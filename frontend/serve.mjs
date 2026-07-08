import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4177);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function resolvePath(url) {
  const parsed = new URL(url, `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const file = pathname === "/" ? "/index.html" : pathname;
  const full = normalize(join(root, file));
  if (!full.startsWith(root)) return null;
  return full;
}

createServer(async (req, res) => {
  const file = resolvePath(req.url || "/");
  if (!file) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`PawRoom frontend preview: http://127.0.0.1:${port}`);
});
