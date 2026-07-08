# PawSentinel Cloud & State Engine 后端架构白皮书 v1.0

版本：v1.0
日期：2026-07-08
文档类型：系统架构说明 / 技术白皮书
提交状态：可展示版本
关联文档：

- `docs/pawroom-ai-pet-collar-platform-prd-v0.4.md`
- `docs/pawroom-web-prototype-ia-ux-flow-v0.1.md`
- `docs/pawroom-web-lowfi-ux-wireflow-v0.1.md`
- `docs/pawroom-hifi-sample-data-and-states-v0.1.md`
- `docs/pawroom-software-prototype-development-plan-v0.1.md`

配套 Mock 数据：

- `data/pawroom-mock-collar-scenarios-v0.1.json`

---

## 1. 架构定位

PawSentinel Cloud & State Engine 是整套产品的“状态理解中枢”。它接收 Collar S1 或模拟项圈上报的遥测数据，把原始的活动、位置、电量、佩戴和生命趋势信号转换为安全等级、宠物状态、时间线事件、提醒事件和桌面动画指令。

该后端不是普通 CRUD 服务，而是一个面向宠物安全看护的实时状态平台：

| 能力层 | 成品职责 |
| --- | --- |
| Telemetry Ingestion | 接收智能项圈、Mock Collar Simulator 或第三方设备适配器数据 |
| Pet State Engine | 将原始遥测转化为 `safe / watch / attention` 安全状态 |
| Realtime Gateway | 通过 Socket.IO 驱动桌面宠物小世界实时变化 |
| Timeline Service | 记录今日活动、提醒、区域变化和用户补充事件 |
| Creation Studio | 处理宠物分身、记忆卡、表情包等低频 AI 创作任务 |
| Credits Ledger | 追踪 AI 创作额度、预估消耗、扣费和失败回滚 |

当前仓库实现的是可演示的软件 MVP：默认使用 memory mode 和 Mock Collar Simulator，保证无需 Docker、PostgreSQL 或 Redis 也能完整跑通演示链路；同时通过 Prisma、BullMQ、MQTT Adapter Stub 和模块化边界保留正式硬件接入能力。

## 2. 总结

PawSentinel 后端第一版按 **MVP + 两周验证** 设计。它的目标不是一开始做商业化完整后端，而是稳定支撑 Web 原型、全流程 Demo 和后续真实硬件/AI 接入验证。

默认技术决策：

- 主栈：`NestJS + Prisma + PostgreSQL`
- 实时通信：`Socket.IO`
- 异步任务：`BullMQ + Redis`
- 硬件接入：MVP 使用 Mock Collar Simulator，预留 MQTT / 第三方项圈 API Adapter
- AI 创作：不做每天自动生成内容，改为用户主动触发的“记忆工坊 / 单次创作”
- 用户体系：MVP 用匿名 Demo Session，正式账号体系放到两周验证后

核心原则：

> 高频看护不用大模型，低频创作用 AI。项圈数据先变成状态，再驱动桌面宠物分身动作；AI 只负责宠物分身、记忆创作和低频表达润色。

---

## 3. 后端边界

### 3.1 MVP 后端要解决什么

MVP 后端只解决 5 件事：

1. 给前端稳定返回宠物、设备、状态、时间线和创作相关数据。
2. 播放 4 套 Mock 项圈剧本：安静日、活跃日、等主人日、需关注日。
3. 把项圈原始数据转换成宠物状态、提醒等级和动画指令。
4. 通过 WebSocket 把状态实时推送给桌面小世界。
5. 模拟 Paw Credits 和记忆工坊的单次 AI 创作流程。

### 3.2 MVP 暂不解决什么

第一版明确不做：

- 真实硬件接入。
- 真实 AI 高频调用。
- 医疗诊断、疾病判断、医疗级生命体征承诺。
- 真实支付。
- 复杂多租户。
- 长期云端数据分析。
- 完整桌面端安装包。

