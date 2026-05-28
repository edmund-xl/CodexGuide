import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedHtmlPages = 44;
const casePages = [
  "recipes/deck-export-check.html",
  "recipes/browser-page-review.html",
  "recipes/pages-deploy-diagnosis.html",
  "recipes/docs-site-redesign.html",
  "recipes/markdown-knowledge-base.html",
  "recipes/spreadsheet-cleanup.html",
  "recipes/screenshot-to-spec.html",
  "recipes/authenticated-readonly-review.html",
  "recipes/document-evidence-table.html",
  "recipes/api-impact-analysis.html",
  "recipes/release-notes-changelog.html",
  "recipes/automation-scheduled-checks.html",
  "recipes/log-error-diagnosis.html",
  "recipes/remote-service-health-check.html"
];
const caseArtifactFiles = [
  "01-input-brief.md",
  "02-evidence-table.csv",
  "03-result-sample.md",
  "04-acceptance-runbook.md",
  "05-execution-transcript.log",
  "06-delivery-preview.md",
  "07-before-after.md",
  "08-quality-scorecard.json",
  "09-operation-replay.md",
  "10-human-handoff.md",
  "11-field-snapshot.svg",
  "12-acceptance-ledger.json",
  "13-delivery-capture.svg",
  "evidence-board.svg"
];
const caseLibraryManifest = "assets/case-artifacts/index.json";
const caseLibraryHealth = "assets/case-artifacts/library-health.json";
const oldRecipeSlugs = [
  "newsletter-brief.html",
  "docs-site-refresh.html",
  "accessibility-audit.html",
  "photo-archive.html",
  "expense-report.html",
  "podcast-notes.html",
  "api-changelog.html",
  "shop-copy.html",
  "learning-plan.html",
  "support-triage.html",
  "github-release.html"
];
const caseRequiredMarkers = [
  "输入材料",
  "Input Materials",
  "过程证据",
  "Evidence Trail",
  "结果样例",
  "Result Sample",
  "失败与修正",
  "Failures and Corrections",
  "风险边界",
  "Risk Boundaries",
  "人工交接",
  "Human Handoff",
  "验收标准",
  "Acceptance Criteria",
  "可复用任务单",
  "Reusable Work Order",
  "实测材料包",
  "Lab Artifact Pack",
  "现场图",
  "Field Snapshot",
  "实测快照",
  "Run Snapshot",
  "交付截图",
  "Delivery Capture",
  "命令回放",
  "Command Replay",
  "现场记录",
  "Run Log",
  "执行转录",
  "Execution Transcript",
  "交付预览",
  "Delivery Preview",
  "前后对比",
  "Before / After",
  "质量评分",
  "Quality Scorecard",
  "验收总账",
  "Acceptance Ledger",
  "case-dashboard",
  "artifact-grid",
  "case-visual",
  "case-visual-grid",
  "run-snapshot",
  "replay-table",
  "handoff-panel",
  "execution-transcript",
  "delivery-preview",
  "before-after-table",
  "quality-scorecard",
  "ledger-panel",
  "ledger-table",
  "case-capture",
  "evidence-table",
  "command-panel",
  "output-sample",
  "acceptance-checklist"
];
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

for (const oldSlug of oldRecipeSlugs) {
  if (files.includes(`recipes/${oldSlug}`)) {
    errors.push(`Old recipe page still exists: recipes/${oldSlug}`);
  }
}

for (const casePage of casePages) {
  if (!htmlFiles.includes(casePage)) {
    errors.push(`Missing semantic recipe page: ${casePage}`);
  }
  const slug = path.basename(casePage, ".html");
  for (const artifact of caseArtifactFiles) {
    const artifactPath = `assets/case-artifacts/${slug}/${artifact}`;
    if (!files.includes(artifactPath)) {
      errors.push(`Missing recipe artifact: ${artifactPath}`);
    }
  }
}

