const ASSETS = {
  catOrange: "./assets/ip/pixel-cat-orange.png",
  catSprout: "./assets/ip/pixel-cat-sprout.png",
  sleepHome: "./assets/ip/pixel-cat-sleep-home-cropped.png",
};

const worldGeneratedAssets = {
  sceneBackground: "./assets/generated/world/scene-background-v0.11.png",
  petIdle: ASSETS.catOrange,
  bookshelf: "",
  lamp: "",
  sofa: "",
  rug: "",
  table: "",
  toy: "",
  bowl: "",
  tv: "",
  plant: "",
  "pet-bed": "",
  "door-mat": "",
};

const pet = {
  name: "花花",
  alias: "Coco",
  age: "2岁8个月",
  breed: "柴犬混血",
  weight: "8.4 kg",
  collar: "PawCollar Demo 01",
};

const queryParams = new URLSearchParams(window.location.search);

const statusProfiles = {
  normal: {
    id: "normal",
    className: "mode-normal",
    homeKicker: "今日安睡",
    homeTitle: "花花状态稳定",
    status: "一切正常，花花正在客厅休息。",
    safety: "高",
    zone: "客厅",
    connection: "已连接",
    connectionShort: "在线",
    battery: 78,
    confidence: 72,
    sync: "10:42",
    activity: 268,
    rest: 8.2,
    heart: 92,
    breath: 20,
    alertCount: 0,
    alertTitle: "无异常",
    alertText: "无异常提醒，继续保持哦",
    confidenceText: "项圈数据采集稳定",
    batteryTitle: "项圈在线，电量充足",
    batteryAdvice: "预计可用 14 小时 30 分钟，最近同步 10:42。",
    dataNote: "生命状态仅作趋势参考，不构成医疗诊断。",
  },
  lowBattery: {
    id: "lowBattery",
    className: "mode-low-battery",
    homeKicker: "低电量",
    homeTitle: "项圈需要充电",
    status: "项圈电量偏低，建议今晚充电。",
    safety: "中",
    zone: "客厅",
    connection: "已连接",
    connectionShort: "在线",
    battery: 18,
    confidence: 66,
    sync: "10:39",
    activity: 252,
    rest: 8.1,
    heart: 94,
    breath: 21,
    alertCount: 1,
    alertTitle: "低电量提醒",
    alertText: "预计可用时间不足 4 小时，建议尽快充电。",
    confidenceText: "采集稳定，但电量会影响后续同步",
    batteryTitle: "项圈在线，电量偏低",
    batteryAdvice: "预计可用不足 4 小时，请在今晚睡前充电。",
    dataNote: "低电量会影响同步频率，生命状态仍仅作趋势参考。",
  },
  offline: {
    id: "offline",
    className: "mode-offline",
    homeKicker: "离线提醒",
    homeTitle: "显示最后同步状态",
    status: "项圈暂时离线，显示最后一次同步状态。",
    safety: "未知",
    zone: "客厅",
    connection: "离线",
    connectionShort: "离线",
    battery: 0,
    batteryDisplay: "--",
    confidence: 28,
    sync: "09:58",
    activity: 210,
    rest: 7.6,
    heart: 90,
    breath: 19,
    alertCount: 1,
    alertTitle: "项圈离线",
    alertText: "已超过 40 分钟未同步，请确认设备距离和电量。",
    confidenceText: "当前为最后同步数据，置信度较低",
    batteryTitle: "项圈离线，电量未知",
    batteryAdvice: "最近同步时间为 09:58，请检查项圈电量、距离或网络。",
    dataNote: "离线时仅展示最后同步数据，不代表实时状态。",
  },
  attention: {
    id: "attention",
    className: "mode-attention",
    homeKicker: "需要观察",
    homeTitle: "静息时间偏长",
    status: "花花静息时间偏长，建议稍后观察精神状态。",
    safety: "需关注",
    zone: "书房",
    connection: "已连接",
    connectionShort: "在线",
    battery: 62,
    confidence: 58,
    sync: "10:42",
    activity: 146,
    rest: 10.6,
    heart: 88,
    breath: 18,
    alertCount: 2,
    alertTitle: "趋势需关注",
    alertText: "静息时长高于平时，建议观察精神状态。",
    confidenceText: "趋势偏离平时，建议结合视频或人工补充",
    batteryTitle: "项圈在线，数据需关注",
    batteryAdvice: "设备电量正常，但静息趋势偏高，建议继续观察。",
    dataNote: "趋势需关注不等于疾病诊断，如有异常请及时就医。",
  },
};

const statusProfile = statusProfiles[queryParams.get("mode")] || statusProfiles.normal;

const telemetry = {
  status: statusProfile.status,
  safety: statusProfile.safety,
  zone: statusProfile.zone,
  battery: statusProfile.battery,
  confidence: statusProfile.confidence,
  sync: statusProfile.sync,
  activity: statusProfile.activity,
  rest: statusProfile.rest,
  heart: statusProfile.heart,
  breath: statusProfile.breath,
};

const worldRoute = [
  { time: "09:05", zone: "宠物窝", status: "在宠物窝休息", source: "项圈记录", action: "睡觉", routine: "sleep", x: 126, y: 612, nodeX: 176, nodeY: 642 },
  { time: "09:22", zone: "书房", status: "从餐厅进入书房", source: "项圈记录", action: "巡逻", routine: "patrol", x: 338, y: 214, nodeX: 398, nodeY: 282 },
  { time: "09:40", zone: "饭盆", status: "在餐厅活动", source: "项圈记录", action: "吃饭", routine: "eat", x: 784, y: 538, nodeX: 840, nodeY: 606 },
  { time: "10:15", zone: "书房", status: "在书房休息", source: "项圈记录", action: "休息", routine: "sleep", x: 456, y: 352, nodeX: 516, nodeY: 418 },
  { time: "10:26", zone: "客厅", status: "从书房进入客厅", source: "项圈记录", action: "等主人", routine: "wait", x: 610, y: 408, nodeX: 670, nodeY: 474 },
  { time: "10:42", zone: "客厅", status: "在客厅活动", source: "项圈记录", action: "扔玩具", routine: "patrol", x: 738, y: 340, nodeX: 798, nodeY: 410 },
];

