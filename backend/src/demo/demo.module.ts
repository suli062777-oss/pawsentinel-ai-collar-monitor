import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { StateModule } from '../state/state.module';
import { TimelineModule } from '../timeline/timeline.module';
import { DemoController } from './demo.controller';
import { DemoPlaybackService } from './demo-playback.service';
import { DemoService } from './demo.service';
import { MockScenariosLoader } from './mock-scenarios.loader';

@Module({
  imports: [StateModule, TimelineModule, RealtimeModule],
  controllers: [DemoController],
  providers: [DemoService, DemoPlaybackService, MockScenariosLoader],
  exports: [DemoService, DemoPlaybackService, MockScenariosLoader],
})
export class DemoModule {}