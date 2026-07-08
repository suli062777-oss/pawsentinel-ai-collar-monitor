# PawRoom Pixel Avatar Kit Architecture v0.1

## Goal

This feature turns uploaded real pet photos into a reusable pixel-game pet asset kit for PawRoom.

The first production-shaped flow is:

```text
Upload pet photos
  -> create source visual assets
  -> generate 1-4 pixel avatar candidates
  -> user selects the most accurate candidate
  -> generate reusable derivatives
  -> frontend uses the kit in the desktop room scene
```

## Why Two Steps

Do not generate every asset immediately from raw photos.

First generate avatar candidates, then let the user pick the one that looks most like their pet. The selected avatar becomes the canonical identity reference for the asset kit. This reduces the risk that stickers, room tokens, and action states look like different pets.

## Backend Module

New module:

```text
backend/src/visual-studio
```

Key pieces:

- `VisualStudioController`: REST API for upload, kit creation, candidate selection, and kit lookup.
- `VisualStudioService`: stores source assets and pixel kits, builds prompts, and coordinates providers.
- `MockPixelImageProvider`: default local provider. Returns displayable data URLs so the frontend flow can run without API credentials.
- `ByteArkImageProvider`: ByteDance/Volcengine image provider adapter.
- `pixel-style-presets.ts`: hard-coded PawRoom pixel style prompt, negative prompt, and post-processing policy.

## Where To Put ByteDance API

Put credentials in:

```text
backend/.env
```

Use `backend/.env.example` as the template.

Required when switching from mock to ByteDance/Volcengine:

```env
PAWROOM_IMAGE_PROVIDER=byteark
BYTEARK_API_KEY="your_api_key_here"
BYTEARK_IMAGE_ENDPOINT="https://ark.cn-beijing.volces.com/api/v3/images/generations"
BYTEARK_IMAGE_MODEL="your_seedream_or_image_model_id"
BYTEARK_IMAGE_RESPONSE_FORMAT="b64_json"
BYTEARK_IMAGE_INPUT_MODE="base64"
BYTEARK_IMAGE_SOURCE_FIELD="image"
BYTEARK_NEGATIVE_PROMPT_FIELD="negative_prompt"
BYTEARK_IMAGE_TIMEOUT_MS=60000
```

Notes:

- Keep API keys on the backend only. The frontend must never call ByteDance directly.
- If your selected ByteDance model expects public image URLs instead of base64, set:

```env
BYTEARK_IMAGE_INPUT_MODE="url"
BYTEARK_IMAGE_SOURCE_FIELD="image"
```

- If the provider expects a different image field, change `BYTEARK_IMAGE_SOURCE_FIELD`.
- The endpoint and model name must match your Volcengine/ByteDance console.

## API Flow

### 1. Check provider

```http
GET /visual-studio/provider
```

Returns active provider and required ByteDance env names.

### 2. List supported styles

```http
GET /visual-studio/styles
```

MVP supports:

```text
pawroom_pixel_soft
```

### 3. Upload a pet photo

```http
POST /pets/:petId/visual-assets
Content-Type: multipart/form-data

file=<image>
label=front face
```

For test/demo without real upload:

```http
POST /pets/:petId/visual-assets/from-url
```

```json
{
  "url": "https://example.com/pet.png",
  "label": "front face",
  "mimeType": "image/png"
}
```

### 4. Generate avatar candidates

```http
POST /pets/:petId/pixel-avatar-kits
```

```json
{
  "sourceAssetIds": ["source_xxx"],
  "petName": "Coco",
  "species": "dog",
  "traitNotes": ["golden fur", "round face", "small tail"],
  "candidateCount": 4
}
```

Returns:

```text
status = awaiting_selection
candidates = 1-4 avatar_candidate assets
```

### 5. Select the best candidate

```http
POST /visual-studio/pixel-avatar-kits/:kitId/select-candidate
```

```json
{
  "candidateAssetId": "generated_xxx"
}
```

Returns:

```text
status = completed
assets = avatar_selected + actions + stickers + scene_token + role_card
```

### 6. Fetch kit

```http
GET /visual-studio/pixel-avatar-kits/:kitId
```

## Generated Asset Types

MVP kit output:

- `avatar_selected`
- `action_idle`
- `action_sleep`
- `action_walk`
- `action_play`
- `action_waiting`
- `action_attention`
- `sticker_happy`
- `sticker_sleepy`
- `sticker_waiting`
- `sticker_alert`
- `sticker_cute`
- `sticker_proud`
- `scene_token`
- `role_card`

## Pixel Style Constraint

The style preset enforces:

- cute pixel game sprite
- thick dark outline
- limited color palette
- flat colors
- no gradients
- no realistic fur
- transparent background
- centered single pet character
- no text or watermark

Post-processing policy for future image pipeline:

- remove background
- crop square
- quantize to 12-24 colors
- nearest-neighbor upscale
- export transparent PNG

## Verification

Run:

```bash
cd backend
npm run build
npm test
npm run smoke:visual
```

`smoke:visual` uses the mock provider by default and proves that the full software flow works without ByteDance credentials.
