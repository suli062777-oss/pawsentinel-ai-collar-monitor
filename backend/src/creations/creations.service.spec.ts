import { InternalServerErrorException } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { InMemoryStoreService } from '../store/in-memory-store.service';
import { CreditsService } from '../credits/credits.service';
import { CreationQueue } from './creation-queue.port';
import { InMemoryCreationQueueService } from './in-memory-creation-queue.service';
import { CreationsService } from './creations.service';

describe('CreationsService', () => {
  it('creates a completed memory job through the queue and charges credits', async () => {
    const store = new InMemoryStoreService();
    const credits = new CreditsService(store);
    const queue = new InMemoryCreationQueueService();
    const realtime = {
      broadcastCreationJob: jest.fn(),
    } as unknown as RealtimeGateway;
    const service = new CreationsService(credits, store, queue, realtime);

    const job = await service.create({
      sessionId: 'demo_session',
      petId: 'pet_coco_demo',
      type: 'memory_card',
      inputEventIds: ['attention_003'],
    });

    expect(job.status).toBe('completed');
    expect(job.creditCost).toBe(25);
    expect(job.balanceAfter).toBe(75);
    expect(job.resultUrls[0]).toContain('/mock-creations/memory_card/');
    expect(store.getCreationJob(job.id)?.status).toBe('completed');
    expect(realtime.broadcastCreationJob).toHaveBeenCalledWith(
      expect.objectContaining({ id: job.id, status: 'completed' }),
      'demo_session',
    );
  });

  it('refunds credits and records a failed job when the creation queue fails', async () => {
    const store = new InMemoryStoreService();
    const credits = new CreditsService(store);
    const queue: CreationQueue = {
      enqueue: jest.fn().mockRejectedValue(new Error('queue failed')),
    };
    const realtime = {
      broadcastCreationJob: jest.fn(),
    } as unknown as RealtimeGateway;
    const service = new CreationsService(credits, store, queue, realtime);

    try {
      await service.create({
        sessionId: 'demo_session',
        petId: 'pet_coco_demo',
        type: 'comic_card',
        inputEventIds: ['attention_003'],
      });
      throw new Error('Expected create to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect((error as InternalServerErrorException).getResponse()).toMatchObject({
        balanceAfter: 100,
      });
    }

    expect(store.getCreditBalance('demo_session')).toBe(100);
    expect(store.getCreditLedger('demo_session').map((entry) => entry.reason)).toEqual([
      'creation_charge',
      'creation_refund',
    ]);
    const failedJob = (realtime.broadcastCreationJob as jest.Mock).mock.calls[0][0];
    expect(failedJob).toMatchObject({ status: 'failed', balanceAfter: 100 });
    expect(store.getCreationJob(failedJob.id)?.status).toBe('failed');
  });
});