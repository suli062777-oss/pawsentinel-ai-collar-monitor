import { BadRequestException } from '@nestjs/common';
import { InMemoryStoreService } from '../store/in-memory-store.service';
import { CreditsService } from './credits.service';

describe('CreditsService', () => {
  let store: InMemoryStoreService;
  let service: CreditsService;

  beforeEach(() => {
    store = new InMemoryStoreService();
    service = new CreditsService(store);
  });

  it('grants a demo balance without charging safety monitoring', () => {
    const balance = service.getBalance('demo_session');

    expect(balance.balance).toBe(100);
    expect(balance.includedSafetyMonitoring).toBe(true);
  });

  it('charges only user-triggered creation jobs', () => {
    service.getBalance('demo_session');
    const charge = service.charge('demo_session', 'memory_card', 'pet_coco_demo', 'creation_1');

    expect(charge.creditCost).toBe(25);
    expect(charge.balanceAfter).toBe(75);
    expect(store.getCreditBalance('demo_session')).toBe(75);
  });

  it('does not replenish an initialized zero balance', () => {
    service.getBalance('demo_session');
    service.charge('demo_session', 'memory_card');
    service.charge('demo_session', 'memory_card');
    service.charge('demo_session', 'memory_card');
    service.charge('demo_session', 'memory_card');

    expect(store.getCreditBalance('demo_session')).toBe(0);
    expect(service.getBalance('demo_session').balance).toBe(0);
    expect(() => service.charge('demo_session', 'role_card')).toThrow(BadRequestException);
  });

  it('rejects invalid creation types before changing balance', () => {
    service.getBalance('demo_session');

    expect(() => service.charge('demo_session', 'bad_type' as never)).toThrow(BadRequestException);
    expect(store.getCreditBalance('demo_session')).toBe(100);
  });

  it('refunds failed creation charges', () => {
    service.getBalance('demo_session');
    const charge = service.charge('demo_session', 'comic_card', 'pet_coco_demo', 'creation_2');
    const refund = service.refund('demo_session', charge.creditCost, 'pet_coco_demo', 'creation_2');

    expect(refund.balanceAfter).toBe(100);
  });

  it('rejects creation when Paw Credits are insufficient', () => {
    service.getBalance('demo_session');
    service.charge('demo_session', 'short_clip');

    expect(() => service.charge('demo_session', 'short_clip')).toThrow(BadRequestException);
  });
});