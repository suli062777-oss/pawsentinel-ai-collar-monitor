import { FORBIDDEN_BUBBLE_TERMS } from '../common/constants/product-boundaries';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import { InMemoryStoreService } from '../store/in-memory-store.service';
import { TimelineService } from './timeline.service';

describe('TimelineService', () => {
  let store: InMemoryStoreService;
  let service: TimelineService;

  beforeEach(() => {
    store = new InMemoryStoreService();
    service = new TimelineService(store);
  });

  it('records telemetry-derived events as rule source and watch severity', () => {
    const event = service.fromTelemetry(
      {
        sampleId: 'sample_1',
        deviceId: 'collar_demo_001',
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
      {
        petId: 'pet_coco_demo',
        deviceId: 'collar_demo_001',
        sampleId: 'sample_1',
        timestamp: '2026-07-07T15:32:00+08:00',
        stateKey: 'waiting',
        safetyLevel: 'watch',
        zoneId: 'door',
        animationKey: 'pace_near_door',
        bubbleText: PawRoomCopy.state.doorWaiting,
        source: 'rule',
        confidence: 0.72,
        battery: 59,
      },
    );

    expect(event.source).toBe('rule');
    expect(event.severity).toBe('watch');
    expect(event.title).toBe(PawRoomCopy.timeline.watchTitle);
    expect(event.linkedSampleId).toBe('sample_1');
    expect(store.getTimeline('pet_coco_demo')).toHaveLength(1);
  });

  it('keeps user-supplied events distinct from device/rule events', () => {
    const event = service.addUserEvent('pet_coco_demo', 'manual note');

    expect(event.source).toBe('user');
    expect(event.severity).toBe('info');
    expect(event.title).toBe(PawRoomCopy.timeline.userSupplementTitle);
  });

  it('includes non-medical disclaimer text on vital trend timeline events', () => {
    const event = service.fromTelemetry(
      {
        sampleId: 'sample_attention',
        deviceId: 'collar_demo_001',
        petId: 'pet_coco_demo',
        timestamp: '2026-07-07T14:05:00+08:00',
        zoneId: 'bed',
        activityLevel: 'low',
        motionHint: 'still',
        heartRateTrend: 'slightly_high',
        respirationTrend: 'normal',
        restingDurationTrend: 'long',
        battery: 30,
        confidence: 0.69,
      },
      {
        petId: 'pet_coco_demo',
        deviceId: 'collar_demo_001',
        sampleId: 'sample_attention',
        timestamp: '2026-07-07T14:05:00+08:00',
        stateKey: 'needs_attention',
        safetyLevel: 'watch',
        zoneId: 'bed',
        animationKey: 'attention_idle',
        bubbleText: PawRoomCopy.state.vitalGeneral,
        source: 'rule',
        confidence: 0.69,
        battery: 30,
        disclaimer: PawRoomCopy.boundaries.trendDisclaimer,
      },
    );

    expect(event.description).toContain(PawRoomCopy.state.vitalGeneral);
    expect(event.description).toContain(PawRoomCopy.boundaries.trendDisclaimer);
    for (const term of FORBIDDEN_BUBBLE_TERMS) {
      expect(event.description.replace(PawRoomCopy.boundaries.trendDisclaimer, '')).not.toContain(term);
    }
  });
});