这些能力只保留接口边界，不进入 2 天 Web 原型和两周验证的主路径。

---

## 4. 架构总览

后端采用模块化单体，不拆微服务。

```text
Frontend Web Prototype
  -> REST API
  -> Socket.IO Realtime Gateway

NestJS Backend
  -> Demo Session
  -> Pet Profile
  -> Collar Device
  -> Telemetry Ingestion
  -> Pet State Engine
  -> Room Scene
  -> Timeline
  -> Creation Studio
  -> Credits Ledger
  -> Settings & Privacy

Infrastructure
  -> PostgreSQL
  -> Redis
  -> BullMQ
  -> Object Storage later
```

### 3.1 核心数据流

```text
Mock/真实项圈数据
  -> TelemetryIngestion
  -> PetStateEngine
  -> PetStateSnapshot
  -> RoomScene 动画指令
  -> Socket.IO 推送前端
  -> Timeline 记录事件
```

### 3.2 AI 创作流

```text
用户选择照片/事件/路径片段
  -> CreationStudio 估算 Credits
  -> 创建 CreationJob
  -> BullMQ 异步处理
  -> 模板生成或 AI Provider
  -> 返回图片/漫画卡/短动画/角色卡
```

---

## 5. 模块设计

| 模块 | 责任 | MVP 做法 | 后续升级 |
| --- | --- | --- | --- |
| `DemoSession` | 匿名演示会话、场景选择 | 创建 demo session，绑定默认宠物和项圈 | 替换为真实账号体系 |
| `PetProfile` | 宠物档案、素材、分身风格 | 使用示例宠物和上传占位数据 | 接入真实上传、对象存储、AI 分身生成 |
| `CollarDevice` | 项圈设备、电量、连接状态 | 使用 `collar_demo_001` | 接入真实设备绑定、固件版本、保修状态 |
| `TelemetryIngestion` | 接收项圈原始数据 | 读取 Mock 剧本或接收 REST telemetry | 接 MQTT、第三方项圈 API、批量导入 |
| `PetStateEngine` | 原始数据转状态 | 规则引擎，不调用大模型 | 加入个体基线、轻量模型、异常置信度 |
| `RoomScene` | 输出桌面宠物分身动画指令 | 输出 `animationKey`、`zoneId`、`bubbleText` | 加入多房间、小游戏、桌面端小窗 |
| `Timeline` | 今日历程和事件 | 记录设备事件、用户补充、AI 演绎 | 支持周报、筛选、导出 |
| `RealtimeGateway` | 实时推送 | Socket.IO 推送状态和动画事件 | 支持桌面端、移动端、离线重连 |
| `CreationStudio` | 记忆工坊 | 模板生成单次创作结果 | 接 ComfyUI 或其他图像/视频生成服务 |
| `CreditsLedger` | AI 创作额度 | 模拟余额、预估、扣减、失败回滚 | 接真实支付、会员、订单 |
| `SettingsPrivacy` | 设置、隐私、医疗边界 | 提醒偏好、安全区、免责声明 | 家庭成员、多设备、多宠物隐私策略 |

---

## 6. 核心接口契约

### 5.1 REST API

