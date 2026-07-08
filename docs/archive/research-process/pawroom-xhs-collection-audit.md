# PawRoom 小红书采集审计记录

## 当前状态

- 已尝试访问小红书搜索页：`宠物独自在家 上班 想狗 宠物摄像头`
- 公开 HTML 可访问，但搜索结果由前端动态请求加载。
- 未登录状态下，小红书返回“登录后查看搜索结果”。
- 因此当前没有把该页面计入用户证据样本。

## 已生成工具

- `scripts/start_xhs_research_browser.ps1`
  - 打开带远程调试端口的 Chrome/Edge。
  - 用于用户正常登录后采集当前可见小红书页面。

- `scripts/xhs_cdp_capture.py`
  - 连接本地浏览器调试端口。
  - 抽取当前可见帖子卡片/帖子详情文本。
  - 保存页面截图。
  - 输出可被主证据管线导入的 CSV/JSON。
  - 如果识别到登录墙，只写入 audit，不写入 raw evidence。

- `data/evidence/tasks/xhs_keyword_tasks.csv`
  - 小红书关键词采集任务表。

- `docs/pawroom-xhs-research-protocol.md`
  - 小红书采集协议、字段、质量标准和 PRD/PPT 使用方式。

## 已生成审计文件

- `data/evidence/audit/xhs_access_gate_capture_20260707-163356.csv`
- `data/evidence/audit/xhs_access_gate_capture_20260707-163356.json`
- `data/evidence/audit/xhs-access-gate-20260707-163651.json`
- `data/evidence/raw/xhs_screenshots/xhs-visible-20260707-163356.png`
- `data/evidence/raw/xhs_screenshots/xhs-visible-20260707-163650.png`

## 为什么不能算完成

本次目标是采集“小红书平台中与 PawRoom 需求点相关的用户评价或帖子截图”。当前只证明了：

- 搜索入口能打开。
- 未登录状态被平台限制。
- 采集工具可以截图和抽取当前可见页面。

但还没有拿到真实帖子/评论内容。因此不能把小红书证据计入用户研究结论。

## 下一步

1. 运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\start_xhs_research_browser.ps1 -Keyword "宠物独自在家 上班 想狗 宠物摄像头" -Port 9222 -Browser chrome
```

2. 在打开的浏览器里正常登录小红书。

3. 搜索 `data/evidence/tasks/xhs_keyword_tasks.csv` 里的关键词，并滚动到帖子列表或打开帖子详情。

4. 运行：

```powershell
& 'C:\Users\27235\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\xhs_cdp_capture.py --port 9222
```

5. 复跑：

```powershell
& 'C:\Users\27235\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\pawroom_evidence_pipeline.py
```

