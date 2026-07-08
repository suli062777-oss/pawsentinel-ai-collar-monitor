# PawRoom IP 组件库与 image2 提示词 v0.1

日期：2026-07-07  
阶段：高保真前的 IP 资产方向定义  
适用范围：PawRoom Web 原型、桌面小世界、今日回放、任务栏图标、后续 Figma 组件库  
参考素材库：`D:\作品\小满ai专项计划\宠物项圈产品web库`

---

## 1. 目标

本文件用于明确 PawRoom 第一版 IP 组件库应该生成什么，以及如何用 image2 生成一组风格稳定、低噪点、低 AI 感、可沉淀为组件库的宠物产品视觉资产。

PawRoom 的 IP 不应该做成单纯可爱贴纸，也不应该做成复杂 3D 玩具。它要服务产品主线：

> 宠物项圈数据驱动的安全看护 + 桌面宠物小世界 + 今日回放创作。

因此 IP 组件库优先覆盖：

1. 个体化宠物分身。
2. 项圈安全看护符号。
3. 家庭地图道具。
4. 宠物状态贴纸。
5. 今日回放创作组件。
6. 左侧任务栏与功能图标。

---

## 2. 素材库风格提炼

从当前参考库可提炼出以下风格约束：

- 色彩：奶油白、暖黄、暖橙为主，少量安全绿色和灰褐色。
- 画面密度：低到中低密度，留白充足，不堆复杂纹理。
- 形体：圆角、软边、几何化，避免尖锐边缘。
- 质感：干净的 UI 插画或扁平矢量，不做强写实、强玻璃、强塑料 3D。
- 噪点：低噪点，背景干净，不要颗粒纹理和随机装饰点。
- 功能感：要能和 dashboard、地图、主画布状态卡、左侧栏共存，不能像营销海报。

推荐核心色：

| 用途 | 颜色 |
| --- | --- |
| 主背景 | `#FAF8F8` |
| 暖光底色 | `#FEE093` |
| 主强调 | `#F76F23` |
| 次强调 | `#F9A159` |
| 安全状态 | `#68AB12` |
| 深色线条 | `#2B2521` / `#4D4741` |
| 辅助描边 | `#D9D2C8` |

---

## 3. 全局 image2 风格前缀

所有 image2 提示词建议统一加这一段，保证组件库风格一致：

```text
PawRoom product IP component library, warm pet care dashboard style, clean matte vector illustration, soft rounded geometry, low-density composition, high whitespace, cream white background, warm orange accent, small safe green accent, grey-brown outline, low noise, no grain, no heavy texture, no glossy 3D, no photorealism, no cyberpunk, no neon, no random decorative sparkles, no text, no watermark, no logo mockup, Figma-ready design asset, consistent icon system, friendly but restrained.
```

中文意图：

- “PawRoom 产品 IP 组件库”比“可爱宠物插画”更准确。
- “matte vector / rounded geometry / low-density”用于降低 AI 味和随机细节。
- “Figma-ready design asset”让生成结果更像可编辑组件，而不是完整海报。

---

## 4. 全局负面提示词

每次生成都建议追加：

```text
Avoid AI-generated look, avoid over-detailed fur, avoid extra limbs, avoid distorted face, avoid random icons, avoid duplicated objects, avoid busy background, avoid dense pattern, avoid dramatic lighting, avoid glossy plastic toy style, avoid complex 3D render, avoid heavy shadow, avoid gradient blobs, avoid bokeh, avoid text, avoid watermark, avoid UI screenshot, avoid photorealistic animal.
```

中文控制点：

- 不要照片级动物。
- 不要复杂毛发。
- 不要高光塑料 3D。
- 不要随机漂浮符号。
- 不要背景故事场景。
- 不要生成 UI 截图，只生成组件资产。

---

## 5. IP 组件库结构

### 5.1 主 IP：PawRoom 宠物电子分身

用途：

- 桌面小世界主角。
- 当前宠物头像。
- 今日回放角色。
- 表情包基础形象。

建议做两套基础模板：

1. 狗狗模板：圆头、短鼻、软耳、橙色项圈。
2. 猫咪模板：圆脸、短耳、轻微胡须、橙色项圈。

设计规则：

