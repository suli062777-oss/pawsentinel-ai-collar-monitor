import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const frontendRoot = fs.existsSync(path.join(cwd, "src/app.js"))
  ? cwd
  : fs.existsSync(path.join(cwd, "frontend/src/app.js"))
    ? path.join(cwd, "frontend")
    : cwd;
const projectRoot = path.basename(frontendRoot) === "frontend" ? path.dirname(frontendRoot) : cwd;
const screenshotDir = path.resolve(
  cwd,
  process.argv[2] || path.join(projectRoot, "docs/assets/frontend-screenshots-v0.9"),
);

const requiredPages = [
  "home",
  "world",
  "data",
  "journey",
  "settings",
  "create",
  "battery",
  "profile",
];

const copyFiles = [
  ["frontend/index.html", path.join(frontendRoot, "index.html")],
  ["frontend/README.md", path.join(frontendRoot, "README.md")],
  ["frontend/src/app.js", path.join(frontendRoot, "src/app.js")],
  ["frontend/src/styles.css", path.join(frontendRoot, "src/styles.css")],
  ["frontend/assets/generated/world/asset-manifest.json", path.join(frontendRoot, "assets/generated/world/asset-manifest.json")],
  ["docs/pawroom-world-p0-asset-intake-checklist-v0.1.md", path.join(projectRoot, "docs/pawroom-world-p0-asset-intake-checklist-v0.1.md")],
];

const mojibakePatterns = [
  0xfffd,
  0x947a,
  0x6d93,
  0x5b80,
  0x59f3,
  0x9366,
  0x7039,
  0x6924,
  0x7470,
  0x9286,
  0x951b,
  0x7ecb,
  0x59dd,
  0x72b5,
  0x52eb,
  0x6b91,
  0xe201,
  0xe0a2,
].map((codePoint) => String.fromCodePoint(codePoint))

const failures = [];

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("not a PNG file");
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bytes: buffer.length,
  };
}

for (const page of requiredPages) {
  const screenshotPath = path.join(screenshotDir, `${page}.png`);
  if (!fs.existsSync(screenshotPath)) {
    failures.push(`missing screenshot: ${page}.png`);
    continue;
  }

  try {
    const size = readPngSize(screenshotPath);
    if (size.width !== 1440 || size.height !== 1024) {
      failures.push(`${page}.png size is ${size.width}x${size.height}, expected 1440x1024`);
    }
    if (size.bytes < 50000) {
      failures.push(`${page}.png is suspiciously small (${size.bytes} bytes)`);
    }
  } catch (error) {
    failures.push(`${page}.png cannot be inspected: ${error.message}`);
  }
}

for (const [label, filePath] of copyFiles) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing review file: ${label}`);
    continue;
  }
  const text = fs.readFileSync(filePath, "utf8");
  for (const pattern of mojibakePatterns) {
    if (text.includes(pattern)) {
      failures.push(`possible mojibake "${pattern}" in ${label}`);
      break;
    }
  }
}

if (failures.length) {
  console.error("PawRoom restoration audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PawRoom restoration audit passed: ${requiredPages.length} screenshots and ${copyFiles.length} text files checked.`);