import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  CreatePixelAvatarKitDto,
  RegisterVisualAssetFromUrlDto,
  SelectPixelAvatarCandidateDto,
} from './dto/visual-studio.dto';
import { VisualStudioService } from './visual-studio.service';

@Controller()
export class VisualStudioController {
  constructor(private readonly visualStudioService: VisualStudioService) {}

  @Get('visual-studio/provider')
  getProviderInfo() {
    return this.visualStudioService.getProviderInfo();
  }

  @Get('visual-studio/styles')
  getStyles() {
    return this.visualStudioService.getStyles();
  }

  @Post('pets/:petId/visual-assets')
  @UseInterceptors(FileInterceptor('file'))
  uploadVisualAsset(
    @Param('petId') petId: string,
    @UploadedFile() file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
    @Body('label') label?: string,
  ) {
    return this.visualStudioService.registerUploadedFile({ petId, file, label });
  }

  @Post('pets/:petId/visual-assets/from-url')
  registerVisualAssetFromUrl(@Param('petId') petId: string, @Body() body: RegisterVisualAssetFromUrlDto) {
    return this.visualStudioService.registerUrl({ petId, ...body });
  }

  @Get('visual-studio/source-assets/:assetId/file')
  getSourceAssetFile(@Param('assetId') assetId: string, @Res() response: Response) {
    const asset = this.visualStudioService.getSourceAsset(assetId);
    if (asset.localPath) {
      response.sendFile(asset.localPath);
      return;
    }
    if (asset.url?.startsWith('http')) {
      response.redirect(asset.url);
      return;
    }
    if (asset.url?.startsWith('data:')) {
      const [header, payload] = asset.url.split(',');
      const mimeType = header.match(/^data:(.*);base64$/)?.[1] ?? 'image/png';
      response.type(mimeType).send(Buffer.from(payload, 'base64'));
      return;
    }
    throw new NotFoundException(`Source visual asset ${assetId} has no readable file.`);
  }

  @Post('pets/:petId/pixel-avatar-kits')
  createPixelAvatarKit(@Param('petId') petId: string, @Body() body: CreatePixelAvatarKitDto) {
    return this.visualStudioService.createPixelAvatarKit({ petId, ...body });
  }

  @Get('visual-studio/pixel-avatar-kits/:kitId')
  getPixelAvatarKit(@Param('kitId') kitId: string) {
    return this.visualStudioService.getKit(kitId);
  }

  @Post('visual-studio/pixel-avatar-kits/:kitId/select-candidate')
  selectPixelAvatarCandidate(@Param('kitId') kitId: string, @Body() body: SelectPixelAvatarCandidateDto) {
    return this.visualStudioService.selectCandidate(kitId, body.candidateAssetId);
  }
}