- 头身比偏可爱，但不要过度幼态。
- 表情克制，适合长期看护场景。
- 项圈必须成为识别点。
- 角色不要太复杂，否则无法做状态和动效扩展。

image2 提示词：

```text
PawRoom product IP component library, create a personalized digital pet avatar base for a desktop pet world. A friendly small dog character with a round head, soft ears, simple muzzle, warm orange smart collar, calm expression, matte vector illustration, soft rounded geometry, clean grey-brown outline, cream white background, warm orange and pale yellow accents, low-density composition, low noise, no grain, no heavy texture, Figma-ready mascot asset, front view, simple pose, readable at small size. Avoid AI-generated look, avoid realistic fur, avoid glossy 3D, avoid plastic toy style, avoid busy background, avoid random sparkles, avoid text, avoid watermark.
```

```text
PawRoom product IP component library, create a personalized digital pet avatar base for a desktop pet world. A friendly small cat character with a round face, short ears, tiny whisker marks, warm orange smart collar, calm and curious expression, matte vector illustration, soft rounded geometry, clean grey-brown outline, cream white background, warm orange and pale yellow accents, low-density composition, low noise, no grain, no heavy texture, Figma-ready mascot asset, front view, simple pose, readable at small size. Avoid AI-generated look, avoid realistic fur, avoid glossy 3D, avoid plastic toy style, avoid busy background, avoid random sparkles, avoid text, avoid watermark.
```

---

### 5.2 项圈安全 IP：Collar Beacon

用途：

- 项圈连接状态。
- 安全等级。
- 电量与数据来源。
- 异常提醒入口。

形象建议：

- 一个简化智能项圈，中心有小圆点或信号灯。
- 不是硬件渲染图，而是产品符号。
- 可扩展为三种状态：正常、注意、断连。

image2 提示词：

```text
PawRoom product IP component library, design a smart pet collar safety beacon icon, simplified collar ring with a tiny status light, warm orange main accent, small safe green dot, grey-brown outline, matte vector style, soft rounded geometry, clean cream white background, low-density composition, low noise, Figma-ready feature icon, 64px product icon style, clear silhouette, no text. Avoid photorealistic hardware render, avoid glossy 3D, avoid heavy shadow, avoid random signals, avoid busy background, avoid watermark.
```

状态变体提示词：

```text
Create three consistent variants of the same PawRoom smart collar safety beacon icon: connected safe state with green dot, attention state with warm orange dot, disconnected state with muted grey dot. Keep the same silhouette, same stroke weight, same rounded geometry, matte vector style, cream white background, low noise, no text, Figma-ready icon set.
```

---

### 5.3 家庭地图 IP：Room Tile 家居道具

用途：

- 卡通家庭地图。
- 桌面小世界场景。
- 今日路径回放。

第一批建议做 6 个：

1. 宠物窝。
2. 沙发。
3. 饭盆。
4. 门口。
5. 窗边。
6. 玩具区。

设计规则：

- 顶视或轻微等距视角，便于放入地图。
- 线条干净，低细节。
- 每个道具都要能在 64px-128px 内识别。

image2 提示词：

```text
PawRoom product IP component library, create a set of six home map objects for a cartoon desktop pet world: pet bed, sofa, food bowl, front door, window corner, toy area. Use clean matte vector illustration, soft rounded geometry, warm cream and pale yellow surfaces, warm orange accents, grey-brown outline, low-density details, low noise, consistent top-down or slight isometric view, Figma-ready component set, each object isolated on cream white background, no text. Avoid photorealism, avoid complex room scene, avoid heavy texture, avoid glossy 3D, avoid random decorations, avoid watermark.
```

单个道具补充提示词：

```text
Design one PawRoom cartoon home map object: [pet bed / sofa / food bowl / front door / window corner / toy area]. Matte vector, soft rounded geometry, simple silhouette, warm cream base, orange accent, grey-brown outline, low noise, isolated object, no background scene, no text, Figma-ready asset.
```

---

### 5.4 宠物状态贴纸：Mood Chips

用途：

- 桌面小世界状态气泡。
- 今日时间线节点。
- 表情包基础素材。
- 手机锁屏状态预览。

第一批状态：

