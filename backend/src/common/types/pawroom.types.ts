export const ZONE_IDS = ['sofa', 'door', 'bowl', 'bed', 'window', 'toy_area'] as const;
export const ACTIVITY_LEVELS = ['low', 'medium', 'high'] as const;
export const MOTION_HINTS = ['still', 'walking', 'running', 'pacing'] as const;
export const TREND_VALUES = ['normal', 'slightly_high', 'slightly_low'] as const;
export const RESTING_TREND_VALUES = ['normal', 'long', 'short'] as const;
export const STATE_KEYS = [
  'sleeping',
  'resting',
  'walking',
  'waiting',
  'playing',
  'needs_attention',
  'offline',
] as const;
export const SAFETY_LEVELS = ['safe', 'watch', 'attention'] as const;
export const SOURCES = ['device', 'rule', 'user', 'ai'] as const;
export const CREATION_TYPES = [
  'sticker_pack',
  'comic_card',
  'memory_card',
  'role_card',
  'short_clip',
] as const;
export const CREATION_STATUSES = ['queued', 'running', 'completed', 'failed'] as const;

export type ZoneId = (typeof ZONE_IDS)[number];
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];
export type MotionHint = (typeof MOTION_HINTS)[number];
export type TrendValue = (typeof TREND_VALUES)[number];
export type RestingTrendValue = (typeof RESTING_TREND_VALUES)[number];
export type StateKey = (typeof STATE_KEYS)[number];
export type SafetyLevel = (typeof SAFETY_LEVELS)[number];
export type PawRoomSource = (typeof SOURCES)[number];
export type CreationType = (typeof CREATION_TYPES)[number];
export type CreationStatus = (typeof CREATION_STATUSES)[number];

export type RawCollarSample = {
  sampleId?: string;
  deviceId: string;
  petId: string;
  timestamp: string;
  zoneId: ZoneId;
  activityLevel: ActivityLevel;
  motionHint?: MotionHint;
  heartRateTrend?: TrendValue;
  respirationTrend?: TrendValue;
  restingDurationTrend?: RestingTrendValue;
  battery: number;
  confidence: number;
};

export type PetStateSnapshot = {
  petId: string;
  deviceId: string;
  sampleId?: string;
  timestamp: string;
  stateKey: StateKey;
  safetyLevel: SafetyLevel;
  zoneId: ZoneId;
  animationKey: string;
  bubbleText: string;
  source: PawRoomSource;
  confidence: number;
  battery: number;
  disclaimer?: string;
};

export type TimelineEvent = {
  id: string;
  petId: string;
  timestamp: string;
  title: string;
  description: string;
  zoneId?: ZoneId;
  source: PawRoomSource;
  severity: SafetyLevel | 'info';
  linkedSampleId?: string;
};

export type PetProfile = {
  petId: string;
  name: string;
  type: string;
  breed?: string;
  avatarStyle?: string;
};

export type CollarDevice = {
  deviceId: string;
  name: string;
  dataSource: string;
  syncIntervalSeconds?: number;
  battery?: number;
  connected?: boolean;
};

export type MockScenario = {
  scenarioId: string;
  name: string;
  purpose: string;
  recommendedPlaybackSeconds: number;
  samples: Array<RawCollarSample & { expectedState?: Partial<PetStateSnapshot> }>;
};

export type MockScenarioFile = {
  version: string;
  date: string;
  timezone: string;
  defaultPet: PetProfile;
  defaultDevice: CollarDevice;
  zones: Array<{ zoneId: ZoneId; label: string; safetyType: SafetyLevel | 'safe' | 'watch' }>;
  scenarios: MockScenario[];
  creationExamples: Array<{
    type: CreationType;
    label: string;
    creditCost: number;
    trigger: string;
    mvpResult: string;
  }>;
  disclaimers: string[];
};

export type DemoSession = {
  sessionId: string;
  scenarioId: string;
  pet: PetProfile;
  device: CollarDevice;
  credits: number;
  createdAt: string;
};

export type CreationJob = {
  id: string;
  petId: string;
  type: CreationType;
  inputAssetIds: string[];
  inputEventIds: string[];
  creditCost: number;
  status: CreationStatus;
  resultUrls: string[];
};

export type CreditLedgerEntry = {
  id: string;
  sessionId: string;
  petId?: string;
  reason:
    | 'demo_grant'
    | 'creation_estimate'
    | 'creation_charge'
    | 'creation_refund'
    | 'manual_adjustment';
  amount: number;
  balanceAfter: number;
  creationJobId?: string;
  createdAt: string;
};
