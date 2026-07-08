# PawRoom 前端还原实施日志 v0.10

日期：2026-07-08

## 本轮目标

把桌面小世界的 `sceneBackground` 从“素材清单里的待生成项”推进为“前端真实可接入的背景资产通道”。本轮不改变世界页布局、左侧栏、玻璃卡片、路径节点、宠物位置、底部数据卡和轻互动按钮，只补齐底层像素场景背景替换能力。

## 已完成

- `frontend/src/app.js`
  - 新增 `toCssImageUrl()`：清理背景路径中可能破坏内联 CSS 的字符。
  - 新增 `getWorldSceneStyle()`：当 `sceneBackground` 有路径时输出 `--scene-bg:url(...)`，为空时保持现有 CSS 占位房间。
  - `renderWorld()` 增加 `has-scene-asset` 类挂载逻辑，支持后续 image2 场景背景直接接入。
- `frontend/src/styles.css`
  - 新增 `.world-scene.has-scene-asset`，把 `--scene-bg` 作为底层场景背景，保持上层 UI 和交互层不变。
- `frontend/validate-world-assets.mjs`
  - 增加 `sceneBackground` 前端接入口检查：`getWorldSceneStyle`、`has-scene-asset`、`--scene-bg`、`.world-scene.has-scene-asset`。
  - 检查 `sceneBackground.transparentBackground` 必须为 `false`。
  - 支持从项目根目录或 `frontend` 目录运行。
- `frontend/audit-restoration.mjs`
  - 支持从项目根目录或 `frontend` 目录运行。
- `frontend/assets/generated/world/asset-manifest.json`
  - 版本更新为 `0.2`。
  - 补充 `sceneBackground` 的真实前端接入说明。
- `docs/pawroom-world-p0-asset-intake-checklist-v0.1.md`
  - 补充 v0.10 `sceneBackground` 接入机制。
- `frontend/README.md`
  - 更新根目录可执行的固定审查命令。
  - 补充 v0.10 审查截图路径。

## 验证结果

- `node --check frontend/src/app.js`：通过。
- `node frontend/validate-world-assets.mjs`：通过，13 个桌面小世界素材槽位和背景通道 hook 已检查。
- `node frontend/audit-restoration.mjs docs/assets/frontend-screenshots-v0.10`：通过，8 个页面截图和 6 个文本文件已检查。
- v0.10 世界页截图尺寸：1440×1024。
- 世界页像素抽样：非空白，页面正常渲染。

## 产物

- `docs/assets/frontend-screenshots-v0.10/`
- `docs/assets/frontend-screenshots-v0.10/world-scene-background-slot-v0.10.png`
- `docs/assets/pawroom-frontend-restoration-v0.10-contact-sheet.png`

## 当前结论

现在桌面小世界已经具备完整的背景替换通道：image2 生成像素客厅背景后，只需要把图片放入 `frontend/assets/generated/world/`，更新 manifest 和 `worldGeneratedAssets.sceneBackground`，即可进入页面底层背景，不需要重写页面结构。

## 下一步建议

1. 使用 image2 生成 `sceneBackground`：2D 像素风温暖客厅，1440×1024 或 1220×976 适配当前主画布，不能带 UI 文案和卡片。
2. 接入背景后做一次布局二次修正：检查状态卡、路径、宠物、按钮、数据卡是否遮挡。
3. 再生成六个核心透明道具：`sofa`、`rug`、`table`、`bowl`、`toy`、`pet-bed`。
4. 接入透明道具后再进入交互动效增强。