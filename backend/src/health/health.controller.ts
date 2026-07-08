import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'pawroom-backend',
      mode: 'mvp_mock',
      timestamp: new Date().toISOString(),
    };
  }
}
