# PawRoom 首页重生成说明 v0.4：数据看护优先

日期：2026-07-07  
用途：修正 v0.3 首页过度偏向“桌面小世界 / 地图主屏”的问题，作为后续 image2 / imagegen 生成首页的约束说明。

---

## 1. 首页定位

首页不是“桌面小世界”页面，也不是完整地图页。

首页应当承担的是：

- 快速判断宠物是否安全；
- 快速看到项圈连接、电量、当前区域；
- 快速浏览今日活动、休息、心率、呼吸等趋势；
- 快速发现异常提醒；
- 提供进入“桌面小世界”和“今日回放”的入口。

因此首页的主视觉比例应调整为：

- 数据看护、状态、趋势、提醒、时间线：约 70%；
- 宠物桌面小世界 / 像素家庭场景预览：约 30%。

---

## 2. 首页保留项

- 左侧全局任务栏；
- 上半区：首页、桌面小世界、宠物数据、今日历程、设置；
- 下半区：添加、电量、宠物信息；
- 液态玻璃风格 UI；
- 像素化宠物 IP；
- 小尺寸像素家庭场景预览；
- 进入桌面小世界按钮；
- 生成今日回放按钮。

---

## 3. 首页删除 / 降级项

- 不使用顶部全局栏；
- 不使用右侧抽屉栏；
- 不让地图或小世界占满主画面；
- 不把首页做成完整的路径追踪页面；
- 不把像素风扩展到 UI 文本、图表、卡片和按钮；
- 不做真实监控画面或摄像头画面。

---

## 4. 推荐页面结构

主内容区建议采用数据优先的仪表盘布局：

1. 今日看护概览  
   展示一句话状态、安全等级、当前区域、项圈连接、电量。

2. 核心数据卡片  
   展示活动量、休息时长、心率趋势、呼吸趋势、区域停留、数据置信度。

3. 小世界预览卡  
   只占约 30% 面积，展示像素宠物在家中场景里的状态，并提供“进入桌面小世界”入口。

4. 最近事件与提醒  
   展示安全区、久静止、数据趋势等提醒。

5. 今日时间线  
   展示 09:05、09:22、09:40、10:15、10:26、10:42 等关键节点。

---

## 5. 生成时的关键提示

```text
PawRoom homepage must be a data-first pet safety monitoring dashboard.
Data cards, status cards, charts, alerts, and timeline occupy about 70% of the main content.
The pixel desktop pet world is only a preview/entry card occupying about 30%.
Keep only pet and scene illustrations in 2D pixel art.
All UI chrome, sidebar, cards, charts, buttons, and text remain modern liquid glass high-fidelity UI.
No top nav bar, no right drawer, no full-screen map, no dominant pixel world.
```

---

## 6. 本次输出资产

- `docs/assets/pawroom-hifi-v04-01-home-data-first.png`

