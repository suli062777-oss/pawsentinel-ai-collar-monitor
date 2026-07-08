# PawRoom image2 高保真页面提示词 v0.1

日期：2026-07-07  
用途：用于基于 PRD、低保真图、设计系统、IP 控件库和参考风格知识库生成 PawRoom Web 高保真界面。  
关联文档：

- `docs/pawroom-design-system-v0.1.md`
- `docs/pawroom-web-lowfi-ux-wireflow-v0.1.md`
- `docs/pawroom-hifi-sample-data-and-states-v0.1.md`
- `docs/pawroom-ip-component-library-prompts-v0.1.md`
- `D:\作品\小满ai专项计划\宠物项圈产品web库`

---

## 1. 生成目标

用 image2 生成一套 PawRoom Web 高保真界面，体现：

> 宠物项圈数据驱动的安全看护 + 桌面宠物小世界 + 今日历程创作。

产品不是宠物电商，不是医院监护后台，也不是纯桌宠游戏。它是一个上班时低干扰查看宠物状态的温暖工作台。

高保真画面要做到：

- 用户一眼看出“我能知道宠物现在是否安全”。
- 用户第二眼看出“这不是冷冰冰监控，而是一个可爱的宠物小世界”。
- 所有页面保持同一种左侧栏和主画布语言。
- IP 形象出现时要服务状态表达，不做无意义装饰。

---

## 2. 全局结构约束

所有页面必须遵守：

- 画布尺寸：`1440 × 1024`。
- 只使用左侧栏 + 主画布。
- 左侧栏宽度约 `112-148px`。
- 不要顶部全局栏。
- 不要右侧抽屉栏。
- 不要右侧固定状态栏。
- 状态、提醒、数据、操作都放在主画布内，以卡片、浮层或底部控制条呈现。
- 左侧栏固定包含 8 个入口：
  1. 首页
  2. 桌面小世界
  3. 宠物数据
  4. 今日历程
  5. 设置
  6. 新增宠物
  7. 电量
  8. 宠物信息

左侧栏建议视觉：

- 圆角竖向玻璃胶囊。
- 图标 + 短中文标签。
- 当前页面使用暖橙或深灰胶囊高亮。
- 新增宠物、电量、宠物信息放在下半区或底部。
- 电量可带小状态点，但不要做成顶部电池栏。

---

## 3. 全局风格前缀

每次生成页面时，建议把下面这段放在 page prompt 前面：

```text
PawRoom high-fidelity web app interface, 1440 by 1024 desktop dashboard, warm pet care monitoring product, left vertical task sidebar only, no top navigation bar, no right sidebar, large central main canvas, Apple-inspired soft glass UI, warm cream background, clean rounded cards, matte vector pet IP assets, friendly but restrained, low anxiety safety monitoring, playful desktop pet world, cream white and warm orange palette, small safe green accents, grey-brown text, high whitespace, premium UIUX, crisp readable Chinese UI text, consistent icon system, no emoji icons, professional product prototype.
```

中文意图：

- `left vertical task sidebar only` 用于防止模型生成顶部导航和右侧栏。
- `low anxiety safety monitoring` 用于避免医疗警报感。
- `playful desktop pet world` 用于保留情绪价值。
- `crisp readable Chinese UI text` 用于提醒模型文字不能糊成装饰。

---

## 4. 全局负面提示词

每次生成都追加：

```text
No top navigation bar, no right sidebar, no right drawer, no ecommerce product grid, no shopping cart, no pet food store layout, no hospital dashboard, no medical diagnosis UI, no dark cyberpunk theme, no neon, no overloaded charts, no dense data table, no tiny unreadable text, no random emoji icons, no floating decorative blobs, no bokeh, no heavy gradient background, no photorealistic CCTV feed, no camera surveillance wall, no cluttered layout, no watermark, no logo mockup, no English-only UI.
```

---

## 5. 参考风格使用方式

参考图库只取“风格 DNA”，不要照抄页面：

