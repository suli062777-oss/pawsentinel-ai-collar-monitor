# PawRoom 半开放式像素桌宠场景提示词 v0.1

日期：2026-07-08  
用途：桌面端首次展示、桌宠悬浮窗、桌面小世界局部状态示意  
画幅建议：16:9，如 `1536 × 864`、`1920 × 1080`  

## 1. 核心定义

这组图不是完整 UI，也不是完整房间插画，而是“半开放式桌宠场景”：

- 画面里有一个像素宠物。
- 只展示和宠物当前行为相关的小物件。
- 场景边界是异型、不规则、漂浮的，不是完整矩形房间。
- 画布其他部分应为透明或可抠透明区域，让用户能看到真实电脑桌面。
- 只有宠物和小场景是像素风，产品界面本身不要像素化。

如果生成工具支持透明背景，使用“transparent background / alpha background”。  
如果生成工具不支持透明背景，使用纯色绿幕背景 `#00FF00`，后期抠图。

---

## 2. 全局风格前缀

每条提示词都建议带上：

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. Only the pixel pet and its small irregular scene island are visible; all other areas are transparent. Crisp handmade pixel art, chunky dark pixel outline, limited indexed color palette, flat color blocks, nearest-neighbor pixel edges, low noise, no grain, no painterly texture, no smooth vector look, no glossy 3D. The scene island has an organic irregular silhouette, not a rectangle, not a complete room. No app UI, no buttons, no navigation bars, no cards, no text, no watermark.
```

绿幕抠图替代版：

```text
Create the same scene on a perfectly flat solid #00FF00 chroma-key background for background removal. Do not use #00FF00 inside the pet or scene. No shadows or gradients on the green background.
```

全局负面提示词：

```text
Avoid AI-generated look, avoid realistic fur, avoid over-detailed fur, avoid extra limbs, avoid distorted face, avoid random decorative symbols, avoid full room background, avoid square frame, avoid UI screenshot, avoid phone screen, avoid desktop screenshot, avoid text, avoid watermark, avoid blur, avoid soft airbrush, avoid smooth 3D render, avoid complex lighting, avoid dense scene.
```

---

## 3. 场景 A：宠物在沙发上睡觉

### A1. 极简悬浮沙发岛

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A strange cute pixel pet is sleeping on a tiny soft sofa island: loaf-shaped puppy-cat body, closed sleepy eyes, tiny orange smart collar beacon, one small folded blanket, one floating battery mood bubble above it. Only the sofa, pet, blanket, and bubble are visible; all other areas are transparent. Crisp handmade pixel art, chunky dark brown pixel outline, limited palette: cream white, warm orange, caramel yellow, pale mint, soft blue shadow. The sofa island has an irregular soft silhouette, not a rectangle, not a full room. No app UI, no buttons, no text, no watermark.

Avoid AI-generated look, realistic fur, over-detailed fur, extra limbs, distorted face, full room background, square frame, dense props, glossy 3D, blur, grain, painterly texture, smooth vector look.
```

### A2. 只露出沙发角落

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A pixel pet sleeps curled on only one visible corner of a sofa, with two sofa cushions and a tiny orange collar light blinking softly. The scene is an irregular cutout: sofa corner, pet, one pillow, a few tiny sleep pixels; the rest of the canvas is transparent. Pixel style should feel hand-placed, like a small desktop sprite scene, chunky outline, flat blocks, low noise. Use warm cream, caramel sofa, pastel blue shadow, PawRoom orange accent, dark brown outline. No complete room, no wall, no floor rectangle, no UI.

Avoid AI-generated look, realistic animal, soft airbrush, over-rendered fur, 3D plush, extra limbs, random icons, text, watermark, dense background.
```

### A3. 奇怪宠物睡在软垫沙发云上

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A weird but lovable pixel pet, shaped like a square sleepy cloud with dog ears, naps on a floating sofa-cloud cushion. Add only a tiny blanket edge, one small paw hanging down, and a warm orange smart collar dot. The scene island should be asymmetrical and floating, with transparent empty space around it. Crisp pixel art, chunky near-black outline, indexed palette, no antialiasing, no grain. Keep it cute, odd, and memorable, not generic.

Avoid full room, rectangular frame, UI elements, text, watermark, realistic fur, glossy 3D, painterly shading, dense decorative pixels, AI-looking malformed face.
```

