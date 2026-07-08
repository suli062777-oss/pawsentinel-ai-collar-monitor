# PawRoom Frontend Restoration Implementation Log v0.7

## Scope

This iteration adds the first concrete asset-replacement mechanism for the desktop-world page.

The visual layout is intentionally unchanged. The purpose is to let future image2 transparent assets replace CSS-drawn scene props without rebuilding the page structure.

## Changes

- Added `worldGeneratedAssets` in `frontend/src/app.js`.
- Added asset helper functions:
  - `getGeneratedAsset(id)`
  - `renderWorldProp(prop)`
  - `getWorldPetSprite()`
- Updated desktop-world room prop rendering:
  - If an asset path is empty, the existing CSS placeholder remains.
  - If an asset path is provided, the slot renders a transparent image inside the existing prop box.
- Added `room-prop-asset` CSS for generated transparent assets.
- Created generated asset folder:
  - `frontend/assets/generated/world/.gitkeep`
- Added P0 image2 prompt pack:
  - `docs/pawroom-image2-world-p0-prompts-v0.1.md`
- Updated `frontend/README.md` with v0.7 screenshot evidence.

## What Did Not Change

- No layout changes.
- No new first-level navigation.
- No top global bar.
- No right drawer.
- No color/radius/spacing redesign.
- No full-page source image pasted as a background.

## Verification

Passed:

- `node --check frontend/src/app.js`
- Replacement-character and mojibake scan for updated app, CSS, and prompt docs.
- Banned structure scan for:
  - `topbar`
  - `navbar`
  - `right-sidebar`
  - `drawer`
  - `h-screen`
  - `Unsplash`
- Confirmed required symbols exist:
  - `worldGeneratedAssets`
  - `getGeneratedAsset`
  - `renderWorldProp`
  - `getWorldPetSprite`
  - `data-asset-slot`
  - `room-prop-asset`
- Generated screenshot:
  - `docs/assets/frontend-screenshots-v0.7/world-asset-slots-v0.7.png`
- Screenshot verified as `1440 x 1024` and nonblank through pixel sampling.

## Next Correction Pass

- Generate or import P0 transparent assets under `frontend/assets/generated/world/`.
- Fill the matching keys in `worldGeneratedAssets` one by one.
- After each replacement, compare screenshot against the desktop-world high-fidelity reference.
- Prioritize: `petIdle`, `sofa`, `bowl`, `toy`, `pet-bed`, then full `sceneBackground`.