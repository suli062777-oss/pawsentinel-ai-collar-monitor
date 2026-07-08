# PawRoom imagegen 高保真页面提示词 v0.3：像素场景 + 液态玻璃 UI

日期：2026-07-07  
用途：重新生成 PawRoom Web 高保真界面。修正原则：宠物和主场景像素化，UI 框架保持液态玻璃高保真。

---

## 1. 全局前缀

```text
PawRoom high-fidelity desktop web app UI, 1440x1024, warm pet safety monitoring product, Apple-inspired liquid glass interface, translucent rounded left sidebar, modern readable dashboard cards, warm cream background, orange smart collar accent, low anxiety monitoring, crisp readable Chinese UI text, premium UIUX. Main content world uses cozy 2D pixel art: pixel pet avatar, pixel home map, pixel room scene, pixel story cards. The UI chrome is NOT pixelated; only the pet and scene illustrations are pixel art.
```

---

## 2. 左侧栏固定结构

```text
Left sidebar: high-fidelity liquid glass vertical rounded pill, translucent light grey, soft blur, subtle border and shadow. The layout follows the provided reference only for placement: two groups. Upper group has five vertically stacked navigation items: 首页, 桌面小世界, 宠物数据, 今日历程, 设置. Lower group near the bottom has two compact round glass buttons: 添加 and 电量, and one larger rounded glass pet block with a small pixel pet avatar and the name 花花. Highlight the current item with warm orange accent or darker glass capsule. Do not make the sidebar a low-fidelity grey placeholder; it must look polished and high-fidelity.
```

---

## 3. 全局负面提示词

```text
No top navigation bar, no right sidebar, no right drawer, no right status panel, no full pixelated UI, no pixelated text, no low-fidelity grey placeholder sidebar, no 3D mascot, no clay render, no photorealistic pet, no realistic CCTV feed, no ecommerce product grid, no shopping cart, no pet food store layout, no hospital dashboard, no medical diagnosis UI, no dark cyberpunk theme, no neon, no dense data table, no tiny unreadable text, no emoji icons, no heavy bokeh, no watermark, no logo mockup, no English-only UI.
```

---

## 4. 页面 01：首页

当前高亮：`首页`

```text
Create PawRoom home page. Use the global prefix and fixed left sidebar. Highlight 首页.

Main canvas: a large cozy 2D pixel art home map fills most of the remaining space. Pixel rooms and zones labeled 客厅, 沙发, 宠物窝, 饭盆, 门口, 窗边, 书房, 阳台. Use pixel tiles, warm floor, tiny furniture, indoor plants. Place a pixel pet avatar 花花 wearing an orange smart collar in 客厅. Show orange pixel dotted activity path from 书房 to 客厅 and a dashed pixel safe zone.

UI overlays: modern liquid glass floating cards on top of the pixel map, not pixelated cards. Cards show “一切正常，花花正在客厅休息”, “安全等级 高”, “当前区域 客厅”, “项圈已连接”, “电量 78%”, “活动 268 min”, “休息 8.2 h”. Bottom liquid glass timeline with 09:05, 09:40, 10:15, 10:26, 10:42. Keep map dominant and UI readable.
```

---

## 5. 页面 02：桌面小世界

当前高亮：`桌面小世界`

```text
Create PawRoom desktop pet world page. Use the global prefix and fixed left sidebar. Highlight 桌面小世界.

Main canvas: immersive cozy 2D pixel room / home world. Include sofa, pet bed, food bowl, door, window, toy area, plants, warm floor tiles, small lamp glow. Place pixel pet avatar 花花 with orange smart collar in the room. Add pixel state markers in the scene: 睡觉, 巡逻, 吃饭, 等主人, 玩玩具.

UI overlays: liquid glass interaction buttons floating over the scene: 摸摸, 投喂, 叫名字, 扔玩具. Add a small liquid glass desktop widget preview inside the canvas. Add source label: 项圈数据驱动 / AI 轻量演绎. The world is pixel art, but the controls are liquid glass UI.
```

---

## 6. 页面 03：宠物数据

当前高亮：`宠物数据`

```text
Create PawRoom pet data page. Use the global prefix and fixed left sidebar. Highlight 宠物数据.

Main canvas: modern liquid glass / solid readable dashboard cards. Data UI is not pixelated. Add small pixel accents only in icons, mini-map, and pet avatar. Top summary cards: 项圈已连接, 电量 78%, 最近同步 10:42, 数据置信度 72%, 当前区域 客厅. Middle grid: 今日活动 268 min, 休息 8.2 h, 心率趋势 92 bpm, 呼吸趋势 20 rpm, 区域停留. Use clean modern charts with subtle pixel icon accents. Include a small 2D pixel mini-map showing 客厅/门口/饭盆. Bottom data boundary strip: 项圈记录, 用户补充, AI 演绎, and “生命状态仅作趋势参考，不构成医疗诊断”.
```

