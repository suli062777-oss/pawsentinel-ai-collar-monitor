# PawSentinel Documentation Index

This folder is the public documentation entry for **PawSentinel**, an AI pet safety monitoring system built around smart-collar telemetry, user-uploaded pet assets, AI-generated cartoon or pixel avatars, and an interactive desktop companion world.

本目录是 PawSentinel 的公开项目文档入口。主路径只保留最终提交、产品架构、软硬件说明、MVP 接口、设计系统、竞品分析和用户证据；早期草稿、生成提示词、前端还原日志和采集脚本已经降级到 `archive/`，避免评审阅读路径被过程材料打散。

## Start Here / 快速阅读路径

| Order | Document | Purpose |
| --- | --- | --- |
| 1 | [Product Report](./pawroom-ai-pet-collar-platform-prd-v0.4.md) | Opportunity, target users, product loop, MVP scope, business model, and validation plan. |
| 2 | [Collar Hardware Architecture](./pawroom-collar-hardware-design-v0.1.md) | Collar S1 components, sensors, structure, firmware, power, data, and validation plan. |
| 3 | [Backend Architecture](./pawroom-backend-architecture-and-reuse-plan-v0.1.md) | Telemetry ingestion, state engine, realtime events, AI creation jobs, and credits model. |
| 4 | [Frontend Integration API](./pawroom-frontend-integration-api-v0.1.md) | REST and Socket.IO contracts consumed by the web prototype. |
| 5 | [Design System](./pawroom-design-system-v0.1.md) | Visual and interaction rules for a calm, premium, safety-oriented pet monitoring product. |
| 6 | [Pixel Avatar Kit](./pawroom-pixel-avatar-kit-architecture-v0.1.md) | How uploaded pet photos/assets are translated into cartoon or pixel-style pet avatars. |
| 7 | [Competitive Landscape](./pawroom-competitor-analysis.md) | Why PawSentinel is positioned as a data interpretation and companion layer, not another camera/GPS tracker. |
| 8 | [User Evidence Report](./pawroom-user-evidence-report.md) | Processed evidence supporting safety anxiety, camera fatigue, and willingness to pay. |
| 9 | [GitHub Project Profile](./github-project-profile.md) | Copy-ready GitHub About text, topics, naming rules, and presentation guidance. |
| 10 | [Submission Readiness Audit](./pawsentinel-submission-readiness-audit.md) | Final checklist for whether the repo reads like a polished product submission. |

## Demo Assets / 展示素材

- `assets/showcase/`: selected images used by the GitHub README and presentations.
- `assets/demo/pawsentinel-product-demo.mp4`: product demo video.
- `assets/frontend-screenshots-v0.14/`: latest frontend screenshot set only.
- `assets/pawroom-collar-concept-v01-*.png`: retained hardware concept colorways.

## Current Public Document Set

### Product And Business

- `pawroom-ai-pet-collar-platform-prd-v0.4.md`
- `pawroom-competitor-analysis.md`
- `pawroom-user-evidence-report.md`
- `pawsentinel-submission-readiness-audit.md`

### Hardware

- `pawroom-collar-hardware-design-v0.1.md`
- `pawroom-collar-hardware-deliverables-v0.1.md`

### Software And AI

- `pawroom-backend-architecture-and-reuse-plan-v0.1.md`
- `pawroom-frontend-integration-api-v0.1.md`
- `pawroom-pixel-avatar-kit-architecture-v0.1.md`

### Design And Repository Profile

- `pawroom-design-system-v0.1.md`
- `github-project-profile.md`

## Archive Policy / 归档策略

`archive/` keeps useful working notes without placing them on the public submission path:

- `archive/product-iterations/`: early product ideas, old PRD versions, and planning notes.
- `archive/design-process/`: IA, low-fidelity flow, design iteration notes, and technical design explorations.
- `archive/frontend-restoration/`: frontend restoration plans and implementation logs.
- `archive/media-prompts/`: image/video generation prompts and visual generation logs.
- `archive/research-process/`: evidence collection protocols and intermediate research notes.
- `archive/evidence-scripts/`: research and evidence helper scripts moved out of the top-level repo.

Heavy exploratory screenshots, obsolete contact sheets, old frontend screenshot versions, and unused generated visual batches were removed from the current tree. The public branch now keeps only the assets needed to understand, run, and evaluate the MVP.

## Naming Note / 命名说明

The public product name is **PawSentinel**. Some file names still keep the historical `pawroom-` prefix for link compatibility and continuity, but the product positioning, README, and submission-facing copy should be read as PawSentinel.
