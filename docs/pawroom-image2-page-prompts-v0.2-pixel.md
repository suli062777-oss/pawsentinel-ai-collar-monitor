# PawRoom image2 / imagegen 像素风高保真页面提示词 v0.2

日期：2026-07-07  
用途：基于 PRD、低保真图、像素 IP 控件库、像素场景参考图，重新生成 PawRoom Web 高保真界面。  
关联文档：

- `docs/pawroom-pixel-hifi-design-addendum-v0.2.md`
- `docs/pawroom-design-system-v0.1.md`
- `docs/pawroom-web-lowfi-ux-wireflow-v0.1.md`
- `docs/pawroom-hifi-sample-data-and-states-v0.2-pixel.md`
- `D:\作品\小满ai专项计划\宠物项圈产品web库\ip图标控件库`

---

## 1. 全局生成前缀

```text
PawRoom high-fidelity desktop web app UI, 1440x1024, cozy 2D pixel art pet monitoring product, pixel pet avatar, pixel home/world scene, smart orange collar, modern readable UI panels, warm cream and soft grey interface, single left vertical rounded sidebar only, two-section left sidebar layout, no top navigation bar, no right sidebar, no right drawer, large central main canvas, low anxiety pet safety monitoring, cute but restrained, crisp readable Chinese UI text, premium UIUX, pixel game-inspired but still a practical dashboard.
```

---

## 2. 左侧栏固定提示词

每张图都必须包含这段结构：

```text
Left sidebar: a tall light-grey rounded vertical pill like the provided reference screenshot. It is split into two visual groups. Upper main task group has five dark grey rectangular buttons stacked with generous spacing: 首页, 桌面小世界, 宠物数据, 今日历程, 设置. Lower group near the bottom has two small round buttons: 添加 and 电量, and a larger rounded pet block showing a small pixel pet avatar and the name 花花. Highlight the current page button. Keep the sidebar simple, no logo, no search, no shopping cart.
```

---

## 3. 全局负面提示词

```text
No top navigation bar, no right sidebar, no right drawer, no right status panel, no 3D mascot, no clay render, no photorealistic pet, no realistic CCTV feed, no camera surveillance wall, no ecommerce product grid, no shopping cart, no pet food store layout, no hospital dashboard, no medical diagnosis UI, no dark cyberpunk theme, no neon, no over-detailed realistic texture, no random fantasy battle HUD, no dense data table, no tiny unreadable text, no emoji icons, no decorative bokeh, no heavy glassmorphism, no watermark, no logo mockup, no English-only UI.
```

---

## 4. 像素视觉规则

- 宠物必须是像素宠物，参考用户给出的像素猫/像素狗控件库。
- 宠物项圈必须是橙色智能项圈。
- 家庭地图和小世界必须是 2D 像素场景，参考像素木屋、草地、水边、俯视游戏地图。
- 数据 UI 可以是现代卡片，但边缘、图标、插图可以有像素块感。
- 文本必须清晰，不能故意做成低清像素字导致不可读。

---

## 5. 页面 01：首页

当前高亮：`首页`

```text
Create PawRoom home page. Use the global prefix and fixed left sidebar prompt. Highlight 首页.

Main canvas: a large top-down 2D pixel art home map fills almost all remaining space. Pixel rooms and zones labeled 客厅, 沙发, 宠物窝, 饭盆, 门口, 窗边, 书房, 阳台. Place a pixel pet avatar 花花 wearing an orange smart collar in 客厅. Show orange pixel dotted activity path from 书房 to 客厅 and a dashed pixel safe zone.

Use compact UI overlays on the pixel map, not a right column: “一切正常，花花正在客厅休息”, “安全等级 高”, “当前区域 客厅”, “项圈已连接”, “电量 78%”, “活动 268 min”, “休息 8.2 h”. Bottom pixel timeline with 09:05, 09:40, 10:15, 10:26, 10:42. Keep the pixel scene dominant.
```

---

## 6. 页面 02：桌面小世界

当前高亮：`桌面小世界`

```text
Create PawRoom desktop pet world page. Use the global prefix and fixed left sidebar prompt. Highlight 桌面小世界.

Main canvas: an immersive cozy 2D pixel room / home world, like a gentle pixel game scene. Include sofa, pet bed, food bowl, door, window, toy area, plants, warm floor tiles. Place pixel pet avatar 花花 with orange smart collar in the room. Add small pixel state chips: 睡觉, 巡逻, 吃饭, 等主人, 玩玩具. Add four interaction buttons floating inside the scene: 摸摸, 投喂, 叫名字, 扔玩具. Add a small pixel desktop widget preview inside the canvas. Add subtle source text: 项圈数据驱动 / AI 轻量演绎.

The page should feel like a useful pixel desktop pet companion, not a combat game.
```

---

## 7. 页面 03：宠物数据

当前高亮：`宠物数据`

