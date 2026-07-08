# PawSentinel Collar S1 硬件资料包索引 v0.2

日期：2026-07-08
对象：课程/比赛评审、产品汇报、后续硬件工程协作
定位：PawSentinel Collar S1 智能项圈的公开硬件说明资料包。

## 1. 核心交付

- [PawSentinel Collar S1 硬件产品架构说明](./pawroom-collar-hardware-design-v0.1.md)
  详细说明智能项圈的产品定位、系统组成、核心器件、传感器链路、结构堆叠、电源、通信、固件和验证计划。

- [硬件概念图提示词](./pawroom-collar-imagegen-prompts-v0.1.md)
  用于继续生成项圈 CMF、结构细节、充电底座和展示图。

- [GitHub Showcase 展示图](./assets/showcase/)
  包含桌面端实物场景、项圈概念图、软件页面总览和像素宠物素材。

## 2. 硬件架构摘要

PawSentinel Collar S1 采用“外侧主控舱 + 内侧柔性传感窗 + 可替换项圈带 + 磁吸充电底座”的结构。

核心架构：

| 模块 | 选型 / 技术 | 作用 |
| --- | --- | --- |
| 蜂窝 + GNSS | Nordic nRF9160-SICA | LTE-M / NB-IoT / GNSS 定位与远程回传 |
| BLE + 低功耗控制 | Nordic nRF52840 | BLE 绑定、传感器调度、本地状态机 |
| 运动识别 | Bosch BMI270 | 静止、走动、奔跑、睡眠、异常活动识别 |
| 生命趋势 | MAX30101 / MAX86141 + TMP117 | 静息心率、呼吸、皮温趋势参考 |
| 佩戴检测 | AD7147 + 接触电极 | 判断项圈佩戴和传感窗贴合质量 |
| 电源 | 420mAh LiPo + BQ25120A + MAX17048 | 充电、电源路径、电量估算 |
| 安全身份 | ATECC608B | 设备证书、TLS 私钥、防伪绑定 |

## 3. 对外介绍口径

可直接用于 PPT：

> PawSentinel Collar S1 是 PawSentinel 系统的数据入口。它通过运动传感、定位、佩戴检测、电量管理和非医疗生命趋势采集，判断宠物当前的安全状态和活动区域；后端状态引擎再将这些数据转译为桌面端可互动的宠物小世界、轻提醒和今日历程。项圈不承担医疗诊断，而是提供低干扰、高可理解度的日常安全看护。

## 4. 硬件视觉素材

- 深棕色项圈概念图：[pawroom-collar-concept-v01-deep-brown.png](./assets/pawroom-collar-concept-v01-deep-brown.png)
- 暖白色项圈概念图：[pawroom-collar-concept-v01-warm-white.png](./assets/pawroom-collar-concept-v01-warm-white.png)
- 纯白色项圈概念图：[pawroom-collar-concept-v01-pure-white.png](./assets/pawroom-collar-concept-v01-pure-white.png)
- 三色对比图：[pawroom-collar-concept-v01-colorways-contact-sheet.png](./assets/pawroom-collar-concept-v01-colorways-contact-sheet.png)
- GitHub 展示用棕色项圈：[smart-collar-brown-concept.png](./assets/showcase/smart-collar-brown-concept.png)
- GitHub 展示用白色传感细节：[smart-collar-white-sensor-detail.png](./assets/showcase/smart-collar-white-sensor-detail.png)

## 5. 汇报顺序建议

1. 先讲产品问题：传统监控视频冷，宠物状态数据难理解。
2. 再讲硬件定位：项圈是安全看护数据入口，不是医疗设备。
3. 展示硬件架构：主控、通信、传感器、电源、结构。
4. 展示软件联动：项圈数据驱动桌面宠物分身和安全提醒。
5. 明确边界：生命数据为趋势提醒，不做诊断，不承诺医疗级监测。

## 6. 后续可补材料

- S1 主板方框图
- 结构爆炸图
- 传感窗剖面图
- 磁吸充电底座图
- EVT / DVT / PVT 测试记录表
- 20 台 Alpha 样机 BOM 成本表