---

## 4. 场景 B：猫咪在玩绣球

这里将“绣球”按宠物可玩的软布绣球 / 毛线绣球处理，避免画成真实花束。

### B1. 绣球玩具与猫爪动作

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A distinctive pixel cat is playing with a small embroidered ball toy, batting it with one paw. The cat has a compact square body, tiny orange smart collar, curious blank eyes, and a curled pixel tail. Only the cat, embroidered ball, two loose thread pixels, and a small irregular rug patch are visible; all other canvas areas are transparent. Crisp handmade pixel art, chunky dark outline, flat indexed colors, low noise. Palette: cream white, tan cat, pastel pink ball, warm orange collar, pale mint rug, dark brown outline.

Avoid AI-generated look, realistic cat, over-detailed fur, full room background, rectangular floor, UI, text, watermark, glossy 3D, painterly texture, random symbols.
```

### B2. 绣球滚动轨迹

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A pixel cat chases a rolling embroidered ball toy. Show a small curved trail made of 4-5 pixel dots, one paw lifted, tail up, playful but simple. The scene island is only a few floating floor tiles under the cat and ball, irregular edges, no full floor. Use chunky pixel outline, handmade sprite feeling, limited palette, low noise, no grain. The cat wears a tiny PawRoom warm orange collar beacon.

Avoid complete room scene, rectangular frame, app UI, buttons, text, watermark, realistic fur, 3D render, blur, complex lighting, too many props.
```

### B3. 奇怪猫与大号绣球

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A strange cute pixel cat with oversized ears and a tiny sleepy face hugs a large soft embroidered ball toy almost as big as itself. The scene is a floating irregular patch: cat, ball, three loose thread pixels, tiny orange collar dot, no other objects. Crisp pixel art, chunky dark brown outline, clean flat blocks, low-density composition, transparent empty space around the island. Color palette: cream, warm beige, pastel pink, muted lavender, PawRoom orange.

Avoid AI-generated look, distorted limbs, realistic animal, full room, UI screenshot, text, watermark, smooth vector, glossy 3D, dense background.
```

---

## 5. 场景 C：猫咪在跑

### C1. 跑过桌面的残影

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A tiny pixel cat runs across an invisible desktop, with only the cat, 3 small motion afterimage blocks, and a few floating paw-print pixels visible. The cat has a compact square body, orange smart collar beacon, determined blank eyes, tail stretched back. No ground except one or two irregular tiny shadow tiles. Crisp handmade pixel art, chunky dark outline, flat indexed colors, low noise, no grain.

Avoid full background, rectangular floor, UI, text, watermark, realistic fur, 3D render, motion blur, painterly texture, random symbols, extra limbs.
```

### C2. 从安全区边缘跑回家

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A pixel cat is running back toward a tiny home-zone marker. Show only the cat, one small dotted path, a tiny orange collar beacon, and two irregular pastel floor tiles. The scene should feel like a desktop pet overlay: partial, floating, not a complete map. Pixel art must be crisp, low-noise, chunky outline, limited palette: cream white, tan cat, pale mint tiles, warm orange path dot, dark brown outline.

Avoid full room, complete map, UI panels, buttons, text, watermark, realistic fur, glossy 3D, dense scenery, smooth gradients.
```

### C3. 夸张短腿冲刺

```text
Create a semi-open desktop pet scene for PawRoom, 16:9 canvas, true transparent background / alpha background. A weird cute pixel cat with tiny short legs is sprinting, body stretched like a soft rectangle, ears pushed back, orange collar dot glowing. Add only a few square dust pixels and one small curved route line below it. The rest of the canvas is transparent. Handmade pixel sprite style, chunky dark outline, no antialiasing, flat color blocks, low-density, playful but clean.

Avoid AI-generated look, extra legs, distorted face, full background, rectangular frame, UI screenshot, text, watermark, realistic animal, glossy 3D, blur, painterly texture.
```

---

## 6. 生成建议

优先生成顺序：

1. A1：能最快验证“半开放式桌宠场景”的桌面悬浮感。
2. B2：动作和路径感更强，适合测试桌宠交互。
3. C1：最像桌面上跑过的实时桌宠状态。

如果需要真透明 PNG，优先使用支持 alpha 的生成路径。  
如果只能生成普通图片，使用绿幕版提示词，再后期抠掉 `#00FF00`。

