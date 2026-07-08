import { Body, Controller, Post } from '@nestjs/common';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import { TimelineService } from '../timeline/timeline.service';
import { CreateInteractionDto } from './dto/interaction.dto';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post()
  interact(@Body() body: CreateInteractionDto) {
    const action = body.action ?? 'pat';
    const feedback = this.feedbackFor(action);
    const event = this.timelineService.addUserEvent(body.petId, feedback);
    return {
      action,
      feedback,
      timelineEvent: event,
      consumesCredits: false,
    };
  }

  private feedbackFor(action: string) {
    const feedback: Record<string, string> = {
      pat: PawRoomCopy.interactions.pat,
      feed: PawRoomCopy.interactions.feed,
      call_name: PawRoomCopy.interactions.callName,
      toy: PawRoomCopy.interactions.toy,
    };
    return feedback[action] ?? PawRoomCopy.interactions.fallback;
  }
}