# PawRoom 软件端原型开发计划

版本：v0.1  
日期：2026-07-07  
关联 PRD：`pawroom-ai-pet-collar-platform-prd-v0.4.md`  
目标：完成 Web 端功能原型，并规划“硬件项圈 -> 软件平台 -> 电脑端/手机端”的全流程演示 Demo。

## 1. MVP 交付物

### 1.1 Web 端功能原型

Web 原型需要和最终产品核心功能一致，覆盖：

- 宠物创建：上传/选择宠物照片，生成卡通宠物分身。
- 项圈数据模拟：展示项圈概念、连接状态、电量、活动、区域、生命状态趋势。
- 桌面宠物小世界：卡通家居地图、宠物状态、互动动作。
- 手机端状态提醒：锁屏组件/灵动岛样式低干扰提醒。
- 今日小剧场：根据一天状态生成宠物故事。
- Paw Credits：展示硬件附赠软件、基础安全免费、AI 创作额度付费。

### 1.2 全流程演示 Demo

全流程 Demo 用视频或可点击演示完成，不需要真实硬件。建议结构：

1. 用户给宠物戴上概念项圈。
2. 项圈采集活动、位置和生命状态趋势。
3. 数据进入 PawRoom 平台。
4. 平台把数据转成卡通房间里的宠物状态。
5. 电脑端出现桌面宠物小世界。
6. 手机锁屏/灵动岛显示轻提醒。
7. 用户点击互动。
8. 下班后生成今日小剧场。

## 2. 推荐技术路线

第一版不要直接做原生桌面 App 或原生移动 App。先做完整 Web 原型，再用录屏和 AIGC 视频补足硬件与全流程叙事。

推荐栈：

- 前端框架：React + TypeScript + Vite。
- 2D 场景：Phaser 优先，PixiJS 备选。
- 动效：CSS Animation / Lottie / Sprite Sheet。
- 数据：Mock Collar Simulator，本地 JSON 模拟。
- AI：MVP 先用规则和模板模拟，后续接 LLM 和图像生成。
- 桌面端：先用 Web 模拟桌面窗口，后续用 Electron 或 Tauri 封装。
- 手机端：先用 HTML/CSS 或 Figma 模拟锁屏/灵动岛，不做原生 ActivityKit。

## 3. 可二创 GitHub 项目

| 项目 | 地址 | 二创用途 | 建议 |
| --- | --- | --- | --- |
| Phaser | https://github.com/phaserjs/phaser | 房间地图、宠物移动、轻小游戏 | 主推 |
| PixiJS | https://github.com/pixijs/pixijs | 高性能 2D 场景和动效 | 备选/升级 |
| pixi-live2d-display | https://github.com/guansss/pixi-live2d-display | PixiJS 内加载 Live2D | 后续升级 |
| live2d-widget | https://github.com/stevenjoezhang/live2d-widget | 参考桌宠气泡和点击互动 | 只参考，谨慎复用 |
| Live2D Cubism Web Samples | https://github.com/Live2D/CubismWebSamples | Live2D Web 技术参考 | 技术验证 |
| lottie-web | https://github.com/airbnb/lottie-web | 播放 AE/Lottie 动效 | 推荐 |
| Tauri | https://github.com/tauri-apps/tauri | 后续轻量桌面端封装 | 后续 |
| Electron | https://github.com/electron/electron | 快速桌面端 Demo 封装 | 展示优先 |
| ECharts | https://github.com/apache/echarts | 项圈数据面板和趋势图 | 可用 |
| Recharts | https://github.com/recharts/recharts | React 图表面板 | 可用 |

注意：

- `live2d-widget` 是 GPL-3.0，商业产品不要直接作为核心代码复用，可参考交互。
- Live2D 模型资源常有授权限制，MVP 可以先用 Sprite Sheet 或 AI 生成序列帧。
- Phaser 更适合做房间互动和小游戏，PixiJS 更适合高质量渲染。

## 4. 软件模块拆解

### 4.1 App Shell

负责整体页面和流程：

- 首页。
- 宠物创建页。
- 项圈连接页。
- 桌面小世界页。
- 手机状态提醒页。
- 今日小剧场页。
- Paw Credits 商业化页。

### 4.2 Pet Profile Builder

功能：

