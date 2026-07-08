import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MockScenario, MockScenarioFile } from '../common/types/pawroom.types';

const MOCK_SCENARIO_FILE = 'pawroom-mock-collar-scenarios-v0.1.json';

@Injectable()
export class MockScenariosLoader {
  private cache?: MockScenarioFile;

  load(): MockScenarioFile {
    if (this.cache) {
      return this.cache;
    }

    const configuredPath = process.env.PAWROOM_MOCK_DATA_PATH;
    const candidates = [
      configuredPath ? resolve(process.cwd(), configuredPath) : undefined,
      resolve(__dirname, '../../../data', MOCK_SCENARIO_FILE),
      resolve(process.cwd(), 'data', MOCK_SCENARIO_FILE),
      resolve(process.cwd(), '../data', MOCK_SCENARIO_FILE),
    ].filter(Boolean) as string[];

    const found = candidates.find((candidate) => existsSync(candidate));
    if (!found) {
      throw new InternalServerErrorException(
        `Mock scenario file not found. Tried: ${candidates.join(', ')}`,
      );
    }

    const raw = readFileSync(found, 'utf8').replace(/^\uFEFF/, '');
    this.cache = JSON.parse(raw) as MockScenarioFile;
    return this.cache;
  }

  listScenarios(): MockScenario[] {
    return this.load().scenarios;
  }

  getScenario(scenarioId: string): MockScenario | undefined {
    return this.listScenarios().find((scenario) => scenario.scenarioId === scenarioId);
  }
}