if (!files.includes(caseLibraryManifest)) {
  errors.push(`Missing recipe library manifest: ${caseLibraryManifest}`);
} else {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, caseLibraryManifest), "utf8"));
  if (manifest.caseCount !== casePages.length) {
    errors.push(`Recipe library manifest case count mismatch: ${manifest.caseCount}`);
  }
  if (manifest.artifactFilesPerCase !== caseArtifactFiles.length) {
    errors.push(`Recipe library manifest artifact count mismatch: ${manifest.artifactFilesPerCase}`);
  }
  if (manifest.artifactCount !== casePages.length * caseArtifactFiles.length) {
    errors.push(`Recipe library manifest total artifact count mismatch: ${manifest.artifactCount}`);
  }
  if (!Array.isArray(manifest.requiredArtifactFiles) || manifest.requiredArtifactFiles.length !== caseArtifactFiles.length) {
    errors.push("Recipe library manifest required artifact files are invalid.");
  }
  if (!Array.isArray(manifest.cases) || manifest.cases.length !== casePages.length) {
    errors.push("Recipe library manifest cases array is invalid.");
  } else {
    for (const item of manifest.cases) {
      if (!item.fieldSnapshot || !item.acceptanceLedger) {
        errors.push(`Recipe library manifest missing field snapshot or acceptance ledger for ${item.slug}.`);
      }
      if (!item.deliveryCapture) {
        errors.push(`Recipe library manifest missing delivery capture for ${item.slug}.`);
      }
      if (item.artifactCount !== caseArtifactFiles.length) {
        errors.push(`Recipe library manifest artifact count mismatch for ${item.slug}.`);
      }
    }
  }
}

if (!files.includes(caseLibraryHealth)) {
  errors.push(`Missing recipe library health report: ${caseLibraryHealth}`);
} else {
  const health = JSON.parse(fs.readFileSync(path.join(root, caseLibraryHealth), "utf8"));
  if (health.caseCount !== casePages.length) {
    errors.push(`Recipe library health case count mismatch: ${health.caseCount}`);
  }
  if (health.artifactFilesPerCase !== caseArtifactFiles.length) {
    errors.push(`Recipe library health artifact count mismatch: ${health.artifactFilesPerCase}`);
  }
  if (health.artifactCount !== casePages.length * caseArtifactFiles.length) {
    errors.push(`Recipe library health total artifact count mismatch: ${health.artifactCount}`);
  }
  if (health.fieldSnapshots !== casePages.length || health.acceptanceLedgers !== casePages.length || health.deliveryCaptures !== casePages.length) {
    errors.push("Recipe library health visual or ledger counts are invalid.");
  }
  if (!Array.isArray(health.cases) || health.cases.length !== casePages.length) {
    errors.push("Recipe library health cases array is invalid.");
  } else {
    for (const item of health.cases) {
      if (!item.fieldSnapshot || !item.acceptanceLedger || !item.deliveryCapture) {
        errors.push(`Recipe library health missing visual proof paths for ${item.slug}.`);
      }
      if (item.artifactCount !== caseArtifactFiles.length) {
        errors.push(`Recipe library health artifact count mismatch for ${item.slug}.`);
      }
    }
  }
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
  if (casePages.includes(file)) {
    for (const marker of caseRequiredMarkers) {
      if (!html.includes(marker)) {
        errors.push(`${file}: missing case marker ${marker}.`);
      }
    }
  }
  if (file === "recipes/index.html") {
    for (const marker of ["case-library-stats", "library-health-panel", "library-health-stats", "maturity-board-table", "completion-board-table", "library-health.json", "case-filter-bar", "case-index-card", "data-case-filter", "data-case-risk"]) {
      if (!html.includes(marker)) {
        errors.push(`${file}: missing recipe index marker ${marker}.`);
      }
    }
  }
  for (const oldSlug of oldRecipeSlugs) {
    if (html.includes(oldSlug)) {
      errors.push(`${file}: contains old recipe slug ${oldSlug}.`);
    }
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
  for (const oldSlug of oldRecipeSlugs) {
    if (body.includes(oldSlug)) {
      errors.push(`${file}: contains old recipe slug ${oldSlug}.`);
    }
  }
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
