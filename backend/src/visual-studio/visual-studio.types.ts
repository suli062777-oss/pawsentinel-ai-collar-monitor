export const PIXEL_STYLE_PRESET_KEYS = ['pawroom_pixel_soft'] as const;
export const VISUAL_SOURCE_TYPES = ['upload', 'url'] as const;
export const PIXEL_KIT_STATUSES = [
  'awaiting_selection',
  'generating_derivatives',
  'completed',
  'failed',
] as const;
export const GENERATED_ASSET_KINDS = [
  'avatar_candidate',
  'avatar_selected',
  'action_idle',
  'action_sleep',
  'action_walk',
  'action_play',
  'action_waiting',
  'action_attention',
  'sticker_happy',
  'sticker_sleepy',
  'sticker_waiting',
  'sticker_alert',
  'sticker_cute',
  'sticker_proud',
  'scene_token',
  'role_card',
] as const;

export type PixelStylePresetKey = (typeof PIXEL_STYLE_PRESET_KEYS)[number];
export type VisualSourceType = (typeof VISUAL_SOURCE_TYPES)[number];
export type PixelKitStatus = (typeof PIXEL_KIT_STATUSES)[number];
export type GeneratedAssetKind = (typeof GENERATED_ASSET_KINDS)[number];

export type SourceVisualAsset = {
  assetId: string;
  petId: string;
  sourceType: VisualSourceType;
  originalName?: string;
  label?: string;
  mimeType?: string;
  sizeBytes?: number;
  url?: string;
  localPath?: string;
  createdAt: string;
};

export type PetVisualProfile = {
  petId: string;
  petName?: string;
  species?: 'cat' | 'dog' | 'unknown';
  stylePresetKey: PixelStylePresetKey;
  referenceAssetIds: string[];
  traitNotes: string[];
  promptIdentityBlock: string;
};

export type GeneratedVisualAsset = {
  assetId: string;
  petId: string;
  kitId: string;
  kind: GeneratedAssetKind;
  provider: string;
  url: string;
  prompt: string;
  width: number;
  height: number;
  transparentBackground: boolean;
  createdAt: string;
};

export type PixelAvatarKit = {
  kitId: string;
  petId: string;
  sessionId: string;
  status: PixelKitStatus;
  provider: string;
  stylePresetKey: PixelStylePresetKey;
  sourceAssetIds: string[];
  visualProfile: PetVisualProfile;
  candidates: GeneratedVisualAsset[];
  selectedAvatarAssetId?: string;
  assets: GeneratedVisualAsset[];
  creditCostEstimate: number;
  usagePolicy: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
};

export type PixelGenerationRequest = {
  petId: string;
  kitId: string;
  kind: GeneratedAssetKind;
  prompt: string;
  negativePrompt?: string;
  sourceAssets: SourceVisualAsset[];
  width: number;
  height: number;
  transparentBackground: boolean;
};

export type PixelGenerationResult = {
  url: string;
  providerAssetId?: string;
};

export type ImageWorkflowProvider = {
  readonly providerName: string;
  generatePixelAsset(request: PixelGenerationRequest): Promise<PixelGenerationResult>;
};