| Method | Path | 用途 | MVP 返回 |
| --- | --- | --- | --- |
| `GET` | `/health` | 服务健康检查 | `{ "status": "ok" }` |
| `GET` | `/demo/scenarios` | 获取 4 套演示剧本 | 安静日、活跃日、等主人日、需关注日 |
| `POST` | `/demo/sessions` | 创建匿名演示会话 | `sessionId`、默认宠物、默认项圈 |
| `GET` | `/pets` | 获取当前会话宠物列表 | 示例宠物 |
| `POST` | `/pets` | 创建宠物档案 | MVP 返回 mock 宠物 |
| `POST` | `/pets/:petId/assets` | 上传宠物素材 | MVP 返回占位 asset |
| `POST` | `/devices/mock/connect` | 连接 mock 项圈 | 设备状态和电量 |
| `POST` | `/devices/:deviceId/telemetry` | 接收项圈样本 | 状态快照和事件 |
| `GET` | `/pets/:petId/state/latest` | 获取最新宠物状态 | `PetStateSnapshot` |
| `GET` | `/pets/:petId/timeline` | 获取今日历程 | 设备记录、用户补充、AI 演绎 |
| `POST` | `/interactions` | 记录桌面宠物分身互动 | 互动反馈和可选时间线事件 |
| `POST` | `/creations/estimate` | 估算记忆工坊消耗 | `creditCost` |
| `POST` | `/creations` | 创建单次创作任务 | `CreationJob` |
| `GET` | `/creations/:creationId` | 获取创作结果 | job 状态和结果 URL |
| `GET` | `/credits/balance` | 查询 Paw Credits | 当前余额和本次会话赠送额度 |
| `PATCH` | `/settings/notifications` | 更新提醒设置 | 更新后的设置 |

### 5.2 WebSocket Events

| Event | 方向 | 用途 |
| --- | --- | --- |
| `pet.state.updated` | Server -> Client | 宠物状态变化 |
| `pet.alert.created` | Server -> Client | 异常或需关注提醒 |
| `scene.animation.command` | Server -> Client | 桌面宠物分身动画指令 |
| `timeline.event.created` | Server -> Client | 今日历程新增事件 |
| `device.status.updated` | Server -> Client | 项圈连接、电量、离线状态 |
| `creation.job.updated` | Server -> Client | 记忆工坊任务状态 |

前端桌面小世界第一版只需要消费：

- `zoneId`
- `stateKey`
- `animationKey`
- `bubbleText`
- `safetyLevel`
- `confidence`

---

## 7. 数据结构

### 6.1 RawCollarSample

```ts
type RawCollarSample = {
  deviceId: string
  petId: string
  timestamp: string
  zoneId: 'sofa' | 'door' | 'bowl' | 'bed' | 'window' | 'toy_area'
  activityLevel: 'low' | 'medium' | 'high'
  motionHint?: 'still' | 'walking' | 'running' | 'pacing'
  heartRateTrend?: 'normal' | 'slightly_high' | 'slightly_low'
  respirationTrend?: 'normal' | 'slightly_high' | 'slightly_low'
  restingDurationTrend?: 'normal' | 'long' | 'short'
  battery: number
  confidence: number
}
```

### 6.2 PetStateSnapshot

```ts
type PetStateSnapshot = {
  petId: string
  stateKey:
    | 'sleeping'
    | 'resting'
    | 'walking'
    | 'waiting'
    | 'playing'
    | 'needs_attention'
    | 'offline'
  safetyLevel: 'safe' | 'watch' | 'attention'
  zoneId: string
  animationKey: string
  bubbleText: string
  source: 'device' | 'rule' | 'user' | 'ai'
  confidence: number
  disclaimer?: string
}
```

### 6.3 TimelineEvent

```ts
type TimelineEvent = {
  id: string
  petId: string
  timestamp: string
  title: string
  description: string
  zoneId?: string
  source: 'device' | 'rule' | 'user' | 'ai'
  severity: 'info' | 'watch' | 'attention'
  linkedSampleId?: string
}
```

### 6.4 CreationJob

```ts
type CreationJob = {
  id: string
  petId: string
  type: 'sticker_pack' | 'comic_card' | 'memory_card' | 'role_card' | 'short_clip'
  inputAssetIds: string[]
  inputEventIds: string[]
  creditCost: number
  status: 'queued' | 'running' | 'completed' | 'failed'
  resultUrls: string[]
}
```

### 6.5 CreditLedgerEntry

```ts
type CreditLedgerEntry = {
  id: string
  sessionId: string
  petId?: string
  reason:
    | 'demo_grant'
    | 'creation_estimate'
    | 'creation_charge'
    | 'creation_refund'
    | 'manual_adjustment'
  amount: number
  balanceAfter: number
  creationJobId?: string
  createdAt: string
}
```

