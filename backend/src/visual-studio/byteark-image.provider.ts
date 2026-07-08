import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { ImageWorkflowProvider, PixelGenerationRequest, PixelGenerationResult, SourceVisualAsset } from './visual-studio.types';

type ByteArkResponse = {
  data?: Array<{ url?: string; b64_json?: string }>;
  images?: Array<string | { url?: string; b64_json?: string }>;
  result?: ByteArkResponse;
  output?: ByteArkResponse | string | string[];
  url?: string;
  b64_json?: string;
};

@Injectable()
export class ByteArkImageProvider implements ImageWorkflowProvider {
  readonly providerName = 'byteark';

  async generatePixelAsset(request: PixelGenerationRequest): Promise<PixelGenerationResult> {
    const endpoint = requireEnv('BYTEARK_IMAGE_ENDPOINT');
    const apiKey = requireEnv('BYTEARK_API_KEY');
    const model = requireEnv('BYTEARK_IMAGE_MODEL');
    const responseFormat = process.env.BYTEARK_IMAGE_RESPONSE_FORMAT ?? 'b64_json';
    const sourceField = process.env.BYTEARK_IMAGE_SOURCE_FIELD ?? 'image';
    const inputMode = process.env.BYTEARK_IMAGE_INPUT_MODE ?? 'base64';
    const timeoutMs = Number(process.env.BYTEARK_IMAGE_TIMEOUT_MS ?? 60000);
    const body: Record<string, unknown> = {
      model,
      prompt: request.prompt,
      size: `${request.width}x${request.height}`,
      response_format: responseFormat,
    };

    if (request.negativePrompt) {
      body[process.env.BYTEARK_NEGATIVE_PROMPT_FIELD ?? 'negative_prompt'] = request.negativePrompt;
    }

    const sourceImages = this.buildSourceImages(request.sourceAssets, inputMode);
    if (sourceImages.length === 1) {
      body[sourceField] = sourceImages[0];
    } else if (sourceImages.length > 1) {
      body[sourceField] = sourceImages;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await response.text();
      if (!response.ok) {
        throw new InternalServerErrorException({
          message: 'ByteDance image provider request failed.',
          status: response.status,
          detail: safeProviderDetail(text),
        });
      }
      const json = parseJson(text);
      return { url: this.extractImageUrl(json), providerAssetId: this.extractProviderAssetId(json) };
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildSourceImages(sourceAssets: SourceVisualAsset[], inputMode: string) {
    if (inputMode === 'none') {
      return [];
    }
    if (inputMode === 'url') {
      return sourceAssets.map((asset) => asset.url).filter((value): value is string => Boolean(value));
    }
    return sourceAssets.map((asset) => this.sourceAssetToDataUrl(asset));
  }

  private sourceAssetToDataUrl(asset: SourceVisualAsset) {
    if (asset.url?.startsWith('data:')) {
      return asset.url;
    }
    if (!asset.localPath || !asset.mimeType) {
      throw new BadRequestException(
        `Source asset ${asset.assetId} cannot be sent as base64. Upload a file or set BYTEARK_IMAGE_INPUT_MODE=url with a public URL.`,
      );
    }
    const data = readFileSync(asset.localPath).toString('base64');
    return `data:${asset.mimeType};base64,${data}`;
  }

  private extractImageUrl(json: ByteArkResponse) {
    const found = firstImage(json);
    if (!found) {
      throw new InternalServerErrorException('ByteDance image provider returned no image URL or base64 payload.');
    }
    return found.startsWith('data:') || found.startsWith('http') ? found : `data:image/png;base64,${found}`;
  }

  private extractProviderAssetId(json: ByteArkResponse) {
    const output = typeof json.output === 'string' ? json.output : undefined;
    return output ? basename(output).replace(/\W+/g, '_') : undefined;
  }
}

function requireEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new BadRequestException(`${key} is required when PAWROOM_IMAGE_PROVIDER=byteark.`);
  }
  return value;
}

function parseJson(text: string): ByteArkResponse {
  try {
    return JSON.parse(text) as ByteArkResponse;
  } catch {
    throw new InternalServerErrorException('ByteDance image provider returned non-JSON response.');
  }
}

function firstImage(value: ByteArkResponse | string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.find((item) => typeof item === 'string');
  }
  if (value.url) {
    return value.url;
  }
  if (value.b64_json) {
    return value.b64_json;
  }
  const dataImage = value.data?.map((item) => item.url ?? item.b64_json).find(Boolean);
  if (dataImage) {
    return dataImage;
  }
  const image = value.images
    ?.map((item) => (typeof item === 'string' ? item : item.url ?? item.b64_json))
    .find(Boolean);
  return image ?? firstImage(value.result) ?? firstImage(value.output);
}

function safeProviderDetail(text: string) {
  return text.length > 500 ? `${text.slice(0, 500)}...` : text;
}
