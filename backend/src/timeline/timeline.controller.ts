import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import { TimelineService } from './timeline.service';

@Controller('pets/:petId/timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  getTimeline(@Param('petId') petId: string) {
    return this.timelineService.getTimeline(petId);
  }

  @Post('user-events')
  addUserEvent(@Param('petId') petId: string, @Body() body: { description?: string }) {
    return this.timelineService.addUserEvent(
      petId,
      body.description ?? PawRoomCopy.timeline.defaultUserEvent,
    );
  }
}