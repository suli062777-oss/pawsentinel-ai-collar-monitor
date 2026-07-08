import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DemoService } from '../demo/demo.service';

@Controller('pets')
export class PetsController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  listPets() {
    return [this.demoService.getDefaultPet()];
  }

  @Post()
  createPet(@Body() body: Record<string, unknown>) {
    const defaultPet = this.demoService.getDefaultPet();
    return {
      ...defaultPet,
      ...body,
      petId: typeof body.petId === 'string' ? body.petId : `pet_${Date.now()}`,
      createdFrom: 'mvp_mock',
    };
  }

  @Post(':petId/assets')
  addAsset(@Param('petId') petId: string, @Body() body: Record<string, unknown>) {
    return {
      assetId: `asset_${Date.now()}`,
      petId,
      type: body.type ?? 'photo',
      url: body.url ?? '/mock-assets/pet-placeholder.png',
      source: body.source ?? 'user_upload_mock',
      createdAt: new Date().toISOString(),
    };
  }
}
