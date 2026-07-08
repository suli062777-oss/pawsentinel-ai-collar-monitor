# PawRoom 首页视觉修正 v0.5：色块层次与异形板块

日期：2026-07-07  
用途：修正 v0.4 首页仍有通用 AI 仪表盘感的问题。参考宠物健康 App 图的视觉语言，增强色块明暗、异形板块和设计节奏。

---

## 1. 本次修正目标

首页仍然保持“看护数据优先”的信息架构，但视觉上不再全部依赖半透明玻璃卡片。

需要增加：

- 更明确的橙色主色块；
- 浅黄 / 奶油色背景；
- 白色内容卡和浅色内容卡的层次；
- 绿色安全状态和主按钮；
- 紫色、蓝色作为少量图表辅助色；
- 局部异形圆角板块；
- 卡片错位、叠放和局部遮挡；
- 更像设计师排版，而不是均匀网格。

---

## 2. 参考图可借鉴的部分

只参考视觉语言，不复制移动端结构。

可借鉴：

- 大面积橙色头部 / 状态区；
- 白色内容卡压在橙色区域上；
- 浅黄背景让页面更温暖；
- 绿色按钮形成明确行动点；
- 不同卡片有不同大小和节奏；
- 部分板块不是标准矩形，而是更大的圆角、切角、弧形边缘或错位叠放；
- 图表颜色更活泼，有橙、绿、紫、蓝的功能区分。

不可借鉴：

- 手机壳展示形式；
- 宠物医疗 App 信息结构；
- 英文内容；
- 纯移动端三屏展示排版。

---

## 3. PawRoom 首页视觉比例

- 数据看护、状态、图表、提醒、时间线：约 70%；
- 桌面小世界像素预览：约 30%；
- 橙色主状态区应成为第一视觉锚点；
- 白色 / 奶油色数据卡应成为第二视觉锚点；
- 像素小世界只作为情绪化入口，不主导首页。

---

## 4. 生成提示词关键词

```text
warm pale yellow background,
large orange asymmetric status panel,
white cards overlapping orange panel,
green primary action button,
purple and blue chart accents,
irregular rounded panels,
organic curved section edges,
offset layered cards,
clear light and dark color block contrast,
designed product interface, not generic AI dashboard
```

---

## 5. 负面约束

```text
no uniform all-glass dashboard,
no generic AI SaaS layout,
no equal-size card grid,
no pale low-contrast interface,
no full-screen map,
no top navigation bar,
no right drawer,
no pixelated UI text,
no phone mockup layout
```

---

## 6. 本次输出资产

- `docs/assets/pawroom-hifi-v05-01-home-colorblock.png`

