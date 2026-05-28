import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const verifiedDate = "2026-05-28";

const officialSources = [
  ["OpenAI Codex", "https://openai.com/codex/"],
  ["Codex CLI documentation", "https://developers.openai.com/codex/cli"],
  ["Codex agent internet access", "https://developers.openai.com/codex/cloud/internet-access"],
  ["Using Codex with your ChatGPT plan", "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan"],
  ["OpenAI code generation guide", "https://developers.openai.com/api/docs/guides/code-generation"]
];

const pages = [];

const configPages = [
  ["configuration/index.html", "配置总览"],
  ["configuration/cli-options.html", "CLI 选项与命令"],
  ["configuration/config-file.html", "config.toml 任务配置"],
  ["configuration/mcp-skills-subagents.html", "MCP、Skills 与 Subagents"],
  ["configuration/security-admin.html", "安全与审批"]
];

const resourcePages = [
  ["practice/index.html", "实践方法"],
  ["reference/index.html", "官方资料"],
  ["contribute/roadmap.html", "共建路线图"]
];

const tutorials = [
  ["guide/01-desktop-install.html", "01 安装并打开桌面端", "准备一个低风险桌面任务，让第一次体验只围绕文件副本和可检查输出。"],
  ["guide/02-account-plan.html", "02 准备账号、计划与使用边界", "确认你使用的计划、数据控制和适合尝试的任务类型。"],
  ["guide/03-app-tour.html", "03 认识桌面 App 的任务界面", "理解任务区、文件区、权限提示、差异预览和结果回看。"],
  ["guide/04-mobile-handoff.html", "04 手机发起、桌面接手", "把随手想到的任务从手机记录下来，再回到电脑完成核查。"],
  ["guide/05-first-task.html", "05 完成第一个低风险任务", "用一份资料副本跑通说明、执行、验证和复盘。"],
  ["guide/06-queue-parallel.html", "06 排队、并行与任务节奏", "区分顺序任务、并行任务和需要等待用户确认的任务。"],
  ["guide/07-permission-review.html", "07 权限弹窗怎么判断", "用文件、命令、网络和账号四类问题判断是否授权。"],
  ["guide/08-skill-plugin-library.html", "08 用 Skills 与插件扩展任务", "理解 Skills、MCP 和插件如何把 Codex 接入更多工作流。"],
  ["guide/09-automation-checks.html", "09 自动化前的确认清单", "把重复任务变成自动化之前，先定义触发条件、退出条件和失败提醒。"],
  ["guide/10-personal-workbench.html", "10 搭建个人任务工作台", "用固定文件夹、模板和检查清单沉淀自己的常用任务。"],
  ["guide/11-cli-install-login.html", "11 CLI 安装与登录", "从终端启动 Codex，理解它能读取、修改并运行所选目录中的代码。"],
  ["guide/12-cli-first-edit.html", "12 第一次让 Codex 改一个小项目", "让 Codex 先计划，再小步修改，最后用测试或页面检查验收。"],
  ["guide/13-vscode-flow.html", "13 在 VS Code 中协同修改", "在编辑器里使用 Codex 解释局部代码、提出补丁和整理提交说明。"],
  ["guide/14-project-rules.html", "14 用 AGENTS.md 写项目规则", "把项目命令、风格、禁区和验收方式写进仓库说明。"],
  ["guide/15-sandbox-approvals.html", "15 沙盒、审批与回退", "建立文件、网络、凭据和高风险命令的审批边界。"],
  ["guide/16-cloud-tasks.html", "16 云端任务与本地接力", "把长任务交给云端执行，再在本地检查差异和结果。"],
  ["guide/17-troubleshooting.html", "17 排障手册", "按登录、权限、依赖、网络、执行和输出质量定位问题。"]
];

const recipes = [
  ["recipes/newsletter-brief.html", "01 Codex × Newsletter：用资料包生成周报草稿", "把零散链接、会议摘录和产品更新整理成一版可审阅周报。"],
  ["recipes/spreadsheet-cleanup.html", "02 Codex × Spreadsheet：清理 CSV 并生成核对表", "识别重复行、缺失字段和异常金额，再输出修正建议。"],
  ["recipes/docs-site-refresh.html", "03 Codex × Docs：批量更新文档站链接", "扫描失效链接、替换旧路径，并生成变更清单。"],
  ["recipes/accessibility-audit.html", "04 Codex × Browser：做页面无障碍巡检", "用浏览器检查标题层级、按钮文案、键盘路径和截图证据。"],
  ["recipes/photo-archive.html", "05 Codex × Local Files：整理照片命名与索引", "把活动照片按日期、场景和用途生成可检索目录。"],
  ["recipes/expense-report.html", "06 Codex × Expense Notes：汇总报销材料", "从票据说明中抽取金额、用途和待补材料。"],
  ["recipes/podcast-notes.html", "07 Codex × Transcript：把访谈稿变成选题库", "从长转录中提取观点、金句、章节和后续选题。"],
  ["recipes/api-changelog.html", "08 Codex × API Changelog：追踪接口变更", "对比版本记录，输出对业务流程的影响清单。"],
  ["recipes/shop-copy.html", "09 Codex × Product Copy：生成商品说明", "把规格、卖点和限制条件整理成电商详情草稿。"],
  ["recipes/learning-plan.html", "10 Codex × Learning Plan：生成个人学习路线", "根据目标、可用时间和资料生成四周学习计划。"],
  ["recipes/support-triage.html", "11 Codex × Support Inbox：汇总客服问题", "把用户反馈归类为 Bug、疑问、账单和体验建议。"],
  ["recipes/markdown-knowledge-base.html", "12 Codex × Markdown KB：重整知识库字段", "把散乱笔记迁移成统一 frontmatter 和目录索引。"],
  ["recipes/github-release.html", "13 Codex × GitHub Releases：生成发布说明", "从提交、Issue 和 PR 摘要整理可发布的 changelog。"],
  ["recipes/credits.html", "参考来源与致谢", "列出官方来源、原创边界和可复用许可。"]
];

