# PawRoom 前端还原实施日志 v0.4

## 本轮目标

在 v0.3 视觉层增强之后，继续补“真实产品感”的状态联动。  
本轮不改变页面信息架构和视觉布局，只让桌面小世界、今日历程、轻互动共享同一组事件数据。

## 新增文档

- `docs/pawroom-frontend-restoration-v0.4-interaction-plan.md`

该文档明确 v0.4 的交互边界：

- 不新增一级入口。
- 不新增顶部栏或右侧抽屉。
- 不引入第三方动画库。
- 宠物移动、路径节点、行为卡、时间线都由同一组事件驱动。

## 前端改动

### 1. 共享事件模型

新增 `worldRoute`，每个事件包含：

- 时间
- 区域
- 状态文案
- 数据来源
- 对应行为
- 宠物坐标
- 场景节点坐标

`events` 不再单独维护，而是从 `worldRoute` 派生，避免今日历程和小世界状态不一致。

### 2. 桌面小世界联动

新增/增强：

- 宠物分身位置由 `activeJourneyEvent` 驱动。
- 场景内路径节点可点击。
- 当前节点高亮，历史节点弱高亮，未来节点低透明。
- 行为卡随当前事件高亮：睡觉 / 巡逻 / 吃饭 / 等主人。
- 顶部状态文案和“当前区域”随事件变化。
- 轻互动按钮会影响相关状态：
  - 投喂 -> 饭盆
  - 叫名字 -> 等主人
  - 扔玩具 -> 客厅活动
  - 摸摸 -> 只记录互动反馈，不强制切换路径

### 3. 今日历程联动

新增/增强：

- 今日时间线节点可点击切换当前事件。
- 播放路径从第一个事件开始推进。
- 播放到最后一个事件后自动停止，不再无限循环。
- 播放结束后有 toast 反馈。

### 4. 动效边界

- 宠物移动使用 `translate`，不动画 `left/top`。
- 当前节点使用轻微 pulse。
- 尊重 `prefers-reduced-motion`，减少动效时关闭移动过渡和循环动画。

## 生成产物

- `docs/assets/frontend-screenshots-v0.4/pawroom-home.png`
- `docs/assets/frontend-screenshots-v0.4/pawroom-world.png`
- `docs/assets/frontend-screenshots-v0.4/pawroom-data.png`
- `docs/assets/frontend-screenshots-v0.4/pawroom-journey.png`
- `docs/assets/frontend-screenshots-v0.4/pawroom-settings.png`
- `docs/assets/frontend-screenshots-v0.4/pawroom-create.png`
- `docs/assets/frontend-screenshots-v0.4/pawroom-battery.png`
- `docs/assets/frontend-screenshots-v0.4/pawroom-profile.png`
- `docs/assets/pawroom-frontend-restoration-v0.4-contact-sheet.png`

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
- 8 张 v0.4 截图均为 `1440 × 1024`。
- 8 张 v0.4 截图均非空。

## 二次修正记录

- 初次替换后发现 `renderWorld` 部分引用了 `activePoint`，但未成功注入常量和移动宠物节点。
- 已改为函数级重写 `renderWorld`，保证状态模型完整接入。
- 旧 `events` 数组仍存在时会造成双数据源，已改为从 `worldRoute` 派生。

## 仍需人工视觉确认

建议打开：

- `docs/assets/pawroom-frontend-restoration-v0.4-contact-sheet.png`

重点看：

- 桌面小世界路径节点是否过密或遮挡场景。
- 宠物默认位置是否合理。
- 行为卡高亮是否抢视觉主次。
- 今日历程节点点击和播放路径是否符合预期。

## 下一轮建议

1. 生成 image2 P0 透明资产并替换 CSS 场景占位。
2. 给小世界补“项圈同步中 / 离线 / 低电量”的真实状态分支。
3. 给新增宠物页补表单校验和生成失败/重试状态。
4. 做人工视觉审查后，对路径节点位置和宠物坐标做像素级微调。
