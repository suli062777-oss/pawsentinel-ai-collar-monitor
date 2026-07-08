import { Body, Controller, Param, Post } from '@nestjs/common';
import { RawCollarSample } from '../common/types/pawroom.types';
import { DevicesService } from './devices.service';
import { IngestTelemetryDto } from './dto/telemetry.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('mock/connect')
  connectMock(@Body() body: { sessionId?: string }) {
    return this.devicesService.connectMockDevice(body?.sessionId);
  }

  @Post(':deviceId/telemetry')
  ingestTelemetry(
    @Param('deviceId') deviceId: string,
    @Body() body: IngestTelemetryDto,
  ) {
    const { sessionId, ...sample } = body;
    return this.devicesService.ingestTelemetry(deviceId, sample as RawCollarSample, sessionId);
  }
}