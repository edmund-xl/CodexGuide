import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const basePath = "/CodexGuide";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".log", "text/plain; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"]
]);

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store"
  });
  res.end(body);
}

function resolveRequestPath(urlPath) {
  let requestPath = decodeURIComponent(urlPath);

  if (requestPath === basePath) {
    return { redirect: `${basePath}/` };
  }

  if (requestPath.startsWith(`${basePath}/`)) {
    requestPath = requestPath.slice(basePath.length);
  }

  if (requestPath === "/") {
    requestPath = "/index.html";
  }

  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(root, safePath);

  if (!absolutePath.startsWith(root)) {
    return { forbidden: true };
  }

  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    return { filePath: path.join(absolutePath, "index.html") };
  }

  return { filePath: absolutePath };
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${host}:${port}`);
  const resolved = resolveRequestPath(requestUrl.pathname);

  if (resolved.redirect) {
    res.writeHead(302, { location: resolved.redirect });
    res.end();
    return;
  }

  if (resolved.forbidden) {
    send(res, 403, "Forbidden");
    return;
  }

  if (!resolved.filePath || !fs.existsSync(resolved.filePath) || fs.statSync(resolved.filePath).isDirectory()) {
    send(res, 404, "Not found");
    return;
  }

  const extension = path.extname(resolved.filePath);
  const type = mimeTypes.get(extension) || "application/octet-stream";
  res.writeHead(200, {
    "content-type": type,
    "cache-control": "no-store"
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  fs.createReadStream(resolved.filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Local site: http://${host}:${port}/`);
  console.log(`Pages-compatible path: http://${host}:${port}${basePath}/`);
});
