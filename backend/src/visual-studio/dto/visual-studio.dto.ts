import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PIXEL_STYLE_PRESET_KEYS, PixelStylePresetKey } from '../visual-studio.types';

const PIXEL_STYLE_VALUES = [...PIXEL_STYLE_PRESET_KEYS];

export class RegisterVisualAssetFromUrlDto {
  @IsString()
  url!: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;
}

export class CreatePixelAvatarKitDto {
  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsArray()
  @IsString({ each: true })
  sourceAssetIds!: string[];

  @IsOptional()
  @IsIn(PIXEL_STYLE_VALUES)
  stylePresetKey?: PixelStylePresetKey;

  @IsOptional()
  @IsString()
  petName?: string;

  @IsOptional()
  @IsIn(['cat', 'dog', 'unknown'])
  species?: 'cat' | 'dog' | 'unknown';

  @IsOptional()
  @IsString({ each: true })
  traitNotes?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  candidateCount?: number;

  @IsOptional()
  @IsBoolean()
  autoApproveFirstCandidate?: boolean;
}

export class SelectPixelAvatarCandidateDto {
  @IsString()
  candidateAssetId!: string;
}
