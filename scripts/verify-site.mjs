import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedHtmlPages = 43;
const forbiddenPatterns = [
  ["交", "流", "群"],
  ["codex", "交", "流", "群"],
  ["苍", "何"],
  ["桌", "面", "宠", "物"],
  ["PPT", " Skill"],
  ["Draw", "\\.io"],
  ["Playwright", " MCP"],
  ["Hyper", "Frames"],
  ["飞", "书"],
  ["DK", "File"]
].map((parts) => new RegExp(parts.join(""), "i"));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") return [];
      return walk(full);
    }
    return [full];
  });
}

const files = walk(root).map((file) => path.relative(root, file));
const htmlFiles = files.filter((file) => file.endsWith(".html")).sort();
const errors = [];

if (htmlFiles.length !== expectedHtmlPages) {
  errors.push(`Expected ${expectedHtmlPages} HTML pages, found ${htmlFiles.length}.`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (!html.includes('data-bilingual="true"')) {
    errors.push(`${file}: missing bilingual content blocks.`);
  }
  if (!html.includes("中文") || !html.includes("English")) {
    errors.push(`${file}: missing visible Chinese/English labels.`);
  }
  if (file !== "index.html" && (!/验收标准/i.test(html) || !/Acceptance criteria/i.test(html))) {
    errors.push(`${file}: missing acceptance criteria.`);
  }
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(html)) {
      errors.push(`${file}: contains forbidden legacy/reference keyword ${pattern}.`);
    }
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    const target = raw.split("#")[0];
    if (!target) continue;
    const resolved = path.resolve(root, path.dirname(file), target);
    if (!fs.existsSync(resolved)) {
      errors.push(`${file}: missing local target ${raw}`);
    }
  }
}

for (const file of files.filter((item) => /\.(md|mjs|js|css|html)$/.test(item) && item !== "scripts/verify-site.mjs")) {
  const body = fs.readFileSync(path.join(root, file), "utf8");
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(body)) {
      errors.push(`${file}: contains forbidden legacy/reference keyword ${pattern}.`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML pages: bilingual coverage, acceptance criteria, links, and forbidden keywords all pass.`);
