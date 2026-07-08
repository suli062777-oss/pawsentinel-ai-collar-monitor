import { Body, Controller, Patch } from '@nestjs/common';
import { PawRoomCopy } from '../common/text/pawroom-copy';

@Controller('settings')
export class SettingsController {
  @Patch('notifications')
  updateNotifications(
    @Body()
    body: {
      sessionId?: string;
      notificationLevel?: 'quiet' | 'standard' | 'strong';
      quietMode?: boolean;
    },
  ) {
    return {
      sessionId: body.sessionId ?? 'demo_session_default',
      notificationLevel: body.notificationLevel ?? 'standard',
      quietMode: body.quietMode ?? false,
      medicalBoundary: PawRoomCopy.settings.medicalBoundary,
      updatedAt: new Date().toISOString(),
    };
  }
}