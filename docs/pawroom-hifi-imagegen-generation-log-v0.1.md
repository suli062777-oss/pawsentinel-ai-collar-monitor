# PawRoom 高保真 imagegen 生成记录 v0.1

日期：2026-07-07  
生成方式：内置 image_gen 工具逐张生成，项目内图片已统一规范化为 `1440 × 1024`。

## 输出文件

| 页面 | 文件 |
| --- | --- |
| 首页 | `docs/assets/pawroom-hifi-01-home-v0.1.png` |
| 桌面小世界 | `docs/assets/pawroom-hifi-02-desktop-world-v0.1.png` |
| 宠物数据 | `docs/assets/pawroom-hifi-03-pet-data-v0.1.png` |
| 今日历程 | `docs/assets/pawroom-hifi-04-daily-journey-v0.1.png` |
| 设置 | `docs/assets/pawroom-hifi-05-settings-v0.1.png` |
| 新增宠物 | `docs/assets/pawroom-hifi-06-add-pet-v0.1.png` |
| 电量 | `docs/assets/pawroom-hifi-07-battery-v0.1.png` |
| 宠物信息 | `docs/assets/pawroom-hifi-08-pet-info-v0.1.png` |
| 总览拼版 | `docs/assets/pawroom-hifi-contact-sheet-v0.1.png` |

## 生成约束

- 只保留左侧栏 + 主画布。
- 不使用顶部全局栏。
- 不使用右侧抽屉栏或右侧固定状态栏。
- 左侧栏固定 8 个入口：首页、桌面小世界、宠物数据、今日历程、设置、新增宠物、电量、宠物信息。
- 页面风格延续暖色宠物 UI、轻玻璃、圆角卡片、低焦虑安全看护。

## 后续建议

- 先人工挑选首页和桌面小世界作为主视觉基准。
- 若要继续推进 Figma，可优先重建首页、桌面小世界、宠物数据三张。
- 若某张页面出现文字细节不准，建议保留布局和视觉，再在 Figma 中重排真实文字。