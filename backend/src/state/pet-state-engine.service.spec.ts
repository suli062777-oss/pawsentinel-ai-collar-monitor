import { FORBIDDEN_BUBBLE_TERMS } from '../common/constants/product-boundaries';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import { PetStateEngineService } from './pet-state-engine.service';

describe('PetStateEngineService', () => {
  const service = new PetStateEngineService();

  it('maps bed + low activity to sleeping', () => {
    const snapshot = service.toSnapshot({
      deviceId: 'collar_demo_001',
      petId: 'pet_coco_demo',
      timestamp: '2026-07-07T09:05:00+08:00',
      zoneId: 'bed',
      activityLevel: 'low',
      motionHint: 'still',
      heartRateTrend: 'normal',
      respirationTrend: 'normal',
      restingDurationTrend: 'normal',
      battery: 82,
      confidence: 0.78,
    });

    expect(snapshot.stateKey).toBe('sleeping');
    expect(snapshot.safetyLevel).toBe('safe');
    expect(snapshot.animationKey).toBe('sleep_idle');
    expect(snapshot.bubbleText).toBe(PawRoomCopy.state.bedSleeping);
  });

  it('maps door pacing to a watch-level waiting state', () => {
    const snapshot = service.toSnapshot({
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
    });

    expect(snapshot.stateKey).toBe('waiting');
    expect(snapshot.safetyLevel).toBe('watch');
    expect(snapshot.animationKey).toBe('pace_near_door');
    expect(snapshot.bubbleText).toBe(PawRoomCopy.state.doorWaiting);
  });

  it('maps vital trend changes to needs_attention without medical diagnosis wording', () => {
    const snapshot = service.toSnapshot({
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
    });

    expect(snapshot.stateKey).toBe('needs_attention');
    expect(snapshot.safetyLevel).toBe('watch');
    expect(snapshot.animationKey).toBe('attention_idle');
    for (const term of FORBIDDEN_BUBBLE_TERMS) {
      expect(snapshot.bubbleText).not.toContain(term);
    }
  });

  it('uses low battery attention while preserving the base pet state', () => {
    const snapshot = service.toSnapshot({
      deviceId: 'collar_demo_001',
      petId: 'pet_coco_demo',
      timestamp: '2026-07-07T14:42:00+08:00',
      zoneId: 'sofa',
      activityLevel: 'low',
      motionHint: 'walking',
      heartRateTrend: 'normal',
      respirationTrend: 'normal',
      restingDurationTrend: 'normal',
      battery: 14,
      confidence: 0.72,
    });

    expect(snapshot.stateKey).toBe('resting');
    expect(snapshot.safetyLevel).toBe('attention');
    expect(snapshot.animationKey).toBe('low_battery_idle');
    expect(snapshot.bubbleText).toBe(PawRoomCopy.state.lowBattery);
  });
});