---

## 8. PetStateEngine 规则

第一版不用大模型做实时判断，只用规则。

| 条件 | `stateKey` | `safetyLevel` | `animationKey` | 气泡方向 |
| --- | --- | --- | --- | --- |
| `zoneId=bed` 且 `activityLevel=low` | `sleeping` | `safe` | `sleep_idle` | 正在休息 |
| `zoneId=sofa` 且 `activityLevel=low` | `resting` | `safe` | `rest_on_sofa` | 沙发附近休息 |
| `zoneId=door` 且 `activityLevel=medium` | `waiting` | `watch` | `pace_near_door` | 门口停留，建议稍后看一眼 |
| `zoneId=toy_area` 且 `activityLevel=high` | `playing` | `safe` | `play_jump` | 玩具区活动 |
| `zoneId=bowl` 且 `activityLevel=medium` | `walking` | `safe` | `sniff_bowl` | 饭盆附近活动 |
| 任一区域且 `heartRateTrend` 或 `respirationTrend` 为 `slightly_high` | `needs_attention` | `watch` | `attention_idle` | 趋势略有波动 |
| 电量低于 15 | 保持原状态 | `attention` | `low_battery_idle` | 项圈电量低 |
| 长时间无样本 | `offline` | `attention` | `offline_idle` | 暂时无法获取项圈数据 |

医疗边界：

- 不返回“诊断”“疾病”“医疗级监测”等表达。
- 生命状态相关输出统一使用“趋势参考”“建议观察”“如持续异常请咨询兽医”。

---

## 9. Mock 剧本

Mock 剧本文件：`data/pawroom-mock-collar-scenarios-v0.1.json`

包含 4 套：

1. `quiet_day`：安静日，证明低干扰陪伴。
2. `active_day`：活跃日，证明桌面宠物分身动效和趣味互动。
3. `waiting_day`：等主人日，证明情绪价值。
4. `attention_day`：需关注日，证明安全看护付费理由。

使用方式：

- 前端可先直接读取 JSON。
- 后端实现后由 `GET /demo/scenarios` 返回剧本元信息。
- `POST /demo/sessions` 选择剧本后，后端按 3-5 秒间隔推送样本。
- 每条样本进入 `PetStateEngine`，再输出状态快照和动画指令。

---

## 10. 记忆工坊设计

原“每日自动记忆演绎”改为“记忆工坊 / 单次创作”。

原因：

- 大多数宠物每天没有足够多的高价值故事。
- 每天自动生成会造成内容疲劳。
- 高频 AI 生成会抬高成本。
- 用户在有纪念、分享、周边需求时，单次付费意愿更强。

MVP 支持的创作类型：

| 类型 | 触发方式 | Credits | MVP 生成方式 |
| --- | --- | --- | --- |
| `sticker_pack` | 选择宠物照片或状态动作 | 20 | 模板占位图 |
| `comic_card` | 选择 1-3 个事件 | 35 | 四格漫画文案 + 占位图 |
| `memory_card` | 选择一段今日历程 | 25 | 回忆卡文案 + 背景图 |
| `role_card` | 选择宠物档案 | 15 | 角色卡 |
| `short_clip` | 选择路径片段 | 60 | 短动画脚本，占位视频 |

Credits 原则：

- 安全看护不扣 Credits。
- 状态推送不扣 Credits。
- 基础桌面宠物分身互动不扣 Credits。
- 用户主动创建记忆内容才扣 Credits。
- 生成失败必须退回 Credits。

---

## 11. 可二创 GitHub 仓库选择

### 10.1 主后端骨架

| 仓库 | 地址 | 用法 | 判断 |
| --- | --- | --- | --- |
| NestJS TypeScript Starter | https://github.com/nestjs/typescript-starter | 最小 NestJS 起点 | 可作为工程初始化参考 |
| Prisma Examples | https://github.com/prisma/prisma-examples | 参考 Prisma + Nest REST API 示例 | 适合学习结构，不建议整仓 fork |
| Prisma | https://github.com/prisma/prisma | ORM、迁移、类型安全查询 | 作为依赖使用 |