const recipeNavPages = [["recipes/index.html", "案例总览"], ...recipes];

function addPage(page) {
  pages.push(page);
  return page;
}

addPage({
  path: "guide/00-overview.html",
  title: "学习路线",
  navTitle: "学习路线",
  group: "教程",
  summary: "三条路线覆盖普通用户、个人开发者和团队落地。你不需要一次读完整站，先选与你当前任务最接近的路径。",
  sections: [
    section("路线一：第一次使用 Codex", "适合没有工程背景、只想把资料整理、文档检查或网页修改做得更稳的人。", [
      "先使用桌面端或网页端完成一个低风险任务。",
      "只处理副本，不上传敏感材料。",
      "把检查方式写进任务描述。"
    ]),
    section("路线二：本地项目提效", "适合已经在维护网站、脚本或小项目的人。重点不是一次改很多，而是让 Codex 形成可验证的小步循环。", [
      "让 Codex 先读项目结构并提出计划。",
      "每次只改一个明确问题。",
      "用测试、截图、差异和日志验收。"
    ]),
    section("路线三：团队规范", "适合把 Codex 引入多人项目的人。团队要先统一边界，再追求速度。", [
      "用 AGENTS.md 记录命令、风格和禁区。",
      "规定什么时候必须人工审批。",
      "把成功任务沉淀成案例和模板。"
    ])
  ],
  links: [
    ["guide/01-desktop-install.html", "从桌面端开始"],
    ["guide/11-cli-install-login.html", "从 CLI 开始"],
    ["guide/14-project-rules.html", "从团队规则开始"]
  ]
});

addPage({
  path: "platform/index.html",
  title: "入口地图",
  navTitle: "入口地图",
  group: "入口",
  summary: "同一个 Codex 能力，在不同入口里的节奏不同。先选入口，再设计任务。",
  image: "entry-map.svg",
  sections: [
    section("如何选择入口", "如果你只想整理资料或检查文案，先从 App 或 ChatGPT 中的 Codex 开始。如果你在项目目录里工作，CLI 更适合小步修改和运行检查。贴近编辑器的解释、局部改动和 Review 可以放在 IDE。", [
      "App：适合跨文件、跨工具、需要可视检查的任务。",
      "CLI：适合仓库、脚本、测试、命令行验证。",
      "IDE：适合局部代码解释、重构建议和上下文内修改。",
      "Cloud/Web：适合长任务、排队任务和需要异步回看的任务。"
    ]),
    section("入口选择的判断题", "选择入口时先问三个问题：任务材料在哪里，结果要在哪里检查，失败时如何回退。", [
      "材料在本地文件夹：优先 CLI 或桌面端。",
      "结果要看页面：配合浏览器截图或本地预览。",
      "需要长时间运行：考虑云端任务，但保留人工 Review。"
    ])
  ],
  links: [["guide/03-app-tour.html", "了解桌面 App"], ["guide/11-cli-install-login.html", "安装 CLI"], ["guide/13-vscode-flow.html", "VS Code 协作"]]
});

const configurationContent = [
  ["configuration/index.html", "配置总览", "把配置理解成任务边界，而不是炫技清单。普通用户只需要先掌握模型、权限、网络、项目规则四件事。"],
  ["configuration/cli-options.html", "CLI 选项与命令", "CLI 适合在本地目录里读文件、改代码、跑检查。第一次使用时，先让 Codex 解释它准备运行的命令。"],
  ["configuration/config-file.html", "config.toml 任务配置", "配置文件适合沉淀常用模型、审批模式和工具偏好。不要把密钥或私人凭据写进配置示例。"],
  ["configuration/mcp-skills-subagents.html", "MCP、Skills 与 Subagents", "MCP 连接工具，Skills 沉淀工作方法，Subagents 拆分复杂任务。先用最少工具跑通，再逐步扩展。"],
  ["configuration/security-admin.html", "安全与审批", "安全配置的目标是让任务可解释、可撤回、可审计。文件、网络、命令和凭据都要有边界。"]
];

