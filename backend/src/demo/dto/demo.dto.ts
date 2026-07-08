import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDemoSessionDto {
  @IsOptional()
  @IsString()
  scenarioId?: string;
}

export class PlaybackDemoSessionDto {
  @IsOptional()
  @IsBoolean()
  includeFirst?: boolean;
}
