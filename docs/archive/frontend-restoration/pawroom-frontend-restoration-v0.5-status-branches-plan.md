# PawRoom Frontend Restoration v0.5 Status Branches Plan

## Objective

v0.5 keeps the approved page structure and visual language, then adds realistic care-status branches so PawRoom can demonstrate more than a single normal-state dashboard.

The page layout still follows:

- Fixed 1440 x 1024 web prototype stage
- Left liquid-glass sidebar only
- Pixel pet and pixel home scene for world content
- Liquid-glass UI surfaces for controls and data
- Brand orange based on `#FF8F3F`

## Status Modes

The status branch is driven by URL query mode, without exposing a demo-control panel in the UI.

- `?page=home&mode=normal`
- `?page=world&mode=lowBattery`
- `?page=world&mode=offline`
- `?page=world&mode=attention`

### Normal

- Safety level: high
- Collar: connected
- Battery: 78%
- Confidence: 72%
- Core message: pet is resting safely in the living room

### Low Battery

- Safety level: medium
- Collar: connected
- Battery: 18%
- Confidence: 66%
- Core message: collar can still sync, but charging should happen soon

### Offline

- Safety level: unknown
- Collar: offline
- Battery: not available
- Confidence: 28%
- Core message: show the last synced state and ask user to check device distance or power

### Attention

- Safety level: needs attention
- Collar: connected
- Battery: 62%
- Confidence: 58%
- Core message: rest time is longer than usual and should be observed

## Product Rules

- Safety monitoring remains the product's main value.
- Pixel world and AI replay are interpretation layers, not medical diagnosis.
- AI-generated content must be marked as interpretation when relevant.
- Device and data states must be visible in the same IA locations: home, desktop world, pet data, battery, and profile.
- No new first-level navigation item is added.

## Visual Rules

- Low battery uses amber/warm accents, not a new primary color.
- Offline uses muted gray and lower scene confidence, but does not make the UI look broken.
- Attention uses restrained red/orange emphasis and keeps the medical boundary clear.
- Normal mode stays closest to the existing approved visual direction.