建议：

- 不直接 fork 大模板。
- 用 NestJS CLI 或 starter 初始化自己的 `backend/`。
- Prisma schema 从 PawSentinel 领域模型开始写，不照搬示例。

### 10.2 实时通信

| 仓库 | 地址 | 用法 | 判断 |
| --- | --- | --- | --- |
| Socket.IO | https://github.com/socketio/socket.io | 状态、提醒、动画指令实时推送 | MVP 主选 |

建议：

- MVP 不需要复杂消息队列推送。
- `Socket.IO` 足够支撑 Web 原型和桌面端 Demo。

### 10.3 异步任务

| 仓库 | 地址 | 用法 | 判断 |
| --- | --- | --- | --- |
| BullMQ | https://github.com/taskforcesh/bullmq | 记忆工坊创作任务、失败重试、Credits 回滚 | MVP 可先接口预留，正式接 Redis 后启用 |

建议：

- 两天 Demo 可以先同步返回 mock 结果。
- 两周验证再接 BullMQ。

### 10.4 硬件数据接入

| 仓库 | 地址 | 用法 | 判断 |
| --- | --- | --- | --- |
| MQTT.js | https://github.com/mqttjs/MQTT.js | 未来接 MQTT 项圈或模拟 MQTT 设备 | 作为 adapter 依赖候选 |
| ThingsBoard | https://github.com/thingsboard/thingsboard | 参考 IoT 设备、遥测、规则引擎 | 只参考，不二创，太重 |
| EMQX | https://github.com/emqx/emqx | 未来 MQTT broker 参考 | 不作为 MVP 依赖，商业嵌入注意许可 |

建议：

- MVP 不搭真实 MQTT。
- 保留 `TelemetryAdapter` 接口。
- 真实硬件验证时优先做 MQTT PoC 或第三方 API adapter。

### 10.5 AI 图片和创作工作流

| 仓库 | 地址 | 用法 | 判断 |
| --- | --- | --- | --- |
| ComfyUI | https://github.com/comfyanonymous/ComfyUI | 宠物分身、漫画卡、风格图、短动画工作流参考 | GPL-3.0，建议独立部署或仅参考 |

建议：

- 不把 ComfyUI 代码合入 PawSentinel 主后端。
- 可把 ComfyUI 作为独立 AI Worker 或内部创作工具。
- PawSentinel 主后端只通过 `AiCreationProvider` 抽象调用外部服务。

---

## 12. 制作流程

### 阶段 1：契约和 Mock 数据

目标：

- 让前端不用等真实后端就能按真实接口设计。

任务：

- 固化 REST API 和 WebSocket event 名称。
- 使用 `data/pawroom-mock-collar-scenarios-v0.1.json` 作为前端临时数据源。
- 定义 `RawCollarSample`、`PetStateSnapshot`、`TimelineEvent`、`CreationJob`。

验收：

- 前端能根据 Mock 样本展示宠物位置、状态、气泡和提醒。

### 阶段 2：状态引擎和实时推送

目标：

- 让桌面小世界由数据驱动，而不是纯动画循环。

任务：

- 实现 `PetStateEngine` 规则映射。
- 按剧本播放样本。
- 推送 `pet.state.updated` 和 `scene.animation.command`。
- 异常提醒写入 Timeline。

验收：

- 切换 4 套剧本时，前端宠物动作、位置和提醒同步变化。

### 阶段 3：持久化和 Credits

目标：

- 让 Demo 从纯 mock 走向可验证产品逻辑。

任务：

- 用 Prisma + PostgreSQL 保存宠物、设备、样本、状态、时间线、创作任务、Credits 账本。
- 安全看护不扣 Credits。
- 记忆工坊估算、扣费、失败回滚闭环。

