import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const verifiedDate = "2026-05-28";
const expectedPageCount = 43;

const b = (zh, en) => ({ zh, en });

const officialDocs = [
  {
    label: "OpenAI Codex",
    url: "https://openai.com/codex/",
    purpose: b("核对 Codex 的产品定位、入口和能力边界。", "Validate Codex positioning, entry points, and capability boundaries.")
  },
  {
    label: "Codex CLI documentation",
    url: "https://developers.openai.com/codex/cli",
    purpose: b("核对 CLI 在本地目录中读取、修改和运行代码的说明。", "Validate CLI behavior for reading, editing, and running code in a local workspace.")
  },
  {
    label: "Codex agent internet access",
    url: "https://developers.openai.com/codex/cloud/internet-access",
    purpose: b("核对云端任务的网络访问、域名限制和安全注意事项。", "Validate network access, domain allowlisting, and safety guidance for cloud tasks.")
  },
  {
    label: "Using Codex with your ChatGPT plan",
    url: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan",
    purpose: b("核对计划、使用限制、设置继承和数据控制。", "Validate plan access, usage limits, inherited settings, and data controls.")
  },
  {
    label: "OpenAI code generation guide",
    url: "https://developers.openai.com/api/docs/guides/code-generation",
    purpose: b("核对代码生成相关的官方建议与能力描述。", "Validate official guidance and capability descriptions for code generation.")
  }
];

const pages = [];

const tutorials = [
  ["guide/01-desktop-install.html", "01 安装并打开桌面端", "01 Install and open the desktop app", "完成安装、登录和第一个低风险工作区确认。", "Complete installation, sign-in, and first low-risk workspace validation.", "10 分钟", "10 minutes"],
  ["guide/02-account-plan.html", "02 准备账号、计划与使用边界", "02 Prepare account, plan, and usage boundaries", "确认当前计划、数据控制、适用任务与不适用任务。", "Confirm current plan, data controls, supported tasks, and unsupported tasks.", "15 分钟", "15 minutes"],
  ["guide/03-app-tour.html", "03 认识桌面 App 的任务界面", "03 Understand the desktop task interface", "理解任务区、文件区、权限提示、差异预览和结果回看。", "Understand the task pane, file area, permission prompts, diff preview, and result review.", "20 分钟", "20 minutes"],
  ["guide/04-mobile-handoff.html", "04 手机发起、桌面接手", "04 Start on mobile and hand off to desktop", "把移动端灵感或临时任务转成桌面可执行的工作单。", "Convert a mobile note or ad-hoc idea into an executable desktop work order.", "15 分钟", "15 minutes"],
  ["guide/05-first-task.html", "05 完成第一个低风险任务", "05 Complete the first low-risk task", "用一份资料副本跑通说明、执行、验证和复盘。", "Use a duplicate source file to complete scope definition, execution, verification, and retrospective.", "30 分钟", "30 minutes"],
  ["guide/06-queue-parallel.html", "06 排队、并行与任务节奏", "06 Queueing, parallel work, and task pacing", "区分顺序任务、并行任务和需要用户确认的暂停点。", "Distinguish sequential tasks, parallel tasks, and user-confirmation pause points.", "20 分钟", "20 minutes"],
  ["guide/07-permission-review.html", "07 权限弹窗怎么判断", "07 Review permission prompts", "用文件、命令、网络和账号四类问题判断是否授权。", "Decide whether to approve by evaluating file, command, network, and account actions.", "20 分钟", "20 minutes"],
  ["guide/08-skill-plugin-library.html", "08 用 Skills 与插件扩展任务", "08 Extend tasks with Skills and plugins", "理解 Skills、MCP 和插件如何扩展 Codex 工作流。", "Understand how Skills, MCP, and plugins extend Codex workflows.", "25 分钟", "25 minutes"],
  ["guide/09-automation-checks.html", "09 自动化前的确认清单", "09 Pre-automation checklist", "把重复任务自动化前，先定义触发条件、退出条件和失败提醒。", "Before automating repeated work, define triggers, exit conditions, and failure notifications.", "25 分钟", "25 minutes"],
  ["guide/10-personal-workbench.html", "10 搭建个人任务工作台", "10 Build a personal task workbench", "用固定目录、模板和检查清单沉淀个人常用任务。", "Use stable folders, templates, and checklists to standardize personal tasks.", "30 分钟", "30 minutes"],
  ["guide/11-cli-install-login.html", "11 CLI 安装与登录", "11 Install and sign in to the CLI", "从终端启动 Codex，确认本地仓库和命令执行边界。", "Start Codex from the terminal and confirm local repository and command execution boundaries.", "20 分钟", "20 minutes"],
  ["guide/12-cli-first-edit.html", "12 第一次让 Codex 改一个小项目", "12 First small project edit with the CLI", "让 Codex 先计划，再小步修改，最后用测试或页面检查验收。", "Ask Codex to plan first, make a small edit, and verify with tests or page review.", "40 分钟", "40 minutes"],
  ["guide/13-vscode-flow.html", "13 在 VS Code 中协同修改", "13 Collaborate in VS Code", "在编辑器上下文中解释局部代码、提出补丁和整理提交说明。", "Use editor context to explain local code, propose patches, and prepare commit notes.", "30 分钟", "30 minutes"],
  ["guide/14-project-rules.html", "14 用 AGENTS.md 写项目规则", "14 Define project rules with AGENTS.md", "把项目命令、风格、禁区和验收方式写进仓库规则。", "Document project commands, style, restricted areas, and acceptance checks in the repository.", "35 分钟", "35 minutes"],
  ["guide/15-sandbox-approvals.html", "15 沙盒、审批与回退", "15 Sandbox, approvals, and rollback", "建立文件、网络、凭据和高风险命令的审批边界。", "Set approval boundaries for files, network, credentials, and high-risk commands.", "35 分钟", "35 minutes"],
  ["guide/16-cloud-tasks.html", "16 云端任务与本地接力", "16 Cloud tasks and local handoff", "把长任务交给云端执行，再在本地检查差异和结果。", "Delegate long-running tasks to cloud execution and review diffs locally.", "30 分钟", "30 minutes"],
  ["guide/17-troubleshooting.html", "17 排障手册", "17 Troubleshooting handbook", "按登录、权限、依赖、网络、执行和输出质量定位问题。", "Diagnose issues across sign-in, permissions, dependencies, network, execution, and output quality.", "持续使用", "Ongoing"]
];

const configPages = [
  ["configuration/index.html", "配置总览", "Configuration overview", "用最小配置建立可理解、可回退、可审计的 Codex 工作环境。", "Establish a Codex environment that is understandable, reversible, and auditable with minimal configuration."],
  ["configuration/cli-options.html", "CLI 选项与命令", "CLI options and commands", "把 CLI 选项整理成任务执行、模型选择、审批控制和排障四类。", "Organize CLI options into task execution, model selection, approval control, and troubleshooting."],
  ["configuration/config-file.html", "config.toml 任务配置", "config.toml task configuration", "用配置文件沉淀稳定偏好，同时避免把凭据和私人信息写进仓库。", "Use configuration files to persist stable preferences while keeping credentials and private data out of the repository."],
  ["configuration/mcp-skills-subagents.html", "MCP、Skills 与 Subagents", "MCP, Skills, and Subagents", "区分工具连接、方法沉淀和任务拆分，避免把扩展能力一次性全部打开。", "Separate tool connections, reusable methods, and task decomposition instead of enabling every extension at once."],
  ["configuration/security-admin.html", "安全与审批", "Security and approvals", "将文件、命令、网络、凭据和团队规则纳入统一审批模型。", "Bring files, commands, network access, credentials, and team policy into one approval model."]
];

const resourcePages = [
  ["practice/index.html", "实践方法", "Operating model", "把每次任务拆成说明、探索、实施、验证和复盘五段，形成可复用工作法。", "Split every task into brief, discovery, execution, verification, and retrospective to create a reusable operating model."],
  ["reference/index.html", "官方文档", "Official Documentation", `最后核对：${verifiedDate}。所有功能、价格、限额、模型和安全策略以 OpenAI 官方文档为准。`, `Last checked: ${verifiedDate}. Product behavior, pricing, limits, models, and safety policy must be validated against official OpenAI documentation.`],
  ["contribute/roadmap.html", "共建路线图", "Contribution roadmap", "用 Issue、PR、验收清单和事实核对流程维护一个可持续开源文档项目。", "Maintain a sustainable open-source documentation project with issues, pull requests, acceptance checklists, and fact checks."]
];

