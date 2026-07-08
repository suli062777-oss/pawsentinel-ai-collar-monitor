# PawRoom 首页视觉修正 v0.7：大胆色块与编辑式排版

日期：2026-07-07  
用途：在 v0.6 “上半状态场景、下半数据”的基础上，进一步提升首页的视觉冲击力和作品集呈现感。

---

## 1. 修正原因

v0.6 的信息结构已经成立，但视觉仍偏安全，整体像常规仪表盘。

v0.7 的目标是：

- 颜色更大胆；
- 排版更不对称；
- 状态区更像产品主视觉；
- 数据区更像有节奏的磁贴组；
- 首页更适合放进作品集和路演材料。

---

## 2. 视觉方向

关键词：

- 大面积橙色状态块；
- 明亮柠檬黄 / 奶油底；
- 鲜绿色操作按钮；
- 青蓝色场景岛；
- 深炭黑大字；
- 错位数据卡；
- 不规则圆角和图形容器；
- 编辑式产品界面。

---

## 3. 首页结构

保留原有 IA：

- 左侧任务栏不变；
- 上半部分：宠物状态 + 像素家庭场景；
- 下半部分：对应数据卡片；
- 无顶部全局栏；
- 无右侧抽屉栏。

但视觉表达更大胆：

- “正常 / 花花今日状态”成为第一视觉锚点；
- 像素场景放入不规则视觉岛，不再只是普通卡片；
- 数据卡不再等宽等高，改为大小、颜色、位置有变化的磁贴；
- 关键数字如 268、78%、92 bpm 可以放大；
- 橙、绿、黄、蓝用于明确分区，而不是只做小点缀。

---

## 4. 生成提示词关键词

```text
bold editorial product UI,
large vivid orange status block,
warm lemon yellow background,
lime green action button,
cyan pixel scene island,
deep charcoal typography,
asymmetric layout,
staggered metric tiles,
irregular rounded containers,
oversized status typography,
not a generic SaaS dashboard
```

---

## 5. 负面约束

```text
no pale safe dashboard,
no equal-size card grid,
no all-glass bland UI,
no beige-only palette,
no full-screen map,
no top navigation bar,
no right drawer,
no pixelated UI text,
no photorealistic pet,
no phone/tablet mockup
```

---

## 6. 本次输出资产

- `docs/assets/pawroom-hifi-v07-01-home-bold-editorial.png`

