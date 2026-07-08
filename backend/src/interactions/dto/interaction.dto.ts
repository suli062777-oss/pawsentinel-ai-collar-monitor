import { IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  petId!: string;

  @IsString()
  action!: string;
}
