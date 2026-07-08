import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreationJob,
  CreditLedgerEntry,
  DemoSession,
  PetStateSnapshot,
  TimelineEvent,
} from '../common/types/pawroom.types';
import { InMemoryStoreService } from './in-memory-store.service';
import { PawRoomStore } from './pawroom-store.port';
import { PrismaStoreService } from './prisma-store.service';

@Injectable()
export class CompositeStoreService implements PawRoomStore {
  private readonly logger = new Logger(CompositeStoreService.name);
  private readonly prismaEnabled = process.env.PAWROOM_ENABLE_PRISMA_STORE === 'true';

  constructor(
    private readonly memory: InMemoryStoreService,
    @Inject(PrismaStoreService) private readonly prismaStore: PrismaStoreService,
  ) {}

  saveSession(session: DemoSession): DemoSession {
    const saved = this.memory.saveSession(session);
    void this.persist('saveSession', () => this.prismaStore.saveSession(session));
    return saved;
  }

  getSession(sessionId: string): DemoSession | undefined {
    return this.memory.getSession(sessionId);
  }

  listSessions(): DemoSession[] {
    return this.memory.listSessions();
  }

  saveLatestSnapshot(snapshot: PetStateSnapshot): PetStateSnapshot {
    const saved = this.memory.saveLatestSnapshot(snapshot);
    void this.persist('saveLatestSnapshot', () => this.prismaStore.saveLatestSnapshot(snapshot));
    return saved;
  }

  getLatestSnapshot(petId: string): PetStateSnapshot | undefined {
    return this.memory.getLatestSnapshot(petId);
  }

  addTimelineEvent(event: TimelineEvent): TimelineEvent {
    const saved = this.memory.addTimelineEvent(event);
    void this.persist('addTimelineEvent', () => this.prismaStore.addTimelineEvent(event));
    return saved;
  }

  getTimeline(petId: string): TimelineEvent[] {
    return this.memory.getTimeline(petId);
  }

  getCreditBalance(sessionId: string): number {
    return this.memory.getCreditBalance(sessionId);
  }

  hasCreditBalance(sessionId: string): boolean {
    return this.memory.hasCreditBalance(sessionId);
  }

  setCreditBalance(sessionId: string, balance: number): number {
    const saved = this.memory.setCreditBalance(sessionId, balance);
    void this.persist('setCreditBalance', () => this.prismaStore.setCreditBalance(sessionId, balance));
    return saved;
  }

  addCreditLedgerEntry(entry: CreditLedgerEntry): CreditLedgerEntry {
    const saved = this.memory.addCreditLedgerEntry(entry);
    void this.persist('addCreditLedgerEntry', () => this.prismaStore.addCreditLedgerEntry(entry));
    return saved;
  }

  getCreditLedger(sessionId: string): CreditLedgerEntry[] {
    return this.memory.getCreditLedger(sessionId);
  }

  saveCreationJob(job: CreationJob): CreationJob {
    const saved = this.memory.saveCreationJob(job);
    void this.persist('saveCreationJob', () => this.prismaStore.saveCreationJob(job));
    return saved;
  }

  getCreationJob(jobId: string): CreationJob | undefined {
    return this.memory.getCreationJob(jobId);
  }

  private async persist(operation: string, write: () => Promise<unknown>) {
    if (!this.prismaEnabled) {
      return;
    }
    try {
      await write();
    } catch (error) {
      this.logger.warn(`Prisma persistence failed during ${operation}: ${(error as Error).message}`);
    }
  }
}
