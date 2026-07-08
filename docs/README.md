# PawSentinel Documentation Index

This folder contains the public-facing product, technical, design, research, and demo materials for **PawSentinel**, an AI pet safety monitoring system built around smart-collar telemetry, user-uploaded pet assets, AI-generated cartoon pixel avatars, and an interactive desktop companion world.

本目录是 PawSentinel 项目的公开文档入口，适合评审、协作者或后续开发者快速理解产品机会、软硬件方案、MVP 实现和验证材料。项目中的宠物分身来自用户上传的自家宠物照片、声音或素材图，再通过 AI 工作流转译为卡通化、像素化的专属形象。

## Submission Pack / 提交资料包

| 展示顺序 | 文档 | 评审看到的价值 |
| --- | --- | --- |
| 1 | [最新产品报告](./pawroom-ai-pet-collar-platform-prd-v0.4.md) | 完整说明机会判断、目标用户、产品链路、MVP 与商业模式 |
| 2 | [硬件设计](./pawroom-collar-hardware-design-v0.1.md) | 展示 Collar S1 的器件选型、结构堆叠、固件和数据链路 |
| 3 | [后端架构](./pawroom-backend-architecture-and-reuse-plan-v0.1.md) | 展示状态引擎、实时推送、AI 创作队列和 Credits 架构 |
| 4 | [前端集成 API](./pawroom-frontend-integration-api-v0.1.md) | 展示前后端联调契约、REST API 和 Socket.IO 事件 |
| 5 | [设计系统](./pawroom-design-system-v0.1.md) | 展示高端、低干扰、可信任的视觉和交互规范 |
| 6 | [竞争对手分析](./pawroom-competitor-analysis.md) | 证明不正面重复摄像头/GPS/医疗项圈，而是做数据解释层 |
| 7 | [用户证据报告](./pawroom-user-evidence-report.md) | 用 331 条证据支撑安全焦虑、隐私压力和付费可能性 |
| 8 | [GitHub 项目简介](./github-project-profile.md) | 提供 About、Topics、Social Preview 和提交口径 |
| 9 | [提交前文档成熟度审查](./pawsentinel-submission-readiness-audit.md) | 检查核心文档是否达到成熟产品展示风格 |

Demo assets:

- `assets/showcase/`: GitHub README and presentation visuals
- `assets/demo/pawsentinel-product-demo.mp4`: product demo video

## Product Strategy / 产品方案

- `pawroom-ai-pet-collar-platform-prd-v0.4.md`: latest full PRD
- `pawroom-core-positioning-addendum-v0.2.md`: core positioning and product narrative
- `pawroom-ai-pet-desktop-world-prd.md`: desktop pet world concept
- `pawroom-software-prototype-development-plan-v0.1.md`: software prototype plan
- `github-project-profile.md`: GitHub About description, topics, and naming rules

## Hardware / 智能项圈

- `pawroom-collar-hardware-design-v0.1.md`: smart collar product design
- `pawroom-collar-hardware-deliverables-v0.1.md`: hardware deliverables
- `pawroom-collar-imagegen-prompts-v0.1.md`: collar concept visual prompts

## Backend And API / 后端与接口

- `pawroom-backend-architecture-and-reuse-plan-v0.1.md`: backend architecture and reuse plan
- `pawroom-frontend-integration-api-v0.1.md`: REST and Socket.IO integration guide
- `pawroom-pixel-avatar-kit-architecture-v0.1.md`: pixel avatar and visual studio backend flow

## Frontend And Design / 前端与设计

- `pawroom-design-system-v0.1.md`: visual and interaction design system
- `pawroom-web-prototype-ia-ux-flow-v0.1.md`: web prototype information architecture and UX flow
- `pawroom-hifi-sample-data-and-states-v0.1.md`: high-fidelity sample states
- `pawroom-hifi-sample-data-and-states-v0.2-pixel.md`: pixel-style sample states

## Evidence And Research / 用户证据与竞品

- `pawroom-competitor-analysis.md`: competitor and market analysis
- `pawroom-user-evidence-report.md`: user evidence report
- `pawroom-prd-user-evidence-addendum.md`: PRD evidence addendum
- `pawroom-xhs-evidence-addendum.md`: Xiaohongshu evidence addendum
- `pawroom-evidence-pipeline-guide.md`: evidence collection pipeline notes

## Demo And Media / 展示素材

- `assets/showcase/`: selected public showcase images for GitHub and presentations
- `assets/demo/`: product demo video assets
- `assets/frontend-screenshots-v0.14/`: latest frontend screenshot set
- `pawroom-30s-concept-ad-script-prompts-v0.1.md`: 30-second concept ad script and prompts
- `pawroom-main-framework-image-to-frontend-map-v0.1.md`: image-to-frontend mapping notes

## Repository Naming Note / 仓库命名说明

The public product name is **PawSentinel**. Some repository file names keep the historical `pawroom-` prefix for link compatibility, while the submission-facing content and product positioning use PawSentinel consistently.

最终公开产品名统一为 **PawSentinel**。仓库内部分文件名保留历史 `pawroom-` 前缀是为了兼容已有链接和代码引用；提交展示时以 PawSentinel 的产品口径为准。
