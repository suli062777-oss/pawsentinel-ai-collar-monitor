import { RealtimeGateway } from './realtime.gateway';

describe('RealtimeGateway', () => {
  it('emits pet state and scene animation commands to the joined session room', () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const gateway = new RealtimeGateway();
    (gateway as unknown as { server: unknown }).server = { to };

    gateway.broadcastState(
      {
        petId: 'pet_coco_demo',
        deviceId: 'collar_demo_001',
        sampleId: 'sample_1',
        timestamp: '2026-07-07T15:32:00+08:00',
        stateKey: 'waiting',
        safetyLevel: 'watch',
        zoneId: 'door',
        animationKey: 'pace_near_door',
        bubbleText: '门口停留时间略长，可以稍后看一眼。',
        source: 'rule',
        confidence: 0.72,
        battery: 59,
      },
      'demo_session',
    );

    expect(to).toHaveBeenCalledWith('demo_session');
    expect(emit).toHaveBeenCalledWith('pet.state.updated', expect.objectContaining({ stateKey: 'waiting' }));
    expect(emit).toHaveBeenCalledWith(
      'scene.animation.command',
      expect.objectContaining({ animationKey: 'pace_near_door', zoneId: 'door' }),
    );
  });

  it('emits alert events for watch and attention timeline events', () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const gateway = new RealtimeGateway();
    (gateway as unknown as { server: unknown }).server = { to };

    gateway.broadcastTimelineEvent(
      {
        id: 'timeline_1',
        petId: 'pet_coco_demo',
        timestamp: '2026-07-07T14:05:00+08:00',
        title: '轻微关注',
        description: '生命状态趋势略有波动，仅作看护参考。',
        zoneId: 'bed',
        source: 'rule',
        severity: 'watch',
        linkedSampleId: 'sample_attention',
      },
      'demo_session',
    );

    expect(emit).toHaveBeenCalledWith('timeline.event.created', expect.any(Object));
    expect(emit).toHaveBeenCalledWith('pet.alert.created', expect.objectContaining({ severity: 'watch' }));
  });

  it('does not emit alert events for info timeline events', () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const gateway = new RealtimeGateway();
    (gateway as unknown as { server: unknown }).server = { to };

    gateway.broadcastTimelineEvent(
      {
        id: 'timeline_user_1',
        petId: 'pet_coco_demo',
        timestamp: '2026-07-07T14:05:00+08:00',
        title: '主人补充',
        description: '今天喜欢趴在沙发角落。',
        source: 'user',
        severity: 'info',
      },
      'demo_session',
    );

    expect(emit).toHaveBeenCalledWith('timeline.event.created', expect.any(Object));
    expect(emit).not.toHaveBeenCalledWith('pet.alert.created', expect.any(Object));
  });
});
