import { Injectable } from '@nestjs/common';
import { RawCollarSample } from '../common/types/pawroom.types';
import { TelemetryAdapter, TelemetryEnvelope } from './telemetry-adapter.port';

@Injectable()
export class MockTelemetryAdapter implements TelemetryAdapter {
  readonly source = 'mock' as const;

  normalize(input: RawCollarSample): TelemetryEnvelope {
    return {
      source: this.source,
      receivedAt: new Date().toISOString(),
      sample: input,
    };
  }
}