验收：

- 用户能看到 Credits 余额。
- 创作任务能扣费和返回结果。
- 失败任务能回滚。

### 阶段 4：记忆工坊

目标：

- 把 AI 从“每天自动生成”改成“用户主动生成高价值内容”。

任务：

- 实现 `POST /creations/estimate`。
- 实现 `POST /creations`。
- MVP 用模板结果，后续接 AI Provider。

验收：

- 用户选择照片/事件后可生成表情包、漫画卡、回忆卡或角色卡。

### 阶段 5：真实硬件预留

目标：

- 两周验证后能平滑接入真实设备。

任务：

- 保留 `TelemetryAdapter`。
- 保留 `POST /devices/:deviceId/telemetry`。
- 定义 MQTT topic 草案：`pawroom/devices/{deviceId}/telemetry`。
- 定义第三方项圈 API adapter 输入输出。

验收：

- 后端可同时接收 mock 样本和外部样本。
- 状态引擎不关心样本来自 mock、MQTT 还是第三方 API。

---

## 13. 测试计划

必须覆盖：

- `PetStateEngine` 单元测试：不同 zone、activity、vital trend 是否映射到正确状态。
- 异常提醒测试：长时间静止、门口徘徊、低电量、项圈断连。
- WebSocket 测试：模拟剧本播放时，前端能收到连续状态更新。
- Credits 测试：基础看护不扣费，创作任务预估后扣费，失败任务回滚。
- 医疗边界测试：任何 API 返回文案不得出现“诊断、疾病判断、医疗级监测”等表达。
- 数据来源测试：Timeline 事件必须区分 `device`、`rule`、`user`、`ai`。

---

## 14. 交付顺序建议

如果立刻开后端工程，建议按这个顺序：

1. 创建 `backend/`，初始化 NestJS。
2. 建立 `health`、`demo`、`pets`、`devices`、`state` 基础模块。
3. 读取 Mock JSON，先实现 `GET /demo/scenarios`。
4. 实现 `PetStateEngine` 纯函数。
5. 实现 `POST /devices/:deviceId/telemetry`。
6. 实现 Socket.IO Gateway。
7. 实现 Timeline 内存版。
8. 实现 CreationStudio mock 版。
9. 接 Prisma + PostgreSQL。
10. 接 BullMQ + Redis。

第一天后端目标：

- 前端能拿到剧本和最新状态。
- 桌面宠物分身能根据状态动起来。

第二天后端目标：

- WebSocket 能推送状态。
- Timeline 和记忆工坊 mock 能走通。

---

## 15. 风险与决策

| 风险 | 处理方式 |
| --- | --- |
| 一开始架构过重 | 模块化单体，不拆微服务 |
| AI 成本不可控 | 高频看护走规则，低频创作才用 AI |
| 用户误解为医疗产品 | 文案和接口都使用“趋势参考”，不使用诊断表达 |
| 第三方项圈 API 不开放 | MVP 用 mock，后续通过 adapter 接 MQTT 或可用 API |
| 室内定位不准 | 只表达“大概区域”，不承诺精准坐标 |
| ComfyUI 许可风险 | 独立部署或只参考，不合入主后端 |
| 每日自动内容疲劳 | 改为用户主动进入记忆工坊单次创作 |

---

## 16. 最终判断

PawSentinel 后端第一版不应该被设计成“大而全的 IoT + AI 平台”。它应该是一个稳定的产品验证后端：

- 用 Mock 数据证明项圈数据可以驱动桌面宠物分身。
- 用规则引擎证明状态理解不依赖高频大模型。
- 用 WebSocket 证明上班时桌面小世界可以实时变化。
- 用记忆工坊证明 AI 创作适合作为低频增值能力。
- 用 Credits 账本证明商业模式可以成立。

这样既能服务当前 Web 原型，也能为后续真实硬件和真实 AI 生成留下清晰入口。