1. 睡觉。
2. 巡逻。
3. 吃饭。
4. 等主人。
5. 玩耍。
6. 轻微关注。

设计规则：

- 状态贴纸要比主角色更小、更符号化。
- 不要做复杂表情包大图。
- 每个状态都应有一个可读动作或道具。

image2 提示词：

```text
PawRoom product IP component library, create six small pet status sticker icons for a desktop pet world: sleeping, patrolling, eating, waiting for owner, playing, attention needed. Use the same simple dog/cat avatar language, matte vector style, soft rounded shapes, warm orange accent, safe green only for normal status, muted orange for attention, cream white background, low-density composition, low noise, no text, no speech bubbles with words, Figma-ready sticker icon set, readable at 48px. Avoid meme style, avoid exaggerated emotion, avoid glossy 3D, avoid random decorative marks, avoid busy background, avoid watermark.
```

单状态提示词：

```text
Create one PawRoom pet status sticker icon: [sleeping / patrolling / eating / waiting for owner / playing / attention needed]. Small rounded pet avatar, simple action pose, matte vector, warm orange accent, cream white background, low noise, Figma-ready, readable at 48px, no text, no background scene.
```

---

### 5.5 今日回放 IP：Memory Frames

用途：

- 今日回放。
- AI 小剧场。
- 四格漫画。
- 分享长图。

建议做三类组件：

1. 时间线记忆节点。
2. 四格漫画边框。
3. 今日角色卡。

设计规则：

- 这类资产可以比状态贴纸更有情绪，但仍要克制。
- 不要直接生成完整漫画故事，先生成可复用的边框、节点和卡片。
- 要明确区分“项圈记录”和“AI 演绎”。

image2 提示词：

```text
PawRoom product IP component library, design reusable memory frame components for daily pet replay: timeline memory node, four-panel comic frame, pet character card frame. Warm pet care dashboard style, matte vector, soft rounded rectangles, cream white panels, pale yellow highlight, warm orange accent, subtle grey-brown outline, low-density layout, low noise, Figma-ready UI illustration components, no text, no watermark, no full UI screenshot. Avoid complex comic scene, avoid manga style, avoid heavy texture, avoid glossy 3D, avoid busy background.
```

---

### 5.6 左侧任务栏图标：Navigation IP Icons

用途：

- Web 端左侧唯一全局任务栏。
- 高保真导航图标。

第一批图标：

1. 首页 / 看护首页。
2. 桌面小世界。
3. 宠物数据。
4. 今日日程。
5. 设置。
6. 添加。
7. 电量。
8. 当前宠物。

设计规则：

- 24px 或 32px 系统图标。
- 线宽 1.75-2px。
- 圆角端点。
- 不使用 emoji。
- 选中态可使用橙色胶囊背景，但图标本身不要复杂。

image2 提示词：

```text
PawRoom product IP component library, design a consistent navigation icon set for a left vertical taskbar: home monitoring, desktop pet world, pet data, daily schedule, settings, add, battery, current pet. 24px and 32px UI icon style, clean rounded line icons, 1.75px stroke, grey-brown default line, warm orange selected accent, simple geometry, optical centering, consistent radius and spacing, no fill unless needed, no text, no background, Figma-ready SVG-like icon set. Avoid emoji, avoid random marks, avoid broken joins, avoid over-detailed illustration, avoid 3D, avoid heavy shadows, avoid watermark.
```

---

### 5.7 异常提醒徽章：Care Alert Badges

用途：

- 离开安全区。
- 长时间静止。
- 趋势需关注。
- 项圈断连。

设计规则：

- 异常提示要清楚，但不能恐吓。
- 红色只用于严重异常，小问题用橙色。
- 每个徽章必须能配合文字说明，不单靠颜色表达。

image2 提示词：

```text
PawRoom product IP component library, create four gentle care alert badges: left safe zone, long rest, trend needs attention, collar disconnected. Matte vector, rounded badge shape, simple symbol inside, warm orange and muted red accents, grey-brown outline, cream white background, low noise, no dramatic warning style, no alarm siren look, Figma-ready badge set, readable at 48px, no text. Avoid scary medical icon style, avoid emergency hospital style, avoid harsh red fill, avoid glossy 3D, avoid busy background, avoid watermark.
```