---

## 7. 页面 04：今日历程

当前高亮：`今日历程`

```text
Create PawRoom daily journey page. Use the global prefix and fixed left sidebar. Highlight 今日历程.

Main canvas: modern liquid glass memory board with pixel content previews. Left/upper area uses readable timeline cards: 09:05 在宠物窝休息, 09:22 从餐厅进入书房, 09:40 在餐厅活动, 10:15 在书房休息, 10:26 从书房进入客厅, 10:42 在客厅活动. Add a small 2D pixel path replay map. Add a note card: 喜欢趴在沙发角落.

Right/lower area inside the same main canvas: liquid glass cards containing pixel story previews: 今日小剧场, 四格漫画, 表情包, 宠物角色卡. Pixel pet avatar appears inside the story thumbnails. Tags: 项圈记录, 用户补充, AI 演绎. Add “预计消耗 12 credits”, “生成今日历程”, “分享导出”, and “AI 演绎，不等同于真实录像”.
```

---

## 8. 页面 05：设置

当前高亮：`设置`

```text
Create PawRoom settings page. Use the global prefix and fixed left sidebar. Highlight 设置.

Main canvas: modern liquid glass settings workspace. UI controls are not pixelated. Sections: 安全区域, 提醒偏好, AI 创作额度, 数据隐私, 医疗边界说明, 设备相关设置. Use polished toggles, segmented controls, checkboxes, sliders, rounded cards. Add small pixel icons and a tiny pixel pet avatar only as visual accents. Include safety zones: 客厅, 宠物窝, 饭盆, 窗边; attention zones: 门口, 阳台. Include “生命状态仅作趋势参考，不构成医疗诊断”.
```

---

## 9. 页面 06：添加宠物

当前高亮：`添加`

```text
Create PawRoom add pet onboarding page. Use the global prefix and fixed left sidebar. Highlight 添加 in the lower sidebar group.

Main canvas: polished liquid glass onboarding flow. Stepper: 1 选择照片, 2 基础信息, 3 像素风格, 4 生成分身, 5 连接项圈. Active step: 选择照片. Large glass upload card for 1-5 pet photos or choose sample pet. Preview area shows a pixel pet avatar silhouette with orange collar, based on the pixel IP style. Helper text: 之后也可以继续补充素材，不用一次填完。 Buttons: 下一步, 使用示例宠物. Keep UI high fidelity and readable; only pet preview is pixel art.
```

---

## 10. 页面 07：电量

当前高亮：`电量`

```text
Create PawRoom collar battery page. Use the global prefix and fixed left sidebar. Highlight 电量 in the lower sidebar group.

Main canvas: modern liquid glass hardware status center. Large polished battery status card with optional pixel orange collar illustration. Text: 电量 78%, 预计可用 14 小时 30 分钟, 项圈已连接, 最近同步 10:42, 信号 良好. Supporting liquid glass cards: 最近同步记录, 充电建议, 低电量提醒设置, 数据同步频率 每 30 秒, 设备 ID collar_demo_001. Copy: 电量充足，可继续支持今日看护。 The battery/collar illustration can be pixel art; the UI cards are liquid glass.
```

---

## 11. 页面 08：宠物板块 / 宠物信息

当前高亮：底部宠物块 `花花`

```text
Create PawRoom pet profile page. Use the global prefix and fixed left sidebar. Highlight the bottom pet block 花花.

Main canvas: modern liquid glass pet identity and material hub. Large profile card contains pixel pet avatar 花花 Coco wearing orange smart collar. Profile: 柴犬混血, 2 岁 8 个月, 8.4 kg, 小型犬, 当前家庭 家·一楼. Personality tags: 黏人, 好奇, 爱巡逻, 喜欢纸箱. Material cards: 照片素材 12 张, 声音素材 3 条, 表情包素材 8 张, 今日事件素材 6 条. Collar binding card: PawCollar Demo 01, 已绑定, 电量 78%. Actions: 编辑档案, 切换宠物, 补充素材. Only pet assets and thumbnails are pixel art; cards and text are high-fidelity liquid glass UI.
```

---

## 12. 检查清单

- 宠物和主场景是否像素化。
- UI 面板是否仍是液态玻璃高保真，而不是全像素 UI。
- 左侧栏是否按参考位置分成上 5 + 下 3。
- 左侧栏是否高保真，不是灰色占位图。
- 是否没有顶部栏和右侧栏。