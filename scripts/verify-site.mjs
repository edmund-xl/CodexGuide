import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedHtmlPages = 43;
const phrase = (...codes) => String.fromCodePoint(...codes);
const forbiddenPatterns = [
  ["codex", "guide", "\\.ai"],
  ["free", "style", "fly"],
  ["Clean", "-room"],
  ["clean", "-room"],
  ["CLEAN", "ROOM"],
  phrase(0x539f, 0x521b, 0x8fb9, 0x754c),
  phrase(0x53c2, 0x8003),
  phrase(0x6765, 0x6e90),
  phrase(0x53c2, 0x8003, 0x6765, 0x6e90),
  phrase(0x6765, 0x6e90, 0x4e0e, 0x81f4, 0x8c22),
  phrase(0x81f4, 0x8c22),
  phrase(0x5916, 0x90e8, 0x7ad9, 0x70b9),
  phrase(0x7b2c, 0x4e09, 0x65b9, 0x7ad9, 0x70b9),
  ["source", "-origin"],
  ["source", " origin"],
  ["Sources", " and ", "Credits"],
  ["Sources", " and ", "credits"],
  phrase(0x5916, 0x90e8, 0x8d44, 0x6599),
  phrase(0x72ec, 0x7acb, 0x7f16, 0x5199),
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
].map((value) => new RegExp(Array.isArray(value) ? value.join("") : value, "i"));

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
  const zhIndex = html.indexOf('data-language-section="zh"');
  const enIndex = html.indexOf('data-language-section="en"');
  if (zhIndex === -1 || enIndex === -1) {
    errors.push(`${file}: missing separated Chinese/English sections.`);
  }
  if (zhIndex !== -1 && enIndex !== -1 && zhIndex > enIndex) {
    errors.push(`${file}: English section appears before Chinese section.`);
  }
  if (html.includes(["bilingual", "-pair"].join("")) || html.includes(["lang", "-card"].join(""))) {
    errors.push(`${file}: contains mixed bilingual pair layout.`);
  }
  if (!html.includes("中文") || !html.includes("English")) {
    errors.push(`${file}: missing visible Chinese/English labels.`);
  }
  if (file !== "index.html" && (!/文档质量验收标准/i.test(html) || !/Documentation Quality Acceptance Criteria/i.test(html))) {
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

console.log(`Verified ${htmlFiles.length} HTML pages: separated Chinese-first bilingual sections, acceptance criteria, links, and forbidden keywords all pass.`);
