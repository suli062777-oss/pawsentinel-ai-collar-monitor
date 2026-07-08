import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { IMAGE_WORKFLOW_PROVIDER } from './image-provider.tokens';
import { buildPixelPrompt, PIXEL_STYLE_PRESETS } from './pixel-style-presets';
import {
  GeneratedAssetKind,
  GeneratedVisualAsset,
  ImageWorkflowProvider,
  PetVisualProfile,
  PixelAvatarKit,
  PixelStylePresetKey,
  SourceVisualAsset,
} from './visual-studio.types';

const UPLOAD_ROOT = join(process.cwd(), 'storage', 'visual-studio', 'uploads');
const DEFAULT_STYLE: PixelStylePresetKey = 'pawroom_pixel_soft';
const DERIVATIVE_KINDS: GeneratedAssetKind[] = [
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
];

@Injectable()
export class VisualStudioService {
  private readonly sourceAssets = new Map<string, SourceVisualAsset>();
  private readonly kits = new Map<string, PixelAvatarKit>();

  constructor(@Inject(IMAGE_WORKFLOW_PROVIDER) private readonly imageProvider: ImageWorkflowProvider) {}

  getProviderInfo() {
    return {
      activeProvider: this.imageProvider.providerName,
      byteApiPlacement: {
        envFile: 'backend/.env',
        requiredWhenUsingByteArk: ['PAWROOM_IMAGE_PROVIDER=byteark', 'BYTEARK_API_KEY', 'BYTEARK_IMAGE_ENDPOINT', 'BYTEARK_IMAGE_MODEL'],
      },
    };
  }

  getStyles() {
    return Object.values(PIXEL_STYLE_PRESETS);
  }

  registerUploadedFile(args: {
    petId: string;
    file: { originalname: string; mimetype: string; size: number; buffer: Buffer };
    label?: string;
  }) {
    if (!args.file) {
      throw new BadRequestException('file is required.');
    }
    if (!args.file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image uploads are supported.');
    }
    mkdirSync(UPLOAD_ROOT, { recursive: true });
    const assetId = `source_${randomUUID()}`;
    const extension = extensionFor(args.file.originalname, args.file.mimetype);
    const localPath = join(UPLOAD_ROOT, `${assetId}${extension}`);
    writeFileSync(localPath, args.file.buffer);
    const asset: SourceVisualAsset = {
      assetId,
      petId: args.petId,
      sourceType: 'upload',
      originalName: args.file.originalname,
      label: args.label,
      mimeType: args.file.mimetype,
      sizeBytes: args.file.size,
      localPath,
      url: `/visual-studio/source-assets/${assetId}/file`,
      createdAt: now(),
    };
    this.sourceAssets.set(assetId, asset);
    return asset;
  }

  registerUrl(args: { petId: string; url: string; label?: string; mimeType?: string }) {
    if (!args.url.startsWith('http') && !args.url.startsWith('data:')) {
      throw new BadRequestException('url must be http(s) or data URL.');
    }
    const asset: SourceVisualAsset = {
      assetId: `source_${randomUUID()}`,
      petId: args.petId,
      sourceType: 'url',
      label: args.label,
      mimeType: args.mimeType,
      url: args.url,
      createdAt: now(),
    };
    this.sourceAssets.set(asset.assetId, asset);
    return asset;
  }

  getSourceAsset(assetId: string) {
    const asset = this.sourceAssets.get(assetId);
    if (!asset) {
      throw new NotFoundException(`Source visual asset ${assetId} not found.`);
    }
    return asset;
  }

  async createPixelAvatarKit(args: {
    petId: string;
    sessionId?: string;
    sourceAssetIds: string[];
    stylePresetKey?: PixelStylePresetKey;
    petName?: string;
    species?: 'cat' | 'dog' | 'unknown';
    traitNotes?: string[];
    candidateCount?: number;
    autoApproveFirstCandidate?: boolean;
  }) {
    const stylePresetKey = args.stylePresetKey ?? DEFAULT_STYLE;
    const preset = PIXEL_STYLE_PRESETS[stylePresetKey];
    if (!preset) {
      throw new BadRequestException(`Unknown pixel style preset ${stylePresetKey}.`);
    }
    const sourceAssets = this.resolveSourceAssets(args.petId, args.sourceAssetIds);
    const kitId = `pixel_kit_${randomUUID()}`;
    const visualProfile = this.buildVisualProfile({
      petId: args.petId,
      petName: args.petName,
      species: args.species,
      stylePresetKey,
      sourceAssets,
      traitNotes: args.traitNotes ?? [],
    });
    const createdAt = now();
    const kit: PixelAvatarKit = {
      kitId,
      petId: args.petId,
      sessionId: args.sessionId ?? 'demo_session_default',
      status: 'awaiting_selection',
      provider: this.imageProvider.providerName,
      stylePresetKey,
      sourceAssetIds: args.sourceAssetIds,
      visualProfile,
      candidates: [],
      assets: [],
      creditCostEstimate: this.estimateCreditCost(args.candidateCount ?? 4),
      usagePolicy:
        'Safety monitoring is included. Pixel avatar generation is a user-triggered AI creation and should consume Paw Credits when real provider billing is enabled.',
      createdAt,
      updatedAt: createdAt,
    };
    this.kits.set(kitId, kit);
    try {
      kit.candidates = await this.generateCandidates(kit, sourceAssets, Math.min(args.candidateCount ?? 4, 4));
      kit.updatedAt = now();
      if (args.autoApproveFirstCandidate && kit.candidates[0]) {
        return this.selectCandidate(kitId, kit.candidates[0].assetId);
      }
      return kit;
    } catch (error) {
      kit.status = 'failed';
      kit.error = error instanceof Error ? error.message : 'pixel_generation_failed';
      kit.updatedAt = now();
      throw error;
    }
  }

