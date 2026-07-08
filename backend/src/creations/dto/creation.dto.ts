import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { CREATION_TYPES, CreationType } from '../../common/types/pawroom.types';

const CREATION_TYPE_VALUES = [...CREATION_TYPES];

export class EstimateCreationDto {
  @IsIn(CREATION_TYPE_VALUES)
  type!: CreationType;
}

export class CreateCreationDto {
  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsString()
  petId!: string;

  @IsIn(CREATION_TYPE_VALUES)
  type!: CreationType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inputAssetIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inputEventIds?: string[];
}