const recipes = [
  ["recipes/newsletter-brief.html", "01 Codex × Newsletter：生成周报草稿", "01 Codex × Newsletter: Draft a weekly brief", "把链接、会议摘录和产品更新整理成可审阅周报。", "Turn links, meeting notes, and product updates into a reviewable weekly brief.", "内容运营", "Content operations"],
  ["recipes/spreadsheet-cleanup.html", "02 Codex × Spreadsheet：清理 CSV 并生成核对表", "02 Codex × Spreadsheet: Clean CSV data and generate checks", "识别重复行、缺失字段和异常金额，输出修正建议。", "Identify duplicates, missing fields, and abnormal amounts, then produce correction guidance.", "数据整理", "Data cleanup"],
  ["recipes/docs-site-refresh.html", "03 Codex × Docs：批量更新文档站链接", "03 Codex × Docs: Refresh documentation links", "扫描失效链接、替换旧路径，并生成变更清单。", "Scan broken links, replace stale paths, and generate a change log.", "文档维护", "Documentation maintenance"],
  ["recipes/accessibility-audit.html", "04 Codex × Browser：做页面无障碍巡检", "04 Codex × Browser: Run an accessibility review", "检查标题层级、按钮文案、键盘路径和截图证据。", "Check heading hierarchy, button labels, keyboard paths, and screenshot evidence.", "网页质量", "Web quality"],
  ["recipes/photo-archive.html", "05 Codex × Local Files：整理照片命名与索引", "05 Codex × Local Files: Organize photo names and index", "把活动照片按日期、场景和用途生成可检索目录。", "Create a searchable archive by date, scene, and usage.", "文件整理", "File organization"],
  ["recipes/expense-report.html", "06 Codex × Expense Notes：汇总报销材料", "06 Codex × Expense Notes: Prepare expense materials", "从票据说明中抽取金额、用途和待补材料。", "Extract amount, purpose, and missing materials from receipt notes.", "行政财务", "Operations finance"],
  ["recipes/podcast-notes.html", "07 Codex × Transcript：把访谈稿变成选题库", "07 Codex × Transcript: Turn interviews into an idea bank", "从转录中提取观点、章节、引用和后续选题。", "Extract insights, chapters, quotes, and follow-up topics from transcripts.", "内容策划", "Editorial planning"],
  ["recipes/api-changelog.html", "08 Codex × API Changelog：追踪接口变更", "08 Codex × API Changelog: Track API changes", "对比版本记录，输出对业务流程的影响清单。", "Compare release notes and summarize impact on business workflows.", "产品技术", "Product engineering"],
  ["recipes/shop-copy.html", "09 Codex × Product Copy：生成商品说明", "09 Codex × Product Copy: Draft product detail copy", "把规格、卖点和限制条件整理成详情页草稿。", "Convert specs, selling points, and constraints into a product-detail draft.", "电商内容", "Commerce content"],
  ["recipes/learning-plan.html", "10 Codex × Learning Plan：生成个人学习路线", "10 Codex × Learning Plan: Build a personal study plan", "根据目标、可用时间和资料生成四周学习计划。", "Generate a four-week study plan from goals, time budget, and materials.", "个人成长", "Personal learning"],
  ["recipes/support-triage.html", "11 Codex × Support Inbox：汇总客服问题", "11 Codex × Support Inbox: Triage support feedback", "把用户反馈归类为缺陷、疑问、账单和体验建议。", "Classify user feedback into defects, questions, billing, and experience suggestions.", "客户支持", "Customer support"],
  ["recipes/markdown-knowledge-base.html", "12 Codex × Markdown KB：重整知识库字段", "12 Codex × Markdown KB: Normalize a Markdown knowledge base", "把散乱笔记迁移成统一 frontmatter 和目录索引。", "Migrate scattered notes into consistent frontmatter and an index.", "知识管理", "Knowledge management"],
  ["recipes/github-release.html", "13 Codex × GitHub Releases：生成发布说明", "13 Codex × GitHub Releases: Generate release notes", "从提交、Issue 和 PR 摘要整理可发布的 changelog。", "Produce a publishable changelog from commits, issues, and PR summaries.", "开源发布", "Open-source release"],
  ["recipes/usage-policy.html", "使用规范", "Usage Policy", "说明隐私、安全、人工复核和发布前确认要求。", "Document privacy, safety, human review, and pre-publication confirmation requirements.", "项目治理", "Project governance"]
];

const recipeNavPages = [["recipes/index.html", "案例总览", "Recipe index"], ...recipes.map(([pathName, zh, en]) => [pathName, zh, en])];
const pagesByPath = new Map();

function addPage(page) {
  pages.push(page);
  pagesByPath.set(page.path, page);
}

function section(title, body, bullets = []) {
  return { title, body, bullets };
}

function link(pathName, labelZh, labelEn) {
  return { path: pathName, label: b(labelZh, labelEn) };
}

function statusMeta(audience, duration, risk = b("低到中", "Low to medium")) {
  return [
    { label: b("文档状态", "Status"), value: b("发布草案 v0.2", "Release draft v0.2") },
    { label: b("最后核对", "Last verified"), value: b(verifiedDate, verifiedDate) },
    { label: b("适用读者", "Audience"), value: audience },
    { label: b("预计耗时", "Estimated time"), value: duration },
    { label: b("风险等级", "Risk level"), value: risk }
  ];
}

function addOverviewPage() {
  addPage({
    path: "guide/00-overview.html",
    title: b("学习路线", "Learning Path"),
    navTitle: b("学习路线", "Learning Path"),
    group: b("教程", "Guide"),
    summary: b("用三条路线覆盖普通用户、个人开发者和团队落地。读者不需要一次读完整站，应先选择与当前任务最接近的路径。", "Use three routes for everyday users, individual developers, and team adoption. Readers should start with the route closest to the task at hand instead of reading the whole site first."),
    meta: statusMeta(b("普通用户、开发者、团队负责人", "Everyday users, developers, and team leads"), b("15 分钟", "15 minutes")),
    sections: [
      section(
        b("路线一：第一次使用 Codex", "Route 1: First-time Codex user"),
        b("这条路线面向没有工程背景、但希望把资料整理、文档检查或网页修改做得更稳的人。目标是在低风险材料上完成一个可复查的小闭环。", "This route is for readers without an engineering background who want more reliable document cleanup, content review, or small webpage edits. The goal is to complete a reviewable loop on low-risk material."),
        [
          b("从桌面端或网页端开始，不要求先学习命令行。", "Start from the desktop or web experience; command-line knowledge is not required."),
          b("只处理副本和脱敏材料。", "Work only on duplicates and redacted materials."),
          b("把检查方式写进任务描述，而不是事后补救。", "Write the verification method into the task brief instead of adding it afterward.")
        ]
      ),
      section(
        b("路线二：个人开发者本地提效", "Route 2: Local productivity for individual developers"),
        b("这条路线面向已经维护网站、脚本或小项目的人。重点不是一次改很多，而是让 Codex 形成计划、修改、验证、复盘的稳定循环。", "This route is for people maintaining websites, scripts, or small projects. The priority is not large changes, but a stable plan-edit-verify-retrospect loop."),
        [
          b("让 Codex 先读项目结构并提出计划。", "Ask Codex to inspect the project structure and propose a plan first."),
          b("每次只处理一个明确问题。", "Handle one clearly bounded issue at a time."),
          b("用测试、截图、diff 和日志验收。", "Use tests, screenshots, diffs, and logs as acceptance evidence.")
        ]
      ),
      section(
        b("路线三：团队落地与规范", "Route 3: Team adoption and governance"),
        b("这条路线面向把 Codex 引入多人项目的人。团队应先统一边界、审批和交付证据，再追求效率。", "This route is for teams introducing Codex into shared projects. Teams should standardize boundaries, approvals, and delivery evidence before optimizing for speed."),
        [
          b("用 AGENTS.md 记录命令、风格、禁区和验收方式。", "Use AGENTS.md to document commands, style, restricted areas, and acceptance checks."),
          b("规定必须人工审批的文件、网络和命令动作。", "Define file, network, and command actions that always require human approval."),
          b("把成功任务沉淀成案例、模板和复盘记录。", "Convert successful tasks into recipes, templates, and retrospectives.")
        ]
      )
    ],
    links: [
      link("guide/01-desktop-install.html", "从桌面端开始", "Start with desktop"),
      link("guide/11-cli-install-login.html", "从 CLI 开始", "Start with CLI"),
      link("guide/14-project-rules.html", "建立团队规则", "Create team rules")
    ]
  });
}

