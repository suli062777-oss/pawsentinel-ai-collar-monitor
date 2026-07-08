import { DemoService } from '../demo/demo.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { PetStateEngineService } from '../state/pet-state-engine.service';
import { InMemoryStoreService } from '../store/in-memory-store.service';
import { TimelineService } from '../timeline/timeline.service';
import { DevicesService } from './devices.service';

describe('DevicesService', () => {
  let store: InMemoryStoreService;
  let service: DevicesService;
  let realtime: jest.Mocked<Pick<RealtimeGateway, 'broadcastDeviceStatus' | 'broadcastState' | 'broadcastTimelineEvent'>>;

  beforeEach(() => {
    store = new InMemoryStoreService();
    realtime = {
      broadcastDeviceStatus: jest.fn(),
      broadcastState: jest.fn(),
      broadcastTimelineEvent: jest.fn(),
    };
    const demoService = {
      getDefaultDevice: () => ({
        deviceId: 'collar_demo_001',
        name: 'PawCollar Demo 01',
        dataSource: 'mock_collar',
        syncIntervalSeconds: 30,
      }),
    } as unknown as DemoService;
    service = new DevicesService(
      demoService,
      new PetStateEngineService(),
      new TimelineService(store),
      store,
      realtime as unknown as RealtimeGateway,
    );
  });

  it('connects the mock collar and broadcasts device status', () => {
    const device = service.connectMockDevice('demo_session');

    expect(device.connected).toBe(true);
    expect(device.battery).toBe(78);
    expect(realtime.broadcastDeviceStatus).toHaveBeenCalledWith(
      expect.objectContaining({ deviceId: 'collar_demo_001', connected: true }),
      'demo_session',
    );
  });

  it('ingests telemetry, stores latest state, creates timeline event, and broadcasts realtime updates', () => {
    const result = service.ingestTelemetry(
      'collar_demo_001',
      {
        sampleId: 'sample_waiting',
        deviceId: 'will_be_overwritten',
        petId: 'pet_coco_demo',
        timestamp: '2026-07-07T15:32:00+08:00',
        zoneId: 'door',
        activityLevel: 'medium',
        motionHint: 'pacing',
        heartRateTrend: 'normal',
        respirationTrend: 'normal',
        restingDurationTrend: 'normal',
        battery: 59,
        confidence: 0.72,
      },
      'demo_session',
    );

    expect(result.sample.deviceId).toBe('collar_demo_001');
    expect(result.snapshot.stateKey).toBe('waiting');
    expect(result.snapshot.safetyLevel).toBe('watch');
    expect(store.getLatestSnapshot('pet_coco_demo')?.animationKey).toBe('pace_near_door');
    expect(store.getTimeline('pet_coco_demo')).toHaveLength(1);
    expect(realtime.broadcastState).toHaveBeenCalledWith(result.snapshot, 'demo_session');
    expect(realtime.broadcastTimelineEvent).toHaveBeenCalledWith(result.timelineEvent, 'demo_session');
    expect(realtime.broadcastDeviceStatus).toHaveBeenCalledWith(
      expect.objectContaining({ deviceId: 'collar_demo_001', battery: 59 }),
      'demo_session',
    );
  });
});
