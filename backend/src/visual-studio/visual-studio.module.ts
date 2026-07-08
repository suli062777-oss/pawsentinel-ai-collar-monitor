import { Module } from '@nestjs/common';
import { ByteArkImageProvider } from './byteark-image.provider';
import { ImageProviderFactory } from './image-provider.factory';
import { MockPixelImageProvider } from './mock-pixel-image.provider';
import { VisualStudioController } from './visual-studio.controller';
import { VisualStudioService } from './visual-studio.service';

@Module({
  controllers: [VisualStudioController],
  providers: [MockPixelImageProvider, ByteArkImageProvider, ImageProviderFactory, VisualStudioService],
  exports: [VisualStudioService],
})
export class VisualStudioModule {}