  getKit(kitId: string) {
    const kit = this.kits.get(kitId);
    if (!kit) {
      throw new NotFoundException(`Pixel avatar kit ${kitId} not found.`);
    }
    return kit;
  }

  async selectCandidate(kitId: string, candidateAssetId: string) {
    const kit = this.getKit(kitId);
    const selected = kit.candidates.find((candidate) => candidate.assetId === candidateAssetId);
    if (!selected) {
      throw new BadRequestException(`Candidate ${candidateAssetId} does not belong to kit ${kitId}.`);
    }
    const sourceAssets = this.resolveSourceAssets(kit.petId, kit.sourceAssetIds);
    kit.status = 'generating_derivatives';
    kit.selectedAvatarAssetId = candidateAssetId;
    kit.updatedAt = now();
    const canonicalAvatar: GeneratedVisualAsset = {
      ...selected,
      assetId: `generated_${randomUUID()}`,
      kind: 'avatar_selected',
      createdAt: now(),
    };
    const derivatives = await Promise.all(DERIVATIVE_KINDS.map((kind) => this.generateAsset(kit, sourceAssets, kind)));
    kit.assets = [canonicalAvatar, ...derivatives];
    kit.status = 'completed';
    kit.updatedAt = now();
    return kit;
  }

  private async generateCandidates(kit: PixelAvatarKit, sourceAssets: SourceVisualAsset[], count: number) {
    const candidates: GeneratedVisualAsset[] = [];
    for (let index = 0; index < count; index += 1) {
      candidates.push(await this.generateAsset(kit, sourceAssets, 'avatar_candidate', `Candidate variation ${index + 1}.`));
    }
    return candidates;
  }

  private async generateAsset(
    kit: PixelAvatarKit,
    sourceAssets: SourceVisualAsset[],
    kind: GeneratedAssetKind,
    extraPrompt?: string,
  ): Promise<GeneratedVisualAsset> {
    const preset = PIXEL_STYLE_PRESETS[kit.stylePresetKey];
    const prompt = [buildPixelPrompt({
      kind,
      presetKey: kit.stylePresetKey,
      identityBlock: kit.visualProfile.promptIdentityBlock,
      petName: kit.visualProfile.petName,
    }), extraPrompt]
      .filter(Boolean)
      .join('\n');
    const result = await this.imageProvider.generatePixelAsset({
      petId: kit.petId,
      kitId: kit.kitId,
      kind,
      prompt,
      negativePrompt: preset.negativePrompt,
      sourceAssets,
      width: preset.size.width,
      height: preset.size.height,
      transparentBackground: true,
    });
    return {
      assetId: `generated_${randomUUID()}`,
      petId: kit.petId,
      kitId: kit.kitId,
      kind,
      provider: this.imageProvider.providerName,
      url: result.url,
      prompt,
      width: preset.size.width,
      height: preset.size.height,
      transparentBackground: true,
      createdAt: now(),
    };
  }

  private resolveSourceAssets(petId: string, assetIds: string[]) {
    if (assetIds.length === 0) {
      throw new BadRequestException('At least one sourceAssetId is required.');
    }
    return assetIds.map((assetId) => {
      const asset = this.getSourceAsset(assetId);
      if (asset.petId !== petId) {
        throw new BadRequestException(`Source asset ${assetId} does not belong to pet ${petId}.`);
      }
      return asset;
    });
  }

  private buildVisualProfile(args: {
    petId: string;
    petName?: string;
    species?: 'cat' | 'dog' | 'unknown';
    stylePresetKey: PixelStylePresetKey;
    sourceAssets: SourceVisualAsset[];
    traitNotes: string[];
  }): PetVisualProfile {
    const notes = args.traitNotes.length > 0 ? args.traitNotes : ['Use the uploaded pet photos as identity reference.'];
    const referenceLabels = args.sourceAssets
      .map((asset) => asset.label ?? asset.originalName)
      .filter((value): value is string => Boolean(value));
    return {
      petId: args.petId,
      petName: args.petName,
      species: args.species ?? 'unknown',
      stylePresetKey: args.stylePresetKey,
      referenceAssetIds: args.sourceAssets.map((asset) => asset.assetId),
      traitNotes: notes,
      promptIdentityBlock: [
        `Species: ${args.species ?? 'unknown'}.`,
        referenceLabels.length > 0 ? `Reference labels: ${referenceLabels.join(', ')}.` : '',
        `Identity notes: ${notes.join('; ')}.`,
      ]
        .filter(Boolean)
        .join('\n'),
    };
  }

  private estimateCreditCost(candidateCount: number) {
    return 12 + candidateCount * 3 + DERIVATIVE_KINDS.length * 2;
  }
}

function now() {
  return new Date().toISOString();
}

function extensionFor(originalName: string, mimeType: string) {
  const explicit = originalName.match(/\.[a-zA-Z0-9]+$/)?.[0];
  if (explicit) {
    return explicit.toLowerCase();
  }
  if (mimeType === 'image/png') {
    return '.png';
  }
  if (mimeType === 'image/webp') {
    return '.webp';
  }
  return '.jpg';
}
