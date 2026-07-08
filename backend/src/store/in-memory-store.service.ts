import { Injectable } from '@nestjs/common';
import {
  CreationJob,
  CreditLedgerEntry,
  DemoSession,
  PetStateSnapshot,
  TimelineEvent,
} from '../common/types/pawroom.types';

@Injectable()
export class InMemoryStoreService {
  private readonly sessions = new Map<string, DemoSession>();
  private readonly latestSnapshots = new Map<string, PetStateSnapshot>();
  private readonly timelineEvents = new Map<string, TimelineEvent[]>();
  private readonly creditBalances = new Map<string, number>();
  private readonly creditLedger = new Map<string, CreditLedgerEntry[]>();
  private readonly creationJobs = new Map<string, CreationJob>();

  saveSession(session: DemoSession): DemoSession {
    this.sessions.set(session.sessionId, session);
    this.creditBalances.set(session.sessionId, session.credits);
    this.addCreditLedgerEntry({
      id: `ledger_${session.sessionId}_grant`,
      sessionId: session.sessionId,
      reason: 'demo_grant',
      amount: session.credits,
      balanceAfter: session.credits,
      createdAt: new Date().toISOString(),
    });
    return session;
  }

  getSession(sessionId: string): DemoSession | undefined {
    return this.sessions.get(sessionId);
  }

  listSessions(): DemoSession[] {
    return Array.from(this.sessions.values());
  }

  saveLatestSnapshot(snapshot: PetStateSnapshot): PetStateSnapshot {
    this.latestSnapshots.set(snapshot.petId, snapshot);
    return snapshot;
  }

  getLatestSnapshot(petId: string): PetStateSnapshot | undefined {
    return this.latestSnapshots.get(petId);
  }

  addTimelineEvent(event: TimelineEvent): TimelineEvent {
    const events = this.timelineEvents.get(event.petId) ?? [];
    events.push(event);
    this.timelineEvents.set(event.petId, events);
    return event;
  }

  getTimeline(petId: string): TimelineEvent[] {
    return this.timelineEvents.get(petId) ?? [];
  }

  getCreditBalance(sessionId: string): number {
    return this.creditBalances.get(sessionId) ?? 0;
  }

  hasCreditBalance(sessionId: string): boolean {
    return this.creditBalances.has(sessionId);
  }

  setCreditBalance(sessionId: string, balance: number): number {
    this.creditBalances.set(sessionId, balance);
    return balance;
  }

  addCreditLedgerEntry(entry: CreditLedgerEntry): CreditLedgerEntry {
    const entries = this.creditLedger.get(entry.sessionId) ?? [];
    entries.push(entry);
    this.creditLedger.set(entry.sessionId, entries);
    return entry;
  }

  getCreditLedger(sessionId: string): CreditLedgerEntry[] {
    return this.creditLedger.get(sessionId) ?? [];
  }

  saveCreationJob(job: CreationJob): CreationJob {
    this.creationJobs.set(job.id, job);
    return job;
  }

  getCreationJob(jobId: string): CreationJob | undefined {
    return this.creationJobs.get(jobId);
  }
}