| 参考素材 | 可借鉴 | 不要借鉴 |
| --- | --- | --- |
| `E-commerce Pet Shop UIUX.jpg` | 暖黄橙、圆角卡片、宠物亲和力 | 商品网格、电商购物车、促销卡 |
| `Pet Health App...png` | 宠物健康状态卡、地图追踪感 | 手机界面比例、强医疗感 |
| `Pets Website.jpg` | 宠物品牌亲和力、留白、圆角图形 | 长网页落地页结构 |
| `Public Transport Mobile App...png` | 路径线、地图、状态卡的干净处理 | 公共交通图标和移动端底栏 |
| 控件库 IP 图片 | 宠物分身、状态贴纸、地图道具 | 不要让 IP 抢占安全看护主线 |

---

## 6. 页面 01：首页

用途：默认入口。上班时用户停留最久，用来判断宠物是否安全。

当前左侧栏高亮：`首页`

必须出现：

- 左侧栏 8 个入口。
- 主画布大面积家庭地图。
- 宠物当前位置和活动路径。
- 一句话状态卡。
- 安全等级。
- 今日概览。
- 最近事件。
- 异常提醒以内联卡片或轻浮层出现。
- 底部时间线或当前时间滑块。

页面 prompt：

```text
Create the PawRoom home monitoring page. Use a 1440x1024 desktop web canvas. Keep a single rounded glass left sidebar with eight Chinese navigation items: 首页, 桌面小世界, 宠物数据, 今日历程, 设置, 新增宠物, 电量, 宠物信息. Highlight 首页. Do not create any top bar or right sidebar.

The main canvas should be a warm, clean home map view. Show a simplified apartment floor plan with labeled zones such as 客厅, 沙发, 宠物窝, 饭盆, 门口, 窗边. Place a cute matte vector pet avatar on the map, with an orange dotted activity path and a soft dashed safe zone. Add floating glass cards inside the main canvas: one sentence status, safety level, current area, connection status, today overview, recent events, and a gentle alert card. Put a bottom timeline control inside the main canvas.

Style: warm cream background, soft glass panels, rounded cards, warm orange accent, small safe green status, grey-brown text, low anxiety monitoring, premium but friendly. The screen should feel like a pet safety dashboard transformed into a calm cartoon home world.
```

避免：

- 不要把状态做成右侧抽屉。
- 不要像监控摄像头墙。
- 不要塞满图表。
- 不要做成宠物用品商店首页。

---

## 7. 页面 02：桌面小世界

用途：核心差异化。让用户在电脑上看到卡通版宠物正在家里生活。

当前左侧栏高亮：`桌面小世界`

必须出现：

- 卡通家庭场景。
- 宠物电子分身。
- 状态动效静帧：睡觉、巡逻、吃饭、等主人、玩玩具中的 2-3 个。
- 轻互动按钮：摸摸、投喂、叫名字、扔玩具。
- 桌面小窗预览。
- 当前数据来源提示。

页面 prompt：

```text
Create the PawRoom desktop pet world page. Use a 1440x1024 desktop web canvas. Keep only one left vertical glass sidebar with the eight Chinese items, highlight 桌面小世界. No top navigation, no right sidebar.

The main canvas is an immersive cartoon home world, like a soft miniature room map. Show the pet's digital avatar living inside the room. Include zones: sofa, pet bed, food bowl, door, window, toy area. Use warm cream and orange, soft rounded shapes, clean matte vector style. Add small floating controls inside the scene for pet interactions: 摸摸, 投喂, 叫名字, 扔玩具. Add status motion chips such as 睡觉, 巡逻, 吃饭, 等主人. Show a small desktop widget preview floating inside the canvas, not as a separate right panel.

The page should feel decorative, calm, and useful: a data-driven desktop pet companion, not a pure game. Show subtle source text such as 项圈数据驱动 / AI 演绎, but keep it elegant and low-density.
```

避免：

- 不要做成游戏启动页。
- 不要大量按钮和游戏 HUD。
- 不要出现右侧互动栏。
- 不要让 IP 比主画布还拥挤。

---

## 8. 页面 03：宠物数据

用途：建立可信度。说明小世界、提醒、今日历程都来自项圈数据。

当前左侧栏高亮：`宠物数据`