function addPlatformPage() {
  addPage({
    path: "platform/index.html",
    title: b("入口地图", "Entry Point Map"),
    navTitle: b("入口地图", "Entry Map"),
    group: b("入口", "Platform"),
    summary: b("同一套 Codex 能力在不同入口里的节奏不同。专业使用方式是先选入口，再设计任务。", "The same Codex capability behaves differently across entry points. A professional workflow chooses the entry point before designing the task."),
    image: "entry-map.svg",
    meta: statusMeta(b("普通用户、开发者、团队管理员", "Everyday users, developers, and team administrators"), b("20 分钟", "20 minutes")),
    sections: [
      section(
        b("入口选择原则", "Entry selection principles"),
        b("入口选择取决于材料位置、验证方式和回退成本。资料整理适合 App 或 Web，本地仓库适合 CLI，编辑器内局部修改适合 IDE，长任务适合 Cloud/Web。", "Choose an entry point based on where the material lives, how results will be verified, and the cost of rollback. Content cleanup fits App or Web, local repositories fit CLI, editor-local edits fit IDE, and longer tasks fit Cloud/Web."),
        [
          b("材料在本地文件夹：优先 CLI 或桌面端。", "Material in a local folder: prefer CLI or the desktop app."),
          b("结果要看页面：使用本地预览、截图或浏览器检查。", "Results that must be visual: use local preview, screenshots, or browser checks."),
          b("任务需要排队或长时间运行：考虑云端，但保留人工 Review。", "Long or queued tasks: consider cloud execution, but keep human review.")
        ]
      ),
      section(
        b("入口与风险匹配", "Match entry point to risk"),
        b("入口越接近真实项目，越需要清晰的权限边界。CLI 和 IDE 可以直接影响仓库内容，应以小步 diff 和可运行检查作为默认验收方式。", "The closer an entry point is to a real project, the clearer the permission boundary must be. CLI and IDE can directly affect repository content, so small diffs and runnable checks should be the default acceptance evidence."),
        [
          b("只在必要时启用网络访问。", "Enable network access only when the task requires it."),
          b("把密钥、客户资料和私人文件排除在默认工作区之外。", "Keep secrets, customer data, and personal files outside the default workspace."),
          b("任何会发送、删除或覆盖的动作都需要单独确认。", "Any send, delete, or overwrite action requires separate confirmation.")
        ]
      )
    ],
    links: [
      link("guide/03-app-tour.html", "了解桌面 App", "Understand the desktop app"),
      link("guide/11-cli-install-login.html", "安装 CLI", "Install the CLI"),
      link("guide/13-vscode-flow.html", "VS Code 协作", "VS Code workflow")
    ]
  });
}

function addConfigurationPages() {
  for (const [pathName, titleZh, titleEn, summaryZh, summaryEn] of configPages) {
    addPage({
      path: pathName,
      title: b(titleZh, titleEn),
      navTitle: b(titleZh, titleEn),
      group: b("配置", "Configuration"),
      summary: b(summaryZh, summaryEn),
      meta: statusMeta(b("开发者、团队管理员、需要可审计设置的高级用户", "Developers, team administrators, and advanced users who need auditable settings"), b("25 分钟", "25 minutes"), b("中", "Medium")),
      sections: [
        section(
          b("配置目标", "Configuration objective"),
          b("配置不是为了打开所有能力，而是为了让 Codex 的默认行为可预测、可解释、可回退。每项设置都应能回答：它解决什么问题，增加什么风险，如何验证。", "Configuration is not about enabling every capability. It is about making Codex behavior predictable, explainable, and reversible. Every setting should answer: what problem does it solve, what risk does it add, and how will it be verified?"),
          [
            b("先从最小可用配置开始。", "Start with the minimum viable configuration."),
            b("把默认工作区限制在当前项目。", "Limit the default workspace to the current project."),
            b("把高风险动作转为显式审批。", "Turn high-risk actions into explicit approvals.")
          ]
        ),
        section(
          b("标准操作流程", "Standard operating procedure"),
          b("每次调整配置后，都应使用一个低风险任务验证行为是否符合预期。不要在生产项目中第一次测试新配置。", "After every configuration change, validate behavior with a low-risk task. Do not test a new configuration for the first time in a production project."),
          [
            b("记录修改前后的配置差异。", "Record the before-and-after configuration diff."),
            b("运行一个只读检查任务，确认 Codex 能解释会访问哪些文件。", "Run a read-only inspection task and confirm Codex can explain which files it will access."),
            b("运行一个小范围写入任务，确认 diff 可控且可回退。", "Run a small write task and confirm the diff is bounded and reversible."),
            b("把成功配置写入团队文档。", "Document the successful configuration in team documentation.")
          ]
        ),
        section(
          b("验收标准", "Acceptance criteria"),
          b("专业配置的验收不是“能运行”，而是“能解释、能限制、能复盘”。", "Professional configuration is not accepted because it runs; it is accepted because it can be explained, constrained, and reviewed."),
          [
            b("Codex 能说明当前任务需要哪些文件、命令或网络访问。", "Codex can explain which files, commands, or network access the current task needs."),
            b("不相关目录不会被默认读取或修改。", "Unrelated directories are not read or modified by default."),
            b("高风险操作有明确审批点。", "High-risk operations have explicit approval points."),
            b("配置变更有记录并可回退。", "Configuration changes are recorded and reversible.")
          ]
        )
      ],
      links: [
        link("guide/15-sandbox-approvals.html", "继续看沙盒与审批", "Continue to sandbox and approvals"),
        link("reference/index.html", "查看官方文档", "Review official documentation")
      ]
    });
  }
}

