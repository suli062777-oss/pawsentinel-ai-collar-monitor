# PawRoom 主框架图片到前端映射表 v0.1

## 目标

把 `宠物项圈产品web库/主框架页面` 中的 8 张高保真图，映射到当前前端路由和后续还原任务。此表用于后续逐页对齐结构、比例、层级、留白、圆角和视觉氛围，避免把页面改成通用后台样式。

## 尺寸基准

- 源图尺寸：`1487 x 1058`
- 前端舞台：`1440 x 1024`
- 建议处理：源图按比例缩放到前端舞台后再取坐标，不能直接使用源图像素坐标。
- 统一舞台：左侧任务栏 + 右侧主内容区，不新增顶部全局栏，不新增右侧固定抽屉。

## 文件映射

| 源文件 | 推测页面 | 当前路由 | 匹配证据 | 还原优先级 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `download.png` | 首页 | `?page=home` | 与 `home-approved.png` 相似度最高，几乎一致 | P0 | 已作为首页方向基准 |
| `ig_0e69fda358d5d0c3016a4d2f6de95c819ba6276808d9c8003c.png` | 桌面小世界 | `?page=world` | 与 `desktop-world-reference.png` 相似度最高，几乎一致 | P0 | 场景资产后续需要 image2 透明/高清拆件 |
| `ig_043065535cec59a2016a4d0dad0c20819889fcdd6bfd3eefef.png` | 添加宠物/宠物信息候选 | `?page=create` 或 `?page=profile` | 与当前 create/profile/settings 截图接近 | P1 | 需要人工看图最终命名 |
| `ig_04a5390c179cdb57016a4d0ceff9888198a18870b771008990.png` | 宠物信息/设置候选 | `?page=profile` 或 `?page=settings` | 与当前 profile/settings 截图接近 | P1 | 需要人工看图最终命名 |
| `ig_04c7e06b8c81b823016a4d0e506818819bbc1f6eecf9f05abf.png` | 宠物信息/添加宠物候选 | `?page=profile` 或 `?page=create` | 与当前 profile/create 截图接近 | P1 | 需要人工看图最终命名 |
| `ig_0b75fdbf229d548d016a4d0c541f6c819a8b03d3fce3f5c22f.png` | 设置候选 | `?page=settings` | 与当前 settings 截图最接近 | P1 | 优先按设置页检查 |
| `ig_0513e113444dc996016a4d2be4500c819984acd0f8170241cc.png` | 电量候选 | `?page=battery` | 与当前 battery 截图最接近 | P1 | 可先对齐电量主卡 |
| `ig_04f6ad2d27d745f8016a4d0b8be5d0819987ce306735f944b0.png` | 今日历程/宠物数据候选 | `?page=journey` 或 `?page=data` | 与 battery/journey/data 距离接近，需人工判定 | P1 | 建议人工查看后锁定 |

## 当前确认度

- 已确认：首页、桌面小世界。
- 高概率：设置、电量。
- 待人工复核：宠物数据、今日历程、添加宠物、宠物信息。

## 后续动作

1. 先用总览图人工确认 8 张源图的最终页面命名。
2. 将确认后的文件复制或软映射到 `frontend/assets/reference/main-framework/` 下的语义化文件名。
3. 每次只选 1-2 个页面做精修，避免全局样式互相污染。
4. 每轮精修后生成 `1440 x 1024` 截图和 contact sheet。
5. 如发现 CSS 绘制无法还原的像素宠物/房间/道具，列入 image2 透明素材清单。