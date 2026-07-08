import { RawCollarSample } from '../common/types/pawroom.types';
import { TelemetryAdapter, TelemetryEnvelope } from './telemetry-adapter.port';

export const PAWROOM_MQTT_TELEMETRY_TOPIC = 'pawroom/devices/{deviceId}/telemetry';

export class MqttTelemetryAdapterStub implements TelemetryAdapter {
  readonly source = 'mqtt' as const;

  normalize(input: unknown): TelemetryEnvelope {
    const sample = input as RawCollarSample;
    return {
      source: this.source,
      receivedAt: new Date().toISOString(),
      sample,
    };
  }
}
