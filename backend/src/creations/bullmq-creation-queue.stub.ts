import { CreationJob } from '../common/types/pawroom.types';
import { CreationQueue, CreationQueuePayload } from './creation-queue.port';

export class BullMqCreationQueueStub implements CreationQueue {
  async enqueue(payload: CreationQueuePayload): Promise<CreationJob> {
    throw new Error(
      `BullMQ queue is not enabled yet. Pending job: ${payload.job.id}. Configure REDIS_URL before using this adapter.`,
    );
  }
}