必须出现：

- 连接状态。
- 电量。
- 更新时间。
- 活动趋势。
- 家庭区域分布。
- 心率趋势、呼吸趋势、静息时长。
- 数据边界：项圈记录、用户补充、AI 演绎。
- 非诊断提示。

页面 prompt：

```text
Create the PawRoom pet data page. Use a 1440x1024 desktop web canvas. Keep a single left vertical glass sidebar with eight Chinese navigation items, highlight 宠物数据. No top bar, no right sidebar.

The main canvas should be a clean data dashboard for pet collar data, but friendly and low anxiety. Place the top part of the main canvas as a calm status summary: collar connected, battery 78%, last update time, current zone. In the center, arrange rounded cards for activity minutes, rest duration, zone distribution, heart rate trend, respiration trend, and resting trend. Use small charts with clear labels, no dense table. At the bottom, add a data boundary explanation with three tags: 项圈记录, 用户补充, AI 演绎, plus a non-diagnostic note.

Style: warm cream, white solid cards for data readability, orange for activity, blue-grey for paths, safe green for normal, gentle red only for warning. The page must feel trustworthy, not medical, not scary.
```

避免：

- 不要医院 ICU 风格。
- 不要诊断疾病文案。
- 不要黑底监控风。
- 不要复杂数据表。

---

## 9. 页面 04：今日历程

用途：把一天的数据转化为情绪价值和可分享内容。

当前左侧栏高亮：`今日历程`

必须出现：

- 今日时间轴。
- 路径回放。
- 用户补充事件。
- AI 小剧场。
- 四格漫画。
- 表情包。
- 角色卡。
- 分享导出。
- AI 创作额度提示。

页面 prompt：

```text
Create the PawRoom daily journey page. Use a 1440x1024 desktop web canvas. Keep only the left vertical glass sidebar, highlight 今日历程. No top navigation and no right sidebar.

The main canvas should combine a daily timeline and creative memory outputs. On the left/upper part of the main canvas, show a horizontal or vertical timeline with pet events: 在客厅活动, 从书房进入客厅, 在饭盆附近停留, 在门口等待. Include a small path replay map. On the right/lower part inside the same main canvas, show AI-generated memory cards: 今日小剧场, 四格漫画, 表情包, 宠物角色卡. Add a share/export area and a subtle AI 创作额度提示.

Style: warm, cute, story-like, but still a product dashboard. Use the pet IP avatar as the main character in story cards. Clearly separate factual records from AI interpretation using small tags: 项圈记录, 用户补充, AI 演绎.
```

避免：

- 不要像社交媒体内容管理后台。
- 不要把创作区做成电商商品卡。
- 不要让 AI 演绎看起来像事实记录。
- 不要出现右侧创作栏。

---

## 10. 页面 05：设置

用途：承接安全区域、提醒、额度、隐私和边界说明。

当前左侧栏高亮：`设置`

必须出现：

- 安全区域。
- 提醒偏好。
- AI 创作额度。
- 数据隐私。
- 医疗边界说明。
- 设备相关设置作为主画布内分组。

页面 prompt：

```text
Create the PawRoom settings page. Use a 1440x1024 desktop web canvas. Keep only a left vertical glass sidebar with eight Chinese items, highlight 设置. No top bar, no right sidebar.

The main canvas should be an organized settings workspace with grouped rounded sections: 安全区域, 提醒偏好, AI 创作额度, 数据隐私, 医疗边界说明, 设备相关设置. Use a calm form layout with toggles, segmented controls, small cards, and clear helper text. Keep it visually clean and not crowded. Show privacy and medical boundary explanations as gentle information cards, not legal walls of text.

Style: warm cream background, solid readable cards, restrained orange primary actions, safe green normal states, high readability, premium utility feeling.
```

避免：

- 不要杂项堆叠。
- 不要法律协议大段文字。
- 不要顶部设置栏。
- 不要右侧详情栏。

---

## 11. 页面 06：新增宠物

用途：渐进式创建宠物分身，降低首次使用负担。

当前左侧栏高亮：`新增宠物`

必须出现：

