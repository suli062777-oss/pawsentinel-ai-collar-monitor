import { Provider } from '@nestjs/common';
import { BullMqCreationQueueService } from './bullmq-creation-queue.service';
import { CREATION_QUEUE as CREATION_QUEUE_TOKEN } from './creation-queue.tokens';
import { InMemoryCreationQueueService } from './in-memory-creation-queue.service';

export const CREATION_QUEUE = CREATION_QUEUE_TOKEN;

export const CreationQueueProvider: Provider = {
  provide: CREATION_QUEUE,
  useFactory: (memoryQueue: InMemoryCreationQueueService) => {
    if (process.env.PAWROOM_CREATION_QUEUE === 'bullmq') {
      return new BullMqCreationQueueService();
    }
    return memoryQueue;
  },
  inject: [InMemoryCreationQueueService],
};