const worldPropSlots = [
  { id: "bookshelf", className: "bookshelf", label: "书架" },
  { id: "lamp", className: "lamp", label: "台灯" },
  { id: "sofa", className: "sofa", label: "沙发" },
  { id: "rug", className: "rug", label: "客厅地毯" },
  { id: "table", className: "table", label: "茶几" },
  { id: "toy", className: "toy", label: "玩具区" },
  { id: "bowl", className: "bowl", label: "饭盆" },
  { id: "tv", className: "tv", label: "电视" },
  { id: "plant", className: "plant", label: "植物" },
  { id: "pet-bed", className: "pet-bed", label: "宠物窝" },
  { id: "door-mat", className: "door-mat", label: "门垫" },
];

const worldLabels = [
  { text: "书房", style: "left:374px;top:184px" },
  { text: "客厅", style: "left:648px;top:304px" },
  { text: "玩具区", style: "right:160px;top:408px" },
  { text: "饭盆", style: "right:286px;bottom:126px" },
  { text: "宠物窝", style: "left:142px;bottom:198px" },
  { text: "沙发", style: "left:300px;top:402px" },
];

const routineCards = [
  { routine: "sleep", className: "sleep", label: "睡觉", meta: "22:15-07:30" },
  { routine: "patrol", className: "patrol", label: "巡逻", meta: "10:30-10:50" },
  { routine: "eat", className: "eat", label: "吃饭", meta: "08:00 已完成" },
  { routine: "wait", className: "wait", label: "等主人", meta: "17:30-18:30" },
];

const interactionItems = ["摸摸", "投喂", "叫名字", "扔玩具"];
const interactionRouteMap = { 投喂: 2, 叫名字: 4, 扔玩具: 5 };

const events = worldRoute.map((point) => [point.time, point.status, point.source]);
const journeyGenerationSteps = [
  { label: "读取项圈记录", detail: "同步路径、区域和活动状态" },
  { label: "整理用户补充", detail: "合并今天的备注事件" },
  { label: "生成小剧场", detail: "输出漫画、文案和分享卡" },
];
const navItems = [
  ["home", "首页", "home"],
  ["world", "桌面小世界", "monitor"],
  ["data", "宠物数据", "chart"],
  ["journey", "今日历程", "calendar"],
  ["settings", "设置", "settings"],
];

const secondaryItems = [
  ["create", "添加", "plus"],
  ["battery", "电量", "battery"],
];

const pageMap = {
  home: renderHome,
  world: renderWorld,
  data: renderData,
  journey: renderJourney,
  settings: renderSettings,
  create: renderCreatePet,
  battery: renderBattery,
  profile: renderProfile,
};

let currentPage = queryParams.get("page") || "home";
if (!pageMap[currentPage]) currentPage = "home";
let toastTimer = null;
let currentToast = "";
let activeJourneyEvent = 0;
let journeyReplayTimer = null;
let createStep = 0;
let worldInteraction = "休息";
let generationState = "idle";
let generationPhase = 0;
let generationTimers = [];
let exportState = "idle";
let exportTimer = null;


function getGeneratedAsset(id) {
  const asset = worldGeneratedAssets[id];
  return typeof asset === "string" && asset.trim() ? asset : "";
}

function renderWorldProp(prop) {
  const src = getGeneratedAsset(prop.id);
  const assetMarkup = src
    ? `<img class="room-prop-asset" src="${src}" alt="${prop.label}" loading="lazy" />`
    : "";
  return `<div class="room-prop ${prop.className} ${src ? "has-asset" : ""}" data-asset-slot="${prop.id}" aria-label="${prop.label}">${assetMarkup}</div>`;
}

function getWorldPetSprite() {
  return getGeneratedAsset("petIdle") || ASSETS.catOrange;
}

