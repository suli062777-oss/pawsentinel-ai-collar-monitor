import { Module } from '@nestjs/common';
import { CreationsModule } from './creations/creations.module';
import { CreditsModule } from './credits/credits.module';
import { DemoModule } from './demo/demo.module';
import { DevicesModule } from './devices/devices.module';
import { HealthModule } from './health/health.module';
import { InteractionsModule } from './interactions/interactions.module';
import { PetsModule } from './pets/pets.module';
import { RealtimeModule } from './realtime/realtime.module';
import { SettingsModule } from './settings/settings.module';
import { StateModule } from './state/state.module';
import { StoreModule } from './store/store.module';
import { TimelineModule } from './timeline/timeline.module';
import { VisualStudioModule } from './visual-studio/visual-studio.module';

@Module({
  imports: [
    StoreModule,
    HealthModule,
    StateModule,
    RealtimeModule,
    DemoModule,
    PetsModule,
    TimelineModule,
    DevicesModule,
    CreditsModule,
    CreationsModule,
    InteractionsModule,
    SettingsModule,
    VisualStudioModule,
  ],
})
export class AppModule {}
