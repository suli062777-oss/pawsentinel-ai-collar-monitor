import {
  CreationJob,
  CreditLedgerEntry,
  DemoSession,
  PetStateSnapshot,
  TimelineEvent,
} from '../common/types/pawroom.types';

export const PAWROOM_STORE = Symbol('PAWROOM_STORE');

export interface PawRoomStore {
  saveSession(session: DemoSession): DemoSession;
  getSession(sessionId: string): DemoSession | undefined;
  listSessions(): DemoSession[];
  saveLatestSnapshot(snapshot: PetStateSnapshot): PetStateSnapshot;
  getLatestSnapshot(petId: string): PetStateSnapshot | undefined;
  addTimelineEvent(event: TimelineEvent): TimelineEvent;
  getTimeline(petId: string): TimelineEvent[];
  getCreditBalance(sessionId: string): number;
  hasCreditBalance(sessionId: string): boolean;
  setCreditBalance(sessionId: string, balance: number): number;
  addCreditLedgerEntry(entry: CreditLedgerEntry): CreditLedgerEntry;
  getCreditLedger(sessionId: string): CreditLedgerEntry[];
  saveCreationJob(job: CreationJob): CreationJob;
  getCreationJob(jobId: string): CreationJob | undefined;
}