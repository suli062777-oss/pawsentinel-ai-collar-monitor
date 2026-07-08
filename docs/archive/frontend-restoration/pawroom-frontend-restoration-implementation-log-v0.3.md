# PawRoom 前端还原实施日志 v0.3

## 本轮目标

基于 v0.2 可运行原型，对照高保真参考图提升还原度。重点不重做设计，而是在现有结构中增强以下三页：

- 桌面小世界
- 宠物数据
- 今日历程

首页保持用户已认可方向，不重新调整为其他布局。

## 本轮新增文档

- `docs/pawroom-frontend-restoration-v0.3-audit-plan.md`

该文档明确：

- v0.3 权威参考源。
- 当前 8 页状态。
- 不改变的约束。
- 三个优先修正页面。
- image2 资产需求联动。
- v0.3 验收标准。

## 前端修正

### 桌面小世界

保留原有结构：

- 左侧液态玻璃任务栏。
- 大面积像素房间。
- 顶部状态浮层。
- 安全等级、当前区域、项圈连接、电量。
- 桌面小窗预览。
- 安全区、活动路径、区域标签。
- 摸摸、投喂、叫名字、扔玩具。
- 活动量和休息时长小卡。

新增/增强：

- 更丰富的像素房间层：窗、书架、灯、电视、植物、宠物窝、门垫、光照。
- 行为状态浮层：睡觉、巡逻、吃饭、等主人。
- 安全区和路径的 HUD 感更强。

### 宠物数据

保留原有结构：

- 顶部状态行。
- 活动量、休息、心率、呼吸数据卡。
- 右侧家庭区域图。
- 数据边界说明。

新增/增强：

- 家庭区域小地图增加标题、当前位置、安全区范围、图例。
- 小地图更接近“宠物家庭区域”而不是普通线框图。

### 今日历程

保留原有结构：

- 今日小剧场主卡。
- 今日时间线。
- 四格漫画。
- AI 小剧场。
- 播放路径、分享导出、生成今日回放。

新增/增强：

- 四格漫画从空面板改为带语义的四个像素分镜。
- AI 小剧场增加 Credits 消耗条。
- 时间线播放态和生成态保留 v0.2 交互。

## 生成产物

- `docs/assets/frontend-screenshots-v0.3/pawroom-home.png`
- `docs/assets/frontend-screenshots-v0.3/pawroom-world.png`
- `docs/assets/frontend-screenshots-v0.3/pawroom-data.png`
- `docs/assets/frontend-screenshots-v0.3/pawroom-journey.png`
- `docs/assets/frontend-screenshots-v0.3/pawroom-settings.png`
- `docs/assets/frontend-screenshots-v0.3/pawroom-create.png`
- `docs/assets/frontend-screenshots-v0.3/pawroom-battery.png`
- `docs/assets/frontend-screenshots-v0.3/pawroom-profile.png`
- `docs/assets/pawroom-frontend-restoration-v0.3-contact-sheet.png`

## 自动检查结果

- `frontend/src/app.js` 语法检查通过。
- 源码扫描未发现：
  - 明显乱码占位符
  - emoji 结构图标
  - `topbar`
  - `navbar`
  - `right-sidebar`
  - `drawer`
  - `h-screen`
  - `#000000`
  - `Unsplash`
- 8 张 v0.3 截图均为 `1440 × 1024`。
- 8 张 v0.3 截图均非空。

## 二次修正记录

- 初次字符串插入没有命中小世界和小地图结构，已改为函数级重写，避免半截插入。
- 修正 `renderWorld` 与 `renderMiniMapCard` 的结构，保证新增层级可维护。
- 补齐今日历程 Credits 条，避免只有按钮没有额度反馈。

## 仍需人工视觉确认

当前工具环境无法直接打开中文路径下图片进行视觉检查，因此自动检查覆盖结构、尺寸、语法和禁用项；人工需要打开：

- `docs/assets/pawroom-frontend-restoration-v0.3-contact-sheet.png`

重点确认：

- 桌面小世界是否比 v0.2 更接近高保真“完整像素房间 + 玻璃浮层”。
- 行为浮层是否遮挡宠物或关键路径。
- 宠物数据页的小地图是否过密。
- 今日历程四格漫画是否符合“创作台”感觉。

## 下一轮建议

1. 让 image2 生成 P0 透明资产：小世界房间背景、宠物三态、四格漫画。
2. 用真实透明资产替换 CSS 场景层，进入 v0.4 视觉级还原。
3. 增加路径播放时宠物位置移动，保持低频、状态驱动。
4. 对每页做人工截图审查，再做像素级尺寸/间距修正。
