# PawRoom 用户证据管线使用说明

## 1. 这套管线解决什么

这套管线用于替代“逐条截图做用户分析”的低效流程。它把 Reddit、淘宝、小红书、抖音、竞品评论、公开评测等证据统一成可追溯表格，并自动生成：

- 用户证据报告：`docs/pawroom-user-evidence-report.md`
- PRD 证据补充章节：`docs/pawroom-prd-user-evidence-addendum.md`
- 结构化证据表：`data/evidence/processed/evidence_items.csv`
- 痛点聚类表：`data/evidence/processed/painpoint_summary.csv`
- 竞品证据表：`data/evidence/processed/competitor_summary.csv`
- 搜索任务表：`data/evidence/processed/search_tasks.csv`

## 2. 目录说明

```text
config/pawroom_evidence_config.json
scripts/pawroom_evidence_pipeline.py
data/evidence/raw/
data/evidence/manual/
data/evidence/processed/
docs/pawroom-user-evidence-report.md
docs/pawroom-prd-user-evidence-addendum.md
```

## 3. CSV 导入格式

把 Thunderbit、Apify、手动整理或其他工具导出的 CSV 放进：

```text
data/evidence/manual/
```

推荐字段：

```text
platform
source_type
source_url
collected_at
competitor
product
original_text
user_scene
pet_type
current_solution
payment_signal
notes
```

可参考模板：

```text
data/evidence/manual/evidence_import_template.csv
```

如果导出的字段叫 `comment`、`review`、`content`、`评论`、`原文`，脚本也会自动识别为 `original_text`。

## 4. 推荐采集方式

### Reddit

优先方式：

- Reddit API + PRAW。
- Apify Reddit Scraper。
- 手动搜索后导出链接和评论。

当前环境匿名 Reddit JSON 访问会返回 403，所以建议使用 API 凭证或第三方导出。

PRAW 运行需要环境变量：

```text
REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET
REDDIT_USER_AGENT
```

安装 PRAW 后可运行：

```powershell
& 'C:\Users\27235\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\pawroom_evidence_pipeline.py --reddit
```

### 小红书 / 抖音 / 淘宝

不建议绕过登录、验证码或反爬限制。推荐：

- Thunderbit 半自动抓取公开页面。
- 浏览器打开搜索结果后导出评论摘要。
- 手动导出淘宝差评、追评、问大家为 CSV。

导出后放入：

```text
data/evidence/manual/
```

再复跑脚本即可。

## 5. 复跑命令

当前机器没有全局 `python`，使用 Codex 自带 Python：

```powershell
& 'C:\Users\27235\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\pawroom_evidence_pipeline.py
```

脚本会自动：

1. 读取 `data/evidence/raw/*.csv` 和 `data/evidence/manual/*.csv`
2. 去重
3. 打痛点标签
4. 计算情绪强度
5. 识别付费信号
6. 输出结构化证据表和报告

## 6. 标签体系

当前自动标签：

- 安全焦虑
- 监控隐私压力
- 设备不准
- 续航连接问题
- 老年宠/幼宠担忧
- 生命状态趋势需求
- 不想一直看监控
- 愿意为硬件付费
- 愿意为内容/情绪价值付费

标签规则在：

```text
config/pawroom_evidence_config.json
```

## 7. 质量门槛

正式汇报前建议满足：

- 至少 100 条原始证据
- 至少 4 个平台来源
- 至少 5 个竞品/相关产品
- 至少 20 条差评或吐槽类证据
- 每个核心结论至少 3 条证据支撑
- 每条证据保留原文、链接和采集时间

## 8. 推荐下一步采集目标

优先补这几类真实评论：

1. 宠物摄像头差评：隐私、误报、一直看监控太累。
2. 智能项圈差评：续航、定位不准、订阅贵。
3. 老年宠监测：担心心率、呼吸、睡眠、活动异常。
4. 上班想宠物：宠物独自在家、主人焦虑。
5. 宠物内容分享：愿意为表情包、小剧场、桌宠皮肤付费。

