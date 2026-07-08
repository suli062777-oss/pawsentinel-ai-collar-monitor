# Phaser 仓库架构分析与 PawRoom 二创复用方案

版本：v0.1  
日期：2026-07-07  
分析对象：https://github.com/phaserjs/phaser  
关联项目：PawRoom 宠物项圈 + AI 安全看护桌宠平台

## 1. 总结判断

Phaser 不适合直接 fork 后改成 PawRoom。它是一个成熟的 HTML5 2D 游戏框架，不是桌宠应用模板。正确使用方式是：

> 在 PawRoom Web 原型中通过 npm 安装 Phaser，把 Phaser 作为“桌面宠物小世界”的 2D 场景引擎。

Phaser 最适合承担 PawRoom 的这些部分：

- 卡通家居地图渲染。
- 宠物电子分身移动与动画。
- 状态驱动的行为演绎。
- 用户点击互动，如摸摸、投喂、逗玩具。
- 轻小游戏，如饭盆补给、门口巡逻、纸箱迷宫。
- 今日小剧场的可播放时间线。

不建议 Phaser 承担：

- 项圈数据模拟器。
- AI 状态理解规则。
- Paw Credits 商业页面。
- 手机锁屏/灵动岛 UI。
- 后端或设备接入。

这些应由 React/TypeScript 普通业务层实现，再把状态传给 Phaser 场景。

## 2. 仓库基本信息

Phaser README 说明它是一个开源 HTML5 游戏框架，支持 WebGL 和 Canvas 渲染，可运行在桌面和移动 Web 浏览器中，也支持结合 React、Vue 等前端框架使用。

仓库关键信息：

- 当前 package 版本：4.2.1。
- License：MIT。
- 入口：`src/phaser.js`。
- 浏览器构建：`dist/phaser.js`。
- ESM 构建：`dist/phaser.esm.js`。
- TypeScript 类型：`types/phaser.d.ts`。
- 构建工具：webpack。
- 测试工具：vitest。
- 安装方式：`npm install phaser`。

这对 PawRoom 的意义：

- MIT 协议对商业原型更友好。
- 有 TypeScript 类型，适合 React + TypeScript 项目。
- 可直接作为依赖使用，不需要复制 Phaser 源码。

## 3. 顶层目录结构

Phaser 仓库的主要目录：

| 目录 | 作用 | PawRoom 是否需要关注 |
| --- | --- | --- |
| `.github` | GitHub 配置 | 不需要 |
| `changelog` | 版本变更记录 | 可查版本差异 |
| `config` | webpack 等构建配置 | 不需要直接改 |
| `dist` | 已构建浏览器版本 | npm 包会提供 |
| `docs` | 文档相关 | 可参考 |
| `scripts` | 构建、类型生成等脚本 | 不需要 |
| `skills` | AI agent 技能说明 | 可参考 Phaser 子系统用法 |
| `src` | Phaser 核心源码 | 理解架构用 |
| `tests` | 测试 | 不需要 |
| `types` | TypeScript 类型 | 使用时会依赖 |

结论：

PawRoom 不需要 fork 整个仓库。只需要在自己的原型项目中安装 Phaser，并阅读 `src` 模块和官方示例。

## 4. Phaser 核心架构

Phaser 的核心架构可以理解为：

```text
Game
  -> Scene
    -> Loader
    -> GameObjects
    -> Input
    -> Tweens
    -> Animations
    -> Physics
    -> Cameras
    -> Tilemaps
    -> Sound
```

对应 PawRoom：

```text
PawRoom App
  -> RoomScene
    -> 预加载宠物、房间、动效资源
    -> 渲染卡通房间
    -> 渲染宠物电子分身
    -> 接收项圈状态
    -> 播放宠物动作
    -> 响应点击互动
    -> 输出小剧场片段
```

## 5. `src` 目录模块分析

### 5.1 `src/core`

作用：