- 输入宠物名称、类型。
- 上传或选择示例照片。
- 选择视觉风格。
- 展示“AI 生成宠物分身”的结果。

MVP 可用预置素材，不强依赖真实 AI 生成。

### 4.3 Collar Demo Simulator

功能：

- 展示项圈概念图。
- 展示连接状态、电量、设备 ID。
- 播放模拟数据。
- 支持切换 4 种剧本：安静日、活跃日、等主人日、需关注日。

示例数据：

```json
{
  "zone": "door",
  "activityLevel": "medium",
  "motionHint": "pacing",
  "eventHint": "waiting",
  "vitalTrend": {
    "heartRateTrend": "normal",
    "respirationTrend": "slightly_high",
    "restingDurationTrend": "normal"
  },
  "confidence": 0.72
}
```

### 4.4 Pet State Engine

功能：

- 将项圈数据转为宠物状态。
- 输出状态标签、提醒等级和动画指令。

基础映射：

- bed + low -> 睡觉。
- door + medium -> 等主人/巡逻。
- bowl + medium -> 饭盆附近。
- sofa + low -> 沙发休息。
- high activity -> 玩耍/焦躁。
- vitalTrend abnormal -> 需关注。

### 4.5 Room Scene Engine

功能：

- 渲染卡通房间。
- 展示宠物分身。
- 根据状态切换动作。
- 展示状态气泡。
- 支持摸摸、投喂、叫名字、逗玩具。

场景区域：

- 狗窝/猫窝。
- 饭盆。
- 门口。
- 沙发。
- 窗边。
- 玩具区。

### 4.6 Desktop Widget Mock

功能：

- 在 Web 页面中模拟电脑桌面。
- 桌宠以小窗形式出现在屏幕角落。
- 支持展开和缩小。

后续可用 Electron/Tauri 封装真实桌面端。

### 4.7 Mobile Live Status Mock

功能：

- 模拟手机锁屏小组件。
- 模拟灵动岛状态。
- 展示轻提醒。

示例文案：

- “在狗窝休息”
- “门口巡逻中”
- “活动量偏高”
- “状态趋势需关注”

### 4.8 AI Story Generator

功能：

- 根据状态序列生成今日小剧场。
- 生成宠物第一视角旁白。
- 生成可分享长图。

MVP 用模板生成，避免依赖外部模型。

### 4.9 Paw Credits Mock

功能：

- 展示硬件附赠基础软件。
- 展示安全看护免费。
- 展示 AI 创作额度消耗。

原则：

- 安全提醒不扣 Credits。
- 小剧场、表情包、动画、皮肤生成扣 Credits。

## 5. 页面级开发计划

### 5.1 首页

目标：讲清“项圈数据 -> AI 桌宠小世界”。

内容：

- 产品名 PawRoom。
- 核心一句话。
- 开始体验按钮。
- 三个价值点：安全看护、桌面陪伴、AI 小剧场。

### 5.2 宠物创建页

目标：生成宠物电子分身。

内容：

- 上传照片区域。
- 宠物资料表单。
- 风格选择。
- 生成结果。

### 5.3 项圈连接页

目标：展示硬件数据入口。

内容：

- 项圈概念图。
- 电量和连接状态。
- 实时数据流。
- 状态剧本切换。
- 生命状态趋势字段。

### 5.4 桌面小世界页

目标：展示核心体验。

内容：

- 卡通房间。
- 宠物角色。
- 状态气泡。
- 点击互动按钮。
- 数据来源浮层。

### 5.5 手机提醒页

目标：展示移动端低干扰状态入口。

内容：

- 手机外框。
- 锁屏小组件。
- 灵动岛状态。
- 异常轻提醒。

### 5.6 今日小剧场页

目标：展示 AI 内容生成价值。

内容：

- 时间线。
- 三到五个剧情节点。
- 宠物第一视角文案。
- 导出长图按钮。

### 5.7 商业化页

目标：展示硬件 + 基础软件 + Paw Credits 模式。

内容：

- 硬件套餐。
- 免费基础能力。
- Paw Credits 消耗。
- 加油包和会员。

## 6. 两天开发排期

### Day 1 上午

- 搭建 React + TypeScript + Vite 项目。
- 建立页面路由。
- 定义模拟项圈数据。
- 定义 Pet State Engine 映射规则。