configurationContent.forEach(([pagePath, title, summary]) => {
  addPage({
    path: pagePath,
    title,
    navTitle: title,
    group: "配置",
    summary,
    sections: [
      section("最小可用配置", "先把默认行为调到你能理解和检查的程度，再增加高级能力。", [
        "明确 Codex 可以读取的目录。",
        "高风险命令先要求解释和确认。",
        "联网只在任务确实需要外部资料时开启。",
        "把项目规则写在仓库内，而不是只写在聊天里。"
      ]),
      section("常见误区", "配置不是越开放越高效。权限越大，检查成本也越高。", [
        "不要把整个电脑目录作为默认工作区。",
        "不要在不懂命令含义时直接允许执行。",
        "不要把外部网页里的指令当成用户命令。"
      ]),
      section("验收清单", "配置改完后，用一个低风险任务验证。", [
        "Codex 能否解释自己会看哪些文件。",
        "Codex 能否在执行前列出计划。",
        "任务结束后是否留下可读的差异、日志或输出。"
      ])
    ],
    links: [["guide/15-sandbox-approvals.html", "继续看沙盒与审批"], ["reference/index.html", "查看官方资料"]]
  });
});

addPage({
  path: "practice/index.html",
  title: "实践方法",
  navTitle: "实践方法",
  group: "资源",
  summary: "把每次任务拆成说明、探索、实施、验证、复盘五段，Codex 才能稳定交付。",
  image: "task-loop.svg",
  sections: [
    section("任务说明", "不要只说“帮我优化一下”。说明应该包含目标、材料、禁止事项、上下文和期望输出。", [
      "目标：最终要得到什么。",
      "范围：只看哪些文件或资料。",
      "约束：哪些内容不要改、不要猜、不要发送。",
      "输出：格式、长度、文件名和检查方式。"
    ]),
    section("验证方式", "验证不是可选项。没有验证方式的任务，很容易变成看起来完成了。", [
      "文字任务用事实清单检查。",
      "网页任务用截图和交互路径检查。",
      "代码任务用测试、构建和 diff 检查。",
      "资料任务用来源和缺口清单检查。"
    ])
  ],
  links: [["guide/05-first-task.html", "跑通第一个任务"], ["recipes/index.html", "查看案例库"]]
});

addPage({
  path: "reference/index.html",
  title: "官方资料",
  navTitle: "官方资料",
  group: "资源",
  summary: `最后核对：${verifiedDate}。涉及功能、价格、限额、模型、数据控制和安全策略时，以 OpenAI 官方资料为准。`,
  sections: [
    section("建议固定核对的页面", "这些链接用于核对 Codex 定位、CLI 能力、联网风险和账号数据控制。", officialSources.map(([label, url]) => `<a href="${url}">${label}</a>`), true),
    section("写作使用规则", "本站只引用官方事实，不复刻官方文案。引用时优先概括，并保留核对日期。", [
      "动态信息不要写死为永久结论。",
      "价格、额度和模型默认值必须回查官方页面。",
      "安全说明要保守，不替代公司制度。"
    ])
  ],
  links: [["CLEANROOM.md", "查看原创边界"], ["contribute/roadmap.html", "参与共建"]]
});

addPage({
  path: "contribute/roadmap.html",
  title: "共建路线图",
  navTitle: "共建路线图",
  group: "资源",
  summary: "这是面向 GitHub 开源维护的路线图，不包含外部群聊入口。贡献以 Issue、PR 和可验证内容为主。",
  sections: [
    section("近期内容", "先把普通用户路线补齐，再扩展到团队和自动化。", [
      "补全 17 节教程的截图占位和检查清单。",
      "为 13 个案例补充输入材料模板。",
      "增加 GitHub Pages 发布说明。",
      "建立事实核对 Issue 模板。"
    ]),
    section("贡献标准", "每个贡献都需要说明来源、验证方式和适用读者。", [
      "不提交第三方站点复制内容。",
      "不加入群聊推广入口。",
      "案例要能替换成读者自己的项目。"
    ])
  ],
  links: [["CONTRIBUTING.md", "贡献指南"], ["recipes/credits.html", "来源与致谢"]]
});

tutorials.forEach(([pagePath, title, goal], index) => {
  addPage({
    path: pagePath,
    title,
    navTitle: title,
    group: "教程",
    summary: goal,
    sections: [
      section("本节目标", goal, [
        "用一个可回退的小任务练习。",
        "让 Codex 先说明计划，再执行。",
        "结束时保留检查证据。"
      ]),
      section("操作框架", "每节都按照同一套格式推进，方便读者形成习惯。", [
        "准备材料：只提供完成任务所需的文件或链接。",
        "发出请求：写清目标、范围、约束和输出格式。",
        "确认权限：看懂文件、网络、命令和账号动作。",
        "检查结果：用清单、截图、测试或 diff 验收。"
      ]),
      section("建议练习", "完成一个 15 到 30 分钟的低风险练习。", [
        index < 10 ? "整理一份资料副本，生成结构化说明。" : "在一个演示仓库里修改小问题并运行检查。",
        "把成功请求保存为自己的任务模板。",
        "记录 Codex 的误解点，下一次提前写进约束。"
      ])
    ],
    links: [
      index < tutorials.length - 1 ? [tutorials[index + 1][0], "下一节"] : ["recipes/index.html", "进入案例库"],
      ["guide/00-overview.html", "返回学习路线"]
    ]
  });
});

