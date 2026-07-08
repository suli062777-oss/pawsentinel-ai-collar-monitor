import { Injectable, Logger } from '@nestjs/common';
import {
  CreationJob,
  CreditLedgerEntry,
  DemoSession,
  PetStateSnapshot,
  TimelineEvent,
} from '../common/types/pawroom.types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaStoreService {
  private readonly logger = new Logger(PrismaStoreService.name);

  constructor(private readonly prisma: PrismaService) {}

  async saveSession(session: DemoSession): Promise<DemoSession> {
    await this.prisma.pet.upsert({
      where: { id: session.pet.petId },
      create: {
        id: session.pet.petId,
        name: session.pet.name,
        type: session.pet.type,
        breed: session.pet.breed,
        avatarStyle: session.pet.avatarStyle,
      },
      update: {
        name: session.pet.name,
        type: session.pet.type,
        breed: session.pet.breed,
        avatarStyle: session.pet.avatarStyle,
      },
    });
    await this.prisma.collarDevice.upsert({
      where: { id: session.device.deviceId },
      create: {
        id: session.device.deviceId,
        petId: session.pet.petId,
        name: session.device.name,
        dataSource: session.device.dataSource,
        battery: session.device.battery ?? 0,
        connected: session.device.connected ?? false,
        lastSeenAt: new Date(),
      },
      update: {
        petId: session.pet.petId,
        name: session.device.name,
        dataSource: session.device.dataSource,
        battery: session.device.battery ?? 0,
        connected: session.device.connected ?? false,
        lastSeenAt: new Date(),
      },
    });
    await this.prisma.demoSession.upsert({
      where: { id: session.sessionId },
      create: {
        id: session.sessionId,
        scenarioId: session.scenarioId,
        petId: session.pet.petId,
        deviceId: session.device.deviceId,
        credits: session.credits,
      },
      update: {
        scenarioId: session.scenarioId,
        petId: session.pet.petId,
        deviceId: session.device.deviceId,
        credits: session.credits,
      },
    });
    return session;
  }

  async saveLatestSnapshot(snapshot: PetStateSnapshot): Promise<PetStateSnapshot> {
    await this.prisma.petStateSnapshot.create({
      data: {
        id: `state_${snapshot.petId}_${Date.now()}`,
        petId: snapshot.petId,
        deviceId: snapshot.deviceId,
        sampleId: snapshot.sampleId,
        timestamp: new Date(snapshot.timestamp),
        stateKey: snapshot.stateKey,
        safetyLevel: snapshot.safetyLevel,
        zoneId: snapshot.zoneId,
        animationKey: snapshot.animationKey,
        bubbleText: snapshot.bubbleText,
        source: snapshot.source,
        confidence: snapshot.confidence,
        disclaimer: snapshot.disclaimer,
      },
    });
    return snapshot;
  }

  async addTimelineEvent(event: TimelineEvent): Promise<TimelineEvent> {
    await this.prisma.timelineEvent.upsert({
      where: { id: event.id },
      create: {
        id: event.id,
        petId: event.petId,
        timestamp: new Date(event.timestamp),
        title: event.title,
        description: event.description,
        zoneId: event.zoneId,
        source: event.source,
        severity: event.severity,
        linkedSampleId: event.linkedSampleId,
      },
      update: {
        title: event.title,
        description: event.description,
        severity: event.severity,
      },
    });
    return event;
  }

  async setCreditBalance(sessionId: string, balance: number): Promise<number> {
    await this.prisma.demoSession.update({
      where: { id: sessionId },
      data: { credits: balance },
    });
    return balance;
  }

  async addCreditLedgerEntry(entry: CreditLedgerEntry): Promise<CreditLedgerEntry> {
    await this.prisma.creditLedgerEntry.upsert({
      where: { id: entry.id },
      create: {
        id: entry.id,
        sessionId: entry.sessionId,
        petId: entry.petId,
        reason: entry.reason,
        amount: entry.amount,
        balanceAfter: entry.balanceAfter,
        creationJobId: entry.creationJobId,
        createdAt: new Date(entry.createdAt),
      },
      update: {
        amount: entry.amount,
        balanceAfter: entry.balanceAfter,
      },
    });
    return entry;
  }

  async saveCreationJob(job: CreationJob): Promise<CreationJob> {
    await this.prisma.creationJob.upsert({
      where: { id: job.id },
      create: {
        id: job.id,
        petId: job.petId,
        type: job.type,
        inputAssetIds: job.inputAssetIds,
        inputEventIds: job.inputEventIds,
        creditCost: job.creditCost,
        status: job.status,
        resultUrls: job.resultUrls,
      },
      update: {
        status: job.status,
        resultUrls: job.resultUrls,
      },
    });
    return job;
  }
}