import { Injectable } from '@nestjs/common';
import { ImageWorkflowProvider, PixelGenerationRequest, PixelGenerationResult } from './visual-studio.types';

@Injectable()
export class MockPixelImageProvider implements ImageWorkflowProvider {
  readonly providerName = 'mock';

  async generatePixelAsset(request: PixelGenerationRequest): Promise<PixelGenerationResult> {
    return {
      url: this.buildDataUrl(request),
      providerAssetId: `mock_${request.kind}_${request.kitId}`,
    };
  }

  private buildDataUrl(request: PixelGenerationRequest) {
    const palette = this.paletteFor(request.kind);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${request.width}" height="${request.height}" viewBox="0 0 128 128" shape-rendering="crispEdges">
<rect width="128" height="128" fill="none"/>
<rect x="30" y="46" width="68" height="42" fill="${palette.outline}"/>
<rect x="34" y="42" width="18" height="16" fill="${palette.outline}"/>
<rect x="76" y="42" width="18" height="16" fill="${palette.outline}"/>
<rect x="34" y="50" width="60" height="34" fill="${palette.body}"/>
<rect x="38" y="46" width="10" height="10" fill="${palette.inner}"/>
<rect x="80" y="46" width="10" height="10" fill="${palette.inner}"/>
<rect x="46" y="62" width="8" height="8" fill="${palette.eye}"/>
<rect x="74" y="62" width="8" height="8" fill="${palette.eye}"/>
<rect x="60" y="72" width="8" height="5" fill="${palette.eye}"/>
<rect x="54" y="80" width="20" height="4" fill="${palette.mood}"/>
<rect x="88" y="70" width="16" height="10" fill="${palette.outline}"/>
<rect x="92" y="66" width="8" height="10" fill="${palette.body}"/>
<rect x="36" y="86" width="10" height="8" fill="${palette.outline}"/>
<rect x="78" y="86" width="10" height="8" fill="${palette.outline}"/>
</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
  }

  private paletteFor(kind: string) {
    const palettes = {
      avatar_candidate: { body: '#f4c26b', inner: '#ffd9df', outline: '#20110c', eye: '#20110c', mood: '#f08a9d' },
      avatar_selected: { body: '#f4c26b', inner: '#ffd9df', outline: '#20110c', eye: '#20110c', mood: '#f08a9d' },
      action_sleep: { body: '#f7dca0', inner: '#ffd9df', outline: '#20110c', eye: '#20110c', mood: '#7aa7c7' },
      action_walk: { body: '#dfa857', inner: '#ffd9df', outline: '#20110c', eye: '#20110c', mood: '#91c788' },
      action_play: { body: '#ffbd59', inner: '#ffd9df', outline: '#20110c', eye: '#20110c', mood: '#ff6f61' },
      action_waiting: { body: '#f4c26b', inner: '#ffd9df', outline: '#20110c', eye: '#20110c', mood: '#9ab6d3' },
      action_attention: { body: '#f4c26b', inner: '#ffd9df', outline: '#20110c', eye: '#20110c', mood: '#f2d34f' },
    } as const;
    return (
      palettes[kind as keyof typeof palettes] ?? {
        body: '#f4c26b',
        inner: '#ffd9df',
        outline: '#20110c',
        eye: '#20110c',
        mood: '#f08a9d',
      }
    );
  }
}
