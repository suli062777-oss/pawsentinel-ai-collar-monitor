import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  ACTIVITY_LEVELS,
  ActivityLevel,
  MOTION_HINTS,
  MotionHint,
  RESTING_TREND_VALUES,
  RestingTrendValue,
  TREND_VALUES,
  TrendValue,
  ZONE_IDS,
  ZoneId,
} from '../../common/types/pawroom.types';

export class IngestTelemetryDto {
  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  sampleId?: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsString()
  petId!: string;

  @IsOptional()
  @IsString()
  timestamp?: string;

  @IsIn([...ZONE_IDS])
  zoneId!: ZoneId;

  @IsIn([...ACTIVITY_LEVELS])
  activityLevel!: ActivityLevel;

  @IsOptional()
  @IsIn([...MOTION_HINTS])
  motionHint?: MotionHint;

  @IsOptional()
  @IsIn([...TREND_VALUES])
  heartRateTrend?: TrendValue;

  @IsOptional()
  @IsIn([...TREND_VALUES])
  respirationTrend?: TrendValue;

  @IsOptional()
  @IsIn([...RESTING_TREND_VALUES])
  restingDurationTrend?: RestingDurationTrendValue;

  @IsInt()
  @Min(0)
  @Max(100)
  battery!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence!: number;
}

type RestingDurationTrendValue = RestingTrendValue;
