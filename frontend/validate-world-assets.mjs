import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, "src/app.js"))
  ? cwd
  : fs.existsSync(path.join(cwd, "frontend/src/app.js"))
    ? path.join(cwd, "frontend")
    : cwd;
const manifestPath = path.join(root, "assets/generated/world/asset-manifest.json");
const appPath = path.join(root, "src/app.js");
const cssPath = path.join(root, "src/styles.css");

const requiredSlots = [
  "petIdle",
  "sceneBackground",
  "bookshelf",
  "lamp",
  "sofa",
  "rug",
  "table",
  "toy",
  "bowl",
  "tv",
  "plant",
  "pet-bed",
  "door-mat",
];

const validStatuses = new Set(["reused", "ready", "needs-image2", "placeholder"]);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const app = fs.readFileSync(appPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const assets = new Map(manifest.assets.map((asset) => [asset.slot, asset]));
const failures = [];

for (const slot of requiredSlots) {
  const asset = assets.get(slot);
  if (!asset) {
    failures.push(`manifest missing slot: ${slot}`);
    continue;
  }

  if (!validStatuses.has(asset.status)) {
    failures.push(`${slot} has invalid status: ${asset.status}`);
  }

  if (slot === "sceneBackground" && asset.transparentBackground !== false) {
    failures.push("sceneBackground must be marked transparentBackground: false");
  }

  const appKey = slot.includes("-") ? `"${slot}"` : `${slot}:`;
  if (!app.includes(appKey)) {
    failures.push(`app.js missing worldGeneratedAssets slot: ${slot}`);
  }

  if ((asset.status === "reused" || asset.status === "ready") && !asset.path) {
    failures.push(`${slot} is ${asset.status} but path is empty`);
  }

  if (asset.path) {
    const resolved = path.resolve(root, asset.path.replace(/^\.\//, ""));
    if (!fs.existsSync(resolved)) {
      failures.push(`${slot} file does not exist: ${asset.path}`);
    }
  }
}

const sceneBackgroundHooks = [
  [app, "getWorldSceneStyle", "app.js missing getWorldSceneStyle helper"],
  [app, "has-scene-asset", "app.js missing has-scene-asset class hook"],
  [app, "--scene-bg", "app.js missing --scene-bg style variable"],
  [css, ".world-scene.has-scene-asset", "styles.css missing scene background asset class"],
  [css, "var(--scene-bg)", "styles.css missing scene background CSS variable"],
];

for (const [source, token, message] of sceneBackgroundHooks) {
  if (!source.includes(token)) failures.push(message);
}
if (failures.length) {
  console.error("World asset validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`World asset validation passed: ${requiredSlots.length} slots checked.`);