验收：

- 页面可运行。
- 模拟数据能播放。

### Day 1 下午

- 完成项圈连接页。
- 完成数据面板。
- 完成卡通房间第一版。
- 宠物能在区域间切换。

验收：

- 点击“开始模拟采集”后，房间状态变化。

### Day 1 晚上

- 增加摸摸、投喂、叫名字、逗玩具。
- 增加桌面角落小窗模拟。
- 增加手机锁屏/灵动岛页面。

验收：

- 能看到电脑端和手机端两种呈现。

### Day 2 上午

- 根据状态序列生成今日小剧场。
- 增加长图导出占位。
- 增加 Paw Credits 页面。

验收：

- 完整流程能走到“小剧场”和“商业化解释”。

### Day 2 下午

- 统一视觉风格。
- 增加转场和微动效。
- 录制 Web 原型流程。
- 准备 AIGC 视频脚本。

验收：

- 可以对外演示完整链路。

### Day 2 晚上

- 检查页面文案。
- 检查安全/医疗边界。
- 准备演示话术。
- 输出 Demo 视频脚本。

验收：

- Demo 不会被误解为医疗诊断或真实硬件量产。

## 7. 全流程演示 Demo 脚本

建议视频长度 60-90 秒。

镜头结构：

1. 用户上班前给宠物戴上项圈。
2. 项圈开始采集活动、区域和生命状态趋势。
3. 数据进入 PawRoom 平台。
4. 冷冰冰的数据面板转化为卡通房间。
5. 电脑桌面角落出现宠物小世界。
6. 手机锁屏/灵动岛显示“在狗窝休息”。
7. 宠物靠近门口，桌宠进入“等主人”状态。
8. 用户点击摸摸或投喂。
9. 下班后生成今日小剧场。
10. 展示 Paw Credits 和硬件捆绑模式。

AIGC 视频建议：

- 用 AIGC 生成项圈概念镜头、数据粒子、卡通化转场。
- 用真实 Web 原型录屏作为主干。
- 不要让视频只像概念片，必须展示真实可点击流程。

## 8. 开发优先级

### P0

- Web 原型主流程。
- 项圈数据模拟器。
- 桌面小世界。
- 手机锁屏/灵动岛原型。
- 今日小剧场。
- Paw Credits 页面。

### P1

- 宠物上传后的视觉生成模拟。
- 轻小游戏入口。
- 长图导出。
- 更多状态剧本。

### P2

- 真实硬件接入。
- 原生 iOS ActivityKit。
- 真实 AI 图像生成接口。
- 真实支付。
- 真实桌面安装包。

## 9. 风险与处理

### 9.1 开源协议风险

`live2d-widget` 为 GPL-3.0，商业化直接复用需谨慎。建议只参考交互思路。

### 9.2 Live2D 模型资源风险

很多 Live2D 模型不能商用。MVP 阶段可用自绘 Sprite 或 AI 生成序列帧代替。

### 9.3 技术范围过大

不要同时做 Web、桌面原生、移动原生、真实 AI、真实硬件。MVP 以 Web 原型为中心。

### 9.4 用户误解为医疗诊断

所有生命状态表达使用“趋势”“需关注”“建议观察”，不使用“疾病”“诊断”“预警某病”。

### 9.5 Demo 过于像概念片

全流程视频必须包含真实 Web 原型录屏，AIGC 镜头只增强表现，不替代产品流程。

## 10. 最终建议

第一版软件端原型先做完整 Web 原型。Web 原型跑通后，再把“桌面小世界”部分包装成电脑端视觉 Demo。

推荐组合：

- React + TypeScript + Vite。
- Phaser 做卡通房间和互动。
- CSS/HTML 模拟手机锁屏和灵动岛。
- 规则引擎模拟 AI 状态理解。
- 模板生成今日小剧场。
- 后续用 Electron 或 Tauri 封装桌面端。

推荐二创优先级：

1. Phaser：主场景和小游戏。
2. PixiJS：高质量 2D 渲染备选。
3. lottie-web：动效增强。
4. Electron/Tauri：后续桌面端封装。
5. pixi-live2d-display：后续宠物角色升级。
6. live2d-widget：只参考交互，不直接商用复用。

