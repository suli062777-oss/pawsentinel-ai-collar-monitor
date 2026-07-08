# PawRoom 小红书用户证据采集协议

## 目标

补强 PawRoom 用户证据中“中国社交内容平台样本不足”的问题。小红书样本只用于早期机会验证，重点验证这些假设：

- 宠物独自在家时，主人是否存在安全焦虑。
- 上班/离家期间，主人是否希望低干扰了解宠物状态。
- 宠物摄像头是否带来“需要一直看、打扰、隐私、焦虑”的压力。
- 宠物定位器/智能项圈是否存在定位不准、续航、连接、价格等问题。
- 用户是否愿意为宠物安全硬件、宠物情绪价值内容、宠物记录衍生内容付费。

## 合规边界

- 只采集公开可见内容，或用户自己账号正常登录后可见的内容。
- 不绕过登录、验证码、风控、付费墙或平台反爬限制。
- 不使用隐匿爬虫、签名逆向、验证码服务、批量账号或代理池。
- 报告中尽量使用短摘录、证据 ID、链接和截图路径，不大段复制原文。

## 推荐关键词

| 假设 | 小红书关键词 |
|---|---|
| 安全焦虑 | 宠物独自在家、上班想狗、上班想猫、狗狗独自在家、猫咪独自在家、宠物留守 |
| 监控压力 | 宠物摄像头、宠物监控、上班看狗、上班看猫、宠物摄像头有必要吗 |
| 硬件缺口 | 宠物定位器、狗狗定位器、宠物智能项圈、定位不准、宠物摄像头差评 |
| 健康趋势 | 老年犬监测、老年猫监测、狗狗心率、宠物健康监测、宠物睡眠监测 |
| 情绪价值 | 宠物桌宠、宠物表情包、宠物纪念、宠物周边、宠物小剧场 |

## 半自动采集流程

1. 打开可调试浏览器：

```powershell
.\scripts\start_xhs_research_browser.ps1 -Keyword "宠物独自在家 上班 想狗 宠物摄像头"
```

2. 在打开的浏览器中正常登录小红书。

3. 搜索上面的关键词，滚动到你认为有代表性的帖子列表或帖子详情页。

4. 运行采集脚本：

```powershell
& 'C:\Users\27235\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\xhs_cdp_capture.py --port 9222
```

5. 脚本会输出：

- `data/evidence/raw/xhs_public_visible_capture.csv`
- `data/evidence/raw/xhs_public_visible_capture.json`
- `data/evidence/raw/xhs_screenshots/*.png`

6. 复跑主证据管线：

```powershell
& 'C:\Users\27235\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\pawroom_evidence_pipeline.py
```

## 采集字段

| 字段 | 含义 |
|---|---|
| platform | 固定为“小红书” |
| source_type | 固定为 `xhs_visible_page` |
| source_url | 帖子链接或当前搜索页链接 |
| original_text | 当前可见卡片/帖子文本 |
| user_scene | 脚本基于关键词推断的场景 |
| pet_type | 狗、猫、狗/猫 |
| current_solution | 摄像头、定位器/项圈、照片/视频记录等 |
| payment_signal | 是否出现价格、购买、会员、值不值等付费信号 |
| notes | 证据 ID、标题、作者、点赞、截图路径 |

## 质量标准

- 至少采集 30 条小红书可见证据。
- 至少覆盖 5 个关键词。
- 每个核心结论至少绑定 3 条小红书证据或 3 条跨平台证据。
- 截图必须能对应到 CSV 中的采集时间和来源 URL。
- 如果只有搜索页而没有帖子详情，标记为“弱/中等证据”，不单独支撑核心结论。

## 进入 PRD/PPT 的方式

小红书证据适合放在“国内用户信号补强”页：

- 上班/离家养宠人群的真实表达。
- 摄像头和定位器现有方案的抱怨。
- 对 PawRoom 的启发：把监控从视频流转为低干扰、卡通化、可互动状态空间。

