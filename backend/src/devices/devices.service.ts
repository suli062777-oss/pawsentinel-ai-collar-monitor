import { Inject, Injectable } from '@nestjs/common';
import { DemoService } from '../demo/demo.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { PetStateEngineService } from '../state/pet-state-engine.service';
import { PAWROOM_STORE, PawRoomStore } from '../store/pawroom-store.port';
import { TimelineService } from '../timeline/timeline.service';
import { RawCollarSample } from '../common/types/pawroom.types';

@Injectable()
export class DevicesService {
  constructor(
    private readonly demoService: DemoService,
    private readonly stateEngine: PetStateEngineService,
    private readonly timelineService: TimelineService,
    @Inject(PAWROOM_STORE) private readonly store: PawRoomStore,
    private readonly realtime: RealtimeGateway,
  ) {}

  connectMockDevice(sessionId?: string) {
    const device = {
      ...this.demoService.getDefaultDevice(),
      connected: true,
      battery: 78,
      lastSeenAt: new Date().toISOString(),
    };
    this.realtime.broadcastDeviceStatus(device, sessionId);
    return device;
  }

  ingestTelemetry(deviceId: string, sample: RawCollarSample, sessionId?: string) {
    const normalizedSample: RawCollarSample = {
      ...sample,
      deviceId,
      timestamp: sample.timestamp ?? new Date().toISOString(),
    };
    const snapshot = this.stateEngine.toSnapshot(normalizedSample);
    this.store.saveLatestSnapshot(snapshot);
    const timelineEvent = this.timelineService.fromTelemetry(normalizedSample, snapshot);
    this.realtime.broadcastState(snapshot, sessionId);
    this.realtime.broadcastTimelineEvent(timelineEvent, sessionId);
    this.realtime.broadcastDeviceStatus(
      {
        deviceId,
        connected: true,
        battery: normalizedSample.battery,
        lastSeenAt: normalizedSample.timestamp,
      },
      sessionId,
    );

    return {
      sample: normalizedSample,
      snapshot,
      timelineEvent,
    };
  }
}