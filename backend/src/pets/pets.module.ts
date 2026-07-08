import { Module } from '@nestjs/common';
import { DemoModule } from '../demo/demo.module';
import { PetsController } from './pets.controller';

@Module({
  imports: [DemoModule],
  controllers: [PetsController],
})
export class PetsModule {}
