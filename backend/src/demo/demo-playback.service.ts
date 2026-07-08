import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PetStateSnapshot,
  RawCollarSample,
  TimelineEvent,
} from '../common/types/pawroom.types';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { PetStateEngineService } from '../state/pet-state-engine.service';
import { PAWROOM_STORE, PawRoomStore } from '../store/pawroom-store.port';
import { TimelineService } from '../timeline/timeline.service';
import { MockScenariosLoader } from './mock-scenarios.loader';

type PlaybackOptions = {
  includeFirst?: boolean;
  intervalMs?: number;
};

type ImmediatePlaybackResult = {
  sessionId: string;
  scenarioId: string;
  playbackMode: 'immediate';
  playedSampleCount: number;
  snapshots: PetStateSnapshot[];
  timelineEvents: TimelineEvent[];
};

type ScheduledPlaybackResult = {
  sessionId: string;
  scenarioId: string;
  playbackMode: 'scheduled';
  intervalMs: number;
  playedSampleCount: number;
  queuedSampleCount: number;
};

@Injectable()
export class DemoPlaybackService {
  constructor(
    private readonly loader: MockScenariosLoader,
    private readonly stateEngine: PetStateEngineService,
    private readonly timelineService: TimelineService,
    private readonly realtime: RealtimeGateway,
    @Inject(PAWROOM_STORE) private readonly store: PawRoomStore,
  ) {}

  playSession(sessionId: string): ImmediatePlaybackResult;
  playSession(
    sessionId: string,
    options: PlaybackOptions & { intervalMs?: 0 },
  ): ImmediatePlaybackResult;
  playSession(
    sessionId: string,
    options: PlaybackOptions,
  ): ImmediatePlaybackResult | ScheduledPlaybackResult;
  playSession(
    sessionId: string,
    options: PlaybackOptions = {},
  ): ImmediatePlaybackResult | ScheduledPlaybackResult {
    const session = this.store.getSession(sessionId);
    if (!session) {
      throw new NotFoundException(`Demo session ${sessionId} not found`);
    }

    const scenario = this.loader.getScenario(session.scenarioId);
    if (!scenario) {
      throw new NotFoundException(`Scenario ${session.scenarioId} not found`);
    }

    const samples = options.includeFirst ? scenario.samples : scenario.samples.slice(1);
    const intervalMs = Math.max(0, Math.floor(options.intervalMs ?? 0));

    if (intervalMs > 0) {
      samples.forEach((sample, index) => {
        setTimeout(() => {
          this.playSample(sample, sessionId);
        }, index * intervalMs);
      });

      return {
        sessionId,
        scenarioId: scenario.scenarioId,
        playbackMode: 'scheduled',
        intervalMs,
        playedSampleCount: samples.length,
        queuedSampleCount: samples.length,
      };
    }

    const played = samples.map((sample) => this.playSample(sample, sessionId));

    return {
      sessionId,
      scenarioId: scenario.scenarioId,
      playbackMode: 'immediate',
      playedSampleCount: played.length,
      snapshots: played.map((item) => item.snapshot),
      timelineEvents: played.map((item) => item.timelineEvent),
    };
  }

  private playSample(sample: RawCollarSample, sessionId: string) {
    const snapshot = this.stateEngine.toSnapshot(sample);
    this.store.saveLatestSnapshot(snapshot);
    const timelineEvent = this.timelineService.fromTelemetry(sample, snapshot);
    this.realtime.broadcastState(snapshot, sessionId);
    this.realtime.broadcastTimelineEvent(timelineEvent, sessionId);
    this.realtime.broadcastDeviceStatus(
      {
        deviceId: sample.deviceId,
        connected: true,
        battery: sample.battery,
        lastSeenAt: sample.timestamp,
      },
      sessionId,
    );
    return {
      sample,
      snapshot,
      timelineEvent,
    };
  }
}