---

### 5.8 互动动作组件：Interaction Props

用途：

- 摸摸。
- 投喂。
- 叫名字。
- 扔玩具。
- 进入小游戏。

建议做成道具，不做复杂人物手势：

1. 小爪印触摸。
2. 小零食。
3. 声音波纹。
4. 小球。
5. 轻量游戏按钮。

image2 提示词：

```text
PawRoom product IP component library, create five interaction prop icons for a desktop pet world: gentle touch paw mark, treat snack, name call sound wave, toy ball, mini game button. Matte vector, soft rounded geometry, warm orange accent, pale yellow fill, grey-brown outline, cream white background, low-density, low noise, Figma-ready prop icon set, readable at 48px, no text. Avoid realistic hand, avoid complex toy scene, avoid glossy 3D, avoid heavy shadow, avoid random decoration, avoid watermark.
```

---

## 6. 优先生成顺序

建议按以下顺序生成，不要一次性把所有资产都丢给 image2：

1. 主宠物分身狗/猫模板。
2. 项圈安全 IP。
3. 左侧任务栏图标。
4. 家庭地图道具。
5. 状态贴纸。
6. 今日回放组件。
7. 异常提醒徽章。
8. 互动动作组件。

原因：

- 主宠物分身决定所有后续资产的角色语言。
- 项圈安全 IP 决定产品不是纯娱乐。
- 左侧任务栏图标会直接影响 Web 高保真第一屏。
- 家庭地图和状态贴纸再进入桌面小世界。

---

## 7. image2 生成参数建议

| 资产类型 | 建议比例 | 建议尺寸 | 输出目标 |
| --- | --- | --- | --- |
| 主宠物分身 | 1:1 | 1024 × 1024 | 角色主图、头像、后续动作基础 |
| 项圈安全 IP | 1:1 | 1024 × 1024 | 功能徽章、状态符号 |
| 任务栏图标 | 1:1 | 1024 × 1024 或批量图 | 后续转 SVG |
| 家庭地图道具 | 4:3 或 1:1 | 1024 × 768 / 1024 × 1024 | 小世界场景道具 |
| 状态贴纸 | 1:1 | 1024 × 1024 | 状态气泡、表情包 |
| 今日回放组件 | 16:9 或 4:3 | 1536 × 864 / 1024 × 768 | 分享卡、回放组件 |

生成后处理建议：

- 用 Figma 重建关键图标，不直接把位图当最终系统图标。
- 主分身可先用 PNG 进入原型，后续再拆成可动部件。
- 任务栏图标必须最终矢量化，保证高保真界面清晰。
- 同一批图标必须人工统一线宽、圆角和视觉重心。

---

## 8. 质量检查清单

每批 image2 输出后检查：

- 是否符合奶油白、暖橙、少量绿色、灰褐线条的色彩体系。
- 是否低噪点、低纹理、留白充足。
- 是否没有明显 AI 生成痕迹：畸形脸、乱毛发、重复肢体、随机符号。
- 是否能在 48px 或 64px 下识别。
- 是否能放进 1440 × 1024 Web dashboard，不像营销插画。
- 是否能拆成 Figma 组件。
- 是否避免医疗诊断、强监控、恐吓式警报心智。

---

## 9. 第一版推荐交付清单

最小可用 IP 组件库：

| 类别 | 数量 | 用途 |
| --- | --- | --- |
| 狗狗分身模板 | 1 | 桌面小世界主角 |
| 猫咪分身模板 | 1 | 桌面小世界主角 |
| 项圈安全 IP | 3 | 正常、注意、断连 |
| 任务栏图标 | 8 | Web 左侧任务栏 |
| 家庭地图道具 | 6 | 小世界地图 |
| 状态贴纸 | 6 | 时间线和状态气泡 |
| 今日回放组件 | 3 | 小剧场、漫画、角色卡 |
| 异常提醒徽章 | 4 | 安全提醒 |
| 互动动作组件 | 5 | 摸摸、投喂、叫名字、扔玩具、小游戏 |

合计：37 个基础组件。

这 37 个组件足够支撑第一版 PawRoom 高保真界面，不需要一开始做完整大 IP 世界观。

