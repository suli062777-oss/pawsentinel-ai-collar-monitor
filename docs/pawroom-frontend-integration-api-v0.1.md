# PawSentinel Frontend Integration API v1.0

文档类型：前端集成契约 / REST + Socket.IO API 说明
提交状态：可展示版本
适用对象：桌面宠物小世界、Web 原型、移动端轻提醒 Demo

## 0. 接口体系摘要

PawSentinel 前端不直接消费原始项圈传感器数据，而是消费后端状态引擎输出的“产品级状态”：宠物状态、安全等级、当前位置、动画指令、时间线事件、设备状态和 AI 创作任务状态。

这使前端可以像渲染一个实时宠物小世界一样工作，而不是像传统监控系统那样处理复杂硬件数据。前端只需要关注：

| 前端关心的对象 | 后端输出 |
| --- | --- |
| 宠物当前在做什么 | `PetStateSnapshot.stateKey` |
| 是否安全 | `safetyLevel: safe / watch / attention` |
| 在家的哪个区域 | `zoneId` 和 `confidence` |
| 桌面宠物分身怎么动 | `scene.animation.command` |
| 是否需要提醒用户 | `pet.alert.created` |
| 今日发生了什么 | `timeline.event.created` |
| AI 创作是否完成 | `creation.job.updated` |

## 1. 主链路

本文档给前端原型联调用，目标是跑通 PawSentinel 的第一条主链路：

```text
创建 Demo Session
-> 选择项圈剧本
-> 播放模拟项圈数据
-> 前端桌面小世界接收状态与动画
-> 用户主动触发记忆工坊创作
```

## 2. 运行方式

默认建议前端先接 memory mode：

```bash
cd backend
npm run build
npm run start
```

默认地址：

- REST API: `http://localhost:4000`
- Socket.IO: `http://localhost:4000`

前端本阶段不用依赖真实 Postgres、Redis 或真实项圈。

## 3. 推荐联调顺序

1. `GET /health`
2. `GET /demo/scenarios`
3. `POST /demo/sessions`
4. Socket.IO 连接并发送 `demo.session.join`
5. `POST /demo/sessions/:sessionId/playback`
6. 前端消费 `pet.state.updated` 和 `scene.animation.command`
7. `POST /creations/estimate`
8. `POST /creations`
9. `GET /credits/balance?sessionId=...`

## 4. REST API

### Health

`GET /health`

用途：确认后端已启动。

返回示例：

```json
{
  "status": "ok"
}
```

### 场景列表

`GET /demo/scenarios`

用途：获取 4 套模拟项圈剧本，前端可作为演示入口。

返回字段：

- `scenarioId`: 场景 ID
- `name`: 场景名
- `purpose`: 场景用途
- `recommendedPlaybackSeconds`: 推荐播放时长
- `sampleCount`: 样本数量

当前场景：

- `quiet_day`: 安静日
- `active_day`: 活跃日
- `waiting_day`: 等主人日
- `attention_day`: 需关注日

### 创建 Demo Session

`POST /demo/sessions`

请求：

```json
{
  "scenarioId": "attention_day"
}
```

返回关键字段：

```json
{
  "sessionId": "demo_xxx",
  "scenarioId": "attention_day",
  "pet": {
    "petId": "pet_coco_demo",
    "name": "花花 Coco",
    "type": "dog"
  },
  "device": {
    "deviceId": "collar_demo_001",
    "connected": true,
    "battery": 78
  },
  "credits": 100
}
```

前端需要保存 `sessionId`，后续 REST 和 Socket.IO 都用它隔离演示房间。

### 播放剧本

`POST /demo/sessions/:sessionId/playback`

请求：

```json
{
  "includeFirst": false
}
```

用途：把当前 session 对应剧本里的项圈样本依次转成状态，并推送 WebSocket 事件。

返回关键字段：

```json
{
  "sessionId": "demo_xxx",
  "scenarioId": "attention_day",
  "playedSampleCount": 4,
  "snapshots": [
    {
      "petId": "pet_coco_demo",
      "stateKey": "needs_attention",
      "safetyLevel": "watch",
      "zoneId": "door",
      "animationKey": "attention_pace",
      "bubbleText": "门口活动和状态趋势同时有波动，建议打开详情看一下。",
      "confidence": 0.66,
      "battery": 21
    }
  ]
}
```

### 手动上报一条项圈数据

`POST /devices/:deviceId/telemetry`

请求：

```json
{
  "sessionId": "demo_xxx",
  "petId": "pet_coco_demo",
  "timestamp": "2026-07-07T14:25:00+08:00",
  "zoneId": "door",
  "activityLevel": "medium",
  "motionHint": "pacing",
  "heartRateTrend": "slightly_high",
  "respirationTrend": "normal",
  "restingDurationTrend": "normal",
  "battery": 21,
  "confidence": 0.66
}
```

允许值：

- `zoneId`: `sofa | door | bowl | bed | window | toy_area`
- `activityLevel`: `low | medium | high`
- `motionHint`: `still | walking | running | pacing`
- `heartRateTrend` / `respirationTrend`: `normal | slightly_high | slightly_low`
- `restingDurationTrend`: `normal | long | short`
- `battery`: `0-100`
- `confidence`: `0-1`

