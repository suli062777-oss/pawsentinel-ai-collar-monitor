import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDemoSessionDto, PlaybackDemoSessionDto } from './dto/demo.dto';
import { DemoPlaybackService } from './demo-playback.service';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(
    private readonly demoService: DemoService,
    private readonly playbackService: DemoPlaybackService,
  ) {}

  @Get('scenarios')
  listScenarios() {
    return this.demoService.listScenarioSummaries();
  }

  @Get('scenarios/:scenarioId')
  getScenario(@Param('scenarioId') scenarioId: string) {
    return this.demoService.getScenario(scenarioId);
  }

  @Post('sessions')
  createSession(@Body() body: CreateDemoSessionDto) {
    return this.demoService.createSession(body?.scenarioId);
  }

  @Post('sessions/:sessionId/playback')
  playSession(
    @Param('sessionId') sessionId: string,
    @Body() body: PlaybackDemoSessionDto,
  ) {
    return this.playbackService.playSession(sessionId, {
      includeFirst: body?.includeFirst ?? false,
      intervalMs: body?.intervalMs ?? 0,
    });
  }
}
