# PawRoom 高保真 imagegen 生成记录 v0.3

日期：2026-07-07  
生成方式：内置 image_gen 工具逐张生成，项目内图片已统一规范化为 `1440 × 1024`。

## 本版修正

- 宠物 IP 与主画布场景改为 2D 像素风。
- UI 框架、左侧栏、卡片、按钮、文字保持 PawRoom 液态玻璃高保真设计系统。
- 左侧栏只参考示意图的位置关系：上半 5 个主入口，下半添加/电量/花花宠物块。
- 不再使用顶部全局栏。
- 不再使用右侧抽屉栏。

## 输出文件

| 页面 | 文件 |
| --- | --- |
| 首页 | `docs/assets/pawroom-hifi-v03-01-home.png` |
| 桌面小世界 | `docs/assets/pawroom-hifi-v03-02-desktop-world.png` |
| 宠物数据 | `docs/assets/pawroom-hifi-v03-03-pet-data.png` |
| 今日历程 | `docs/assets/pawroom-hifi-v03-04-daily-journey.png` |
| 设置 | `docs/assets/pawroom-hifi-v03-05-settings.png` |
| 添加宠物 | `docs/assets/pawroom-hifi-v03-06-add-pet.png` |
| 电量 | `docs/assets/pawroom-hifi-v03-07-battery.png` |
| 宠物板块 | `docs/assets/pawroom-hifi-v03-08-pet-info.png` |
| 总览拼版 | `docs/assets/pawroom-hifi-v03-contact-sheet.png` |

## 关联提示词文档

- `docs/pawroom-pixel-scene-liquid-ui-addendum-v0.3.md`
- `docs/pawroom-imagegen-page-prompts-v0.3-pixel-scene-liquid-ui.md`
---

## v0.4 首页补充生成

日期：2026-07-07  
原因：v0.3 首页的小世界 / 地图占比过高，容易与“桌面小世界”页面混淆，不符合信息架构中“看护首页”的定位。

本次只重新生成首页，不替换其他 7 张页面。

调整原则：

- 首页改为数据看护优先；
- 宠物桌面小世界只作为约 30% 的预览入口；
- 状态、趋势、提醒、时间线、核心指标占约 70%；
- 保留左侧任务栏；
- 不使用顶部全局栏；
- 不使用右侧抽屉栏；
- 宠物和场景继续像素化，UI 卡片与图表继续使用液态玻璃高保真风格。

输出文件：

- `docs/assets/pawroom-hifi-v04-01-home-data-first.png`

关联说明：

- `docs/pawroom-homepage-data-first-regeneration-v0.4.md`