function addResourcePages() {
  addPage({
    path: "practice/index.html",
    title: b("实践方法", "Operating Model"),
    navTitle: b("实践方法", "Operating Model"),
    group: b("资源", "Resources"),
    summary: b("把每次任务拆成说明、探索、实施、验证和复盘五段，形成可复用工作法。", "Split every task into brief, discovery, execution, verification, and retrospective to create a reusable operating model."),
    image: "task-loop.svg",
    meta: statusMeta(b("所有读者", "All readers"), b("30 分钟", "30 minutes")),
    sections: [
      section(
        b("任务说明标准", "Task brief standard"),
        b("专业任务说明必须包含目标、范围、约束、输入材料、输出格式和验收方式。缺少任何一项，Codex 都可能把不确定性转化为错误执行。", "A professional task brief must include objective, scope, constraints, input materials, output format, and acceptance method. If any part is missing, Codex may convert uncertainty into incorrect execution."),
        [
          b("目标：最终交付物是什么。", "Objective: what final deliverable is expected."),
          b("范围：允许读取或修改哪些材料。", "Scope: which materials may be read or modified."),
          b("约束：哪些内容不能猜、不能改、不能发送。", "Constraints: what must not be guessed, changed, or sent."),
          b("验收：用什么证据判断任务完成。", "Acceptance: what evidence proves the task is complete.")
        ]
      ),
      section(
        b("五段式闭环", "Five-stage loop"),
        b("每次任务都应留下可复盘证据。即使任务很小，也应知道 Codex 看了什么、改了什么、如何验证、风险在哪里。", "Every task should leave reviewable evidence. Even for small tasks, you should know what Codex inspected, what it changed, how it was verified, and where the risks are."),
        [
          b("说明：写清目标、范围和约束。", "Brief: define objective, scope, and constraints."),
          b("探索：让 Codex 先读材料并提出计划。", "Discover: ask Codex to inspect materials and propose a plan first."),
          b("实施：小步执行并控制 diff。", "Execute: make small changes and keep diffs controlled."),
          b("验证：用测试、截图、表格或人工清单检查。", "Verify: use tests, screenshots, tables, or manual checklists."),
          b("复盘：记录误解、风险和可复用模板。", "Retrospect: record misunderstandings, risks, and reusable templates.")
        ]
      )
    ],
    links: [
      link("guide/05-first-task.html", "跑通第一个任务", "Complete the first task"),
      link("recipes/index.html", "查看案例库", "Browse recipes")
    ]
  });

  addPage({
    path: "reference/index.html",
    title: b("官方文档", "Official Documentation"),
    navTitle: b("官方文档", "Official Documentation"),
    group: b("资源", "Resources"),
    summary: b(`最后核对：${verifiedDate}。功能、价格、限额、模型和安全策略必须回到 OpenAI 官方文档核对。`, `Last checked: ${verifiedDate}. Product behavior, pricing, limits, models, and safety policy must be validated against official OpenAI documentation.`),
    meta: statusMeta(b("文档维护者、团队管理员", "Documentation maintainers and team administrators"), b("15 分钟", "15 minutes"), b("中", "Medium")),
    sections: [
      section(
        b("官方文档使用规则", "Official documentation policy"),
        b("本站只概括产品事实，不复刻官方文案。涉及动态信息时必须保留核对日期，并在发布前重新打开官方页面确认。", "This site summarizes product facts but does not reproduce official copy. Dynamic facts must include a verification date and must be checked again before publication."),
        [
          b("不要把价格、额度、模型默认值写成永久结论。", "Do not present pricing, quota, or default model information as permanent."),
          b("不要把帮助中心、开发者文档和产品页混为同一类依据。", "Do not treat Help Center, developer docs, and product pages as the same validation basis."),
          b("高风险建议必须保守，并提示读者遵守组织政策。", "High-risk guidance must be conservative and remind readers to follow organizational policy.")
        ]
      ),
      section(
        b("官方链接", "Official links"),
        b("以下页面用于核对 Codex 定位、CLI、本地权限、云端联网、计划设置和代码生成建议。", "Use the following pages to validate Codex positioning, CLI behavior, local permissions, cloud internet access, plan settings, and code-generation guidance."),
        officialDocs.map((item) => b(`<a href="${item.url}">${item.label}</a>：${item.purpose.zh}`, `<a href="${item.url}">${item.label}</a>: ${item.purpose.en}`))
      )
    ],
    links: [
      link("recipes/usage-policy.html", "使用规范", "Usage policy"),
      link("contribute/roadmap.html", "参与共建", "Contribute")
    ]
  });

  addPage({
    path: "contribute/roadmap.html",
    title: b("共建路线图", "Contribution Roadmap"),
    navTitle: b("共建路线图", "Roadmap"),
    group: b("资源", "Resources"),
    summary: b("用 Issue、PR、验收清单和事实核对流程维护一个可持续开源文档项目。", "Maintain a sustainable open-source documentation project with issues, pull requests, acceptance checklists, and fact checks."),
    meta: statusMeta(b("开源贡献者、维护者", "Open-source contributors and maintainers"), b("20 分钟", "20 minutes")),
    sections: [
      section(
        b("贡献优先级", "Contribution priorities"),
        b("优先补充能被验证、能被读者复用、能降低风险的内容。不要提交未经授权的材料，也不要把外部社交入口作为文档主体。", "Prioritize content that can be verified, reused by readers, and used to reduce risk. Do not submit unauthorized material or make external social entry points part of the documentation body."),
        [
          b("补充每篇教程的真实截图占位和检查证据。", "Add screenshot placeholders and verification evidence for each guide."),
          b("为案例增加输入材料模板。", "Add input-material templates for recipes."),
          b("为动态事实建立定期核对 Issue。", "Create periodic fact-check issues for dynamic information.")
        ]
      ),
      section(
        b("PR 验收要求", "Pull request acceptance requirements"),
        b("每个 PR 都应说明修改意图、事实依据、验证方式和影响范围。内容类 PR 必须同时维护中文和英文。", "Every PR should describe intent, factual basis, verification method, and impact. Content PRs must maintain both Chinese and English."),
        [
          b("通过本地构建、链接检查和双语覆盖检查。", "Pass local build, link validation, and bilingual coverage checks."),
          b("新增事实必须附官方文档依据。", "New factual claims must include official documentation basis."),
          b("新增案例必须使用自有场景或中性演示材料。", "New recipes must use owned scenarios or neutral demo materials.")
        ]
      )
    ],
    links: [
      link("CONTRIBUTING.md", "贡献指南", "Contributing guide"),
      link("recipes/usage-policy.html", "使用规范", "Usage policy")
    ]
  });
}

function tutorialSections(titleZh, titleEn, summaryZh, summaryEn, durationZh, durationEn, index) {
  const isDeveloper = index >= 10;
  return [
    section(
      b("适用范围与读者", "Scope and audience"),
      b(summaryZh, summaryEn),
      [
        isDeveloper
          ? b("适合在本地仓库、脚本或 IDE 中工作的读者。", "For readers working in local repositories, scripts, or IDEs.")
          : b("适合希望用 Codex 处理日常资料、文件和轻量任务的读者。", "For readers using Codex for everyday documents, files, and lightweight tasks."),
        b("本节不处理生产系统、敏感账号或不可回退操作。", "This section does not cover production systems, sensitive accounts, or irreversible operations."),
        b("所有练习都应使用副本或演示项目。", "All exercises should use duplicates or demo projects.")
      ]
    ),
    section(
      b("前置条件", "Prerequisites"),
      b("开始前先准备一个受控工作区，并明确哪些内容可以让 Codex 读取或修改。", "Before starting, prepare a controlled workspace and define what Codex may read or modify."),
      [
        b("准备一个非敏感示例文件夹或演示仓库。", "Prepare a non-sensitive sample folder or demo repository."),
        b("确认可以回退：保留原文件、备份或 Git 提交。", "Confirm rollback: keep initial files, backups, or a Git commit."),
        b("准备验收方式：清单、截图、测试、diff 或人工 Review。", "Prepare an acceptance method: checklist, screenshot, test, diff, or human review.")
      ]
    ),
    section(
      b("标准流程", "Standard procedure"),
      b("把任务拆成可确认的小步骤。Codex 应先解释计划，再执行会改变文件、联网或运行命令的动作。", "Break the task into confirmable steps. Codex should explain the plan before actions that change files, access the network, or run commands."),
      [
        b(`说明任务：引用本节目标“${titleZh}”，写清目标、范围和禁止事项。`, `Brief the task: refer to "${titleEn}" and define objective, scope, and constraints.`),
        b("请求计划：要求 Codex 列出会读取的材料、执行步骤和风险点。", "Request a plan: ask Codex to list materials, execution steps, and risks."),
        b("小步执行：一次只批准一个明确动作。", "Execute in small steps: approve one clear action at a time."),
        b("记录证据：保存输出、diff、截图或测试结果。", "Record evidence: keep outputs, diffs, screenshots, or test results.")
      ]
    ),
    section(
      b("交付物", "Deliverables"),
      b("本节完成后，应留下可以复查的结果，而不是只得到一段聊天记录。", "At the end of this section, you should have reviewable artifacts, not just a chat transcript."),
      [
        b("一份任务说明或执行记录。", "A task brief or execution record."),
        b("一个可检查的输出文件、diff 或截图。", "A checkable output file, diff, or screenshot."),
        b("一条后续可复用的任务模板。", "A reusable task template for future work.")
      ]
    ),
    section(
      b("风险控制", "Risk controls"),
      b("如果任务涉及文件写入、命令执行、联网或账号数据，必须先解释风险再授权。", "If the task involves file writes, command execution, network access, or account data, explain the risk before approval."),
      [
        b("默认拒绝与任务无关的目录访问。", "Deny access to directories unrelated to the task by default."),
        b("看不懂命令时，要求 Codex 用自然语言解释目的和后果。", "If a command is unclear, ask Codex to explain purpose and consequence in plain language."),
        b("任何发送、删除、覆盖、发布动作都需要单独确认。", "Sending, deleting, overwriting, or publishing requires separate confirmation.")
      ]
    ),
    section(
      b("验收标准", "Acceptance criteria"),
      b("只有当结果能被独立检查时，任务才算完成。", "The task is complete only when the result can be independently checked."),
      [
        b("输出符合任务目标和格式要求。", "Output matches the objective and format requirements."),
        b("未越权读取、修改或发送材料。", "No unauthorized material was read, changed, or sent."),
        b("不确定事项被标注为待确认。", "Uncertain items are marked for confirmation."),
        b("有证据证明结果已检查。", "There is evidence that the result was checked.")
      ]
    )
  ];
}

