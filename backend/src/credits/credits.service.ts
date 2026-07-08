import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import { CreationType } from '../common/types/pawroom.types';
import { PAWROOM_STORE, PawRoomStore } from '../store/pawroom-store.port';

const CREDIT_COSTS: Record<CreationType, number> = {
  sticker_pack: 20,
  comic_card: 35,
  memory_card: 25,
  role_card: 15,
  short_clip: 60,
};

@Injectable()
export class CreditsService {
  constructor(@Inject(PAWROOM_STORE) private readonly store: PawRoomStore) {}

  getBalance(sessionId = 'demo_session_default') {
    const balance = this.ensureBalance(sessionId);
    return {
      sessionId,
      balance,
      includedSafetyMonitoring: true,
      note: PawRoomCopy.credits.includedSafetyMonitoring,
    };
  }

  estimate(type: CreationType) {
    return {
      type,
      creditCost: CREDIT_COSTS[type],
      chargePolicy: PawRoomCopy.credits.chargePolicy,
    };
  }

  charge(sessionId: string, type: CreationType, petId?: string, creationJobId?: string) {
    const cost = CREDIT_COSTS[type];
    if (typeof cost !== 'number') {
      throw new BadRequestException('Invalid creation type.');
    }
    const current = this.ensureBalance(sessionId);
    if (current < cost) {
      throw new BadRequestException(PawRoomCopy.credits.insufficient);
    }
    const balanceAfter = this.store.setCreditBalance(sessionId, current - cost);
    this.store.addCreditLedgerEntry({
      id: `ledger_${randomUUID()}`,
      sessionId,
      petId,
      reason: 'creation_charge',
      amount: -cost,
      balanceAfter,
      creationJobId,
      createdAt: new Date().toISOString(),
    });
    return { creditCost: cost, balanceAfter };
  }

  refund(sessionId: string, amount: number, petId?: string, creationJobId?: string) {
    const current = this.ensureBalance(sessionId);
    const balanceAfter = this.store.setCreditBalance(sessionId, current + amount);
    this.store.addCreditLedgerEntry({
      id: `ledger_${randomUUID()}`,
      sessionId,
      petId,
      reason: 'creation_refund',
      amount,
      balanceAfter,
      creationJobId,
      createdAt: new Date().toISOString(),
    });
    return { balanceAfter };
  }

  private ensureBalance(sessionId: string) {
    if (this.store.hasCreditBalance(sessionId)) {
      return this.store.getCreditBalance(sessionId);
    }
    this.store.setCreditBalance(sessionId, 100);
    return 100;
  }
}