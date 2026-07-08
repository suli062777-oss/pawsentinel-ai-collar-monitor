# PawRoom 桌面小世界 P0 素材接入验收清单 v0.1

## 目标

本清单用于约束 image2 生成的桌面小世界素材，确保后续替换到 Web 原型时只增强像素宠物与像素场景，不改变左侧导航、玻璃卡片、数据卡片和交互按钮的既有布局语言。

## 当前接入状态

- `petIdle`：已复用现有像素猫素材 `frontend/assets/ip/pixel-cat-orange.png`，并接入 `worldGeneratedAssets.petIdle`。
- `sceneBackground`：v0.11 已生成并接入 `frontend/assets/generated/world/scene-background-v0.11.png`，作为桌面小世界底层 2D 像素客厅背景。
- 其他道具：待生成，全部要求透明背景 PNG，作为房间内可定位组件叠放。

## image2 生成原则

1. 只让宠物和场景道具像素化，界面控件保持液态玻璃 UI。
2. 色彩以 `#FF8F3F` 为品牌橙主基准，场景可以使用暖木色、奶油白、浅绿、低饱和蓝作为辅助。
3. 每个道具必须是单独主体，不带 UI 文案，不带卡片，不带按钮，不带阴影背景。
4. 道具透视统一为轻微俯视 2D 像素风，避免 3D 渲染、写实摄影、厚重描边不一致。
5. 宠物素材需保持可爱、可识别、和现有 IP 一致，适合缩放到 96-180px 范围仍可读。

## P0 素材优先级

1. `sceneBackground`：像素客厅背景，决定页面观感上限；v0.11 已接入，后续只在需要二次修正时替换。
2. `petIdle`：宠物待机形象，当前已有可复用版本。
3. `sofa`、`rug`、`table`：构成客厅中心区域。
4. `bowl`、`toy`、`pet-bed`：对应吃饭、玩耍、睡觉三类核心状态。
5. `bookshelf`、`lamp`、`tv`、`plant`、`door-mat`：补足房间层次和生活感。

## 透明素材验收标准

- 文件格式：PNG。
- 背景：透明背景，不要白底、灰底、渐变底。
- 尺寸建议：单个道具 512×512 或 768×768；宠物 1024×1024 以内。
- 边缘：像素边缘清晰，不要被过度柔化。
- 文案：素材图中不能出现中文、英文、数字 UI 文案。
- 风格：温暖像素游戏感，不能偏写实、赛博、暗黑、商业插画海报。
- 页面接入：放入 `frontend/assets/generated/world/` 后，在 `asset-manifest.json` 填写路径，再把对应 `worldGeneratedAssets` slot 指向该路径。

## 替换后检查

- 页面尺寸仍为 1440×1024。
- 左侧栏位置不变，仍分为上半部分主功能、下半部分添加/电量/宠物信息。
- 桌面小世界页面结构不变：背景房间为主体，顶部状态卡、右侧预览卡、底部数据卡和轻互动按钮保留。
- 素材不遮挡核心状态卡、活动路径、宠物当前位置、互动按钮。
- `node frontend/validate-world-assets.mjs` 检查通过。
## v0.10 `sceneBackground` 接入机制

- `sceneBackground` 现在不是只写在清单里，前端已经读取该 slot。
- 当 `worldGeneratedAssets.sceneBackground` 为空时，页面继续使用当前 CSS 像素房间占位，不影响既有结构。
- 当 `worldGeneratedAssets.sceneBackground` 填入图片路径时，`renderWorld()` 会自动给 `.world-scene` 增加 `has-scene-asset` 类，并写入 `--scene-bg:url(...)`。
- CSS 会使用 `.world-scene.has-scene-asset` 把该图作为底层像素客厅背景，上层状态卡、路径、宠物、轻互动按钮和底部数据卡不变。
- `sceneBackground` 的 `transparentBackground` 必须为 `false`；它是整张场景底图，不是透明道具组件。
## v0.11 `sceneBackground` 生成记录

- 生成方式：内置 imagegen 工具。
- 项目内路径：`frontend/assets/generated/world/scene-background-v0.11.png`。
- 原始生成路径保留在 Codex 默认生成目录，项目中使用复制后的稳定文件。
- 图片尺寸：1487×1058。
- 接入状态：`asset-manifest.json` 版本 `0.3`，`sceneBackground.status = ready`。
- 层级修正：接入真实背景后，`.world-scene.has-scene-asset .room-prop:not(.has-asset)` 和 `.pixel-window` 会隐藏，避免 CSS 占位家具与真实背景重复；未来接入的透明道具 `.room-prop.has-asset` 仍会显示。