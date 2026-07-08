# PawRoom 桌面小世界 P0 image2 素材提示词 v0.1

## 使用方式

这些提示词用于生成透明底单件素材或无 UI 背景素材。生成后建议放入：

```text
frontend/assets/generated/world/
```

再把路径填入 `frontend/src/app.js` 的 `worldGeneratedAssets` 对应 key。

## 统一要求

- 2D pixel art。
- 暖木色室内光源。
- 品牌橙 `#FF8F3F` 只作为小面积识别色。
- 不包含中文、英文、UI 卡片、图标、水印。
- 边缘干净，适合叠加在 DOM/SVG UI 下。
- 透明素材输出 PNG/WebP，长边至少 1024px。

## 01 客厅背景

前端 key：`sceneBackground`

```text
生成 PawRoom 桌面宠物小世界的 2D pixel art 客厅背景，横向 1440x1024 构图，温暖木地板，窗边自然光，左侧沙发区，中间客厅地毯和茶几，右侧玩具区、饭盆、电视柜，远处有书架、台灯、植物。不要任何文字，不要 UI 面板，不要宠物，不要路径线，不要安全区虚线。整体像素风精致、温暖、干净，适合作为前端底层场景背景。
```

建议输出：`world-room-background.png`

## 02 宠物待机分身

前端 key：`petIdle`

```text
生成 PawRoom 的宠物电子分身，透明背景，2D pixel art，一只灰白色小猫坐姿，佩戴橙色智能项圈 #FF8F3F，表情稳定但有陪伴感，正面略 3/4 视角，边缘清晰，轻微像素阴影，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`pet-idle-cat.png`

## 03 沙发

前端 key：`sofa`

```text
生成透明底 2D pixel art 沙发素材，温暖奶油色布艺沙发，轻微俯视角，柔软坐垫和抱枕，像素边缘清晰，暖木室内光，不要文字，不要 UI 卡片，不要背景，适合放在 PawRoom 客厅像素场景左侧。
```

建议输出：`prop-sofa.png`

## 04 饭盆

前端 key：`bowl`

```text
生成透明底 2D pixel art 宠物饭盆素材，圆形橙棕色饭盆，里面有清晰宠物粮颗粒，小面积品牌橙 #FF8F3F 识别点，轻微俯视角，边缘干净，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`prop-bowl.png`

## 05 玩具区

前端 key：`toy`

```text
生成透明底 2D pixel art 宠物玩具区素材，包含彩色球、软骨头玩具、小绳结，温暖可爱但不过饱和，轻微俯视角，像素边缘清晰，适合放在 PawRoom 客厅右侧，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`prop-toy-zone.png`

## 06 宠物窝

前端 key：`pet-bed`

```text
生成透明底 2D pixel art 宠物窝素材，圆形柔软宠物窝，奶油米色和暖橙色细节，轻微俯视角，边缘干净，温暖室内光，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`prop-pet-bed.png`

## 07 茶几

前端 key：`table`

```text
生成透明底 2D pixel art 木质茶几素材，椭圆或圆角长方形，暖木色，有一本小书和一只杯子作为生活细节，轻微俯视角，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`prop-coffee-table.png`

## 08 台灯

前端 key：`lamp`

```text
生成透明底 2D pixel art 温暖台灯素材，木质小桌灯，柔和黄色灯光，适合客厅夜晚陪伴氛围，边缘清晰，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`prop-lamp.png`

## 09 书架

前端 key：`bookshelf`

```text
生成透明底 2D pixel art 书架素材，暖木色书架，摆放书本、小植物和相框，像素细节精致，轻微俯视/正面混合视角，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`prop-bookshelf.png`

## 10 植物

前端 key：`plant`

```text
生成透明底 2D pixel art 室内植物素材，陶土花盆，绿色叶片，暖光环境，边缘干净，适合放在宠物客厅小世界右下角，不要文字，不要 UI 卡片，不要背景。
```

建议输出：`prop-plant.png`

## 前端接入示例

```js
const worldGeneratedAssets = {
  petIdle: "./assets/generated/world/pet-idle-cat.png",
  sofa: "./assets/generated/world/prop-sofa.png",
  bowl: "./assets/generated/world/prop-bowl.png",
};
```

未填写路径的 slot 会继续使用 CSS 占位，不影响页面结构。