function addTutorialPages() {
  tutorials.forEach(([pathName, titleZh, titleEn, summaryZh, summaryEn, durationZh, durationEn], index) => {
    addPage({
      path: pathName,
      title: b(titleZh, titleEn),
      navTitle: b(titleZh, titleEn.replace(/^[0-9]+\s/, "")),
      group: b("教程", "Guide"),
      summary: b(summaryZh, summaryEn),
      meta: statusMeta(b(index >= 10 ? "个人开发者、维护者" : "普通用户、创作者、运营人员", index >= 10 ? "Individual developers and maintainers" : "Everyday users, creators, and operators"), b(durationZh, durationEn), b(index >= 10 ? "中" : "低", index >= 10 ? "Medium" : "Low")),
      sections: tutorialSections(titleZh, titleEn, summaryZh, summaryEn, durationZh, durationEn, index),
      links: [
        index < tutorials.length - 1
          ? link(tutorials[index + 1][0], "下一节", "Next section")
          : link("recipes/index.html", "进入案例库", "Go to recipes"),
        link("guide/00-overview.html", "返回学习路线", "Back to learning path")
      ]
    });
  });
}

function recipeSections(recipe, index) {
  const [, titleZh, titleEn, summaryZh, summaryEn, domainZh, domainEn] = recipe;
  return [
    section(
      b("业务目标", "Business objective"),
      b(summaryZh, summaryEn),
      [
        b(`领域：${domainZh}。`, `Domain: ${domainEn}.`),
        b("目标是生成可人工审阅的中间交付物，而不是自动对外发布。", "The goal is to produce a human-reviewable intermediate deliverable, not to publish automatically."),
        b("所有外部发送、公开发布或账号操作都必须由用户完成。", "All external sending, public publishing, or account actions must be performed by the user.")
      ]
    ),
    section(
      b("输入材料", "Input materials"),
      b("输入材料必须最小化、可追溯、可删除。不要把完成任务不需要的私人信息交给 Codex。", "Input materials must be minimized, traceable, and removable. Do not provide private information that is not required for the task."),
      [
        b("任务说明：目标、受众、输出格式和限制条件。", "Task brief: objective, audience, output format, and constraints."),
        b("任务材料：只包含完成案例所需的文件、链接或摘录。", "Task material: only files, links, or excerpts needed for the recipe."),
        b("验收清单：事实、格式、风险和缺口。", "Acceptance checklist: facts, format, risks, and gaps.")
      ]
    ),
    section(
      b("执行流程", "Workflow"),
      b("让 Codex 先做结构化分析，再生成草稿。不要让它跳过材料核对或不确定事项标注。", "Ask Codex to perform structured analysis before drafting. Do not let it skip material checks or uncertainty labels."),
      [
        b(`用一句话说明案例：“${titleZh}”。`, `Describe the recipe in one sentence: "${titleEn}".`),
        b("要求 Codex 先列出材料清单和处理步骤。", "Ask Codex to list materials and processing steps first."),
        b("生成第一版输出后，要求列出不确定项、缺失材料和人工确认点。", "After the first output, ask for uncertainties, missing materials, and human-confirmation points."),
        b("按验收清单修改，而不是重复生成。", "Revise against the checklist instead of regenerating repeatedly.")
      ]
    ),
    section(
      b("提示词合同", "Prompt contract"),
      b("提示词应像工作单一样清晰，明确 Codex 不能越权补充事实。", "The prompt should read like a work order and explicitly prohibit Codex from inventing unsupported facts."),
      [
        b("请先说明你会读取哪些材料，以及每份材料的用途。", "First state which materials you will read and how each will be used."),
        b("不要补充输入材料之外的事实；缺失内容请标注为待确认。", "Do not add facts outside the provided inputs; mark missing content as to be confirmed."),
        b("输出必须包含正文、检查清单和下一步建议。", "The output must include the body, a review checklist, and recommended next steps.")
      ]
    ),
    section(
      b("交付物", "Deliverables"),
      b("案例交付物应可被另一个人独立检查。", "Recipe deliverables should be independently reviewable by another person."),
      [
        index % 2 === 0 ? b("一份结构化草稿或变更清单。", "A structured draft or change list.") : b("一份清理后的表格、目录或分类结果。", "A cleaned table, index, or classification result."),
        b("一份不确定项和待补材料列表。", "A list of uncertainties and missing materials."),
        b("一份人工验收清单。", "A manual acceptance checklist.")
      ]
    ),
    section(
      b("验收标准", "Acceptance criteria"),
      b("案例完成不等于内容完美，而是达到可审阅、可修改、可追溯的标准。", "A recipe is complete when it is reviewable, editable, and traceable, not when it looks perfect."),
      [
        b("所有关键事实都能回到输入材料。", "All key facts can be traced back to the provided inputs."),
        b("输出没有未经确认的承诺、金额、日期或账号动作。", "The output contains no unconfirmed promises, amounts, dates, or account actions."),
        b("读者能根据交付物继续人工编辑或发布。", "A human can continue editing or publishing from the deliverable."),
        b("风险和限制被显式列出。", "Risks and limitations are explicitly listed.")
      ]
    )
  ];
}

