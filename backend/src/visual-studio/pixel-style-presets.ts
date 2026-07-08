import { GeneratedAssetKind, PixelStylePresetKey } from './visual-studio.types';

export type PixelStylePreset = {
  key: PixelStylePresetKey;
  label: string;
  description: string;
  size: { width: number; height: number };
  promptPrefix: string;
  negativePrompt: string;
  postProcessPolicy: string[];
};

export const PIXEL_STYLE_PRESETS: Record<PixelStylePresetKey, PixelStylePreset> = {
  pawroom_pixel_soft: {
    key: 'pawroom_pixel_soft',
    label: 'PawRoom soft pixel game sprite',
    description:
      'Cute low-resolution pet sprite with thick outline, limited palette, simple pose, and transparent game-asset background.',
    size: { width: 1024, height: 1024 },
    promptPrefix:
      'Create a cute pixel art game sprite of the referenced pet. Use low-resolution pixel game style, thick dark outline, flat colors, limited color palette, crisp square pixels, chibi proportions, centered single pet character, transparent background, no text. Keep the pet identity consistent: main fur color, face markings, ear shape, tail shape, body silhouette, collar or distinctive markings if visible.',
    negativePrompt:
      'realistic photo, detailed fur, 3d render, soft gradient, watercolor, oil painting, noisy background, room background, text, watermark, multiple animals, extra legs, distorted face, human, logo',
    postProcessPolicy: [
      'remove background',
      'crop to square bounds',
      'quantize to 12-24 colors',
      'nearest-neighbor upscale',
      'export transparent PNG for frontend sprites',
    ],
  },
};

const KIND_PROMPTS: Record<GeneratedAssetKind, string> = {
  avatar_candidate:
    'Generate one neutral standing avatar candidate. Front three-quarter view, friendly expression, clear silhouette.',
  avatar_selected:
    'Refine the selected avatar into a canonical PawRoom pet sprite. Neutral pose, very readable silhouette.',
  action_idle: 'Idle pose. Tiny breathing feeling, relaxed eyes, suitable as the default desktop pet state.',
  action_sleep: 'Sleeping pose. Curled or lying down, calm expression, small sleepy feeling.',
  action_walk: 'Walking pose. Side-facing readable legs, simple game sprite motion frame.',
  action_play: 'Playing pose. Excited body language, toy-chasing feeling, cute and energetic.',
  action_waiting: 'Waiting pose. Looking toward the door or owner, patient and slightly expectant.',
  action_attention: 'Needs attention pose. Mild alert expression, not medical, not scary, just noticeable.',
  sticker_happy: 'Sticker expression: happy. Big cute eyes, cheerful face, transparent background.',
  sticker_sleepy: 'Sticker expression: sleepy. Half-closed eyes, tiny sleepy mood, transparent background.',
  sticker_waiting: 'Sticker expression: waiting for owner. Gentle expectant face, transparent background.',
  sticker_alert: 'Sticker expression: alert. Ears up, curious, safe non-medical warning mood.',
  sticker_cute: 'Sticker expression: cute begging or cuddle mood, transparent background.',
  sticker_proud: 'Sticker expression: proud little pet, confident tiny pose, transparent background.',
  scene_token:
    'Small map token for a desktop room scene. Top-down friendly sprite icon, clear at small size, transparent background.',
  role_card:
    'Pixel game character card for this pet. Single pet portrait, small decorative pixel frame, no readable text.',
};

export function buildPixelPrompt(args: {
  kind: GeneratedAssetKind;
  presetKey: PixelStylePresetKey;
  identityBlock: string;
  petName?: string;
}) {
  const preset = PIXEL_STYLE_PRESETS[args.presetKey];
  const petLine = args.petName ? `Pet name: ${args.petName}.` : '';
  return [
    preset.promptPrefix,
    petLine,
    args.identityBlock,
    KIND_PROMPTS[args.kind],
    'Use the same pet identity across all generated assets.',
  ]
    .filter(Boolean)
    .join('\n');
}
