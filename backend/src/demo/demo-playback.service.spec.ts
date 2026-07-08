import { RealtimeGateway } from '../realtime/realtime.gateway';
import { PetStateEngineService } from '../state/pet-state-engine.service';
import { InMemoryStoreService } from '../store/in-memory-store.service';
import { TimelineService } from '../timeline/timeline.service';
import { DemoPlaybackService } from './demo-playback.service';
import { MockScenariosLoader } from './mock-scenarios.loader';

describe('DemoPlaybackService', () => {
  let store: InMemoryStoreService;
  let service: DemoPlaybackService;
  let realtime: jest.Mocked<Pick<RealtimeGateway, 'broadcastDeviceStatus' | 'broadcastState' | 'broadcastTimelineEvent'>>;

  beforeEach(() => {
    store = new InMemoryStoreService();
    realtime = {
      broadcastDeviceStatus: jest.fn(),
      broadcastState: jest.fn(),
      broadcastTimelineEvent: jest.fn(),
    };
    service = new DemoPlaybackService(
      new MockScenariosLoader(),
      new PetStateEngineService(),
      new TimelineService(store),
      realtime as unknown as RealtimeGateway,
      store,
    );
    store.saveSession({
      sessionId: 'demo_session',
      scenarioId: 'waiting_day',
      pet: {
        petId: 'pet_coco_demo',
        name: '花花 Coco',
        type: 'dog',
      },
      device: {
        deviceId: 'collar_demo_001',
        name: 'PawCollar Demo 01',
        dataSource: 'mock_collar',
        connected: true,
        battery: 61,
      },
      credits: 100,
      createdAt: '2026-07-07T15:00:00+08:00',
    });
  });

  it('plays the remaining samples in the session scenario and broadcasts realtime updates', () => {
    const result = service.playSession('demo_session');

    expect(result.scenarioId).toBe('waiting_day');
    expect(result.playedSampleCount).toBe(4);
    expect(result.snapshots.at(-1)?.stateKey).toBe('resting');
    expect(store.getLatestSnapshot('pet_coco_demo')?.animationKey).toBe('walk_slow');
    expect(store.getTimeline('pet_coco_demo')).toHaveLength(4);
    expect(realtime.broadcastState).toHaveBeenCalledTimes(4);
    expect(realtime.broadcastTimelineEvent).toHaveBeenCalledTimes(4);
    expect(realtime.broadcastDeviceStatus).toHaveBeenCalledTimes(4);
  });

  it('can replay all samples when includeFirst is true', () => {
    const result = service.playSession('demo_session', { includeFirst: true });

    expect(result.playedSampleCount).toBe(5);
    expect(result.snapshots[0].stateKey).toBe('resting');
  });
});