function toCssImageUrl(src) {
  const safeSrc = src.replace(/["'\\\n\r]/g, "");
  return safeSrc ? `url("${safeSrc}")` : "";
}

function getWorldSceneStyle(routeProgress) {
  const sceneBackground = getGeneratedAsset("sceneBackground");
  const sceneImage = toCssImageUrl(sceneBackground);
  const routeProgressValue = Number(routeProgress) || 0;
  const routeProgressPct = `${routeProgressValue}%`;
  return sceneImage
    ? `--route-progress:${routeProgressValue.toFixed(2)};--route-progress-pct:${routeProgressPct};--scene-bg:${sceneImage}`
    : `--route-progress:${routeProgressValue.toFixed(2)};--route-progress-pct:${routeProgressPct}`;
}

function getRouteProgressValue() {
  return ((activeJourneyEvent + 1) / worldRoute.length) * 100;
}

function buildWorldRouteSvgPoints() {
  return worldRoute.map((point) => `${point.nodeX},${point.nodeY}`).join(" ");
}

function renderWorldSceneBackground() {
  const sceneBackground = getGeneratedAsset("sceneBackground");
  return sceneBackground
    ? `<img class="scene-background-asset" src="${sceneBackground}" alt="" aria-hidden="true" loading="eager" />`
    : "";
}
function renderWorldRouteLayer(routeProgressValue) {
  const points = buildWorldRouteSvgPoints();
  const strokeOffset = Math.max(0, 100 - routeProgressValue).toFixed(2);
  return `
    <svg class="route-progress-layer" viewBox="0 0 1220 976" aria-hidden="true">
      <polyline class="route-progress-shadow" points="${points}" pathLength="100"></polyline>
      <polyline class="route-progress-stroke" points="${points}" pathLength="100" style="stroke-dashoffset:${strokeOffset}"></polyline>
    </svg>
  `;
}

function getBatteryDisplay() {
  return statusProfile.batteryDisplay || `${telemetry.battery}%`;
}

function getGenerationProgress() {
  if (generationState === "done") return 100;
  if (generationState !== "processing") return 0;
  return [32, 68, 86][generationPhase] || 32;
}

function getGenerationCopy() {
  if (generationState === "done") {
    return {
      title: "今日回放已生成",
      desc: "四格漫画、小剧场和分享卡已准备好。",
      credits: "已扣除 12",
      button: "重新生成今日回放",
    };
  }
  if (generationState === "processing") {
    const step = journeyGenerationSteps[generationPhase] || journeyGenerationSteps[0];
    return {
      title: step.label,
      desc: step.detail,
      credits: "处理中",
      button: "生成中",
    };
  }
  return {
    title: "预计消耗 12 Paw Credits",
    desc: "生成前提示额度，基础安全摘要免费。",
    credits: "预计 12",
    button: "生成今日回放",
  };
}

function renderGenerationPanel() {
  const copy = getGenerationCopy();
  const progress = getGenerationProgress();
  return `
    <div class="generation-panel ${generationState}">
      <strong>${copy.title}</strong>
      <p class="caption">${copy.desc}</p>
      <div class="generation-progress" style="--gen-progress:${progress}%"><i></i></div>
      <div class="generation-steps">
        ${journeyGenerationSteps.map((step, index) => `
          <span class="generation-step ${generationState === "done" || index < generationPhase ? "done" : ""} ${generationState === "processing" && index === generationPhase ? "active" : ""}">${step.label}</span>
        `).join("")}
      </div>
    </div>
  `;
}

function renderGeneratedStory() {
  if (generationState === "processing") {
    return `
      <div class="story-skeleton" aria-label="今日回放生成中">
        <i></i><i></i><i></i>
      </div>
    `;
  }
  return `<p class="generated-copy">“花花把书房当成临时基地，又慢慢巡逻回客厅。今天没有异常提醒。”</p>`;
}

function getExportButtonLabel() {
  if (exportState === "exporting") return "导出中";
  if (exportState === "done") return "已保存";
  return "分享导出";
}
function buildPageUrl(page) {
  const params = new URLSearchParams();
  params.set("page", page);
  if (statusProfile.id !== "normal") params.set("mode", statusProfile.id);
  return `?${params.toString()}`;
}

function getActiveRoutePoint() {
  return worldRoute[activeJourneyEvent % worldRoute.length] || worldRoute[0];
}

function setActiveRoute(index, message) {
  activeJourneyEvent = Math.max(0, Math.min(worldRoute.length - 1, Number(index) || 0));
  const point = getActiveRoutePoint();
  worldInteraction = point.action;
  if (message) showToast(message);
  renderCurrentPage();
}
function icon(name) {
  const paths = {
    home: '<path d="M4 12.5 12 5l8 7.5"/><path d="M6.5 11.5V20h11v-8.5"/><path d="M10 20v-5h4v5"/>',
    monitor: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M9 20h6"/><path d="M12 16v4"/><path d="m8 12 2-2 2 3 2-5 2 4"/>',
    chart: '<path d="M5 19V9"/><path d="M12 19V5"/><path d="M19 19v-7"/><path d="M4 19h16"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05A1.7 1.7 0 0 0 15 19.36a1.7 1.7 0 0 0-1 .15 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.07a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.9.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 3.6 15a1.7 1.7 0 0 0-1.55-1H2a2 2 0 1 1 0-4h.07a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.9l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 8 3.6a1.7 1.7 0 0 0 1-.15A1.7 1.7 0 0 0 10 1.9V2a2 2 0 1 1 4 0v-.07a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.9-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 20.4 9c.12.32.46 1 1.55 1H22a2 2 0 1 1 0 4h-.07a1.7 1.7 0 0 0-1.55 1Z"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2"/><path d="M7 11h8v2H7z"/>',
    shield: '<path d="M12 3 19 6v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-5"/>',
    heart: '<path d="M20.5 8.5c0 5.3-8.5 10-8.5 10s-8.5-4.7-8.5-10A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5Z"/>',
    lung: '<path d="M12 12V4"/><path d="M12 12c-3-3-6-3-7 0-1 4 1 7 4 7 2 0 3-2 3-7Z"/><path d="M12 12c3-3 6-3 7 0 1 4-1 7-4 7-2 0-3-2-3-7Z"/>',
    route: '<path d="M6 6h.01"/><path d="M18 18h.01"/><path d="M6 6c8 0 0 12 12 12"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    export: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.home}</svg>`;
}

function statusPill(label, value, iconName = "shield", className = "") {
  return `
    <div class="status-pill ${className}">
      <span class="button-icon">${icon(iconName)}</span>
      <div><span>${label}</span><strong>${value}</strong></div>
    </div>
  `;
}

function miniBars(values, color = "currentColor") {
  return `<div class="mini-bars" style="color:${color}">${values
    .map((h, index) => `<i style="--h:${h}px;--o:${index > 8 ? 0.32 : 0.92}"></i>`)
    .join("")}</div>`;
}

function lineChart(color = "var(--brand-deep)") {
  return `
    <svg class="line-chart" viewBox="0 0 320 112" style="--chart:${color}">
      <path class="grid" d="M0 20H320M0 58H320M0 96H320"/>
      <polyline points="0,78 28,70 56,72 84,48 112,44 140,65 168,38 196,58 224,64 252,74 280,56 320,62"/>
    </svg>
  `;
}

function renderShell() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <div class="viewport">
      <div class="stage">
        ${renderSidebar()}
        <main class="main" id="main"></main>
      </div>
    </div>
  `;
  bindNav();
  renderCurrentPage();
  syncScale();
}

function renderSidebar() {
  const nav = navItems.map(([id, label, iconName]) => navButton(id, label, iconName)).join("");
  const secondary = secondaryItems.map(([id, label, iconName]) => roundButton(id, label, iconName)).join("");
  return `
    <aside class="sidebar" aria-label="PawRoom 主导航">
      <nav class="nav-group">${nav}</nav>
      <div class="nav-group secondary">
        <div class="round-actions">${secondary}</div>
        <button class="pet-tile" data-page="profile" aria-label="宠物信息">
          <img src="${ASSETS.catSprout}" alt="花花像素头像" />
          <strong>花花</strong>
        </button>
      </div>
    </aside>
  `;
}

function navButton(id, label, iconName) {
  return `
    <button class="nav-item" data-page="${id}" aria-label="${label}">
      <span class="nav-icon">${icon(iconName)}</span>
      <span class="nav-label">${label}</span>
    </button>
  `;
}

function roundButton(id, label, iconName) {
  return `
    <button class="round-button" data-page="${id}" aria-label="${label}">
      <span class="nav-icon">${icon(iconName)}</span>
      <span>${label}</span>
    </button>
  `;
}

function bindNav() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = button.dataset.page;
      if (journeyReplayTimer) clearInterval(journeyReplayTimer);
      journeyReplayTimer = null;
      generationState = "idle";
      generationPhase = 0;
      generationTimers.forEach((timer) => clearTimeout(timer));
      generationTimers = [];
      exportState = "idle";
      if (exportTimer) clearTimeout(exportTimer);
      exportTimer = null;
      history.replaceState(null, "", buildPageUrl(currentPage));
      renderCurrentPage();
    });
  });
}

function updateActiveNav() {
  document.querySelectorAll("[data-page]").forEach((node) => {
    node.classList.toggle("active", node.dataset.page === currentPage);
  });
}

function renderCurrentPage() {
  updateActiveNav();
  const main = document.querySelector("#main");
  main.innerHTML = `<section class="page active">${pageMap[currentPage]()}</section><div class="toast ${currentToast ? "show" : ""}">${currentToast}</div>`;
  bindPageInteractions();
}

function renderHome() {
  return `
    <section class="home-shell ${statusProfile.className}">
      <section class="home-hero ${statusProfile.className}">
        <div class="home-copy">
          <div class="kicker">${statusProfile.homeKicker}</div>
          <h1>${statusProfile.homeTitle}</h1>
          <div><span class="big-number tabular">${telemetry.rest}</span><span class="unit">h</span></div>
          <div class="home-pills">
            ${statusPill("\u5b89\u5168\u7b49\u7ea7", telemetry.safety, "shield", statusProfile.className)}
            ${statusPill(statusProfile.alertTitle, statusProfile.alertCount ? `${statusProfile.alertCount} \u6761` : "\u7a33\u5b9a", "route", statusProfile.className)}
            ${statusPill("\u9879\u5708\u72b6\u6001", statusProfile.connection, "battery", statusProfile.className)}
          </div>
        </div>
        <div class="sleep-pet">
          <div class="mattress"></div>
          <img src="${ASSETS.sleepHome}" alt="\u7761\u5728\u8f6f\u57ab\u4e0a\u7684\u50cf\u7d20\u5ba0\u7269" />
        </div>
      </section>
      <svg class="home-curve" viewBox="0 0 1010 150" aria-hidden="true">
        <path d="M42 118 C204 50 336 82 484 48 C626 16 794 34 972 74"/>
        <circle cx="210" cy="84" r="10"/><circle cx="528" cy="43" r="10"/><circle cx="934" cy="70" r="10"/>
        <text x="190" y="56" fill="#4D4741" font-size="15" font-weight="700">09:05</text>
        <text x="500" y="18" fill="#4D4741" font-size="15" font-weight="700">09:40</text>
        <text x="916" y="44" fill="#4D4741" font-size="15" font-weight="700">10:42</text>
      </svg>
      <section class="home-grid">
        ${homeMetricCard("\u6d3b\u52a8\u91cf", telemetry.activity, "min", "\u4eca\u65e5\u6d3b\u52a8", "orange", [36, 58, 72, 94, 52, 112, 80, 70, 92, 64, 50], "#fff")}
        ${homeMetricCard("\u4f11\u606f\u65f6\u957f", telemetry.rest, "h", "\u4eca\u65e5\u4f11\u606f", "blue", [40, 76, 64, 46, 86, 58, 98, 66, 82], "#5976ee")}
        ${homeSmallTrend("\u5fc3\u7387\u8d8b\u52bf", `${telemetry.heart}`, "bpm", "\u5f53\u524d\u5fc3\u7387", "var(--danger)", "heart")}
        ${homeSmallTrend("\u547c\u5438\u8d8b\u52bf", `${telemetry.breath}`, "rpm", "\u5f53\u524d\u547c\u5438", "var(--blue)", "lung")}
        <div class="small-stat metric-card lime home-status-card">
          <div class="metric-label">\u4eca\u65e5\u63d0\u9192</div>
          <strong>${statusProfile.alertCount} \u6761</strong>
          <p class="caption">${statusProfile.alertText}</p>
        </div>
        <div class="small-stat metric-card cyan home-status-card">
          <div class="metric-label">\u6570\u636e\u7f6e\u4fe1\u5ea6</div>
          <strong>${telemetry.confidence}%</strong>
          <p class="caption">${statusProfile.confidenceText}</p>
        </div>
      </section>
      <aside class="home-footnote">
        <span>${icon("shield")}</span>
        <strong>PawRoom \u5b89\u5168\u5b88\u62a4</strong>
        <em>\u751f\u547d\u72b6\u6001\u4ec5\u4f5c\u8d8b\u52bf\u53c2\u8003\uff0c\u4e0d\u6784\u6210\u533b\u7597\u8bca\u65ad\u3002</em>
      </aside>
    </section>
  `;
}

function homeMetricCard(label, value, unit, sub, tone, bars, color) {
  return `
    <article class="metric-card ${tone} ${tone === "orange" ? "home-activity-card" : "home-rest-card"}">
      <div class="metric-label">${label}</div>
      <div><span class="metric-value tabular">${value}</span><span class="metric-unit">${unit}</span></div>
      <div class="caption">${sub}</div>
      ${miniBars(bars, color)}
      <div class="caption metric-footer">
        <span>\u76ee\u6807 ${unit === "min" ? "300 min" : "10 h"}</span>
        <span>\u5b8c\u6210\u7387 ${unit === "min" ? "89%" : "82%"}</span>
      </div>
    </article>
  `;
}

function homeSmallTrend(label, value, unit, sub, color, iconName) {
  return `
    <article class="small-stat solid-card home-trend-card">
      <div class="metric-label">${label}</div>
      <strong>${value}<span class="metric-unit">${unit}</span></strong>
      <div class="caption">${sub}</div>
      ${lineChart(color)}
      <div class="source-tag" style="width:max-content;margin-top:8px;color:var(--safe);background:rgba(104,171,18,0.12)">
        ${icon(iconName)} \u6b63\u5e38\u8303\u56f4
      </div>
    </article>
  `;
}

function metricCard(label, value, unit, sub, tone, bars, color) {
  return `
    <article class="metric-card ${tone} solid-card">
      <div class="metric-label">${label}</div>
      <div><span class="metric-value tabular">${value}</span><span class="metric-unit">${unit}</span></div>
      <div class="caption">${sub}</div>
      ${miniBars(bars, color)}
      <div class="caption" style="display:flex;justify-content:space-between;margin-top:18px">
        <span>\u76ee\u6807 ${unit === "min" ? "300 min" : "10 h"}</span>
        <span>\u5b8c\u6210\u7387 ${unit === "min" ? "89%" : "82%"}</span>
      </div>
    </article>
  `;
}

function smallTrend(label, value, unit, sub, color, iconName) {
  return `
    <article class="small-stat solid-card">
      <div class="metric-label">${label}</div>
      <strong>${value}<span class="metric-unit">${unit}</span></strong>
      <div class="caption">${sub}</div>
      ${lineChart(color)}
      <div class="source-tag" style="width:max-content;margin-top:8px;color:var(--safe);background:rgba(104,171,18,0.12)">
        ${icon(iconName)} \u6b63\u5e38\u8303\u56f4
      </div>
    </article>
  `;
}
function renderWorld() {
  const activePoint = getActiveRoutePoint();
  const routeProgressValue = getRouteProgressValue();
  const isReplaying = Boolean(journeyReplayTimer);
  const hasSceneAsset = Boolean(getGeneratedAsset("sceneBackground"));
  const worldSceneStyle = getWorldSceneStyle(routeProgressValue);
  return `
    <section class="world-scene ${statusProfile.className} ${hasSceneAsset ? "has-scene-asset" : ""} ${isReplaying ? "is-replaying" : ""}" style="${worldSceneStyle}">
      ${renderWorldSceneBackground()}
      <div class="scene-sunlight"></div>
      <div class="pixel-window"></div>
      ${worldPropSlots.map(renderWorldProp).join("")}
      <div class="safe-zone"></div>
      <div class="route-line"></div>
      ${renderWorldRouteLayer(routeProgressValue)}
      ${worldRoute.map((point, index) => `
        <button class="scene-node ${index <= activeJourneyEvent ? "is-past" : ""} ${index === activeJourneyEvent ? "is-active" : ""}" data-route-index="${index}" style="left:${point.nodeX}px;top:${point.nodeY}px" type="button" aria-label="${point.time} ${point.status}">
          <span>${point.time}</span>
        </button>
      `).join("")}
      <img class="scene-pet action-${activePoint.routine}" style="--pet-x:${activePoint.x}px;--pet-y:${activePoint.y}px" src="${getWorldPetSprite()}" alt="桌面小世界中的花花分身" />
      ${worldLabels.map((label) => `<div class="label-badge" style="${label.style}">${label.text}</div>`).join("")}
      ${routineCards.map((card) => `<div class="routine-card ${card.className} ${activePoint.routine === card.routine ? "active" : ""}">${card.label}<span>${card.meta}</span></div>`).join("")}
    </section>
    <div class="floating-status world-status glass ${statusProfile.className}">
      <img src="${ASSETS.catOrange}" alt="花花头像" />
      <div>
        <h2 class="panel-title">${statusProfile.id === "normal" ? `一切正常，${activePoint.status}` : statusProfile.status} <span class="status-dot ${statusProfile.className}"></span></h2>
        <p class="caption">当前区域：${activePoint.zone} / 当前互动：${worldInteraction}</p>
      </div>
    </div>
    <div class="top-pills">
      ${statusPill("安全等级", telemetry.safety, "shield", statusProfile.className)}
      ${statusPill("当前区域", activePoint.zone, "route", statusProfile.className)}
      ${statusPill("项圈状态", statusProfile.connectionShort, "battery", statusProfile.className)}
      ${statusPill("电量", getBatteryDisplay(), "battery", statusProfile.className)}
    </div>
    <aside class="world-mini glass">
      <strong>桌面小窗预览</strong>
      <div class="mini-preview ${statusProfile.className}"></div>
      <p class="caption">小窗模式跟随 ${activePoint.zone}，保留状态和轻互动入口。</p>
    </aside>
    <div class="interaction-dock">
      ${interactionItems.map((item) => `
        <button class="action-card glass ${worldInteraction === item ? "active" : ""}" data-interaction="${item}">
          ${item}
        </button>
      `).join("")}
    </div>
    <article class="world-bottom-card glass" style="left:34px">
      <div class="metric-label">今日活动</div>
      <strong class="metric-value" style="font-size:42px">${telemetry.activity}<span class="metric-unit">min</span></strong>
      ${miniBars([28,46,58,38,64,44,52,60,34], "var(--brand-deep)")}
    </article>
    <article class="world-bottom-card glass" style="right:150px">
      <div class="metric-label">今日休息</div>
      <strong class="metric-value" style="font-size:42px">${telemetry.rest}<span class="metric-unit">h</span></strong>
      ${miniBars([26,44,56,36,48,62,42,58,46], "var(--blue)")}
    </article>
    <div class="floating-status glass state-note ${statusProfile.className}" style="right:22px;bottom:18px;width:220px">${statusProfile.alertTitle}<br><strong>${statusProfile.alertText}</strong></div>
  `;
}

function renderData() {
  return `
    <section class="data-layout">
      <div class="data-status-row">
        ${statusPill("项圈状态", statusProfile.connection, "battery", statusProfile.className)}
        ${statusPill("电量", getBatteryDisplay(), "battery", statusProfile.className)}
        ${statusPill("最近同步", telemetry.sync, "calendar", statusProfile.className)}
        ${statusPill("数据置信度", `${telemetry.confidence}%`, "shield", statusProfile.className)}
        ${statusPill("当前区域", telemetry.zone, "route", statusProfile.className)}
      </div>
      <div class="data-grid">
        ${metricCard("活动量", telemetry.activity, "min", "24h 活动趋势", "orange", [34,44,66,52,82,40,90,72,48,58], "#fff")}
        ${metricCard("休息时长", telemetry.rest, "h", "静息分布稳定", "blue", [54,80,60,42,76,48,92,58,84], "#5976ee")}
        ${smallTrend("心率趋势", telemetry.heart, "bpm", "趋势参考", "var(--danger)", "heart")}
        ${smallTrend("呼吸趋势", telemetry.breath, "rpm", "趋势参考", "var(--blue)", "lung")}
      </div>
      <aside class="data-side">
        ${renderMiniMapCard()}
        <article class="metric-card solid-card">
          <div class="metric-label">活动节律</div>
          <p class="caption">${statusProfile.id === "offline" ? "当前为最后同步数据，路径与趋势不代表实时状态。" : "上午偏安静，10:42 后在客厅有轻度活动。"}</p>
          ${miniBars([36,30,42,64,84,70,58,46,50,66,40,34], "var(--brand-deep)")}
          <div class="setting-row"><strong>客厅</strong><span class="caption">42%</span></div>
          <div class="setting-row"><strong>书房</strong><span class="caption">24%</span></div>
          <div class="setting-row"><strong>宠物窝</strong><span class="caption">21%</span></div>
        </article>
      </aside>
      <div class="source-strip glass">
        <div>
          <h2 class="panel-title">数据边界</h2>
          <p class="caption">${statusProfile.dataNote}</p>
        </div>
        <div class="source-tags">
          <span class="source-tag">项圈记录</span>
          <span class="source-tag">用户补充</span>
          <span class="source-tag">AI 演绎</span>
        </div>
      </div>
    </section>
  `;
}

function renderMiniMapCard() {
  return `
    <article class="mini-map solid-card">
      <div class="map-title">家庭区域</div>
      <div class="room" style="left:22px;top:22px;width:150px;height:96px">书房</div>
      <div class="room" style="left:196px;top:28px;width:170px;height:120px">客厅</div>
      <div class="room" style="left:42px;bottom:34px;width:130px;height:96px">餐厅</div>
      <div class="room" style="right:28px;bottom:38px;width:128px;height:88px">宠物窝</div>
      <div class="mini-route"></div>
      <div class="map-pet-dot"></div>
      <div class="map-safe-ring"></div>
      <div class="map-legend">
        <span>当前位置</span>
        <span>活动路径</span>
        <span>安全区域</span>
      </div>
    </article>
  `;
}

function renderJourney() {
  const progress = `${((activeJourneyEvent + 1) / events.length) * 100}%`;
  const generationCopy = getGenerationCopy();
  const exportDisabled = generationState !== "done" || exportState === "exporting";
  return `
    <section class="timeline-page">
      <article class="story-hero">
        <div>
          <span class="eyebrow" style="color:rgba(255,255,255,0.76)">今日小剧场</span>
          <h1>上午占领书房，随后回到客厅巡逻</h1>
          <p>项圈记录显示花花今天状态稳定。AI 只把路径和状态演绎成故事，不把演绎内容当作事实。</p>
        </div>
        <div class="glass" style="border-radius:28px;padding:22px;color:var(--ink)">
          ${renderGenerationPanel()}
        </div>
      </article>
      <article class="daily-timeline solid-card">
        <h2 class="panel-title">今日时间线</h2>
        <div class="timeline-track" style="margin-top:28px;--progress:${progress}">
          ${events.map(([time, text, source], index) => `
            <div class="event-node ${index <= activeJourneyEvent ? "is-past" : ""} ${index === activeJourneyEvent ? "is-active" : ""}" data-route-index="${index}" role="button" tabindex="0">
              <div class="event-time">${time}</div>
              <div class="event-text">${text}</div>
              <div class="caption">${source}</div>
            </div>
          `).join("")}
        </div>
      </article>
      <aside class="creation-grid">
        <article class="creation-card glass">
          <h2 class="panel-title">四格漫画</h2>
          <div class="comic-grid">
            ${["书房基地", "客厅巡逻", "饭盆确认", "等待主人"].map((label, index) => `
              <div class="comic-panel panel-${index + 1}">
                <span>${label}</span>
              </div>
            `).join("")}
          </div>
        </article>
        <article class="creation-card solid-card generation-card ${generationState}">
          <h2 class="panel-title">AI 小剧场</h2>
          ${renderGeneratedStory()}
          <div class="source-tags">
            <span class="source-tag">AI 演绎</span>
            <span class="source-tag">${generationState === "done" ? "可分享" : generationState === "processing" ? "生成中" : "待生成"}</span>
          </div>
          <div class="credits-bar ${generationState}">
            <span>Credits</span>
            <strong>${generationCopy.credits}</strong>
          </div>
        </article>
      </aside>
      <article class="glass journey-action-bar" style="border-radius:30px;padding:26px;display:flex;align-items:center;justify-content:space-between">
        <div class="source-tags">
          <span class="source-tag">项圈记录</span>
          <span class="source-tag">用户补充</span>
          <span class="source-tag">AI 演绎</span>
        </div>
        <div class="journey-action-controls">
          <button class="secondary-button" data-start-replay>${icon("play")}播放路径</button>
          <button class="secondary-button" data-export ${exportDisabled ? "disabled" : ""}>${icon("export")}${getExportButtonLabel()}</button>
          <button class="primary-button" data-generate ${generationState === "processing" ? "disabled" : ""}>${icon("play")}${generationCopy.button}</button>
        </div>
      </article>
    </section>
  `;
}
function renderSettings() {
  return `
    <section class="settings-grid">
      <article class="glass wide" style="border-radius:34px;padding:30px">
        <h1 class="panel-title">设置</h1>
        <p class="caption">围绕安全区域、提醒偏好、AI 创作额度、隐私与医疗边界组织。</p>
      </article>
      ${settingCard("安全区域", [["客厅安全区", true], ["门口停留提醒", true], ["阳台关注区", false]])}
      ${settingCard("提醒偏好", [["长时间静止", true], ["活动偏高", true], ["低电量提醒", true]])}
      ${settingCard("Paw Credits", [["每次生成前提示", true], ["自动生成日报", false], ["会员权益提醒", true]])}
      ${settingCard("数据隐私", [["不保存原始定位", true], ["隐藏敏感时间段", true], ["导出前二次确认", true]])}
    </section>
  `;
}

function settingCard(title, rows) {
  return `
    <article class="solid-card" style="border-radius:32px;padding:30px">
      <h2 class="panel-title">${title}</h2>
      ${rows.map(([label, on]) => `
        <div class="setting-row">
          <strong>${label}</strong>
          <span class="toggle ${on ? "on" : ""}" aria-label="${label}${on ? "已开启" : "已关闭"}"></span>
        </div>
      `).join("")}
    </article>
  `;
}

function renderCreatePet() {
  const createSteps = [
    {
      label: "上传素材",
      title: "上传照片或选择示例宠物",
      desc: "第一步只要求宠物照片，先让用户看到分身预览，降低填写压力。",
      zone: "照片上传区域",
    },
    {
      label: "基础信息",
      title: "填写必要基础信息",
      desc: "只收集名字、宠物类型和年龄，其他资料后续可补充。",
      zone: "姓名 / 类型 / 年龄",
    },
    {
      label: "选择风格",
      title: "选择像素化视觉风格",
      desc: "保持小世界统一像素风，可在橙色项圈、蘑菇帽、睡垫等风格里选择。",
      zone: "风格卡片选择",
    },
    {
      label: "生成分身",
      title: "生成宠物电子分身",
      desc: "展示生成进度、失败重试和可替换素材入口。",
      zone: "分身生成预览",
    },
    {
      label: "连接项圈",
      title: "连接项圈数据",
      desc: "最后再进入设备连接，避免用户一开始就被硬件步骤打断。",
      zone: "项圈连接状态",
    },
  ];
  const currentStep = createSteps[createStep] || createSteps[0];
  return `
    <section class="create-grid">
      <article class="glass wide" style="border-radius:34px;padding:30px">
        <h1 class="panel-title">新增宠物</h1>
        <p class="caption">渐进式填写，每一步只保留一个主要动作和一个预览区域。</p>
      </article>
      <aside class="step-list glass" style="border-radius:34px">
        ${createSteps.map((step, index) => `
          <button class="step-item ${index === createStep ? "active" : ""}" data-create-step="${index}">
            <strong>Step ${index + 1}</strong>
            <div>${step.label}</div>
          </button>
        `).join("")}
      </aside>
      <article class="upload-card solid-card">
        <div>
          <h2 class="panel-title">${currentStep.title}</h2>
          <p class="caption">${currentStep.desc}</p>
          <div class="dropzone"><strong>${currentStep.zone}</strong></div>
        </div>
        <div class="profile-card glass">
          <img src="${ASSETS.catSprout}" alt="生成中的像素宠物分身" />
          <h2>分身预览</h2>
          <p class="caption">后续可替换为 image2 透明底高清组件。</p>
        </div>
      </article>
    </section>
  `;
}

function bindPageInteractions() {
  document.querySelectorAll("[data-route-index]").forEach((node) => {
    const activate = () => {
      const index = Number(node.dataset.routeIndex || 0);
      const point = worldRoute[index] || worldRoute[0];
      setActiveRoute(index, `已切换到 ${point.time}：${point.status}`);
    };
    node.addEventListener("click", activate);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  document.querySelectorAll("[data-interaction]").forEach((button) => {
    button.addEventListener("click", () => {
      worldInteraction = button.dataset.interaction || "互动";
      const targetIndex = interactionRouteMap[worldInteraction];
      if (targetIndex !== undefined) {
        activeJourneyEvent = targetIndex;
      }
      const point = getActiveRoutePoint();
      showToast(`已记录：${worldInteraction}，花花现在在${point.zone}。`);
      renderCurrentPage();
    });
  });

  document.querySelectorAll("[data-create-step]").forEach((button) => {
    button.addEventListener("click", () => {
      createStep = Number(button.dataset.createStep || 0);
      showToast(`已切换到创建步骤 ${createStep + 1}`);
      renderCurrentPage();
    });
  });

  const replayButton = document.querySelector("[data-start-replay]");
  if (replayButton) {
    replayButton.addEventListener("click", startJourneyReplay);
  }

  const generateButton = document.querySelector("[data-generate]");
  if (generateButton) {
    generateButton.addEventListener("click", () => {
      if (generationState === "processing") return;
      generationTimers.forEach((timer) => clearTimeout(timer));
      generationTimers = [];
      generationState = "processing";
      generationPhase = 0;
      exportState = "idle";
      showToast("正在生成今日回放，预计消耗 12 Paw Credits。");
      renderCurrentPage();
      generationTimers = [
        setTimeout(() => {
          generationPhase = 1;
          renderCurrentPage();
        }, 520),
        setTimeout(() => {
          generationPhase = 2;
          renderCurrentPage();
        }, 1040),
        setTimeout(() => {
          generationState = "done";
          generationPhase = journeyGenerationSteps.length;
          generationTimers = [];
          showToast("今日回放已生成，可分享导出。");
          renderCurrentPage();
        }, 1560),
      ];
    });
  }

  const exportButton = document.querySelector("[data-export]");
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      if (generationState !== "done" || exportState === "exporting") {
        showToast("请先生成今日回放，再分享导出。");
        return;
      }
      if (exportTimer) clearTimeout(exportTimer);
      exportState = "exporting";
      showToast("正在整理分享卡和四格漫画。");
      renderCurrentPage();
      exportTimer = setTimeout(() => {
        exportState = "done";
        showToast("今日回放已保存到导出队列。");
        renderCurrentPage();
      }, 900);
    });
  }
}

function showToast(message) {
  currentToast = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    currentToast = "";
    renderCurrentPage();
  }, 2200);
}

function startJourneyReplay() {
  if (journeyReplayTimer) clearInterval(journeyReplayTimer);
  activeJourneyEvent = 0;
  worldInteraction = getActiveRoutePoint().action;
  showToast("开始回放今日路径。");
  renderCurrentPage();

  let nextIndex = 1;
  journeyReplayTimer = setInterval(() => {
    if (nextIndex >= worldRoute.length) {
      clearInterval(journeyReplayTimer);
      journeyReplayTimer = null;
      showToast("今日路径回放已完成。");
      renderCurrentPage();
      return;
    }
    activeJourneyEvent = nextIndex;
    worldInteraction = getActiveRoutePoint().action;
    nextIndex += 1;
    renderCurrentPage();
  }, 900);
}

function renderBattery() {
  return `
    <section class="battery-grid">
      <article class="battery-hero">
        <span class="eyebrow" style="color:rgba(255,255,255,0.78)">PawCollar Demo 01</span>
        <h1 class="panel-title" style="color:#fff;font-size:34px;margin-top:10px">${statusProfile.batteryTitle}</h1>
        <div class="battery-percent tabular">${getBatteryDisplay()}</div>
        <p>${statusProfile.batteryAdvice}</p>
      </article>
      <article class="profile-card glass">
        <img src="${ASSETS.catOrange}" alt="佩戴橙色项圈的花花" />
        <strong>花花</strong>
      </article>
      ${settingCard("设备状态", [[`项圈${statusProfile.connection}`, statusProfile.connection !== "离线"], ["每 30 秒同步", statusProfile.id !== "offline"], ["低电量提醒", true]])}
      ${settingCard("处理建议", [[statusProfile.id === "lowBattery" ? "今晚睡前充电" : "保持日常充电", true], ["断连时提醒", true], [statusProfile.id === "offline" ? "检查距离或网络" : "记录电量历史", true]])}
      <article class="solid-card" style="border-radius:32px;padding:30px">
        <h2 class="panel-title">数据说明</h2>
        <p>电量和连接状态是安全看护可信基础。低电量、离线和关注状态会同步影响首页、小世界和宠物数据页。</p>
      </article>
    </section>
  `;
}

function renderProfile() {
  return `
    <section class="profile-grid">
      <article class="profile-card glass">
        <img src="${ASSETS.catSprout}" alt="花花像素头像" />
        <h1>${pet.name} ${pet.alias}</h1>
        <p class="caption">${pet.age} / ${pet.breed} / ${pet.weight}</p>
      </article>
      <article class="solid-card" style="border-radius:42px;padding:36px">
        <h2 class="panel-title">宠物身份</h2>
        <div class="setting-row"><strong>性格标签</strong><span>黏人、好奇、爱巡逻</span></div>
        <div class="setting-row"><strong>当前项圈</strong><span>${pet.collar}</span></div>
        <div class="setting-row"><strong>当前状态</strong><span>${telemetry.status}</span></div>
      </article>
      <article class="solid-card wide" style="border-radius:42px;padding:36px">
        <h2 class="panel-title">素材资产库</h2>
        <div class="asset-grid" style="margin-top:22px">
          ${["照片素材", "声音素材", "表情包", "今日事件", "角色卡", "小剧场"].map((item) => `
            <div class="asset-tile"><strong>${item}</strong><p class="caption">可补充、替换、生成</p></div>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function syncScale() {
  const stage = document.querySelector(".stage");
  const viewport = document.querySelector(".viewport");
  if (!stage || !viewport) return;
  const scale = Math.min(window.innerWidth / 1440, window.innerHeight / 1024, 1);
  stage.style.setProperty("--stage-scale", scale.toFixed(4));
  viewport.style.width = `${1440 * scale}px`;
  viewport.style.height = `${1024 * scale}px`;
}

window.addEventListener("resize", syncScale);
renderShell();





