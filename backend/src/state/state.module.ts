import { Module } from '@nestjs/common';
import { PetStateEngineService } from './pet-state-engine.service';
import { StateController } from './state.controller';

@Module({
  controllers: [StateController],
  providers: [PetStateEngineService],
  exports: [PetStateEngineService],
})
export class StateModule {}
