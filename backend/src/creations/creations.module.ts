import { Module } from '@nestjs/common';
import { CreditsModule } from '../credits/credits.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { CreationsController } from './creations.controller';
import { CreationQueueProvider } from './creation-queue.provider';
import { CreationsService } from './creations.service';
import { InMemoryCreationQueueService } from './in-memory-creation-queue.service';

@Module({
  imports: [CreditsModule, RealtimeModule],
  controllers: [CreationsController],
  providers: [InMemoryCreationQueueService, CreationQueueProvider, CreationsService],
})
export class CreationsModule {}