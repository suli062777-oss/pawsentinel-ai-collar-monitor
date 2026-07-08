import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = resolve(process.cwd(), '../data/pawroom-mock-collar-scenarios-v0.1.json');
const raw = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
const data = JSON.parse(raw);

const allowedZones = new Set(['sofa', 'door', 'bowl', 'bed', 'window', 'toy_area']);
const allowedActivities = new Set(['low', 'medium', 'high']);
const allowedStates = new Set([
  'sleeping',
  'resting',
  'walking',
  'waiting',
  'playing',
  'needs_attention',
  'offline',
]);
const forbiddenBubbleTerms = ['诊断', '疾病判断', '医疗级监测', '医疗级'];

const errors = [];

if (!Array.isArray(data.scenarios) || data.scenarios.length !== 4) {
  errors.push(`Expected 4 scenarios, got ${data.scenarios?.length ?? 'none'}.`);
}

for (const scenario of data.scenarios ?? []) {
  if (!scenario.scenarioId || !scenario.name) {
    errors.push('Scenario is missing scenarioId or name.');
  }
  if (!Array.isArray(scenario.samples) || scenario.samples.length === 0) {
    errors.push(`Scenario ${scenario.scenarioId} has no samples.`);
    continue;
  }

  for (const sample of scenario.samples) {
    if (!allowedZones.has(sample.zoneId)) {
      errors.push(`${sample.sampleId}: invalid zoneId ${sample.zoneId}.`);
    }
    if (!allowedActivities.has(sample.activityLevel)) {
      errors.push(`${sample.sampleId}: invalid activityLevel ${sample.activityLevel}.`);
    }
    if (typeof sample.battery !== 'number' || sample.battery < 0 || sample.battery > 100) {
      errors.push(`${sample.sampleId}: battery must be 0-100.`);
    }
    if (typeof sample.confidence !== 'number' || sample.confidence < 0 || sample.confidence > 1) {
      errors.push(`${sample.sampleId}: confidence must be 0-1.`);
    }

    const derived = deriveExpectedState(sample);
    const expected = sample.expectedState ?? {};
    for (const key of ['stateKey', 'safetyLevel', 'animationKey']) {
      if (expected[key] !== derived[key]) {
        errors.push(
          `${sample.sampleId}: expectedState.${key}=${expected[key]} but rule derives ${derived[key]}.`,
        );
      }
    }
    if (!allowedStates.has(expected.stateKey)) {
      errors.push(`${sample.sampleId}: invalid expected state ${expected.stateKey}.`);
    }
    for (const term of forbiddenBubbleTerms) {
      if (String(expected.bubbleText ?? '').includes(term)) {
        errors.push(`${sample.sampleId}: bubbleText includes forbidden medical term ${term}.`);
      }
    }
  }
}

if (!Array.isArray(data.creationExamples) || data.creationExamples.length !== 5) {
  errors.push(`Expected 5 creation examples, got ${data.creationExamples?.length ?? 'none'}.`);
}

if (errors.length > 0) {
  console.error('PawRoom mock data verification failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('PawRoom mock data verification passed.');
console.log(`Scenarios: ${data.scenarios.length}`);
console.log(
  data.scenarios.map((scenario) => `${scenario.scenarioId}:${scenario.samples.length}`).join(', '),
);
console.log(`Creation examples: ${data.creationExamples.length}`);

function deriveExpectedState(sample) {
  const base = baseStateFor(sample);
  let stateKey = base.stateKey;
  let safetyLevel = base.safetyLevel;
  let animationKey = base.animationKey;

  const vitalConcern =
    sample.heartRateTrend === 'slightly_high' ||
    sample.heartRateTrend === 'slightly_low' ||
    sample.respirationTrend === 'slightly_high' ||
    sample.respirationTrend === 'slightly_low';

  if (vitalConcern) {
    stateKey = 'needs_attention';
    safetyLevel = 'watch';
    animationKey = sample.motionHint === 'pacing' ? 'attention_pace' : 'attention_idle';
  } else if (sample.restingDurationTrend === 'long' && sample.activityLevel === 'low') {
    stateKey = 'resting';
    safetyLevel = 'watch';
    animationKey = 'long_rest_idle';
  }

  if (sample.battery < 15) {
    safetyLevel = 'attention';
    animationKey = 'low_battery_idle';
  }

  return { stateKey, safetyLevel, animationKey };
}

function baseStateFor(sample) {
  if (sample.zoneId === 'bed' && sample.activityLevel === 'low') {
    if (sample.motionHint === 'walking') {
      return { stateKey: 'resting', safetyLevel: 'safe', animationKey: 'walk_slow' };
    }
    return { stateKey: 'sleeping', safetyLevel: 'safe', animationKey: 'sleep_idle' };
  }
  if (sample.zoneId === 'sofa' && sample.activityLevel === 'low') {
    if (sample.motionHint === 'walking') {
      return { stateKey: 'resting', safetyLevel: 'safe', animationKey: 'walk_slow' };
    }
    return { stateKey: 'resting', safetyLevel: 'safe', animationKey: 'rest_on_sofa' };
  }
  if (sample.zoneId === 'door') {
    return {
      stateKey: 'waiting',
      safetyLevel: 'watch',
      animationKey: sample.motionHint === 'still' ? 'sit_near_door' : 'pace_near_door',
    };
  }
  if (sample.zoneId === 'toy_area' && sample.activityLevel === 'high') {
    return {
      stateKey: 'playing',
      safetyLevel: 'safe',
      animationKey: sample.motionHint === 'running' ? 'toy_chase' : 'play_jump',
    };
  }
  if (sample.zoneId === 'bowl') {
    return { stateKey: 'walking', safetyLevel: 'safe', animationKey: 'sniff_bowl' };
  }
  if (sample.zoneId === 'window') {
    return { stateKey: 'walking', safetyLevel: 'safe', animationKey: 'look_window' };
  }
  return {
    stateKey: sample.activityLevel === 'high' ? 'playing' : 'walking',
    safetyLevel: 'safe',
    animationKey: sample.activityLevel === 'high' ? 'play_jump' : 'walk_slow',
  };
}