addPage({
  path: "recipes/index.html",
  title: "案例总览",
  navTitle: "案例总览",
  group: "实战案例",
  summary: "案例库提供可改写的任务样本。每个案例都换成你自己的材料、工具和验收方式。",
  sections: [
    section("案例怎么读", "不要照抄案例里的请求。先看任务拆解，再替换成自己的输入材料。", [
      "看目标：这个案例最终交付什么。",
      "看材料：它允许 Codex 读取哪些内容。",
      "看边界：哪些动作必须确认。",
      "看验证：如何证明结果能用。"
    ]),
    section("本库案例", "以下案例与参考站不同，覆盖内容、资料、文件、网页、支持和发布流程。", recipes.slice(0, 13).map(([href, label]) => `<a href="${relativeLink("recipes/index.html", href)}">${label}</a>`), true)
  ],
  links: [["recipes/newsletter-brief.html", "从周报案例开始"], ["practice/index.html", "先看实践方法"]]
});

recipes.slice(0, 13).forEach(([pagePath, title, goal], index) => {
  addPage({
    path: pagePath,
    title,
    navTitle: title,
    group: "实战案例",
    summary: goal,
    sections: [
      section("适用场景", goal, [
        "你已经有一组明确材料。",
        "结果需要人工确认后再对外发送或发布。",
        "任务可以拆成输入、处理、输出和检查。"
      ]),
      section("任务写法", "把请求写成可审计的工作单，而不是一句泛泛的命令。", [
        "请先列出你会读取的材料和处理步骤。",
        "不要补充材料之外的事实。",
        "生成结果后列出不确定项和需要人工确认的地方。"
      ]),
      section("验收方式", "这个案例的重点是可复用，不是一次生成完美结果。", [
        index % 3 === 0 ? "用截图或预览确认排版和交互。" : "用表格或清单核对事实字段。",
        "保留原始材料和输出版本。",
        "把可复用请求整理进个人模板库。"
      ])
    ],
    links: [
      index < 12 ? [recipes[index + 1][0], "下一个案例"] : ["recipes/credits.html", "来源与致谢"],
      ["recipes/index.html", "返回案例总览"]
    ]
  });
});

addPage({
  path: "recipes/credits.html",
  title: "参考来源与致谢",
  navTitle: "参考来源与致谢",
  group: "实战案例",
  summary: "本站是原创开源文档项目。第三方站点只作为布局和目录参考，不复用其内容资产。",
  sections: [
    section("原创边界", "本站案例、图片、页面代码和文案均为新写内容。", [
      "不包含外部群聊入口。",
      "不复制参考站案例。",
      "不复用参考站截图、图标、CSS 或页面源码。"
    ]),
    section("官方资料", "涉及 Codex 功能和安全策略时，请回到官方页面核对。", officialSources.map(([label, url]) => `<a href="${url}">${label}</a>`), true)
  ],
  links: [["CLEANROOM.md", "Clean-room notes"], ["LICENSE", "MIT License"]]
});

function section(title, body, bullets = [], bulletsAreHtml = false) {
  return { title, body, bullets, bulletsAreHtml };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(path.join(root, filePath)), { recursive: true });
}

function write(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(path.join(root, filePath), content, "utf8");
}

