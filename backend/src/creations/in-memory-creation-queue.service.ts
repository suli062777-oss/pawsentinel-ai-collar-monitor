import { Injectable } from '@nestjs/common';
import { CreationJob } from '../common/types/pawroom.types';
import { CreationQueue, CreationQueuePayload } from './creation-queue.port';

@Injectable()
export class InMemoryCreationQueueService implements CreationQueue {
  async enqueue(payload: CreationQueuePayload): Promise<CreationJob> {
    return {
      ...payload.job,
      status: 'completed',
    };
  }
}
