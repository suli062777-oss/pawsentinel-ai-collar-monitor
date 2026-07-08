import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateDemoSessionDto {
  @IsOptional()
  @IsString()
  scenarioId?: string;
}

export class PlaybackDemoSessionDto {
  @IsOptional()
  @IsBoolean()
  includeFirst?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5000)
  intervalMs?: number;
}
