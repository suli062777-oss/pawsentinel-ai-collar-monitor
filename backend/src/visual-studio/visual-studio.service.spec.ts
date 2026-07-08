import { MockPixelImageProvider } from './mock-pixel-image.provider';
import { VisualStudioService } from './visual-studio.service';

describe('VisualStudioService', () => {
  let service: VisualStudioService;

  beforeEach(() => {
    service = new VisualStudioService(new MockPixelImageProvider());
  });

  it('creates pixel avatar candidates from source pet assets', async () => {
    const source = service.registerUrl({
      petId: 'pet_demo',
      url: 'https://example.com/pet.png',
      label: 'front face',
      mimeType: 'image/png',
    });

    const kit = await service.createPixelAvatarKit({
      petId: 'pet_demo',
      sourceAssetIds: [source.assetId],
      petName: 'Momo',
      species: 'dog',
      traitNotes: ['yellow fur', 'round face'],
      candidateCount: 2,
    });

    expect(kit.status).toBe('awaiting_selection');
    expect(kit.provider).toBe('mock');
    expect(kit.candidates).toHaveLength(2);
    expect(kit.candidates[0].url).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(kit.visualProfile.promptIdentityBlock).toContain('yellow fur');
  });

  it('selects a candidate and generates a complete reusable asset kit', async () => {
    const source = service.registerUrl({
      petId: 'pet_demo',
      url: 'data:image/png;base64,ZmFrZQ==',
      label: 'pet reference',
      mimeType: 'image/png',
    });
    const kit = await service.createPixelAvatarKit({
      petId: 'pet_demo',
      sourceAssetIds: [source.assetId],
      candidateCount: 1,
    });

    const completed = await service.selectCandidate(kit.kitId, kit.candidates[0].assetId);

    expect(completed.status).toBe('completed');
    expect(completed.selectedAvatarAssetId).toBe(kit.candidates[0].assetId);
    expect(completed.assets.map((asset) => asset.kind)).toEqual(
      expect.arrayContaining(['avatar_selected', 'action_idle', 'action_sleep', 'sticker_happy', 'scene_token', 'role_card']),
    );
  });
});
