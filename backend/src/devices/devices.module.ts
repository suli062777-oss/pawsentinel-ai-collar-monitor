import { Module } from '@nestjs/common';
import { DemoModule } from '../demo/demo.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { StateModule } from '../state/state.module';
import { TimelineModule } from '../timeline/timeline.module';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

@Module({
  imports: [DemoModule, StateModule, TimelineModule, RealtimeModule],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