```text
Create PawRoom pet data page. Use the global prefix and fixed left sidebar prompt. Highlight 宠物数据.

Main canvas: a warm readable pixel-inspired data dashboard. Use modern rounded cards with pixel icons and small pixel map/chart accents. Top summary cards: 项圈已连接, 电量 78%, 最近同步 10:42, 数据置信度 72%, 当前区域 客厅. Middle grid: 今日活动 268 min, 休息 8.2 h, 心率趋势 92 bpm, 呼吸趋势 20 rpm, 区域停留. Use pixel-style bar charts and line charts, but keep labels readable. Include a small pixel mini-map showing 客厅/门口/饭盆. Bottom data boundary strip: 项圈记录, 用户补充, AI 演绎, and “生命状态仅作趋势参考，不构成医疗诊断”.
```

---

## 8. 页面 04：今日历程

当前高亮：`今日历程`

```text
Create PawRoom daily journey page. Use the global prefix and fixed left sidebar prompt. Highlight 今日历程.

Main canvas: a pixel memory board. Left/upper area shows pixel timeline: 09:05 在宠物窝休息, 09:22 从餐厅进入书房, 09:40 在餐厅活动, 10:15 在书房休息, 10:26 从书房进入客厅, 10:42 在客厅活动. Add a small pixel path replay map. Add a pixel sticky note: 喜欢趴在沙发角落.

Right/lower area within the same main canvas, not a sidebar: pixel AI creation cards: 今日小剧场, 四格漫画, 表情包, 宠物角色卡. Use pixel pet avatar in story cards. Tags: 项圈记录, 用户补充, AI 演绎. Add “预计消耗 12 credits”, “生成今日历程”, “分享导出”, and “AI 演绎，不等同于真实录像”.
```

---

## 9. 页面 05：设置

当前高亮：`设置`

```text
Create PawRoom settings page. Use the global prefix and fixed left sidebar prompt. Highlight 设置.

Main canvas: organized settings workspace with modern readable cards and pixel-style icons. Sections: 安全区域, 提醒偏好, AI 创作额度, 数据隐私, 医疗边界说明, 设备相关设置. Use toggles, segmented controls, checkboxes, sliders. Include safety zones: 客厅, 宠物窝, 饭盆, 窗边; attention zones: 门口, 阳台. AI credits: 本月额度 300 credits, 已使用 126 credits. Include “生命状态仅作趋势参考，不构成医疗诊断”. Use subtle pixel borders and small pixel icons, not heavy glass.
```

---

## 10. 页面 06：添加宠物

当前高亮：`添加`

```text
Create PawRoom add pet onboarding page. Use the global prefix and fixed left sidebar prompt. Highlight 添加 in the lower sidebar group.

Main canvas: progressive pixel pet creation flow. Stepper: 1 选择照片, 2 基础信息, 3 像素风格, 4 生成分身, 5 连接项圈. Active step: 选择照片. Large upload card for 1-5 pet photos or choose sample pet. Show sample pixel pets from the control library style. Preview area shows a pixel pet silhouette with orange collar. Helper text: 之后也可以继续补充素材，不用一次填完。 Buttons: 下一步, 使用示例宠物. Do not show all forms at once.
```

---

## 11. 页面 07：电量

当前高亮：`电量`

```text
Create PawRoom collar battery page. Use the global prefix and fixed left sidebar prompt. Highlight 电量 in the lower sidebar group.

Main canvas: friendly pixel hardware status center. Large pixel battery graphic and small pixel orange smart collar illustration. Text: 电量 78%, 预计可用 14 小时 30 分钟, 项圈已连接, 最近同步 10:42, 信号 良好. Supporting pixel cards: 最近同步记录, 充电建议, 低电量提醒设置, 数据同步频率 每 30 秒, 设备 ID collar_demo_001. Copy: 电量充足，可继续支持今日看护。
```

---

## 12. 页面 08：宠物板块 / 宠物信息

当前高亮：底部宠物板块 `花花`

```text
Create PawRoom pet profile page. Use the global prefix and fixed left sidebar prompt. Highlight the bottom pet block 花花 in the lower sidebar group.

Main canvas: pixel pet identity and material hub. Large pixel pet avatar card for 花花 Coco, wearing orange smart collar. Profile: 柴犬混血, 2 岁 8 个月, 8.4 kg, 小型犬, 当前家庭 家·一楼. Personality pixel tags: 黏人, 好奇, 爱巡逻, 喜欢纸箱. Material cards: 照片素材 12 张, 声音素材 3 条, 表情包素材 8 张, 今日事件素材 6 条. Collar binding card: PawCollar Demo 01, 已绑定, 电量 78%. Actions: 编辑档案, 切换宠物, 补充素材.
```

---

## 13. 生成后检查

- 是否是 2D 像素宠物和 2D 像素场景。
- 左侧栏是否像参考图一样分成上半 5 个主入口、下半添加/电量/花花宠物块。
- 是否没有顶部栏和右侧栏。
- 主画布是否最大。
- 文字是否可读。