非法值会返回 `400`，不会生成状态，也不会污染时间线。

### 查询最新状态

`GET /pets/:petId/state/latest`

用途：页面刷新后补一次当前宠物状态。

### 查询时间线

`GET /pets/:petId/timeline`

用途：渲染今日历程列表。

### 基础互动

`POST /interactions`

请求：

```json
{
  "petId": "pet_coco_demo",
  "action": "pat"
}
```

支持的 `action`：

- `pat`
- `feed`
- `call_name`
- `toy`

返回里 `consumesCredits` 固定为 `false`。

### Credits 余额

`GET /credits/balance?sessionId=demo_xxx`

说明：

- 安全看护、状态推送、基础互动不消耗 Paw Credits
- 只有用户主动创作记忆内容时才消耗
- 余额为 `0` 不会自动重置

### 记忆工坊估算

`POST /creations/estimate`

请求：

```json
{
  "type": "comic_card"
}
```

支持的 `type`：

- `sticker_pack`
- `comic_card`
- `memory_card`
- `role_card`
- `short_clip`

### 创建记忆内容

`POST /creations`

请求：

```json
{
  "sessionId": "demo_xxx",
  "petId": "pet_coco_demo",
  "type": "comic_card",
  "inputAssetIds": [],
  "inputEventIds": ["timeline_xxx"]
}
```

返回：

```json
{
  "id": "creation_xxx",
  "petId": "pet_coco_demo",
  "type": "comic_card",
  "creditCost": 35,
  "status": "completed",
  "resultUrls": ["/mock-creations/comic_card/creation_xxx.png"],
  "balanceAfter": 65
}
```

失败策略：

- 扣费后如果队列失败，后端会自动退款
- 创作任务会保存为 `failed`
- WebSocket 会广播 `creation.job.updated`
- 前端可显示“生成失败，Credits 已退回”

## 5. Socket.IO

连接后先加入当前 demo session：

```ts
socket.emit('demo.session.join', { sessionId })
```

### `pet.state.updated`

用途：更新宠物当前状态。

核心字段：

- `stateKey`: `sleeping | resting | walking | waiting | playing | needs_attention | offline`
- `safetyLevel`: `safe | watch | attention`
- `zoneId`: 房间区域
- `animationKey`: 前端动画 key
- `bubbleText`: 气泡文案
- `battery`
- `confidence`

### `scene.animation.command`

用途：驱动桌面小世界动画。

前端第一版只需要消费：

```json
{
  "petId": "pet_coco_demo",
  "zoneId": "door",
  "stateKey": "needs_attention",
  "animationKey": "attention_pace",
  "bubbleText": "门口活动和状态趋势同时有波动，建议打开详情看一下。",
  "safetyLevel": "watch",
  "confidence": 0.66
}
```

### `timeline.event.created`

用途：追加今日历程。

### `pet.alert.created`

用途：渲染轻提醒或高提醒。只有 `watch` / `attention` 事件会触发。

### `device.status.updated`

用途：更新项圈连接、电量、最后同步时间。

### `creation.job.updated`

用途：更新记忆工坊任务状态。

## 6. 前端映射建议

`zoneId` 到房间地图：

- `bed`: 宠物窝
- `sofa`: 沙发
- `door`: 门口
- `bowl`: 饭盆
- `window`: 窗边
- `toy_area`: 玩具区

`animationKey` 第一版可先映射为静态/轻动效：

- `sleep_idle`: 睡觉呼吸
- `rest_on_sofa`: 沙发趴着
- `walk_slow`: 慢走
- `pace_near_door`: 门口徘徊
- `sit_near_door`: 门口坐着
- `toy_chase`: 追玩具
- `play_jump`: 跳跃
- `sniff_bowl`: 闻饭盆
- `look_window`: 看窗外
- `attention_idle`: 关注待机
- `attention_pace`: 关注徘徊
- `long_rest_idle`: 久卧提醒
- `low_battery_idle`: 低电量提醒

## 7. 前端最小接入代码示意

```ts
const apiBase = 'http://localhost:4000';

const scenarios = await fetch(`${apiBase}/demo/scenarios`).then((res) => res.json());
const session = await fetch(`${apiBase}/demo/sessions`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ scenarioId: scenarios[0].scenarioId }),
}).then((res) => res.json());

socket.emit('demo.session.join', { sessionId: session.sessionId });
socket.on('scene.animation.command', (command) => {
  // command.zoneId -> move pet in room map
  // command.animationKey -> play animation
  // command.bubbleText -> show bubble
});

await fetch(`${apiBase}/demo/sessions/${session.sessionId}/playback`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ includeFirst: false }),
});
```

## 8. 当前边界

- 第一版不接真实项圈。
- 第一版不做高频 AI 调用。
- 项圈数据只表达“大概区域”和“状态趋势”。
- 生命状态只做看护提醒，不做医疗诊断。
- 记忆工坊当前返回 mock result URL，后续再接真实图像/视频生成服务。
