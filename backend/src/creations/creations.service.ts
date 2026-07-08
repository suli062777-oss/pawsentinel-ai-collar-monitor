import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreationJob, CreationType } from '../common/types/pawroom.types';
import { CreditsService } from '../credits/credits.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { PAWROOM_STORE, PawRoomStore } from '../store/pawroom-store.port';
import { CreationQueue } from './creation-queue.port';
import { CREATION_QUEUE } from './creation-queue.provider';

@Injectable()
export class CreationsService {
  constructor(
    private readonly creditsService: CreditsService,
    @Inject(PAWROOM_STORE) private readonly store: PawRoomStore,
    @Inject(CREATION_QUEUE) private readonly creationQueue: CreationQueue,
    private readonly realtime: RealtimeGateway,
  ) {}

  estimate(type: CreationType) {
    return this.creditsService.estimate(type);
  }

  async create(body: {
    sessionId?: string;
    petId: string;
    type: CreationType;
    inputAssetIds?: string[];
    inputEventIds?: string[];
  }): Promise<CreationJob & { balanceAfter: number }> {
    const sessionId = body.sessionId ?? 'demo_session_default';
    const jobId = `creation_${randomUUID()}`;
    const charge = this.creditsService.charge(sessionId, body.type, body.petId, jobId);
    const queuedJob: CreationJob = {
      id: jobId,
      petId: body.petId,
      type: body.type,
      inputAssetIds: body.inputAssetIds ?? [],
      inputEventIds: body.inputEventIds ?? [],
      creditCost: charge.creditCost,
      status: 'queued',
      resultUrls: this.mockResultUrls(body.type, jobId),
    };
    this.store.saveCreationJob(queuedJob);
    try {
      const completedJob = await this.creationQueue.enqueue({ sessionId, job: queuedJob });
      this.store.saveCreationJob(completedJob);
      this.realtime.broadcastCreationJob(completedJob, sessionId);
      return { ...completedJob, balanceAfter: charge.balanceAfter };
    } catch {
      const refund = this.creditsService.refund(sessionId, charge.creditCost, body.petId, jobId);
      const failedJob: CreationJob = {
        ...queuedJob,
        status: 'failed',
        resultUrls: [],
      };
      this.store.saveCreationJob(failedJob);
      this.realtime.broadcastCreationJob(
        {
          ...failedJob,
          balanceAfter: refund.balanceAfter,
          error: 'creation_failed_refunded',
        },
        sessionId,
      );
      throw new InternalServerErrorException({
        message: 'Creation failed; Paw Credits refunded.',
        creationId: jobId,
        balanceAfter: refund.balanceAfter,
      });
    }
  }

  get(creationId: string) {
    const job = this.store.getCreationJob(creationId);
    if (!job) {
      throw new NotFoundException(`Creation job ${creationId} not found`);
    }
    return job;
  }

  private mockResultUrls(type: CreationType, jobId: string) {
    return [`/mock-creations/${type}/${jobId}.png`];
  }
}