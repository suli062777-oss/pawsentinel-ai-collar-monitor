import { Controller, Get, Query } from '@nestjs/common';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('balance')
  getBalance(@Query('sessionId') sessionId?: string) {
    return this.creditsService.getBalance(sessionId);
  }
}