- Phaser 游戏实例、生命周期和配置核心。

PawRoom 复用方式：

- 创建一个 Phaser Game 实例，挂载到 React 的 `RoomSceneCanvas` 容器中。
- 不直接改核心源码。

建议：

- PawRoom 页面切换时要正确销毁 Phaser 实例，避免重复 canvas 和内存泄漏。

### 5.2 `src/scene`

作用：

- Scene 是 Phaser 的核心组织单元。
- 每个 Scene 拥有自己的资源加载、对象创建、更新循环和事件。

PawRoom 复用方式：

- `BootScene`：加载资源。
- `RoomScene`：主桌宠房间。
- `MiniGameScene`：后续轻小游戏。
- `StoryReplayScene`：今日小剧场回放。

建议 PawRoom 第一版只做一个 `RoomScene`，不要过早拆太多 Scene。

### 5.3 `src/loader`

作用：

- 加载图片、精灵图、音频、JSON、纹理图集等资源。

PawRoom 复用方式：

- 加载宠物 Sprite Sheet。
- 加载房间背景。
- 加载饭盆、狗窝、门口、沙发等道具。
- 加载表情气泡和状态图标。

### 5.4 `src/gameobjects`

作用：

- Phaser 的核心显示对象系统。
- 里面包含 Sprite、Image、Container、Text、Graphics、Particles、Zone 等。

PawRoom 可复用对象：

| GameObject | PawRoom 用途 |
| --- | --- |
| `Sprite` | 宠物角色、道具动画 |
| `Image` | 房间背景、家具、项圈图标 |
| `Container` | 宠物角色组合，如身体、表情、气泡 |
| `Text` | 状态文案、轻提醒 |
| `Graphics` | 画区域、路径线、数据脉冲 |
| `Zone` | 房间交互区域，如饭盆、门口、狗窝 |
| `Particles` | 开心、能量、状态变化粒子 |
| `PathFollower` | 宠物按路径移动 |
| `TileSprite` | 可循环背景或地板纹理 |

PawRoom 第一版重点用：

- `Image`
- `Sprite`
- `Container`
- `Text`
- `Zone`
- `Graphics`

### 5.5 `src/animations`

作用：

- 管理 Sprite Sheet 帧动画。

PawRoom 复用方式：

- 宠物 idle。
- 宠物 sleep。
- 宠物 walk。
- 宠物 run。
- 宠物 wait-at-door。
- 宠物 eating。
- 宠物 happy-after-touch。

建议：

- 第一版不要做复杂骨骼动画，用 Sprite Sheet 足够。
- 每个状态准备 4-8 帧小动画即可。

### 5.6 `src/tweens`

作用：

- 做属性补间动画，如移动、缩放、透明度、旋转。

PawRoom 复用方式：

- 宠物从狗窝走到门口。
- 宠物跳一下表示开心。
- 气泡淡入淡出。
- 数据流转成卡通路径时的过渡。
- 桌宠被点击后的反馈。

这是 PawRoom MVP 中最有价值的模块之一。

### 5.7 `src/input`

作用：

- 管理鼠标、触摸、键盘、手柄等输入。

PawRoom 复用方式：

- 点击宠物：摸摸。
- 点击饭盆：投喂。
- 点击玩具：逗玩具。
- 点击门口：查看等待事件。
- 悬停区域：显示状态说明。

手机 Web 原型也可以用触摸输入，但 MVP 不需要复杂手势。

### 5.8 `src/tilemaps`

作用：

- 管理瓦片地图。

PawRoom 复用方式：

- 如果要做“像素风家居地图”，可用 Tilemap。
- 如果做手绘卡通房间，直接背景图 + Zone 更快。

建议：

- MVP 不用 Tilemap，先用静态房间图和交互区域。
- 第二版如果做纸箱迷宫、家居地图编辑器，再引入 Tilemap。

### 5.9 `src/physics`

作用：

