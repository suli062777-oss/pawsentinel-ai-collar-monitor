import { CreationJob } from '../common/types/pawroom.types';

export type CreationQueuePayload = {
  sessionId: string;
  job: CreationJob;
};

export interface CreationQueue {
  enqueue(payload: CreationQueuePayload): Promise<CreationJob>;
}