function addRecipePages() {
  addPage({
    path: "recipes/index.html",
    title: b("案例总览", "Recipe Index"),
    navTitle: b("案例总览", "Recipe Index"),
    group: b("实战案例", "Recipes"),
    summary: b("案例库提供可调整的任务模板。每个案例都应替换成读者自己的材料、工具和验收方式。", "The recipe library provides adaptable task templates. Each recipe should be replaced with the reader's own materials, tools, and acceptance method."),
    meta: statusMeta(b("所有希望把 Codex 接入真实工作的读者", "Readers who want to apply Codex to real work"), b("20 分钟", "20 minutes")),
    sections: [
      section(
        b("案例阅读方法", "How to read recipes"),
        b("不要照抄案例提示词。先理解任务结构，再替换成自己的输入材料、限制条件和验收证据。", "Do not copy recipe prompts directly. Understand the task structure first, then replace inputs, constraints, and evidence with your own."),
        [
          b("看目标：这个案例最终交付什么。", "Objective: what does this recipe deliver?"),
          b("看材料：它允许 Codex 读取哪些内容。", "Materials: what is Codex allowed to read?"),
          b("看边界：哪些动作必须人工确认。", "Boundaries: which actions require human confirmation?"),
          b("看验证：如何证明结果可用。", "Verification: how do you prove the result is usable?")
        ]
      ),
      section(
        b("案例清单", "Recipe list"),
        b("以下案例使用中性的演示场景，覆盖内容、资料、文件、网页、支持和开源发布流程。", "The following recipes use neutral demo scenarios across content, data, files, web quality, support, and open-source release workflows."),
        recipes.slice(0, 13).map(([pathName, zh, en]) => b(`<a href="${relativeLink("recipes/index.html", pathName)}">${zh}</a>`, `<a href="${relativeLink("recipes/index.html", pathName)}">${en}</a>`))
      )
    ],
    links: [
      link("recipes/newsletter-brief.html", "从周报案例开始", "Start with the newsletter recipe"),
      link("practice/index.html", "先看实践方法", "Review the operating model first")
    ]
  });

  recipes.slice(0, 13).forEach((recipe, index) => {
    const [pathName, titleZh, titleEn, summaryZh, summaryEn] = recipe;
    addPage({
      path: pathName,
      title: b(titleZh, titleEn),
      navTitle: b(titleZh, titleEn.replace(/^[0-9]+\s/, "")),
      group: b("实战案例", "Recipes"),
      summary: b(summaryZh, summaryEn),
      meta: statusMeta(b("业务人员、创作者、项目维护者", "Operators, creators, and project maintainers"), b("30-45 分钟", "30-45 minutes"), b("低到中", "Low to medium")),
      sections: recipeSections(recipe, index),
      links: [
        index < 12
          ? link(recipes[index + 1][0], "下一个案例", "Next recipe")
          : link("recipes/usage-policy.html", "使用规范", "Usage policy"),
        link("recipes/index.html", "返回案例总览", "Back to recipe index")
      ]
    });
  });

  addPage({
    path: "recipes/usage-policy.html",
    title: b("使用规范", "Usage Policy"),
    navTitle: b("使用规范", "Usage Policy"),
    group: b("实战案例", "Recipes"),
    summary: b("说明隐私、安全、人工复核和发布前确认要求。", "Document privacy, safety, human review, and pre-publication confirmation requirements."),
    meta: statusMeta(b("贡献者、维护者、复用者", "Contributors, maintainers, and reusers"), b("10 分钟", "10 minutes")),
    sections: [
      section(
        b("隐私与材料控制", "Privacy and material control"),
        b("使用 Codex 前先确认材料是否可以被读取、修改或上传。默认只提供完成任务所需的最小信息。", "Before using Codex, confirm whether the material may be read, changed, or uploaded. Provide only the minimum information required for the task by default."),
        [
          b("不要提交密钥、客户资料、私人证件、合同原文或内部账号信息。", "Do not submit keys, customer records, private IDs, full contract text, or internal account information."),
          b("只在必要时允许联网、运行命令或读取额外目录。", "Allow internet access, command execution, or additional directory reads only when necessary."),
          b("敏感材料应先脱敏，再进入任务流程。", "Sensitive material should be redacted before it enters the task workflow.")
        ]
      ),
      section(
        b("人工复核", "Human review"),
        b("Codex 可以帮助整理、检查和生成草稿，但对外发布、删除、覆盖、发送和账号操作必须由用户确认。", "Codex can help organize, check, and draft, but publishing, deleting, overwriting, sending, and account actions must be confirmed by the user."),
        [
          b("发布前核对事实、数字、日期、链接和承诺。", "Verify facts, numbers, dates, links, and commitments before publication."),
          b("高风险建议必须附限制条件和人工确认点。", "High-risk guidance must include constraints and human confirmation points."),
          b("任务结果应保留输出、检查证据和待确认事项。", "Task results should keep outputs, review evidence, and items requiring confirmation.")
        ]
      )
    ],
    links: [
      link("reference/index.html", "官方文档", "Official documentation"),
      link("LICENSE", "开源许可", "Open-source license")
    ]
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function keepHtml(value) {
  return String(value);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(path.join(root, filePath)), { recursive: true });
}

function write(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(path.join(root, filePath), content.replace(/[ \t]+$/gm, ""), "utf8");
}

function relativeLink(from, to) {
  if (/^https?:\/\//.test(to) || to.startsWith("#")) return to;
  const fromDir = path.posix.dirname(from);
  let rel = path.posix.relative(fromDir, to);
  if (!rel) rel = path.posix.basename(to);
  return rel;
}

function navLink(from, target, label) {
  return `<a href="${relativeLink(from, target)}"${from === target ? ' aria-current="page"' : ""}>${escapeHtml(label.zh)}</a>`;
}

function getPage(pathName) {
  return pagesByPath.get(pathName);
}

function navLabel(pathName, fallbackZh, fallbackEn) {
  const page = getPage(pathName);
  return page?.navTitle || b(fallbackZh, fallbackEn);
}

function topNav(currentPath) {
  const group = (label, links) => `
    <details class="nav-dropdown">
      <summary><span>${escapeHtml(label.zh)}</span></summary>
      <div class="dropdown-menu">
        ${links.map(([href, zh, en]) => navLink(currentPath, href, navLabel(href, zh, en))).join("")}
      </div>
    </details>`;

  return `
    <header class="site-header">
      <a class="brand" href="${relativeLink(currentPath, "index.html")}" aria-label="Codex Everyday Guide Home">
        <img src="${relativeLink(currentPath, "assets/logo.svg")}" alt="" width="42" height="42">
        <strong>Codex Everyday</strong>
      </a>
      <button class="menu-button" type="button" data-menu-toggle aria-expanded="false" aria-controls="topNav">目录</button>
      <nav class="top-nav" id="topNav" aria-label="Main navigation">
        ${navLink(currentPath, "index.html", b("首页", "Home"))}
        ${navLink(currentPath, "guide/00-overview.html", navLabel("guide/00-overview.html", "学习路线", "Learning Path"))}
        ${navLink(currentPath, "platform/index.html", navLabel("platform/index.html", "入口地图", "Entry Map"))}
        ${group(b("配置", "Configuration"), configPages)}
        ${group(b("资源", "Resources"), resourcePages)}
        ${group(b("教程", "Guide"), tutorials)}
        ${group(b("实战案例", "Recipes"), recipeNavPages)}
      </nav>
      <div class="header-actions">
        <a class="icon-link" href="https://github.com/edmund-xl/CodexGuide" aria-label="GitHub">GH</a>
        <button class="search-trigger" type="button" data-open-search>搜索 <kbd>⌘</kbd><kbd>K</kbd></button>
      </div>
    </header>`;
}

function searchDialog(currentPath) {
  const items = pages.map((page) => {
    const text = `${page.title.zh} ${page.title.en} ${page.group.zh} ${page.group.en} ${page.summary.zh} ${page.summary.en}`;
    return `<a data-search-item="${escapeHtml(text)}" href="${relativeLink(currentPath, page.path)}"><strong>${escapeHtml(page.title.zh)}</strong></a>`;
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
    [b("基础", "Basics"), [["guide/00-overview.html", "学习路线", "Learning Path"], ["platform/index.html", "入口地图", "Entry Map"]]],
    [b("配置", "Configuration"), configPages],
    [b("教程", "Guide"), tutorials],
    [b("实战案例", "Recipes"), recipeNavPages],
    [b("资源", "Resources"), resourcePages]
  ];

  return `
    <aside class="doc-sidebar">
      ${groups.map(([label, links]) => `
        <section>
          <h2>${escapeHtml(label.zh)}</h2>
          ${links.map(([href, zh, en]) => navLink(currentPath, href, navLabel(href, zh, en))).join("")}
        </section>
      `).join("")}
    </aside>`;
}

function textOf(value, lang) {
  return typeof value === "object" && value ? value[lang] : value;
}

function paragraph(value, lang, options = {}) {
  const text = textOf(value, lang);
  const render = options.html ? keepHtml : escapeHtml;
  return `<p>${render(text)}</p>`;
}

function singleLangList(items, lang) {
  return `
    <ul class="single-lang-list">
      ${items.map((item) => {
        const text = textOf(item, lang);
        const render = /<a\s/i.test(text) ? keepHtml : escapeHtml;
        return `<li>${render(text)}</li>`;
      }).join("")}
    </ul>`;
}

function metaGrid(meta, lang) {
  return `
    <dl class="doc-meta-grid">
      ${meta.map((item) => `
        <div>
          <dt>${escapeHtml(textOf(item.label, lang))}</dt>
          <dd>${escapeHtml(textOf(item.value, lang))}</dd>
        </div>
      `).join("")}
    </dl>`;
}

function layout({ currentPath, title, description, body, home = false }) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title.zh)} | ${escapeHtml(title.en)} | Codex Everyday Guide</title>
    <meta name="description" content="${escapeHtml(description.zh)} ${escapeHtml(description.en)}">
    <link rel="stylesheet" href="${relativeLink(currentPath, "styles.css")}">
  </head>
  <body${home ? ' class="home-page"' : ""}>
    ${topNav(currentPath)}
    ${body}
    <button class="back-top" type="button" data-back-top aria-label="返回顶部 / Back to top">↑</button>
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
        <span>基础资料最后核对日期：${verifiedDate}。动态信息请以 OpenAI 官方文档为准。</span>
        <span class="footer-en">Product facts last checked on ${verifiedDate}. Verify dynamic details against official OpenAI documentation.</span>
      </div>
      <nav aria-label="Footer navigation">
        <a href="${relativeLink(currentPath, "reference/index.html")}">官方文档</a>
        <a href="${relativeLink(currentPath, "LICENSE")}">开源许可</a>
        <a href="${relativeLink(currentPath, "contribute/roadmap.html")}">共建路线图</a>
      </nav>
    </footer>`;
}

function homePage() {
  const currentPath = "index.html";
  const featureCards = [
    [b("专业任务标准", "Professional task standard"), b("每篇文档都包含范围、前置条件、流程、交付物、风险控制和验收标准。", "Every page includes scope, prerequisites, procedure, deliverables, risk controls, and acceptance criteria.")],
    [b("双语分区", "Separated bilingual sections"), b("页面先呈现完整中文，再呈现完整英文，适合学习、培训和维护。", "Each page presents the complete Chinese section first, followed by the complete English section for learning, training, and maintenance.")],
    [b("可验证交付", "Verifiable delivery"), b("强调测试、截图、diff、清单和人工 Review，而不是只追求生成速度。", "Emphasizes tests, screenshots, diffs, checklists, and human review rather than generation speed alone.")],
    [b("安全治理", "Safety governance"), b("文件、命令、网络、凭据和团队规则统一纳入审批与复盘。", "Files, commands, network access, credentials, and team policy are handled through approvals and retrospectives.")]
  ];
  const metrics = [
    [b("43 个双语页面", "43 bilingual pages"), b("首页、教程、配置、案例和资源页全部生成双语内容。", "Home, guide, configuration, recipe, and resource pages all generate bilingual content.")],
    [b("17 节系统教程", "17 guide chapters"), b("覆盖桌面端、CLI、IDE、项目规则、沙盒、云端任务和排障。", "Covers desktop, CLI, IDE, project rules, sandbox, cloud tasks, and troubleshooting.")],
    [b("13 个实战模板", "13 practical templates"), b("使用周报、表格、文档站、支持工单和发布说明等不同场景。", "Uses distinct scenarios such as newsletters, spreadsheets, docs sites, support inboxes, and releases.")],
    [b("自动质量检查", "Automated quality checks"), b("验证链接、双语覆盖、验收标准和禁用关键词。", "Validates links, bilingual coverage, acceptance criteria, and forbidden terms.")]
  ];

  const homeActions = (lang) => `
    <div class="hero-actions">
      <a class="button primary" href="guide/00-overview.html">${lang === "zh" ? "学习路线" : "Learning Path"}</a>
      <a class="button secondary" href="platform/index.html">${lang === "zh" ? "入口地图" : "Entry Map"}</a>
      <a class="button secondary" href="recipes/index.html">${lang === "zh" ? "实战案例" : "Recipes"}</a>
    </div>`;

  const cardGrid = (items, lang, cardClass = "metric-card") => `
    <div class="card-grid four">
      ${items.map(([title, text], index) => `
        <article class="${cardClass} style-${index + 1}">
          <h3>${escapeHtml(textOf(title, lang))}</h3>
          <p>${escapeHtml(textOf(text, lang))}</p>
        </article>
      `).join("")}
    </div>`;

  const recipeCards = (lang) => `
    <div class="card-grid four">
      ${recipes.slice(0, 4).map(([href, zh, en, summaryZh, summaryEn]) => `
        <a class="plain-card" href="${href}">
          <h3>${escapeHtml(lang === "zh" ? zh : en)}</h3>
          <p>${escapeHtml(lang === "zh" ? summaryZh : summaryEn)}</p>
        </a>
      `).join("")}
    </div>`;

  const homeLanguageSection = (lang) => {
    const isZh = lang === "zh";
    return `
      <section class="language-section home-language-section${isZh ? "" : " english-section"}" lang="${isZh ? "zh-CN" : "en"}" data-language-section="${lang}">
        <p class="language-kicker">${isZh ? "中文" : "English"}</p>
        <section class="hero">
          <div class="hero-art">
            <img src="assets/logo.svg" alt="Codex Everyday Guide Logo">
          </div>
          <div class="hero-copy">
            <h1>Codex Everyday Guide</h1>
            ${paragraph(b(
              "面向普通用户、创作者、个人开发者与小团队的专业 Codex 实践文档。本站采用先中文后英文的完整分区结构、可验证流程和安全边界标准。",
              "Professional Codex documentation for everyday users, creators, individual developers, and small teams. The site uses complete Chinese-first and English-second sections, verifiable procedures, and explicit safety boundaries."
            ), lang)}
            ${homeActions(lang)}
          </div>
        </section>

        <section class="feature-grid" aria-label="${isZh ? "文档标准" : "Documentation standard"}">
          ${featureCards.map(([title, text]) => `
            <article>
              <h2>${escapeHtml(textOf(title, lang))}</h2>
              <p>${escapeHtml(textOf(text, lang))}</p>
            </article>
          `).join("")}
        </section>

        <section class="home-section">
          <header class="section-title">
            <h2>${isZh ? "这份文档如何达标" : "How This Documentation Meets the Standard"}</h2>
            ${paragraph(b(
              "本站不再使用浅层短文模板。每个页面都以专业文档结构组织，读者能明确知道要做什么、需要什么、如何操作、如何验收以及如何控制风险。",
              "The site no longer uses shallow short-form templates. Each page follows a professional documentation structure so readers know what to do, what they need, how to proceed, how to accept the result, and how to control risk."
            ), lang)}
          </header>
          ${cardGrid(metrics, lang)}
        </section>

        <section class="split-section">
          <div>
            <h2>${isZh ? "先选对入口" : "Choose the Right Entry Point"}</h2>
            ${paragraph(b(
              "Codex 的能力会出现在 App、CLI、Cloud、IDE、ChatGPT 和集成生态中。专业使用方式是先根据材料位置、风险等级和验收方式选择入口。",
              "Codex capabilities appear across App, CLI, Cloud, IDE, ChatGPT, and integrations. A professional workflow chooses the entry point based on material location, risk level, and acceptance method."
            ), lang)}
            <div class="inline-actions">
              <a class="button ghost" href="platform/index.html">${isZh ? "入口地图" : "Entry Map"}</a>
              <a class="button ghost" href="guide/03-app-tour.html">${isZh ? "桌面端" : "Desktop"}</a>
              <a class="button ghost" href="guide/11-cli-install-login.html">CLI</a>
            </div>
          </div>
          <img class="section-image" src="assets/entry-map.svg" alt="${isZh ? "Codex 入口地图" : "Codex entry point map"}">
        </section>

        <section class="loop-section">
          <header>
            <h2>${isZh ? "把一次任务做成闭环" : "Make Every Task a Closed Loop"}</h2>
            ${paragraph(b(
              "高质量任务由说明、探索、实施、验证和复盘组成。没有验收证据的任务不应被视为完成。",
              "A high-quality task includes brief, discovery, execution, verification, and retrospective. A task without acceptance evidence should not be considered complete."
            ), lang)}
          </header>
          <img src="assets/task-loop.svg" alt="${isZh ? "Codex 任务闭环" : "Codex task loop"}">
        </section>

        <section class="case-section">
          <header class="section-title">
            <h2>${isZh ? "精选实战场景" : "Selected Recipes"}</h2>
            ${paragraph(b(
              "案例库不是提示词清单，而是可复用的任务标准。读者应替换成自己的材料、限制和验收方式。",
              "The recipe library is not a prompt list; it is a reusable task standard. Readers should replace the materials, constraints, and acceptance method with their own."
            ), lang)}
          </header>
          ${recipeCards(lang)}
        </section>
      </section>`;
  };

  const body = `
    <main>
      ${homeLanguageSection("zh")}
      ${homeLanguageSection("en")}
    </main>`;

  return layout({
    currentPath,
    title: b("首页", "Home"),
    description: b("面向真实工作流的专业 Codex 双语文档。", "Professional bilingual Codex documentation for real workflows."),
    body,
    home: true
  });
}

function docPage(page) {
  const currentPath = page.path;
  const acceptance = {
    title: b("文档质量验收标准", "Documentation Quality Acceptance Criteria"),
    body: b(
      "本页只有在读者能按步骤执行、识别风险、产出交付物并完成验收时才算达标。",
      "This page meets the documentation standard only when readers can follow the procedure, identify risks, produce deliverables, and complete acceptance checks."
    ),
    bullets: [
      b("中文和英文信息一致，没有遗漏关键限制。", "Chinese and English content are equivalent and do not omit critical constraints."),
      b("读者能根据本页完成一个可回退的低风险任务。", "A reader can complete a reversible low-risk task using this page."),
      b("任务结束后有输出、证据和待确认事项。", "The task ends with output, evidence, and confirmation items."),
      b("涉及动态事实时，读者能回到官方文档复核。", "For dynamic facts, the reader can verify against official documentation.")
    ]
  };

  const relatedLinks = (links, lang) => links?.length ? `
    <nav class="next-links" aria-label="${lang === "zh" ? "相关链接" : "Related links"}">
      ${links.map((item) => `<a href="${relativeLink(currentPath, item.path)}">${escapeHtml(textOf(item.label, lang))}</a>`).join("")}
    </nav>
  ` : "";

  const languageSection = (lang) => {
    const isZh = lang === "zh";
    return `
      <section class="language-section${isZh ? "" : " english-section"}" lang="${isZh ? "zh-CN" : "en"}" data-language-section="${lang}">
        <p class="language-kicker">${isZh ? "中文" : "English"}</p>
        <p class="eyebrow">${escapeHtml(textOf(page.group, lang))}</p>
        <h1>${escapeHtml(textOf(page.title, lang))}</h1>
        ${paragraph(page.summary, lang)}
        ${metaGrid(page.meta || statusMeta(b("所有读者", "All readers"), b("20 分钟", "20 minutes")), lang)}
        ${page.image ? `<img class="doc-hero-image" src="${relativeLink(currentPath, `assets/${page.image}`)}" alt="${escapeHtml(textOf(page.title, lang))}">` : ""}
        ${page.sections.map((item) => `
          <section>
            <h2>${escapeHtml(textOf(item.title, lang))}</h2>
            ${paragraph(item.body, lang)}
            ${item.bullets?.length ? singleLangList(item.bullets, lang) : ""}
          </section>
        `).join("")}
        <section>
          <h2>${escapeHtml(textOf(acceptance.title, lang))}</h2>
          ${paragraph(acceptance.body, lang)}
          ${singleLangList(acceptance.bullets, lang)}
        </section>
        ${relatedLinks(page.links, lang)}
      </section>`;
  };

  const body = `
    <main class="doc-layout">
      ${sidebar(currentPath)}
      <article class="doc-content">
        ${languageSection("zh")}
        ${languageSection("en")}
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
  <title id="title">Codex entry point map</title>
  <desc id="desc">CLI, Cloud, IDE, Desktop App, ChatGPT, and integrations.</desc>
  <rect width="900" height="430" rx="20" fill="#151827"/>
  <rect x="38" y="38" width="824" height="354" rx="16" fill="#1d2231" stroke="#30384d"/>
  <text x="70" y="82" fill="#fff" font-size="28" font-weight="700" font-family="Arial">入口地图</text>
  <text x="70" y="112" fill="#c8d0da" font-size="18" font-family="Arial">Entry Point Map</text>
  <text x="70" y="142" fill="#c8d0da" font-size="15" font-family="Arial">按材料位置、风险等级和验收方式选择入口。</text>
  <text x="70" y="164" fill="#c8d0da" font-size="15" font-family="Arial">Choose by material, risk, and acceptance evidence.</text>
  <g font-family="Arial" font-weight="700">
    <rect x="70" y="190" width="160" height="92" rx="12" fill="#203238" stroke="#6bd2c7"/>
    <text x="92" y="225" fill="#fff" font-size="23">CLI</text>
    <text x="92" y="254" fill="#c8d0da" font-size="14">Local iteration</text>
    <rect x="260" y="190" width="170" height="92" rx="12" fill="#232a56" stroke="#7187ff"/>
    <text x="282" y="225" fill="#fff" font-size="23">Cloud</text>
    <text x="282" y="254" fill="#c8d0da" font-size="14">Long-running tasks</text>
    <rect x="462" y="190" width="170" height="92" rx="12" fill="#2a2256" stroke="#9b8cff"/>
    <text x="484" y="225" fill="#fff" font-size="23">IDE</text>
    <text x="484" y="254" fill="#c8d0da" font-size="14">Editor context</text>
    <rect x="664" y="190" width="166" height="92" rx="12" fill="#382f22" stroke="#f3bd4f"/>
    <text x="686" y="225" fill="#fff" font-size="23">Desktop App</text>
    <text x="686" y="254" fill="#c8d0da" font-size="14">Local workbench</text>
    <rect x="172" y="290" width="250" height="58" rx="10" fill="#171b29" stroke="#33394d"/>
    <text x="204" y="325" fill="#fff" font-size="18">ChatGPT Codex</text>
    <rect x="478" y="290" width="250" height="58" rx="10" fill="#171b29" stroke="#33394d"/>
    <text x="520" y="325" fill="#fff" font-size="18">Integrations</text>
  </g>
</svg>`);

  write("assets/task-loop.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex task loop</title>
  <desc id="desc">Brief, discovery, execution, verification, and retrospective.</desc>
  <rect width="900" height="430" rx="20" fill="#151827"/>
  <text x="70" y="66" fill="#fff" font-size="32" font-weight="800" font-family="Arial">任务闭环</text>
  <text x="70" y="98" fill="#d6dde8" font-size="20" font-family="Arial">Task Loop</text>
  <text x="72" y="128" fill="#d6dde8" font-size="16" font-family="Arial">说明、探索、实施、验证、复盘。</text>
  <text x="72" y="151" fill="#d6dde8" font-size="16" font-family="Arial">Brief, discover, execute, verify, retrospect.</text>
  <path d="M250 262C315 145 470 128 568 206" fill="none" stroke="#8690a5" stroke-width="6"/>
  <path d="M604 239c42 90-33 168-160 166-108-2-202-55-224-124" fill="none" stroke="#8690a5" stroke-width="6"/>
  <g font-family="Arial" text-anchor="middle">
    <circle cx="195" cy="260" r="78" fill="#203238" stroke="#6bd2c7" stroke-width="4"/>
    <text x="195" y="254" fill="#fff" font-size="24" font-weight="800">说明</text>
    <text x="195" y="286" fill="#dce5ef" font-size="16">Brief</text>
    <circle cx="420" cy="178" r="76" fill="#222b5c" stroke="#7187ff" stroke-width="4"/>
    <text x="420" y="172" fill="#fff" font-size="24" font-weight="800">探索</text>
    <text x="420" y="204" fill="#dce5ef" font-size="16">Discover</text>
    <circle cx="618" cy="218" r="76" fill="#2c245e" stroke="#9b8cff" stroke-width="4"/>
    <text x="618" y="212" fill="#fff" font-size="24" font-weight="800">实施</text>
    <text x="618" y="244" fill="#dce5ef" font-size="16">Execute</text>
    <circle cx="690" cy="330" r="70" fill="#3a3222" stroke="#f3bd4f" stroke-width="4"/>
    <text x="690" y="325" fill="#fff" font-size="23" font-weight="800">验证</text>
    <text x="690" y="355" fill="#dce5ef" font-size="16">Verify</text>
    <circle cx="450" cy="336" r="70" fill="#111522" stroke="#475067" stroke-width="4"/>
    <text x="450" y="331" fill="#fff" font-size="23" font-weight="800">复盘</text>
    <text x="450" y="361" fill="#dce5ef" font-size="16">Retro</text>
  </g>
</svg>`);

  write("assets/safety-layers.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex safety layers</title>
  <desc id="desc">Task brief, project rules, sandbox approvals, and verification review.</desc>
  <rect width="760" height="430" rx="20" fill="#151827"/>
  <text x="54" y="62" fill="#fff" font-size="28" font-weight="800" font-family="Arial">安全边界</text>
  <text x="54" y="92" fill="#d6dde8" font-size="19" font-family="Arial">Safety Layers</text>
  <text x="54" y="121" fill="#d6dde8" font-size="16" font-family="Arial">用项目规则、运行环境和人工验证共同约束风险。</text>
  <g font-family="Arial" font-weight="700">
    <rect x="72" y="150" width="616" height="54" rx="10" fill="#203238" stroke="#6bd2c7"/>
    <text x="104" y="178" fill="#fff" font-size="18">1. 任务说明</text>
    <text x="104" y="195" fill="#dce5ef" font-size="14">Task brief</text>
    <rect x="98" y="224" width="564" height="54" rx="10" fill="#232a56" stroke="#7187ff"/>
    <text x="132" y="252" fill="#fff" font-size="18">2. AGENTS.md</text>
    <text x="132" y="269" fill="#dce5ef" font-size="14">Commands, style, rules</text>
    <rect x="126" y="298" width="508" height="54" rx="10" fill="#2a2256" stroke="#9b8cff"/>
    <text x="158" y="326" fill="#fff" font-size="18">3. 审批</text>
    <text x="158" y="343" fill="#dce5ef" font-size="14">Approvals</text>
    <rect x="154" y="362" width="452" height="44" rx="10" fill="#382f22" stroke="#f3bd4f"/>
    <text x="186" y="384" fill="#fff" font-size="17">4. 验证</text>
    <text x="186" y="400" fill="#dce5ef" font-size="13">Verification</text>
  </g>
</svg>`);
}

function build() {
  writeAssets();
  addOverviewPage();
  addPlatformPage();
  addConfigurationPages();
  addResourcePages();
  addTutorialPages();
  addRecipePages();

  if (pages.length !== expectedPageCount - 1) {
    throw new Error(`Expected ${expectedPageCount - 1} generated doc pages, got ${pages.length}`);
  }

  write("index.html", homePage());
  pages.forEach((page) => write(page.path, docPage(page)));
  console.log(`Generated ${pages.length + 1} bilingual pages and SVG assets.`);
}

build();