- Phaser 支持物理系统，包括 Arcade Physics 和 Matter.js。

PawRoom 复用方式：

- 轻小游戏中做碰撞。
- 宠物和玩具碰撞。
- 纸箱迷宫。
- 饭盆补给游戏。

建议：

- MVP 主桌宠不需要物理引擎。
- P1 轻小游戏可用 Arcade Physics。

### 5.10 `src/cameras`

作用：

- 管理 2D 摄像机、缩放、跟随、视口。

PawRoom 复用方式：

- 今日小剧场回放时镜头跟随宠物。
- 桌面小窗模式下固定缩放。
- 放大查看房间某个区域。

### 5.11 `src/filters` / `src/display`

作用：

- 滤镜、颜色、显示效果。

PawRoom 复用方式：

- 生命状态需关注时添加柔和光效。
- 宠物开心时添加暖色光。
- 夜间模式给房间降亮度。
- 像素风模式可用 pixelate 类效果。

### 5.12 `src/events` / `src/data`

作用：

- Phaser 内部事件和数据管理。

PawRoom 复用方式：

- 用事件把 React 状态传给 Phaser。
- Phaser 场景向 React 发出互动事件。
- 给宠物对象绑定当前状态数据。

建议：

- PawRoom 自己封装一个 `RoomEventBus`，避免 React 和 Phaser 互相直接依赖太深。

## 6. PawRoom 推荐二创架构

### 6.1 前端整体架构

```text
React App
  pages/
    HomePage
    PetCreatePage
    CollarDemoPage
    DesktopRoomPage
    MobileStatusPage
    StoryPage
    PawCreditsPage

  domain/
    CollarSimulator
    PetStateEngine
    BehaviorDirector
    StoryGenerator

  phaser/
    PhaserGameHost
    RoomScene
    PetSpriteController
    RoomZoneController
    InteractionController
```

### 6.2 Phaser 只管“场景表现”

Phaser 不要负责业务逻辑。它只接收已经计算好的状态：

```ts
type PetPresentationState = {
  zone: 'bed' | 'door' | 'bowl' | 'sofa' | 'window' | 'toy';
  activity: 'low' | 'medium' | 'high';
  animation: 'sleep' | 'walk' | 'run' | 'wait' | 'eat' | 'play';
  bubbleText: string;
  alertLevel: 'none' | 'attention';
};
```

这样 PawRoom 的安全看护逻辑、Paw Credits、手机端提醒都不会被 Phaser 绑死。

### 6.3 数据流

```text
Mock Collar Data
  -> Pet State Engine
  -> Behavior Director
  -> RoomEventBus
  -> Phaser RoomScene
  -> Sprite/Tween/Animation
```

反向交互：

```text
User clicks pet in Phaser
  -> RoomEventBus
  -> React Interaction Panel
  -> Update pet mood / story event
```

## 7. PawRoom 可直接复用的功能点

### 7.1 房间场景

用 Phaser 的 `Scene + Image + Container + Zone` 实现：

- 背景图作为房间。
- 家具作为静态 Image。
- 狗窝、饭盆、门口作为 Zone。
- 宠物作为 Sprite/Container。

### 7.2 宠物状态动画

用 `Sprite + animations + tweens` 实现：

- 睡觉。
- 巡逻。
- 等主人。
- 饭盆转圈。
- 玩耍。
- 状态需关注。

### 7.3 点击互动

用 `Input` 实现：

- 点击宠物 -> 摸摸。
- 点击饭盆 -> 投喂。
- 点击玩具 -> 逗玩具。
- 点击门口 -> 查看等待事件。

### 7.4 行动路径演绎

用 `Tweens + Graphics + PathFollower` 实现：

- 宠物从狗窝走到门口。
- 地图上画出今日路径。
- 回放今日小剧场。

### 7.5 轻小游戏

用 `Arcade Physics + Input + Tween` 实现：

- 饭盆补给。
- 门口巡逻。
- 纸箱迷宫。
- 玩具追逐。

