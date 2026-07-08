import { Module } from '@nestjs/common';
import { TimelineModule } from '../timeline/timeline.module';
import { InteractionsController } from './interactions.controller';

@Module({
  imports: [TimelineModule],
  controllers: [InteractionsController],
})
export class InteractionsModule {}
