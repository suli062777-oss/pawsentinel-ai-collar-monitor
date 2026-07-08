import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';
import { PAWROOM_STORE, PawRoomStore } from '../store/pawroom-store.port';

@Controller('pets/:petId/state')
export class StateController {
  constructor(@Inject(PAWROOM_STORE) private readonly store: PawRoomStore) {}

  @Get('latest')
  getLatest(@Param('petId') petId: string) {
    const snapshot = this.store.getLatestSnapshot(petId);
    if (!snapshot) {
      throw new NotFoundException(`No state snapshot found for pet ${petId}`);
    }
    return snapshot;
  }
}