但这属于 P1/P2，不建议 MVP 第一版就做。

## 8. 不建议复用/不适合 Phaser 做的部分

### 8.1 项圈数据面板

不适合用 Phaser。  
用 React + 图表库更快。

### 8.2 手机锁屏/灵动岛

不适合用 Phaser。  
用 HTML/CSS/Figma 模拟即可。

### 8.3 Paw Credits 页面

不适合用 Phaser。  
这是普通产品页面。

### 8.4 AI 文案生成

不适合放进 Phaser。  
放在 `StoryGenerator` 或后端服务中。

### 8.5 生命状态趋势判断

不适合放进 Phaser。  
由 `PetStateEngine` 处理，Phaser 只展示结果。

## 9. 推荐 MVP Phaser Scene 设计

### 9.1 `RoomScene`

职责：

- 加载房间和宠物资源。
- 创建家具和区域。
- 接收状态事件。
- 播放宠物动画。
- 处理用户点击。

### 9.2 `PetSpriteController`

职责：

- 管理宠物 Sprite。
- 切换动画。
- 执行移动。
- 显示气泡。

### 9.3 `RoomZoneController`

职责：

- 管理各区域坐标。
- 把 `zone=door` 映射到门口坐标。
- 处理区域点击。

### 9.4 `InteractionController`

职责：

- 摸摸。
- 投喂。
- 叫名字。
- 逗玩具。

## 10. 实施建议

### 10.1 第一版不要 fork Phaser

使用：

```bash
npm install phaser
```

在 Vite/React 项目中引入：

```ts
import Phaser from 'phaser';
```

### 10.2 资源先用占位

MVP 不要卡在宠物素材上：

- 房间先用一张背景图。
- 宠物先用 4-8 帧 Sprite Sheet。
- 动效先用 Tween 和少量粒子。

### 10.3 React 与 Phaser 解耦

React 管页面、数据和商业逻辑。  
Phaser 管房间、宠物和互动动画。

推荐通信方式：

- React -> Phaser：事件总线或 Scene 方法。
- Phaser -> React：事件回调。

### 10.4 首个技术验证目标

1. 加载房间背景。
2. 显示宠物 Sprite。
3. 点击按钮切换状态。
4. 宠物从狗窝移动到门口。
5. 显示气泡“我在门口等你”。
6. 点击宠物触发摸摸反馈。

这个跑通，就证明 Phaser 适合 PawRoom。

## 11. 结论

Phaser 对 PawRoom 的价值非常明确：它不是业务系统底座，而是“桌面宠物小世界”的表现层引擎。

最值得复用的架构：

- Scene：组织房间和回放。
- GameObjects：宠物、家具、气泡、路径。
- Animations：宠物动作。
- Tweens：移动和微动效。
- Input：点击互动。
- Cameras：小剧场回放和视角控制。
- Arcade Physics：后续轻小游戏。

最推荐的二创方式：

> React 做产品原型和数据平台，Phaser 做卡通宠物房间。项圈数据先进入 React 的状态引擎，再由状态引擎驱动 Phaser 场景变化。

参考资料：

- Phaser GitHub：https://github.com/phaserjs/phaser
- Phaser README：https://github.com/phaserjs/phaser/blob/master/README.md
- Phaser package.json：https://github.com/phaserjs/phaser/blob/master/package.json
- Phaser src：https://github.com/phaserjs/phaser/tree/master/src
- Phaser gameobjects：https://github.com/phaserjs/phaser/tree/master/src/gameobjects
- Phaser input：https://github.com/phaserjs/phaser/tree/master/src/input
- Phaser tweens：https://github.com/phaserjs/phaser/tree/master/src/tweens
- Phaser tilemaps：https://github.com/phaserjs/phaser/tree/master/src/tilemaps
- Phaser arcade physics：https://github.com/phaserjs/phaser/tree/master/src/physics/arcade

