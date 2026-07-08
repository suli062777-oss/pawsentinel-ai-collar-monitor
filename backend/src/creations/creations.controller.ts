import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreationsService } from './creations.service';
import { CreateCreationDto, EstimateCreationDto } from './dto/creation.dto';

@Controller('creations')
export class CreationsController {
  constructor(private readonly creationsService: CreationsService) {}

  @Post('estimate')
  estimate(@Body() body: EstimateCreationDto) {
    return this.creationsService.estimate(body.type);
  }

  @Post()
  create(@Body() body: CreateCreationDto) {
    return this.creationsService.create(body);
  }

  @Get(':creationId')
  get(@Param('creationId') creationId: string) {
    return this.creationsService.get(creationId);
  }
}