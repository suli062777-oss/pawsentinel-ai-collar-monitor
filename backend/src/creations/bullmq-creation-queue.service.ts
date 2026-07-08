import { Job, Queue, QueueEvents, Worker } from 'bullmq';
import { CreationJob } from '../common/types/pawroom.types';
import { CreationQueue, CreationQueuePayload } from './creation-queue.port';

type BullMqResult = CreationJob;

export class BullMqCreationQueueService implements CreationQueue {
  private queue?: Queue<CreationQueuePayload, BullMqResult>;
  private queueEvents?: QueueEvents;
  private worker?: Worker<CreationQueuePayload, BullMqResult>;

  async enqueue(payload: CreationQueuePayload): Promise<CreationJob> {
    await this.ensureQueue();
    const queue = this.queue;
    const queueEvents = this.queueEvents;
    if (!queue || !queueEvents) {
      throw new Error('BullMQ queue was not initialized.');
    }

    const job = await queue.add('memory-creation', payload, {
      attempts: 2,
      removeOnComplete: 100,
      removeOnFail: 100,
    });
    return job.waitUntilFinished(queueEvents, 15000);
  }

  async close() {
    await this.worker?.close();
    await this.queueEvents?.close();
    await this.queue?.close();
  }

  private async ensureQueue() {
    if (this.queue && this.worker && this.queueEvents) {
      return;
    }

    const connection = this.connectionOptions();
    this.queue = new Queue<CreationQueuePayload, BullMqResult>('pawroom-creation', {
      connection,
    });
    this.queueEvents = new QueueEvents('pawroom-creation', {
      connection,
    });
    await this.queueEvents.waitUntilReady();
    this.worker = new Worker<CreationQueuePayload, BullMqResult>(
      'pawroom-creation',
      async (job: Job<CreationQueuePayload>) => ({
        ...job.data.job,
        status: 'completed',
      }),
      {
        connection,
      },
    );
    await this.worker.waitUntilReady();
  }

  private connectionOptions() {
    const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: Number(url.port || 6379),
      username: url.username || undefined,
      password: url.password || undefined,
      maxRetriesPerRequest: null,
    };
  }
}
