import { Provider } from '@nestjs/common';
import { ByteArkImageProvider } from './byteark-image.provider';
import { IMAGE_WORKFLOW_PROVIDER } from './image-provider.tokens';
import { MockPixelImageProvider } from './mock-pixel-image.provider';

export const ImageProviderFactory: Provider = {
  provide: IMAGE_WORKFLOW_PROVIDER,
  inject: [MockPixelImageProvider, ByteArkImageProvider],
  useFactory: (mockProvider: MockPixelImageProvider, byteArkProvider: ByteArkImageProvider) => {
    const provider = process.env.PAWROOM_IMAGE_PROVIDER ?? 'mock';
    if (provider === 'byteark') {
      return byteArkProvider;
    }
    return mockProvider;
  },
};