function relativeLink(from, to) {
  if (/^https?:\/\//.test(to) || to.startsWith("#")) return to;
  const fromDir = path.posix.dirname(from);
  const target = to === "index.html" ? "index.html" : to;
  let rel = path.posix.relative(fromDir, target);
  if (!rel) rel = path.posix.basename(target);
  return rel;
}

function pageByPath(filePath) {
  return pages.find((page) => page.path === filePath);
}

function navLink(from, target, label) {
  return `<a href="${relativeLink(from, target)}"${from === target ? ' aria-current="page"' : ""}>${escapeHtml(label)}</a>`;
}

function topNav(currentPath) {
  const group = (label, links) => `
    <details class="nav-dropdown">
      <summary>${escapeHtml(label)}</summary>
      <div class="dropdown-menu">
        ${links.map(([href, labelText]) => navLink(currentPath, href, labelText)).join("")}
      </div>
    </details>`;

  return `
    <header class="site-header">
      <a class="brand" href="${relativeLink(currentPath, "index.html")}" aria-label="Codex Everyday Guide 首页">
        <img src="${relativeLink(currentPath, "assets/logo.svg")}" alt="" width="42" height="42">
        <strong>Codex Everyday</strong>
      </a>
      <button class="menu-button" type="button" data-menu-toggle aria-expanded="false" aria-controls="topNav">目录</button>
      <nav class="top-nav" id="topNav" aria-label="主导航">
        ${navLink(currentPath, "index.html", "首页")}
        ${navLink(currentPath, "guide/00-overview.html", "学习路线")}
        ${navLink(currentPath, "platform/index.html", "入口地图")}
        ${group("配置", configPages)}
        ${group("资源", resourcePages)}
        ${group("教程", tutorials)}
        ${group("实战案例", recipeNavPages)}
      </nav>
      <div class="header-actions">
        <a class="icon-link" href="https://github.com/" aria-label="GitHub">GH</a>
        <button class="search-trigger" type="button" data-open-search>搜索 <kbd>⌘</kbd><kbd>K</kbd></button>
      </div>
    </header>`;
}

function searchDialog(currentPath) {
  const items = pages.map((page) => {
    const text = `${page.navTitle || page.title} ${page.group} ${page.summary}`;
    return `<a data-search-item="${escapeHtml(text)}" href="${relativeLink(currentPath, page.path)}"><strong>${escapeHtml(page.navTitle || page.title)}</strong><span>${escapeHtml(page.group || "页面")}</span></a>`;
  }).join("");

  return `
    <dialog class="search-dialog" id="siteSearch">
      <form method="dialog" class="search-head">
        <strong>搜索文档</strong>
        <button type="submit" aria-label="关闭搜索">×</button>
      </form>
      <input id="siteSearchInput" type="search" placeholder="输入：权限、入口、案例、CLI">
      <div class="search-results">${items}</div>
    </dialog>`;
}

function sidebar(currentPath) {
  const groups = [
    ["基础", [["guide/00-overview.html", "学习路线"], ["platform/index.html", "入口地图"]]],
    ["配置", configPages],
    ["教程", tutorials],
    ["实战案例", recipeNavPages],
    ["资源", resourcePages]
  ];

  return `
    <aside class="doc-sidebar">
      ${groups.map(([label, links]) => `
        <section>
          <h2>${escapeHtml(label)}</h2>
          ${links.map(([href, labelText]) => navLink(currentPath, href, labelText)).join("")}
        </section>
      `).join("")}
    </aside>`;
}

function layout({ currentPath, title, description, body, home = false }) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Codex Everyday Guide</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="stylesheet" href="${relativeLink(currentPath, "styles.css")}">
  </head>
  <body${home ? ' class="home-page"' : ""}>
    ${topNav(currentPath)}
    ${body}
    <button class="back-top" type="button" data-back-top aria-label="返回顶部">↑</button>
    ${footer(currentPath)}
    ${searchDialog(currentPath)}
    <script src="${relativeLink(currentPath, "script.js")}"></script>
  </body>
</html>`;
}

function footer(currentPath) {
  return `
    <footer class="site-footer">
      <div>
        <strong>Codex Everyday Guide</strong>
        <span>基础资料最后核对日期：${verifiedDate}。功能、价格、可用性和安全策略以 OpenAI 官方资料为准。</span>
      </div>
      <nav aria-label="页脚导航">
        <a href="${relativeLink(currentPath, "CLEANROOM.md")}">原创边界</a>
        <a href="${relativeLink(currentPath, "LICENSE")}">MIT Licensed</a>
        <a href="${relativeLink(currentPath, "contribute/roadmap.html")}">共建路线图</a>
      </nav>
    </footer>`;
}

function homePage() {
  const currentPath = "index.html";
  const featureCards = [
    ["桌面 App 入门路径", "从客户端打开到第一个任务，帮助新手先跑通完整闭环。"],
    ["CLI 本地提效", "覆盖本地仓库、命令执行、测试验证、提交说明和排障流程。"],
    ["Skills 与插件", "梳理 MCP、Skills、Subagents、浏览器和自动化能力的组合方式。"],
    ["安全与权限", "解释沙盒、审批、网络、凭据和团队使用时的边界设置。"],
    ["移动协同", "用手机记录任务，再回到桌面端检查和交付。"],
    ["原创案例库", "收录 13 个可迁移案例，覆盖内容、资料、网页、支持和发布流程。"],
    ["团队沉淀", "提供 AGENTS.md、任务模板、复盘结构和团队推广方法。"],
    ["配置与排障", "汇总配置文件、CLI 选项、常见错误和恢复路径。"]
  ];

  const body = `
    <main>
      <section class="hero">
        <div class="hero-art">
          <img src="assets/logo.svg" alt="Codex Everyday Guide Logo">
        </div>
        <div class="hero-copy">
          <h1>Codex Everyday Guide</h1>
          <p>面向普通用户、创作者、个人开发者与小团队的 Codex 实践指南。从第一次上手，到把 Codex 接入真实工作流。</p>
          <div class="hero-actions">
            <a class="button primary" href="guide/00-overview.html">从学习路线开始</a>
            <a class="button secondary" href="platform/index.html">选择使用入口</a>
            <a class="button secondary" href="recipes/index.html">浏览实战案例</a>
          </div>
        </div>
      </section>

      <section class="feature-grid" aria-label="站点能力">
        ${featureCards.map(([title, text]) => `<article><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></article>`).join("")}
      </section>

      ${homeSection("这份教程适合谁", "它不是命令速查表，而是一份围绕真实工作流组织的实践指南。它帮助不同背景的人回答三个问题：从哪个入口开始，怎样把需求交给 Codex，怎样确认交付可靠。", [
        ["17 节系统指南", "从桌面 App、CLI、IDE 到 Cloud，按阶段建立完整使用习惯。"],
        ["13 个原创案例", "把 Codex 放进周报、表格、文档站、知识库、发布说明等真实场景。"],
        ["4 类配置主题", "覆盖 CLI 选项、config.toml、MCP/Skills/Subagents 与安全管理。"],
        ["3 组实践方法", "任务设计、非开发工作流、团队 playbook，帮助你把经验沉淀下来。"]
      ])}

      <section class="path-section">
        <header class="section-title">
          <h2>三条推荐学习路径</h2>
          <p>不同起点不需要读同一条路。先选与你当前工作最贴近的路径，再回头补全基础概念。</p>
        </header>
        <div class="path-cards">
          ${[
            ["01", "第一次使用 Codex", "安装并熟悉桌面端，完成一个低风险任务。", "适合初学者、运营、写作者"],
            ["02", "个人开发者本地提效", "在 CLI 或 IDE 中读项目、改代码、跑检查。", "适合前端、后端、开源维护者"],
            ["03", "团队落地与规范", "用项目规则、权限边界和案例库统一协作方式。", "适合技术负责人、内部工具负责人"]
          ].map(([num, title, text, audience]) => `<article><span>${num}</span><h3>${title}</h3><p>${text}</p><small>${audience}</small></article>`).join("")}
        </div>
      </section>

      <section class="split-section">
        <div>
          <h2>先选对入口</h2>
          <p>Codex 的能力会出现在 App、CLI、Cloud、IDE、ChatGPT 和集成生态里。入口不同，任务节奏也不同：本地小步修改适合 CLI，长任务和并行任务适合 Cloud，贴近编辑器的解释与局部改动适合 IDE，跨工具流程适合 App 和插件体系。</p>
          <div class="inline-actions">
            <a class="button ghost" href="platform/index.html">查看入口地图</a>
            <a class="button ghost" href="guide/03-app-tour.html">了解桌面 App</a>
            <a class="button ghost" href="guide/13-vscode-flow.html">VS Code 使用方式</a>
          </div>
        </div>
        <img class="section-image" src="assets/entry-map.svg" alt="Codex 使用入口地图">
      </section>

      <section class="loop-section">
        <header>
          <h2>把一次任务做成闭环</h2>
          <p>好用 Codex 的关键不是把 prompt 写得花哨，而是让它始终知道目标、范围、约束、验证方式和交付格式。</p>
        </header>
        <div class="loop-cards">
          ${["说明：目标、范围、约束和输出", "探索：读材料、找入口和提计划", "实施：小步修改并汇报状态", "验证：测试、截图、日志和人工检查", "沉淀：模板、案例和团队规则"].map((item) => `<article>${escapeHtml(item)}</article>`).join("")}
        </div>
        <img src="assets/task-loop.svg" alt="Codex 高质量任务闭环">
      </section>

      <section class="case-section">
        <header class="section-title">
          <h2>精选实战场景</h2>
          <p>案例库不是展示清单，而是可改写的任务样本。你可以直接换成自己的项目、工具、账号和验证方式。</p>
        </header>
        <div class="card-grid four">
          ${recipes.slice(0, 4).map(([href, title, text]) => `<a class="plain-card" href="${href}"><h3>${escapeHtml(title.replace(/^[0-9]+\\s/, ""))}</h3><p>${escapeHtml(text)}</p></a>`).join("")}
        </div>
      </section>

      <section class="split-section project-section">
        <img class="section-image" src="assets/safety-layers.svg" alt="Codex 安全边界分层">
        <div>
          <h2>为真实项目准备</h2>
          <p>当 Codex 进入真实项目，真正重要的是边界、复现和共识。教程会把每次任务拆成可检查的输入与输出，减少“看起来完成了，但没人敢交付”的时刻。</p>
          <ul class="checked-list">
            <li>用 AGENTS.md 写清项目命令、代码风格和禁止事项。</li>
            <li>用沙盒与审批管理文件、网络、凭据和高风险命令。</li>
            <li>用团队 playbook 统一任务模板、复盘结构和案例沉淀。</li>
            <li>用排障手册快速定位登录、权限、依赖和执行异常。</li>
          </ul>
        </div>
      </section>

      <section class="start-section">
        <h2>建议从这里开始</h2>
        <p>如果你只有二十分钟，先完成桌面端路线的前五节；如果你已经在项目里写代码，直接从 CLI 安装和第一次本地任务开始。</p>
        <div class="hero-actions">
          <a class="button primary" href="guide/00-overview.html">进入学习路线</a>
          <a class="button secondary" href="configuration/index.html">查看配置专题</a>
          <a class="button secondary" href="contribute/roadmap.html">参与共建</a>
        </div>
      </section>
    </main>`;

  return layout({
    currentPath,
    title: "首页",
    description: "面向普通用户、创作者、个人开发者和小团队的 Codex 实践指南。",
    body,
    home: true
  });
}

function homeSection(title, text, cards) {
  return `
    <section class="home-section">
      <header class="section-title">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(text)}</p>
      </header>
      <div class="card-grid four">
        ${cards.map(([cardTitle, cardText], index) => `<article class="metric-card style-${index + 1}"><h3>${escapeHtml(cardTitle)}</h3><p>${escapeHtml(cardText)}</p></article>`).join("")}
      </div>
    </section>`;
}

function docPage(page) {
  const currentPath = page.path;
  const body = `
    <main class="doc-layout">
      ${sidebar(currentPath)}
      <article class="doc-content">
        <p class="eyebrow">${escapeHtml(page.group || "Guide")}</p>
        <h1>${escapeHtml(page.title)}</h1>
        <p class="doc-lead">${escapeHtml(page.summary)}</p>
        ${page.image ? `<img class="doc-hero-image" src="${relativeLink(currentPath, `assets/${page.image}`)}" alt="${escapeHtml(page.title)}示意图">` : ""}
        ${page.sections.map((item) => `
          <section>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${item.body}</p>
            ${item.bullets?.length ? `<ul>${item.bullets.map((bullet) => `<li>${item.bulletsAreHtml ? bullet : escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
          </section>
        `).join("")}
        ${page.links?.length ? `
          <nav class="next-links" aria-label="相关链接">
            ${page.links.map(([href, label]) => `<a href="${relativeLink(currentPath, href)}">${escapeHtml(label)}</a>`).join("")}
          </nav>
        ` : ""}
      </article>
    </main>`;

  return layout({
    currentPath,
    title: page.title,
    description: page.summary,
    body
  });
}

function writeAssets() {
  write("assets/logo.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-labelledby="title">
  <title id="title">Codex Everyday Guide</title>
  <rect x="8" y="8" width="80" height="80" rx="18" fill="#151827"/>
  <path d="M27 30h31" stroke="#6bd2c7" stroke-width="7" stroke-linecap="round"/>
  <path d="M27 48h24" stroke="#9b8cff" stroke-width="7" stroke-linecap="round"/>
  <path d="M27 66h31" stroke="#f3bd4f" stroke-width="7" stroke-linecap="round"/>
  <path d="M61 37l13 11-13 11" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

  write("assets/hero-workspace.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 520" preserveAspectRatio="none">
  <rect width="1440" height="520" fill="#f7f8f9"/>
  <g opacity=".24" fill="none" stroke="#b9c7c4" stroke-width="3">
    <rect x="84" y="82" width="280" height="178" rx="18"/>
    <rect x="1090" y="54" width="280" height="178" rx="18"/>
    <rect x="925" y="330" width="230" height="146" rx="18"/>
    <path d="M394 160h198M394 206h148M1118 116h190M1118 158h130M956 382h142"/>
  </g>
  <g opacity=".18">
    <circle cx="198" cy="332" r="66" fill="#6bd2c7"/>
    <circle cx="1232" cy="368" r="82" fill="#9b8cff"/>
    <circle cx="695" cy="112" r="48" fill="#f3bd4f"/>
  </g>
</svg>`);

  write("assets/entry-map.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex 使用入口地图</title>
  <desc id="desc">CLI、Cloud、IDE、Desktop App、ChatGPT 与集成生态入口示意。</desc>
  <rect width="900" height="430" rx="20" fill="#151827"/>
  <rect x="38" y="38" width="824" height="354" rx="16" fill="#1d2231" stroke="#30384d"/>
  <text x="70" y="86" fill="#fff" font-size="30" font-weight="700" font-family="Arial">Codex 使用入口地图</text>
  <text x="70" y="115" fill="#c8d0da" font-size="16" font-family="Arial">同一套编程代理能力，在不同入口里承担不同节奏的任务。</text>
  <g font-family="Arial" font-weight="700">
    <rect x="70" y="155" width="160" height="92" rx="12" fill="#203238" stroke="#6bd2c7"/>
    <text x="92" y="190" fill="#fff" font-size="23">CLI</text>
    <text x="92" y="219" fill="#c8d0da" font-size="14">终端内快速迭代</text>
    <rect x="260" y="155" width="170" height="92" rx="12" fill="#232a56" stroke="#7187ff"/>
    <text x="282" y="190" fill="#fff" font-size="23">Cloud / Web</text>
    <text x="282" y="219" fill="#c8d0da" font-size="14">长任务与异步回看</text>
    <rect x="462" y="155" width="170" height="92" rx="12" fill="#2a2256" stroke="#9b8cff"/>
    <text x="484" y="190" fill="#fff" font-size="23">IDE</text>
    <text x="484" y="219" fill="#c8d0da" font-size="14">贴近编辑器上下文</text>
    <rect x="664" y="155" width="166" height="92" rx="12" fill="#382f22" stroke="#f3bd4f"/>
    <text x="686" y="190" fill="#fff" font-size="23">Desktop App</text>
    <text x="686" y="219" fill="#c8d0da" font-size="14">本地多任务工作台</text>
    <rect x="172" y="290" width="250" height="58" rx="10" fill="#171b29" stroke="#33394d"/>
    <text x="204" y="325" fill="#fff" font-size="18">ChatGPT 中的 Codex</text>
    <rect x="478" y="290" width="250" height="58" rx="10" fill="#171b29" stroke="#33394d"/>
    <text x="520" y="325" fill="#fff" font-size="18">集成生态</text>
  </g>
</svg>`);

  write("assets/task-loop.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex 高质量任务闭环</title>
  <desc id="desc">说明、探索、实施、验证、复盘的任务闭环。</desc>
  <rect width="900" height="430" rx="20" fill="#151827"/>
  <text x="70" y="80" fill="#fff" font-size="36" font-weight="800" font-family="Arial">Codex 高质量任务闭环</text>
  <text x="72" y="116" fill="#d6dde8" font-size="19" font-family="Arial">把一次任务拆成可观察、可验证、可复盘的工程循环。</text>
  <path d="M250 262C315 145 470 128 568 206" fill="none" stroke="#8690a5" stroke-width="6"/>
  <path d="M604 239c42 90-33 168-160 166-108-2-202-55-224-124" fill="none" stroke="#8690a5" stroke-width="6"/>
  <g font-family="Arial" text-anchor="middle">
    <circle cx="195" cy="260" r="78" fill="#203238" stroke="#6bd2c7" stroke-width="4"/>
    <text x="195" y="251" fill="#fff" font-size="27" font-weight="800">说明</text>
    <text x="195" y="284" fill="#dce5ef" font-size="17">目标 / 范围 / 约束</text>
    <circle cx="420" cy="178" r="76" fill="#222b5c" stroke="#7187ff" stroke-width="4"/>
    <text x="420" y="169" fill="#fff" font-size="27" font-weight="800">探索</text>
    <text x="420" y="202" fill="#dce5ef" font-size="17">读材料 / 提计划</text>
    <circle cx="618" cy="218" r="76" fill="#2c245e" stroke="#9b8cff" stroke-width="4"/>
    <text x="618" y="209" fill="#fff" font-size="27" font-weight="800">实施</text>
    <text x="618" y="242" fill="#dce5ef" font-size="17">小步修改 / 控制 diff</text>
    <circle cx="690" cy="330" r="70" fill="#3a3222" stroke="#f3bd4f" stroke-width="4"/>
    <text x="690" y="322" fill="#fff" font-size="25" font-weight="800">验证</text>
    <text x="690" y="352" fill="#dce5ef" font-size="16">测试 / 截图 / 检查</text>
    <circle cx="450" cy="336" r="70" fill="#111522" stroke="#475067" stroke-width="4"/>
    <text x="450" y="328" fill="#fff" font-size="25" font-weight="800">复盘</text>
    <text x="450" y="358" fill="#dce5ef" font-size="16">原因 / 模板 / 风险</text>
  </g>
</svg>`);

  write("assets/safety-layers.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex 安全边界分层</title>
  <desc id="desc">任务说明、项目规则、沙盒审批、验证评审四层边界。</desc>
  <rect width="760" height="430" rx="20" fill="#151827"/>
  <text x="54" y="72" fill="#fff" font-size="30" font-weight="800" font-family="Arial">Codex 安全边界分层</text>
  <text x="54" y="101" fill="#d6dde8" font-size="16" font-family="Arial">用项目规则、运行环境和人工验证共同约束任务风险。</text>
  <g font-family="Arial" font-weight="700">
    <rect x="72" y="150" width="616" height="54" rx="10" fill="#203238" stroke="#6bd2c7"/>
    <text x="104" y="184" fill="#fff" font-size="18">1. 任务说明</text>
    <text x="274" y="184" fill="#dce5ef" font-size="15">目标、范围、禁止事项、验收标准</text>
    <rect x="98" y="224" width="564" height="54" rx="10" fill="#232a56" stroke="#7187ff"/>
    <text x="132" y="258" fill="#fff" font-size="18">2. AGENTS.md</text>
    <text x="314" y="258" fill="#dce5ef" font-size="15">项目结构、命令、风格、安全规则</text>
    <rect x="126" y="298" width="508" height="54" rx="10" fill="#2a2256" stroke="#9b8cff"/>
    <text x="158" y="332" fill="#fff" font-size="18">3. 沙盒与审批</text>
    <text x="360" y="332" fill="#dce5ef" font-size="15">文件写入、网络、命令执行、授权确认</text>
    <rect x="154" y="362" width="452" height="44" rx="10" fill="#382f22" stroke="#f3bd4f"/>
    <text x="186" y="390" fill="#fff" font-size="17">4. 验证与评审</text>
    <text x="360" y="390" fill="#dce5ef" font-size="14">测试、diff、人工 review、上线检查</text>
  </g>
</svg>`);
}

function build() {
  writeAssets();
  write("index.html", homePage());
  pages.forEach((page) => write(page.path, docPage(page)));
}

build();
console.log(`Generated ${pages.length + 1} pages and SVG assets.`);
