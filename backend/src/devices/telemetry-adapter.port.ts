import { RawCollarSample } from '../common/types/pawroom.types';

export type TelemetrySource = 'mock' | 'mqtt' | 'third_party_api';

export type TelemetryEnvelope = {
  source: TelemetrySource;
  receivedAt: string;
  sample: RawCollarSample;
};

export interface TelemetryAdapter {
  readonly source: TelemetrySource;
  normalize(input: unknown): TelemetryEnvelope;
}
