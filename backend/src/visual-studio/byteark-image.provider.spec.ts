import { ByteArkImageProvider } from './byteark-image.provider';

describe('ByteArkImageProvider', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      BYTEARK_API_KEY: 'test-key',
      BYTEARK_IMAGE_ENDPOINT: 'https://example.com/images/generations',
      BYTEARK_IMAGE_MODEL: 'test-image-model',
      BYTEARK_IMAGE_RESPONSE_FORMAT: 'b64_json',
      BYTEARK_IMAGE_INPUT_MODE: 'base64',
      BYTEARK_IMAGE_SOURCE_FIELD: 'image',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('builds a ByteDance image request and parses base64 image responses', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ data: [{ b64_json: 'ZmFrZV9pbWFnZQ==' }] }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const provider = new ByteArkImageProvider();

    const result = await provider.generatePixelAsset({
      petId: 'pet_demo',
      kitId: 'kit_demo',
      kind: 'avatar_candidate',
      prompt: 'pixel pet prompt',
      negativePrompt: 'realistic photo',
      sourceAssets: [
        {
          assetId: 'source_demo',
          petId: 'pet_demo',
          sourceType: 'url',
          url: 'data:image/png;base64,c291cmNl',
          createdAt: '2026-07-08T00:00:00.000Z',
        },
      ],
      width: 1024,
      height: 1024,
      transparentBackground: true,
    });

    expect(result.url).toBe('data:image/png;base64,ZmFrZV9pbWFnZQ==');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/images/generations',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.model).toBe('test-image-model');
    expect(body.prompt).toBe('pixel pet prompt');
    expect(body.negative_prompt).toBe('realistic photo');
    expect(body.image).toBe('data:image/png;base64,c291cmNl');
  });
});