- 渐进式步骤条。
- 当前步骤只出现一个主任务。
- 上传照片或选择示例宠物。
- 基础信息。
- 视觉风格选择。
- 分身预览。
- 连接项圈。

页面 prompt：

```text
Create the PawRoom add pet onboarding page. Use a 1440x1024 desktop web canvas. Keep only the left vertical glass sidebar, highlight 新增宠物. No top navigation, no right sidebar.

The main canvas should show a progressive pet creation flow. Use a clear stepper: 1 选择照片, 2 基础信息, 3 视觉风格, 4 生成分身, 5 连接项圈. Show only one main task in focus: upload pet photos or choose a sample pet. Include a large preview area for the future digital pet avatar and a small helper card explaining that more details can be added later. Use primary action button: 下一步 / 生成宠物分身.

Style: friendly, low pressure, warm, clean, with soft rounded cards and enough whitespace. It should feel easy, not like a long form.
```

避免：

- 不要一次性展示全部表单。
- 不要复杂注册页。
- 不要把项圈连接放成右侧栏。
- 不要让用户感觉必须填完所有信息。

---

## 12. 页面 07：电量

用途：让用户快速确认项圈是否在线、是否有足够电量支撑看护。

当前左侧栏高亮：`电量`

必须出现：

- 大号电量状态。
- 连接状态。
- 更新时间。
- 低电量提醒。
- 充电建议。
- 最近同步记录。

页面 prompt：

```text
Create the PawRoom collar battery page. Use a 1440x1024 desktop web canvas. Keep only the left vertical glass sidebar, highlight 电量. No top bar, no right sidebar.

The main canvas should focus on the smart collar battery and connection status. Show a large friendly battery visualization, battery 78%, connected status, last update time, estimated remaining time, and charging advice. Add small cards for recent sync records and low battery alert settings. Use a gentle state point on the left sidebar battery entry.

Style: utility but warm, readable, low anxiety. Use safe green for normal battery, warm orange for attention, grey for disconnected. The page should make users feel the monitoring system is reliable.
```

避免：

- 不要把电量放在角落。
- 不要做成硬件工程后台。
- 不要出现顶部设备栏。
- 不要右侧状态栏。

---

## 13. 页面 08：宠物信息

用途：管理当前宠物身份和素材，保证 AI 分身和今日历程有稳定对象。

当前左侧栏高亮：`宠物信息`

必须出现：

- 宠物头像/IP 形象。
- 昵称、品种、年龄、体重。
- 性格标签。
- 照片素材。
- 声音素材。
- 当前项圈绑定。
- 切换宠物或编辑档案入口。

页面 prompt：

```text
Create the PawRoom pet profile page. Use a 1440x1024 desktop web canvas. Keep only the left vertical glass sidebar, highlight 宠物信息. No top navigation and no right sidebar.

The main canvas should show the current pet profile as an identity and asset hub. Use a large pet IP avatar card, name 花花 Coco, dog profile information, breed, age, weight, personality tags, photo material gallery, voice material card, and current collar binding status. Include actions to edit profile or switch pet. Keep the layout warm, personal, and organized.

Style: pet memory and identity, not account settings. Use warm cream, rounded cards, soft orange accents, matte pet IP asset, clean readable Chinese labels.
```

避免：

- 不要变成普通账号设置页。
- 不要把素材墙做得太密。
- 不要使用真实照片监控风。
- 不要出现右侧档案栏。

---

## 14. 生成顺序建议

推荐先生成：

1. 首页：验证主结构、左侧栏、地图和状态系统。
2. 桌面小世界：验证 IP、场景和差异化。
3. 宠物数据：验证可信度和图表风格。
4. 新增宠物：验证渐进式流程。
5. 今日历程：验证 AI 创作和记忆表达。
6. 设置、电量、宠物信息：补齐系统页面。

每生成一张，都检查：

- 是否出现顶部栏。
- 是否出现右侧栏。
- 左侧栏是否有 8 个入口。
- 当前入口是否高亮。
- 主画布是否是最大视觉区域。
- 是否符合“安全看护 + 宠物小世界”，而不是电商/医疗/纯游戏。