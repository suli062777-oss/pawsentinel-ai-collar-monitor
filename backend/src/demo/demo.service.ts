import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import { DemoSession, MockScenario } from '../common/types/pawroom.types';
import { PAWROOM_STORE, PawRoomStore } from '../store/pawroom-store.port';
import { PetStateEngineService } from '../state/pet-state-engine.service';
import { MockScenariosLoader } from './mock-scenarios.loader';

@Injectable()
export class DemoService {
  constructor(
    private readonly loader: MockScenariosLoader,
    @Inject(PAWROOM_STORE) private readonly store: PawRoomStore,
    private readonly stateEngine: PetStateEngineService,
  ) {}

  listScenarioSummaries() {
    return this.loader.listScenarios().map((scenario) => ({
      scenarioId: scenario.scenarioId,
      name: scenario.name,
      purpose: scenario.purpose,
      recommendedPlaybackSeconds: scenario.recommendedPlaybackSeconds,
      sampleCount: scenario.samples.length,
    }));
  }

  getScenario(scenarioId: string): MockScenario {
    const scenario = this.loader.getScenario(scenarioId);
    if (!scenario) {
      throw new NotFoundException(`Scenario ${scenarioId} not found`);
    }
    return scenario;
  }

  createSession(scenarioId = 'quiet_day'): DemoSession {
    const file = this.loader.load();
    const scenario = this.getScenario(scenarioId);
    const session: DemoSession = {
      sessionId: `demo_${randomUUID()}`,
      scenarioId: scenario.scenarioId,
      pet: file.defaultPet,
      device: {
        ...file.defaultDevice,
        battery: scenario.samples[0]?.battery ?? 78,
        connected: true,
      },
      credits: 100,
      createdAt: new Date().toISOString(),
    };

    this.store.saveSession(session);

    const firstSample = scenario.samples[0];
    if (firstSample) {
      const snapshot = this.stateEngine.toSnapshot(firstSample);
      this.store.saveLatestSnapshot(snapshot);
      this.store.addTimelineEvent({
        id: `timeline_${firstSample.sampleId ?? randomUUID()}`,
        petId: firstSample.petId,
        timestamp: firstSample.timestamp,
        title: PawRoomCopy.demo.sessionStarted,
        description: snapshot.bubbleText,
        zoneId: snapshot.zoneId,
        source: 'rule',
        severity: snapshot.safetyLevel,
        linkedSampleId: firstSample.sampleId,
      });
    }

    return session;
  }

  getDefaultPet() {
    return this.loader.load().defaultPet;
  }

  getDefaultDevice() {
    return this.loader.load().defaultDevice;
  }
}