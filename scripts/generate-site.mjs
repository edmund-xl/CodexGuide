import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const verifiedDate = "2026-05-28";
const expectedPageCount = 44;
const artifactRoot = "assets/case-artifacts";
const siteName = "Codex Everyday Guide";
const siteBaseUrl = "https://edmund-xl.github.io/CodexGuide";
const repositoryUrl = "https://github.com/edmund-xl/CodexGuide";

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

const decisionWorkbenchProfiles = new Map([
  ["platform/index.html", {
    entry: b("桌面端 / CLI / IDE / 云端任务", "Desktop / CLI / IDE / cloud task"),
    material: b("材料位置、风险等级、验收方式", "Material location, risk level, acceptance method"),
    evidence: b("入口选择表、禁止动作、验收截图", "Entry choice table, prohibited actions, acceptance screenshot"),
    stop: b("入口需要超出当前材料权限", "Entry point needs access beyond current materials"),
    done: b("入口、权限和验收方式三项能互相解释", "Entry point, permissions, and acceptance method explain each other"),
    sample: b(
      "场景：我要检查一个本地页面和一份截图\n入口：桌面端或本地浏览器检查\n禁止：不登录新账号，不发送文件，不覆盖页面\n验收：保存桌面/手机截图，列出问题等级",
      "Scenario: review one local page and one screenshot\nEntry: desktop app or local browser review\nProhibited: no new sign-in, no file sending, no page overwrite\nAcceptance: save desktop/mobile screenshots and list issue severity"
    )
  }],
  ["configuration/index.html", {
    entry: b("本地配置 + 只读验证任务", "Local configuration plus read-only validation task"),
    material: b("当前目录、默认权限、审批策略", "Current directory, default permissions, approval policy"),
    evidence: b("配置差异、只读任务记录、回退说明", "Configuration diff, read-only task log, rollback note"),
    stop: b("配置会默认扩大目录或网络访问", "Configuration expands directory or network access by default"),
    done: b("最小配置可运行、可解释、可回退", "Minimum configuration runs, is explainable, and is reversible"),
    sample: b(
      "目标：建立当前项目的最小可用配置\n限制：不保存密钥，不默认扩大工作区\n验证：让 Codex 只读说明会访问哪些文件\n交付：配置 diff、验证记录、回退步骤",
      "Goal: create the minimum usable configuration for the current project\nConstraints: do not save secrets or broaden the workspace by default\nVerification: ask Codex to explain which files it would access read-only\nDeliverable: configuration diff, validation log, rollback steps"
    )
  }],
  ["configuration/cli-options.html", {
    entry: b("终端命令 + 审批提示", "Terminal commands plus approval prompts"),
    material: b("运行命令、模型选择、沙盒范围", "Run command, model choice, sandbox scope"),
    evidence: b("命令输出、审批记录、失败退出码", "Command output, approval record, failure exit code"),
    stop: b("命令会删除、发布、推送或改远端状态", "Command deletes, publishes, pushes, or changes remote state"),
    done: b("命令能复跑，风险动作有单独确认", "Commands can rerun and risky actions have separate confirmation"),
    sample: b(
      "任务：整理 CLI 常用启动方式\n先做：列出命令、适用场景和风险动作\n不要：直接执行发布、删除或推送\n验收：每条命令都有用途、退出条件和人工确认点",
      "Task: organize common CLI launch patterns\nFirst: list command, use case, and risky action\nDo not: publish, delete, or push directly\nAcceptance: every command has purpose, exit condition, and human confirmation point"
    )
  }],
  ["configuration/config-file.html", {
    entry: b("配置文件工作副本", "Configuration file working copy"),
    material: b("config.toml、环境变量说明、忽略规则", "config.toml, environment variable notes, ignore rules"),
    evidence: b("前后 diff、敏感字段检查、回退副本", "Before/after diff, sensitive-field check, rollback copy"),
    stop: b("凭据、账号标识或私人路径准备写入仓库", "Credentials, account identifiers, or private paths would be written to the repository"),
    done: b("配置文件不含敏感值，变更能被复核", "Configuration file has no sensitive values and changes are reviewable"),
    sample: b(
      "材料：config.toml 工作副本\n要求：只保留稳定偏好和审批默认值\n检查：搜索 token、key、password、个人目录\n交付：安全 diff、待人工确认项、回退文件名",
      "Material: config.toml working copy\nRequirement: keep only stable preferences and approval defaults\nCheck: search for token, key, password, and personal directories\nDeliverable: safe diff, human confirmation items, rollback filename"
    )
  }],
  ["configuration/mcp-skills-subagents.html", {
    entry: b("工具连接清单 + 单项试跑", "Tool connection list plus one-by-one trial"),
    material: b("可用工具、权限范围、任务拆分条件", "Available tools, permission scope, task-splitting conditions"),
    evidence: b("启用清单、试跑记录、失败处理", "Enablement checklist, trial log, failure handling"),
    stop: b("一次打开多个高权限工具且没有验收方式", "Multiple high-permission tools are enabled at once without acceptance"),
    done: b("每个扩展能力都有用途、边界和关闭方式", "Every extension has purpose, boundary, and shutdown method"),
    sample: b(
      "目标：只验证一个工具连接是否适合当前任务\n限制：一次只启用一个能力，不处理真实敏感材料\n验收：记录输入、输出、权限提示和关闭方式\n失败：连接不稳定时停止扩大范围",
      "Goal: verify whether one tool connection fits the current task\nConstraints: enable one capability at a time and avoid real sensitive material\nAcceptance: record input, output, permission prompt, and shutdown path\nFailure: stop expanding scope when the connection is unstable"
    )
  }],
  ["configuration/security-admin.html", {
    entry: b("权限矩阵 + 团队规则", "Permission matrix plus team policy"),
    material: b("文件、命令、网络、凭据、账号动作", "Files, commands, network, credentials, account actions"),
    evidence: b("审批矩阵、拒绝样例、升级路径", "Approval matrix, refusal samples, escalation path"),
    stop: b("无法说明动作影响或负责人", "Action impact or owner cannot be stated"),
    done: b("每类高风险动作都有默认处理方式", "Every high-risk action type has a default handling rule"),
    sample: b(
      "场景：团队准备允许 Codex 改仓库\n矩阵：文件写入、命令执行、联网、凭据读取、账号操作\n规则：低风险可执行，高风险必须人工确认\n验收：每类动作都有允许、拒绝和升级样例",
      "Scenario: a team prepares to let Codex edit a repository\nMatrix: file write, command run, network, credential read, account operation\nRule: low-risk actions may run; high-risk actions need human confirmation\nAcceptance: every action type has allow, deny, and escalation samples"
    )
  }],
  ["practice/index.html", {
    entry: b("任务说明 + 复盘记录", "Task brief plus retrospective record"),
    material: b("目标、范围、约束、输出格式", "Objective, scope, constraints, output format"),
    evidence: b("计划、diff、截图、人工清单", "Plan, diff, screenshot, manual checklist"),
    stop: b("目标含糊或验收方式缺失", "Objective is vague or acceptance method is missing"),
    done: b("五段式闭环留下可复查材料", "The five-stage loop leaves reviewable material"),
    sample: b(
      "任务：把一份资料副本整理成摘要表\n说明：只读原件，输出到新文件\n探索：先列字段和不确定项\n验证：人工核对 5 行样本和全部待确认项",
      "Task: turn a document duplicate into a summary table\nBrief: read the source only and output to a new file\nDiscovery: list fields and uncertainties first\nVerification: manually check five sample rows and all confirmation items"
    )
  }],
  ["reference/index.html", {
    entry: b("官方页面 + 核对日期", "Official page plus verification date"),
    material: b("功能、价格、限额、模型、安全策略", "Features, pricing, limits, models, safety policy"),
    evidence: b("核对清单、日期、改动记录", "Validation checklist, date, change log"),
    stop: b("动态事实无法在官方页面确认", "A dynamic fact cannot be confirmed on an official page"),
    done: b("每条动态信息都有最近核对日期", "Every dynamic detail has a recent verification date"),
    sample: b(
      "目标：更新一条 Codex 功能说明\n材料：官方产品页或开发者文档\n要求：记录核对日期，不写永久结论\n验收：页面文字、链接和日期三项一致",
      "Goal: update one Codex feature note\nMaterial: official product page or developer documentation\nRequirement: record verification date and avoid permanent claims\nAcceptance: page copy, link, and date are consistent"
    )
  }],
  ["contribute/roadmap.html", {
    entry: b("Issue / PR / 本地检查", "Issue / PR / local checks"),
    material: b("修改意图、影响范围、验收命令", "Change intent, impact area, acceptance commands"),
    evidence: b("构建结果、链接检查、双语 diff", "Build result, link check, bilingual diff"),
    stop: b("只改中文或英文，另一侧缺失", "Only Chinese or English is changed while the other side is missing"),
    done: b("PR 能说明为什么改、怎么验收、风险在哪", "The PR explains why it changed, how it was checked, and where risks remain"),
    sample: b(
      "PR 内容：新增一个工具实测案例\n必须包含：中文、英文、输入材料、验收命令、风险边界\n本地检查：npm run build && npm run check\n交付：截图、diff、待确认项",
      "PR content: add one tool-tested recipe\nMust include: Chinese, English, input material, acceptance command, risk boundary\nLocal check: npm run build && npm run check\nDeliverable: screenshot, diff, confirmation items"
    )
  }],
  ["recipes/usage-policy.html", {
    entry: b("材料审查 + 人工确认", "Material review plus human confirmation"),
    material: b("隐私字段、账号动作、发布动作", "Private fields, account actions, publishing actions"),
    evidence: b("脱敏记录、确认清单、停止条件", "Redaction log, confirmation checklist, stop conditions"),
    stop: b("材料包含密钥、证件、合同原文或未授权内容", "Material includes keys, IDs, full contracts, or unauthorized content"),
    done: b("敏感材料已处理，发布动作有负责人确认", "Sensitive material is handled and publishing actions have owner confirmation"),
    sample: b(
      "检查：这份材料是否含密钥、客户资料、私人证件或账号权限\n动作：先脱敏，再限定输出格式和禁止动作\n停止：无法确认授权时不继续处理\n验收：保留脱敏说明和人工确认项",
      "Check: whether the material contains keys, customer records, private IDs, or account permissions\nAction: redact first, then limit output format and prohibited actions\nStop: do not continue when authorization is unclear\nAcceptance: keep redaction notes and human confirmation items"
    )
  }]
]);

const caseRecipes = [
  {
    path: "recipes/deck-export-check.html",
    title: b("01 演示稿生成与导出核查", "01 Deck Generation and Export Verification"),
    navTitle: b("01 演示稿导出核查", "01 Deck export check"),
    summary: b("用一份脱敏产品说明生成 7 页演示稿，并用导出截图、逐页表和人工确认项判断是否可交付。", "Generate a seven-slide deck from a redacted product brief and judge delivery with export screenshots, a slide table, and human confirmations."),
    domain: b("演示材料", "Presentation work"),
    audience: b("运营、创作者、项目负责人", "Operators, creators, and project leads"),
    entry: b("桌面端 + 演示文档工具", "Desktop app plus presentation tooling"),
    materialsLabel: b("脱敏产品说明、品牌色、页数限制、必须出现的三条信息", "Redacted product brief, brand colors, slide limit, and three required messages"),
    evidence: b("导出文件、四张预览截图、逐页验收表", "Exported file, four preview screenshots, and slide acceptance table"),
    deliverable: b("deck-draft.pptx、slide-checklist.md、export-notes.md", "deck-draft.pptx, slide-checklist.md, and export-notes.md"),
    duration: b("45-60 分钟", "45-60 minutes"),
    risk: b("低到中", "Low to medium"),
    materials: [
      b("输入说明限制在 800 字以内，客户名、报价、合同编号和内部链接已替换为中性占位。", "Input brief is capped at 800 words; customer names, quotes, contract IDs, and internal links are replaced with neutral placeholders."),
      b("品牌约束只保留颜色、语气和字号，不放真实商标或专有图片。", "Brand constraints keep only colors, tone, and type size, without real marks or proprietary images."),
      b("验收时只检查文件结构、可读性和事实标注，不代替最终对外确认。", "Acceptance checks file structure, readability, and fact markings, without replacing final external approval.")
    ],
    environment: [
      b("工作目录：<code>workspace/deck-demo/</code>，输出目录：<code>workspace/deck-demo/out/</code>。", "Workspace: <code>workspace/deck-demo/</code>; output directory: <code>workspace/deck-demo/out/</code>."),
      b("导出检查覆盖首页、目录页、数据页和结尾页四张截图。", "Export review covers four screenshots: cover, agenda, data slide, and closing slide."),
      b("高风险内容为金额、日期、承诺语和版权素材，全部标记为人工确认。", "High-risk items are amounts, dates, commitments, and licensed assets; all are marked for human confirmation.")
    ],
    inputSample: b(`产品：Team Notes
目标读者：小团队负责人
核心主张：把会议纪要、待办、文件链接整理成一个可追踪工作台
必须出现：7 天试用、三步上手、数据不对外发送
限制：不要写客户名，不要写价格，不要承诺自动决策`,
`Product: Team Notes
Audience: small-team leads
Core claim: organize meeting notes, tasks, and file links into a trackable workspace
Must include: seven-day trial, three-step onboarding, no external data sending
Constraints: no customer names, no pricing, no autonomous decision claims`),
    playbook: [
      b("先生成 7 页结构表，逐页确认标题、主张、证据和备注，再允许制作文件。", "Create a seven-slide structure table first, confirming title, claim, evidence, and notes before file generation."),
      b("生成文件时同步生成 <code>slide-checklist.md</code>，每页记录输入材料、风险点和验收状态。", "Generate <code>slide-checklist.md</code> alongside the file, recording input material, risk, and acceptance status per slide."),
      b("导出后逐张截图检查标题长度、正文溢出、备注缺失和图片占位。", "After export, inspect screenshots for title length, text overflow, missing notes, and image placeholders.")
    ],
    evidenceTable: [
      [b("大纲锁定", "Outline locked"), b("7 页结构，无价格、无客户名", "Seven-slide structure, no pricing, no customer names"), b("slide-outline.md", "slide-outline.md"), b("通过", "Pass")],
      [b("文件导出", "File export"), b("PPTX 可打开，页数为 7", "PPTX opens and contains seven slides"), b("deck-draft.pptx", "deck-draft.pptx"), b("通过", "Pass")],
      [b("视觉抽查", "Visual spot check"), b("数据页有一处正文过长，已缩短为两行", "Data slide had long body text and was shortened to two lines"), b("data-slide-1440.png", "data-slide-1440.png"), b("修正后通过", "Passed after fix")],
      [b("人工确认", "Human confirmation"), b("试用期、隐私表述、对外承诺待用户确认", "Trial period, privacy wording, and external claims need user confirmation"), b("export-notes.md", "export-notes.md"), b("待确认", "Needs confirmation")]
    ],
    outputSample: b(`交付摘要
- deck-draft.pptx：7 页，可打开，可导出
- slide-checklist.md：7 行逐页状态，1 项待确认
- export-notes.md：列出试用期、隐私表述、版权素材三类人工确认点
- screenshots/：cover、agenda、data、closing 四张 PNG`,
`Delivery summary
- deck-draft.pptx: seven slides, opens correctly, exportable
- slide-checklist.md: seven slide rows, one confirmation item
- export-notes.md: trial, privacy wording, and asset confirmation items
- screenshots/: cover, agenda, data, and closing PNG files`),
    failureNotes: [
      [b("页数失控", "Slide count drift"), b("第一轮草稿生成 10 页，超出限制", "First draft produced ten slides, beyond the limit"), b("先锁 7 页结构，再生成文件", "Lock the seven-slide structure before file generation")],
      [b("正文溢出", "Body overflow"), b("数据页说明超过卡片高度", "Data slide body exceeded card height"), b("改为两条短句并重新截图", "Rewrite as two short bullets and capture again")],
      [b("承诺语过强", "Over-strong claim"), b("出现自动决策表述", "Autonomous decision wording appeared"), b("替换为辅助整理，并列入人工确认", "Replace with assistive wording and add human confirmation")]
    ],
    riskControls: [
      b("不使用真实客户、金额、合同号、商标图片或未授权素材。", "Do not use real customers, amounts, contract IDs, marks, or unauthorized assets."),
      b("所有对外承诺、隐私表述和日期在发送前由用户确认。", "All external promises, privacy wording, and dates are confirmed by the user before sending."),
      b("原始说明保留为只读副本，生成文件使用新文件名。", "The original brief stays read-only; generated files use new names.")
    ],
    commands: [
      b("ls out/deck-draft.pptx out/slide-checklist.md out/export-notes.md", "ls out/deck-draft.pptx out/slide-checklist.md out/export-notes.md"),
      b("人工打开 deck-draft.pptx，确认 7 页均可显示且备注不为空。", "Open deck-draft.pptx manually and confirm all seven slides display and notes are not empty."),
      b("人工检查 screenshots/cover.png、agenda.png、data.png、closing.png 是否无文字溢出。", "Manually check screenshots/cover.png, agenda.png, data.png, and closing.png for no text overflow.")
    ],
    acceptanceChecks: [
      b("交付物齐全，文件名不覆盖原始材料。", "Deliverables are complete and do not overwrite source material."),
      b("逐页验收表包含状态、风险和待确认项。", "The slide checklist includes status, risk, and confirmation items."),
      b("截图覆盖封面、目录、正文密集页和结尾页。", "Screenshots cover the cover, agenda, dense body slide, and closing slide."),
      b("所有金额、日期、隐私和承诺语已标为人工确认。", "All amounts, dates, privacy wording, and claims are marked for human confirmation.")
    ],
    taskOrder: [
      b("请先把这份脱敏产品说明拆成 7 页演示稿结构，不要生成文件。", "First split this redacted product brief into a seven-slide deck structure; do not generate files yet."),
      b("每页输出标题、核心主张、输入证据、视觉建议、备注和待确认项。", "For each slide, output title, core claim, input evidence, visual direction, notes, and confirmation items."),
      b("确认结构后再生成 PPTX、逐页验收表和导出截图检查清单。", "After structure confirmation, generate the PPTX, slide acceptance table, and export screenshot checklist.")
    ]
  },
  {
    path: "recipes/browser-page-review.html",
    title: b("02 浏览器页面巡检与截图证据", "02 Browser Page Review with Screenshot Evidence"),
    navTitle: b("02 页面巡检截图", "02 Page screenshot review"),
    summary: b("用本地页面做一次只读巡检，记录桌面与手机视口、控制台状态、截图证据和问题优先级。", "Run a read-only review of a local page, recording desktop and mobile viewports, console state, screenshot evidence, and issue priority."),
    domain: b("网页质量", "Web quality"),
    audience: b("站点维护者、运营、前端协作者", "Site maintainers, operators, and frontend collaborators"),
    entry: b("本地页面 + 浏览器检查", "Local page plus browser inspection"),
    materialsLabel: b("目标 URL、主路径、视口尺寸、禁止动作", "Target URL, primary path, viewport sizes, and prohibited actions"),
    evidence: b("桌面截图、手机截图、控制台摘要、问题表", "Desktop screenshot, mobile screenshot, console summary, and issue table"),
    deliverable: b("page-review.md、screenshots/、console-summary.txt", "page-review.md, screenshots/, and console-summary.txt"),
    duration: b("35-50 分钟", "35-50 minutes"),
    risk: b("低", "Low"),
    materials: [
      b("目标页面为本地预览地址，不输入账号密码，不提交表单。", "The target page is a local preview URL; no credentials are entered and no forms are submitted."),
      b("视口固定为桌面 1440x1000、手机 390x900。", "Viewports are fixed at desktop 1440x1000 and mobile 390x900."),
      b("主路径只点击导航和展开控件，不触发写入、购买、删除或授权。", "The primary path clicks only navigation and expand controls, without write, purchase, delete, or authorization actions.")
    ],
    environment: [
      b("服务地址：<code>http://127.0.0.1:4173/</code>。", "Service URL: <code>http://127.0.0.1:4173/</code>."),
      b("检查页面：首页、案例总览、一个案例详情、使用规范页。", "Checked pages: home, recipe index, one recipe detail, and usage policy."),
      b("问题分级：阻断、影响体验、文字瑕疵、后续优化。", "Issue levels: blocking, experience impact, copy polish, and follow-up improvement.")
    ],
    inputSample: b(`巡检任务
URL: http://127.0.0.1:4173/recipes/pages-deploy-diagnosis.html
主路径: 打开页面、切换手机视口、展开导航、检查证据表
禁止动作: 不提交表单、不修改数据、不触发账号动作`,
`Review task
URL: http://127.0.0.1:4173/recipes/pages-deploy-diagnosis.html
Primary path: open page, switch to mobile viewport, expand navigation, inspect evidence table
Prohibited actions: do not submit forms, change data, or trigger account actions`),
    playbook: [
      b("先读取页面标题、主标题、导航和核心按钮，确认可见层级。", "Read page title, main heading, navigation, and primary buttons first to confirm visible hierarchy."),
      b("分别截图桌面和手机视口，不能用一张截图代替全部设备。", "Capture desktop and mobile screenshots separately; one screenshot cannot represent all devices."),
      b("记录控制台错误、网络失败和横向溢出结果。", "Record console errors, network failures, and horizontal overflow results.")
    ],
    evidenceTable: [
      [b("桌面首屏", "Desktop first view"), b("主标题、侧栏和任务状态面板可见", "Main heading, sidebar, and task status panel are visible"), b("home-desktop-1440.png", "home-desktop-1440.png"), b("通过", "Pass")],
      [b("手机视口", "Mobile viewport"), b("无横向滚动，导航按钮可展开", "No horizontal scrolling; nav button expands"), b("case-mobile-390.png", "case-mobile-390.png"), b("通过", "Pass")],
      [b("证据表", "Evidence table"), b("表格在手机端可横向滚动，未撑破页面", "Table scrolls horizontally on mobile without breaking the page"), b("case-table-mobile.png", "case-table-mobile.png"), b("通过", "Pass")],
      [b("控制台", "Console"), b("无 JavaScript 错误，资源均返回 200", "No JavaScript errors; assets return 200"), b("console-summary.txt", "console-summary.txt"), b("通过", "Pass")]
    ],
    outputSample: b(`page-review.md
P0 阻断：0
P1 体验影响：1 - 手机端证据表需要明显滚动提示
P2 文字瑕疵：2 - 两处按钮文案可缩短
通过项：本地服务 200，桌面无重叠，手机无横向页面溢出`,
`page-review.md
P0 blocking: 0
P1 experience impact: 1 - mobile evidence table needs a clearer scroll cue
P2 copy polish: 2 - two button labels can be shortened
Passed checks: local service 200, no desktop overlap, no mobile page overflow`),
    failureNotes: [
      [b("只看 DOM", "DOM-only review"), b("DOM 文本正常但手机截图里按钮换行拥挤", "DOM text was fine but mobile screenshot showed cramped button wrapping"), b("截图成为必检证据", "Make screenshots mandatory evidence")],
      [b("截图命名混乱", "Screenshot naming drift"), b("第一次截图无法判断视口", "First screenshot names did not show viewport"), b("统一使用页面加视口命名", "Use page plus viewport in filenames")],
      [b("表格撑宽", "Table width issue"), b("证据表在 390px 下撑出页面", "Evidence table stretched beyond 390px"), b("为表格容器启用横向滚动", "Enable horizontal scrolling on table containers")]
    ],
    riskControls: [
      b("只读页面状态，不提交表单、不删除、不购买、不授权。", "Read page state only; do not submit, delete, purchase, or authorize."),
      b("截图前确认没有多余个人信息或账号标识。", "Before screenshots, confirm no unnecessary personal data or account identifiers are visible."),
      b("只记录可复核现象，不推断未点击路径的结果。", "Record reviewable observations only; do not infer results for paths not clicked.")
    ],
    commands: [
      b("curl -I -L --max-time 15 http://127.0.0.1:4173/", "curl -I -L --max-time 15 http://127.0.0.1:4173/"),
      b("浏览器桌面视口：1440x1000，截图 home-desktop-1440.png。", "Browser desktop viewport: 1440x1000, capture home-desktop-1440.png."),
      b("浏览器手机视口：390x900，检查 document.documentElement.scrollWidth 是否大于 window.innerWidth。", "Browser mobile viewport: 390x900, check whether document.documentElement.scrollWidth is greater than window.innerWidth.")
    ],
    acceptanceChecks: [
      b("目标 URL 返回 200，关键资源未缺失。", "Target URL returns 200 and key assets are not missing."),
      b("桌面和手机截图都能证明页面主要内容可见。", "Desktop and mobile screenshots prove primary content is visible."),
      b("问题表包含位置、现象、截图名、建议和优先级。", "Issue table includes location, symptom, screenshot name, recommendation, and priority."),
      b("未触发任何会改变数据或账号状态的动作。", "No action that changes data or account state is triggered.")
    ],
    taskOrder: [
      b("请打开这个本地页面做只读巡检，先列出检查区域和禁止动作。", "Open this local page for read-only review and first list checked areas and prohibited actions."),
      b("请分别检查桌面和手机视口，输出截图清单、控制台摘要和问题表。", "Check desktop and mobile viewports separately, then output screenshot inventory, console summary, and issue table."),
      b("不要提交表单、不要修改数据、不要触发账号动作。", "Do not submit forms, modify data, or trigger account actions.")
    ]
  },
  {
    path: "recipes/pages-deploy-diagnosis.html",
    title: b("03 GitHub Pages 部署失败诊断", "03 GitHub Pages Deployment Failure Diagnosis"),
    navTitle: b("03 Pages 部署诊断", "03 Pages deploy diagnosis"),
    summary: b("从失败通知、Actions job 和本地检查命令定位 Pages 发布问题，并用新的 run 与线上响应完成闭环。", "Diagnose a Pages deployment issue from failure notification, Actions jobs, and local checks, then close the loop with a new run and live response."),
    domain: b("发布排障", "Deployment troubleshooting"),
    audience: b("项目维护者、内容站负责人", "Project maintainers and documentation site owners"),
    entry: b("本地仓库 + Actions 日志", "Local repository plus Actions logs"),
    materialsLabel: b("失败截图、run id、workflow 文件、最新提交 SHA", "Failure screenshot, run id, workflow file, and latest commit SHA"),
    evidence: b("失败步骤、修复提交、新 run、线上 200 响应", "Failed step, fix commit, new run, and live 200 response"),
    deliverable: b("deploy-incident.md、修复提交、验证命令记录", "deploy-incident.md, fix commit, and validation command record"),
    duration: b("40-70 分钟", "40-70 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("失败页面截图只用于识别 job 名称和失败状态，不作为唯一判断。", "The failure screenshot is used only to identify job name and status, not as the only judgment."),
      b("本地工作区先确认干净，避免发布修复混入内容改动。", "Confirm a clean local worktree first so deploy fixes do not mix with content edits."),
      b("只改 workflow 或 Pages 配置相关文件，不碰业务页面。", "Change only workflow or Pages configuration-related files, not content pages.")
    ],
    environment: [
      b("仓库分支：<code>main</code>，发布方式：GitHub Pages Actions。", "Repository branch: <code>main</code>; publishing method: GitHub Pages Actions."),
      b("本地质量门禁：<code>npm run build</code>、<code>npm run check</code>、<code>git diff --check</code>。", "Local quality gates: <code>npm run build</code>, <code>npm run check</code>, and <code>git diff --check</code>."),
      b("线上验收：目标地址返回 <code>200 OK</code>，页面包含本次标题或新内容标记。", "Live acceptance: target URL returns <code>200 OK</code> and contains the current title or new content marker.")
    ],
    inputSample: b(`失败摘要
Run: Deploy Pages #5
build: failed in 10 seconds
deploy: skipped
现象: 邮件显示 Some jobs were not successful
限制: 不改内容页面，先判断 workflow、artifact、Pages 设置哪一段失败`,
`Failure summary
Run: Deploy Pages #5
build: failed in 10 seconds
deploy: skipped
Symptom: email says Some jobs were not successful
Constraint: do not edit content pages; first identify whether workflow, artifact, or Pages settings failed`),
    playbook: [
      b("先区分内容构建失败、artifact 上传失败、Pages 配置失败和部署失败。", "First separate content build failure, artifact upload failure, Pages configuration failure, and deploy failure."),
      b("进入 job steps 找第一个红色步骤，不被最终 skipped 状态误导。", "Open job steps and find the first red step instead of being misled by the final skipped status."),
      b("修复后用新 run 验证，旧失败 run 不会自动变绿。", "After fixing, validate with a new run; old failed runs do not turn green automatically.")
    ],
    evidenceTable: [
      [b("本地构建", "Local build"), b("44 个页面生成成功", "44 pages generated successfully"), b("npm run build", "npm run build"), b("通过", "Pass")],
      [b("本地检查", "Local check"), b("双语、链接、验收、禁用词通过", "Bilingual, links, acceptance, and blocked words passed"), b("npm run check", "npm run check"), b("通过", "Pass")],
      [b("失败定位", "Failure location"), b("第一个失败点在 Pages 配置或 artifact 步骤", "First failure located in Pages configuration or artifact step"), b("job steps", "job steps"), b("已定位", "Located")],
      [b("线上验收", "Live acceptance"), b("新 run build/deploy 成功，线上返回 200", "New run build/deploy passed and live URL returned 200"), b("curl -I -L", "curl -I -L"), b("通过", "Pass")]
    ],
    outputSample: b(`deploy-incident.md
现象：Deploy Pages 的 build 失败，deploy 跳过
根因：workflow 的 Pages 配置步骤未满足当前发布方式
修复：更新 Pages Actions 配置并保留 build/check 步骤
验证：新 run build=success, deploy=success; live URL=200 OK`,
`deploy-incident.md
Symptom: Deploy Pages build failed and deploy was skipped
Root cause: workflow Pages configuration did not match the current publish mode
Fix: update Pages Actions configuration while keeping build/check steps
Verification: new run build=success, deploy=success; live URL=200 OK`),
    failureNotes: [
      [b("只看邮件", "Email-only diagnosis"), b("邮件没有第一个失败步骤", "Email did not show the first failed step"), b("必须打开 job steps", "Open job steps")],
      [b("旧 run 误判", "Old run confusion"), b("修复后旧 run 仍显示失败", "Old run still showed failure after fix"), b("以新提交触发的新 run 为准", "Use the new run from the new commit")],
      [b("缓存延迟", "Cache delay"), b("线上页面短时间仍显示旧内容", "Live page briefly showed old content"), b("用响应头和页面标题共同判断", "Check both response headers and page title")]
    ],
    riskControls: [
      b("部署修复与内容改动分开提交，便于回退。", "Keep deploy fixes and content changes in separate commits for rollback."),
      b("不使用强制覆盖远端历史，除非用户单独确认。", "Do not force-overwrite remote history unless the user explicitly confirms."),
      b("每次推送后等待新 run 完成，再宣布线上成功。", "After each push, wait for the new run to finish before declaring live success.")
    ],
    commands: [
      b("npm run build && npm run check && git diff --check", "npm run build && npm run check && git diff --check"),
      b("git status --short --branch", "git status --short --branch"),
      b("curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/", "curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/")
    ],
    acceptanceChecks: [
      b("本地 build 和 check 均通过。", "Local build and check both pass."),
      b("失败记录写清现象、失败步骤、根因、修复和验证命令。", "Incident record states symptom, failed step, root cause, fix, and verification commands."),
      b("新 run 的 build 与 deploy 均为 success。", "The new run has build and deploy both successful."),
      b("线上地址返回 200，并能看到新页面内容。", "Live URL returns 200 and displays the new page content.")
    ],
    taskOrder: [
      b("请根据这次失败 run 先判断失败类型，不要直接修改业务页面。", "Use this failed run to identify the failure type first; do not edit content pages directly."),
      b("请列出第一个失败步骤、错误信息、最小修复和验证命令。", "List the first failed step, error message, minimal fix, and verification commands."),
      b("修复完成后请提交、推送，并确认新的 run 与线上地址。", "After fixing, commit, push, and verify the new run and live URL.")
    ]
  },
  {
    path: "recipes/docs-site-redesign.html",
    title: b("04 本地文档站批量改版", "04 Local Documentation Site Redesign"),
    navTitle: b("04 文档站批量改版", "04 Docs site redesign"),
    summary: b("把静态文档站一次性改成深色产品工作台，并用页面数量、链接、截图和禁用词检查证明未破坏发布链路。", "Redesign a static documentation site into a dark product workspace and prove the publish chain remains intact with page count, links, screenshots, and blocked-word checks."),
    domain: b("文档工程", "Documentation engineering"),
    audience: b("文档站维护者、个人开发者", "Documentation maintainers and individual developers"),
    entry: b("本地仓库 + 静态生成器", "Local repository plus static generator"),
    materialsLabel: b("生成器、样式表、README、截图目录、发布 workflow", "Generator, stylesheet, README, screenshot directory, and deploy workflow"),
    evidence: b("diff、构建日志、链接检查、桌面与手机截图", "Diff, build log, link check, desktop and mobile screenshots"),
    deliverable: b("新版站点、README 截图、质量门禁结果", "Redesigned site, README screenshots, and quality-gate results"),
    duration: b("90-120 分钟", "90-120 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("改版前锁定页面数量、目录、发布命令和本地服务地址。", "Before redesign, lock page count, folders, deploy commands, and local service URLs."),
      b("视觉目标拆成颜色、密度、导航、表格、代码块和移动端规则。", "Break the visual target into color, density, navigation, tables, code blocks, and mobile rules."),
      b("截图只展示本站内容，避免混入无关品牌和业务数据。", "Screenshots show only this site and do not include unrelated brand or business data.")
    ],
    environment: [
      b("生成命令：<code>npm run build</code>，检查命令：<code>npm run check</code>。", "Build command: <code>npm run build</code>; check command: <code>npm run check</code>."),
      b("本地服务同时支持根路径和 <code>/CodexGuide/</code> 路径。", "Local service supports both root path and <code>/CodexGuide/</code>."),
      b("验收截图覆盖首页、案例总览、案例详情和使用规范页。", "Acceptance screenshots cover home, recipe index, recipe detail, and usage policy.")
    ],
    inputSample: b(`改版约束
底色 #141414，面板 #1e1e1e / #242424，边框 #333，强调色 #ff922c
页面数量保持 44
README 需要展示新版截图
本地路径和线上路径都要可访问`,
`Redesign constraints
Background #141414, panels #1e1e1e / #242424, border #333, accent #ff922c
Keep 44 pages
README must show updated screenshots
Local and live paths must be accessible`),
    playbook: [
      b("先改数据结构和渲染组件，再改 CSS，最后更新截图和 README。", "Change data structure and rendering components first, then CSS, then screenshots and README."),
      b("每完成一个大块就运行构建，尽早发现模板错误。", "Run the build after each major block to catch template errors early."),
      b("视觉验收必须用浏览器截图，不只看代码。", "Visual acceptance requires browser screenshots, not code review alone.")
    ],
    evidenceTable: [
      [b("页面数量", "Page count"), b("HTML 页面仍为 44", "HTML page count remains 44"), b("npm run check", "npm run check"), b("通过", "Pass")],
      [b("链接", "Links"), b("导航、搜索、README 链接均指向现有文件", "Navigation, search, and README links point to existing files"), b("verify-site.mjs", "verify-site.mjs"), b("通过", "Pass")],
      [b("移动端", "Mobile"), b("390px 下无页面横向溢出", "No page-level horizontal overflow at 390px"), b("mobile screenshots", "mobile screenshots"), b("通过", "Pass")],
      [b("截图", "Screenshots"), b("README 五张截图均为新版深色界面", "All five README screenshots show the redesigned dark interface"), b("assets/screenshots/", "assets/screenshots/"), b("通过", "Pass")]
    ],
    outputSample: b(`改版结果
- 44 个页面重新生成
- 案例页新增任务状态面板、证据表、命令块和验收清单
- README 更新首页、案例总览、两个案例页、使用规范页截图
- 本地根路径和 /CodexGuide/ 均返回 200`,
`Redesign result
- 44 pages regenerated
- Recipe pages gain task status panels, evidence tables, command blocks, and acceptance checklists
- README updates home, recipe index, two recipe pages, and usage policy screenshots
- Local root and /CodexGuide/ both return 200`),
    failureNotes: [
      [b("旧文件残留", "Stale files"), b("改 URL 后旧 HTML 仍留在目录中", "Old HTML files remained after URL changes"), b("删除旧文件并让校验禁止旧路径", "Delete old files and make verification block old paths")],
      [b("搜索索引旧文案", "Stale search text"), b("搜索结果仍显示旧摘要", "Search results still showed old summaries"), b("统一从新 page 数据生成搜索文本", "Generate search text from new page data")],
      [b("表格移动端溢出", "Mobile table overflow"), b("证据表撑破 390px 页面", "Evidence table broke the 390px page"), b("给表格容器设置滚动和最小列宽", "Add scroll containers and minimum column widths")]
    ],
    riskControls: [
      b("URL 改名属于破坏性变更，提交前必须确认 README、导航和搜索全部更新。", "URL renaming is breaking; before commit, confirm README, navigation, and search are updated."),
      b("不改发布 workflow 的核心行为，除非本地和远端检查证明需要。", "Do not change core deploy workflow behavior unless local and remote checks prove it is needed."),
      b("生成截图前先跑 build/check，避免截到过期页面。", "Run build/check before capturing screenshots to avoid stale pages.")
    ],
    commands: [
      b("npm run build", "npm run build"),
      b("npm run check", "npm run check"),
      b("curl -I -L --max-time 15 http://127.0.0.1:4173/CodexGuide/", "curl -I -L --max-time 15 http://127.0.0.1:4173/CodexGuide/")
    ],
    acceptanceChecks: [
      b("44 个 HTML 页面全部生成并通过链接检查。", "All 44 HTML pages are generated and pass link checks."),
      b("旧案例路径不再出现在仓库内容或生成页面中。", "Old recipe paths no longer appear in repository content or generated pages."),
      b("桌面和手机截图无文字重叠、无页面级横向溢出。", "Desktop and mobile screenshots show no text overlap and no page-level horizontal overflow."),
      b("README 截图与当前站点界面一致。", "README screenshots match the current site interface.")
    ],
    taskOrder: [
      b("请先列出不可破坏项，再开始改生成器、样式和截图。", "List non-breaking requirements before changing the generator, styles, and screenshots."),
      b("每轮修改后运行构建与检查，最终用桌面和手机浏览器截图验收。", "Run build and checks after each round; use desktop and mobile browser screenshots for final acceptance."),
      b("提交前请确认 README 截图、线上路径和本地路径一致。", "Before committing, confirm README screenshots, live paths, and local paths are aligned.")
    ]
  },
  {
    path: "recipes/markdown-knowledge-base.html",
    title: b("05 Markdown 知识库重整", "05 Markdown Knowledge Base Restructure"),
    navTitle: b("05 知识库重整", "05 Knowledge base cleanup"),
    summary: b("把散乱 Markdown 笔记整理成统一 frontmatter、主题索引和待补清单，并保留样本 diff 便于回退。", "Restructure scattered Markdown notes into consistent frontmatter, a topic index, and a pending list while keeping sample diffs for rollback."),
    domain: b("知识管理", "Knowledge management"),
    audience: b("研究者、创作者、个人知识库维护者", "Researchers, creators, and personal knowledge-base maintainers"),
    entry: b("本地 Markdown 目录 + 只读扫描", "Local Markdown folder plus read-only scan"),
    materialsLabel: b("笔记副本、字段规则、样本文件、目标索引格式", "Notes copy, field rules, sample files, and target index format"),
    evidence: b("字段缺失矩阵、样本 diff、索引页、待补清单", "Missing-field matrix, sample diff, index page, and pending list"),
    deliverable: b("重整后的 Markdown 副本、index.md、pending-review.md", "Restructured Markdown copy, index.md, and pending-review.md"),
    duration: b("50-80 分钟", "50-80 minutes"),
    risk: b("低到中", "Low to medium"),
    materials: [
      b("只处理笔记目录副本，原始目录保持只读。", "Only the copied notes folder is processed; the original folder stays read-only."),
      b("统一字段为 title、date、topic、status、summary、next_action。", "Consistent fields are title, date, topic, status, summary, and next_action."),
      b("缺失字段标记为待补，不猜作者、日期或结论。", "Missing fields are marked pending; author, date, and conclusion are not guessed.")
    ],
    environment: [
      b("样本目录：<code>notes-working/</code>，先抽 5 篇验证规则。", "Sample folder: <code>notes-working/</code>; validate rules with five notes first."),
      b("索引按 topic 和 status 分组，不复制完整目录树。", "The index groups by topic and status instead of copying the full folder tree."),
      b("所有批量修改先展示 diff，再等待确认。", "All batch edits show diffs before confirmation.")
    ],
    inputSample: b(`notes-working/
  2025-ideas.md       # 无 frontmatter，标题重复
  meeting-ai.md       # 有标题，无日期
  draft-launch.md     # 状态不清楚
目标字段: title, date, topic, status, summary, next_action`,
`notes-working/
  2025-ideas.md       # no frontmatter, duplicate heading
  meeting-ai.md       # has title, no date
  draft-launch.md     # unclear status
Target fields: title, date, topic, status, summary, next_action`),
    playbook: [
      b("第一步只扫描文件名、标题和已有 frontmatter，输出缺失矩阵。", "Step one scans only filenames, headings, and existing frontmatter, then outputs a missing-field matrix."),
      b("第二步处理 5 篇样本并展示 diff，确认规则后再批量迁移。", "Step two processes five samples and shows diffs; batch migration happens only after rules are confirmed."),
      b("第三步生成主题索引和待补清单，突出状态和下一步。", "Step three generates topic index and pending list, emphasizing status and next action.")
    ],
    evidenceTable: [
      [b("扫描", "Scan"), b("发现 18 篇笔记，11 篇缺 date，6 篇缺 status", "Found 18 notes, 11 missing date, 6 missing status"), b("missing-fields.md", "missing-fields.md"), b("通过", "Pass")],
      [b("样本迁移", "Sample migration"), b("5 篇样本生成 frontmatter，未猜缺失日期", "Five samples gained frontmatter without guessed dates"), b("sample-diff.patch", "sample-diff.patch"), b("通过", "Pass")],
      [b("索引", "Index"), b("按 topic/status 分组，能看到待补项", "Grouped by topic/status and shows pending items"), b("index.md", "index.md"), b("通过", "Pass")],
      [b("待补", "Pending"), b("所有缺失作者、日期、结论单独列出", "Missing author, date, and conclusion items are listed separately"), b("pending-review.md", "pending-review.md"), b("待人工补充", "Needs human input")]
    ],
    outputSample: b(`index.md
## 产品想法
- Team Notes / active / 下一步：补充使用场景
- Launch Draft / pending / 下一步：确认发布日期

pending-review.md
- meeting-ai.md: date 缺失
- draft-launch.md: status 需要确认`,
`index.md
## Product ideas
- Team Notes / active / Next: add use case
- Launch Draft / pending / Next: confirm launch date

pending-review.md
- meeting-ai.md: missing date
- draft-launch.md: status needs confirmation`),
    failureNotes: [
      [b("自动猜日期", "Guessed dates"), b("文件名年份被误当成完整日期", "Filename year was treated as full date"), b("只保留可证明日期，其他标待补", "Keep only provable dates and mark others pending")],
      [b("索引太像目录", "Index looked like a folder tree"), b("初版只列文件名，无法行动", "First version listed only filenames and was not actionable"), b("改为 topic、status、next_action 三列", "Switch to topic, status, and next_action columns")],
      [b("批量范围过大", "Batch too large"), b("一次改全部文件难以审阅", "Editing all files at once was hard to review"), b("先做样本 diff 再批量", "Create sample diffs before batching")]
    ],
    riskControls: [
      b("原始笔记目录不写入，迁移只发生在工作副本。", "The original notes folder is not written; migration happens only in the working copy."),
      b("缺失信息标记为 pending，不补写没有证据的内容。", "Missing information is marked pending and absent content is not invented."),
      b("批量前必须展示样本 diff 并确认规则。", "Before batching, sample diffs and rules must be confirmed.")
    ],
    commands: [
      b("rg --files notes-working | sort", "rg --files notes-working | sort"),
      b("rg -n \"^title:|^date:|^topic:|^status:\" notes-working", "rg -n \"^title:|^date:|^topic:|^status:\" notes-working"),
      b("git diff -- notes-working index.md pending-review.md", "git diff -- notes-working index.md pending-review.md")
    ],
    acceptanceChecks: [
      b("每篇笔记都有统一字段或明确待补标记。", "Every note has consistent fields or explicit pending markers."),
      b("index.md 能按主题和状态快速定位材料。", "index.md supports quick lookup by topic and status."),
      b("pending-review.md 集中列出需要人工补充的信息。", "pending-review.md centralizes information needing human input."),
      b("样本 diff 可读，单篇文件可回退。", "Sample diffs are readable and individual files can be reverted.")
    ],
    taskOrder: [
      b("请扫描这个 Markdown 工作副本，先输出字段缺失矩阵和迁移规则。", "Scan this Markdown working copy and first output a missing-field matrix and migration rules."),
      b("请先处理 5 个样本文件，展示 diff 后等待确认。", "Process five sample files first, show the diff, and wait for confirmation."),
      b("确认后批量迁移，并生成主题索引和待补清单。", "After confirmation, batch-migrate and generate a topic index plus pending list.")
    ]
  },
  {
    path: "recipes/spreadsheet-cleanup.html",
    title: b("06 表格数据清洗与异常核对", "06 Spreadsheet Cleanup and Anomaly Review"),
    navTitle: b("06 表格清洗核对", "06 Spreadsheet review"),
    summary: b("对一份脱敏 CSV 做只读画像、异常分类、清理建议和人工复核表，保留原始行号便于追溯。", "Profile a redacted CSV read-only, classify anomalies, produce cleanup suggestions and a human review sheet, and keep original row numbers for traceability."),
    domain: b("数据整理", "Data cleanup"),
    audience: b("运营、财务助理、数据维护者", "Operators, finance assistants, and data maintainers"),
    entry: b("本地 CSV + 只读分析", "Local CSV plus read-only analysis"),
    materialsLabel: b("脱敏 CSV、字段说明、金额和日期规则", "Redacted CSV, field notes, amount and date rules"),
    evidence: b("数据画像、异常表、样本行、校验公式", "Data profile, anomaly table, sample rows, and validation formulas"),
    deliverable: b("data-profile.md、anomalies.csv、review-sheet.csv", "data-profile.md, anomalies.csv, and review-sheet.csv"),
    duration: b("45-75 分钟", "45-75 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("CSV 已替换真实姓名、电话、证件号和完整地址。", "The CSV has real names, phone numbers, IDs, and full addresses replaced."),
      b("唯一键为 order_id，金额单位为 CNY，允许空值字段为 note。", "The unique key is order_id, amount unit is CNY, and allowed blank field is note."),
      b("第一轮只读分析，不删除行、不覆盖原文件。", "The first round is read-only: no rows deleted and no source file overwritten.")
    ],
    environment: [
      b("样本文件：<code>orders-redacted.csv</code>，清理输出使用 <code>-cleaned</code> 后缀。", "Sample file: <code>orders-redacted.csv</code>; cleaned output uses a <code>-cleaned</code> suffix."),
      b("异常分类：重复、缺失、格式、范围、跨字段矛盾。", "Anomaly classes: duplicate, missing, format, range, and cross-field conflict."),
      b("所有异常保留 <code>original_row</code>，人工复核时可回到原始行。", "Every anomaly keeps <code>original_row</code> so reviewers can return to the source row.")
    ],
    inputSample: b(`order_id,date,amount,status,note
1001,2026-05-01,199.00,paid,
1002,2026/05/02,-20.00,paid,refund?
1002,2026-05-02,20.00,paid,duplicate?
1003,,8500.00,pending,large order`,
`order_id,date,amount,status,note
1001,2026-05-01,199.00,paid,
1002,2026/05/02,-20.00,paid,refund?
1002,2026-05-02,20.00,paid,duplicate?
1003,,8500.00,pending,large order`),
    playbook: [
      b("先输出数据画像：行数、列数、字段类型、空值、重复键和金额范围。", "First output data profile: rows, columns, inferred types, blanks, duplicate keys, and amount range."),
      b("再列异常规则，不直接删除或填补任何值。", "Then list anomaly rules without deleting or filling values."),
      b("最后生成异常表和人工复核表，保留原始行号和建议动作。", "Finally generate anomaly and human review tables with original row numbers and suggested actions.")
    ],
    evidenceTable: [
      [b("数据画像", "Data profile"), b("4 行、5 列，order_id 有重复，date 有缺失", "4 rows, 5 columns, duplicate order_id, missing date"), b("data-profile.md", "data-profile.md"), b("通过", "Pass")],
      [b("重复检测", "Duplicate check"), b("order_id=1002 出现 2 次，金额符号不一致", "order_id=1002 appears twice with inconsistent amount signs"), b("anomalies.csv", "anomalies.csv"), b("待复核", "Needs review")],
      [b("范围检测", "Range check"), b("amount=8500 超过手动确认阈值", "amount=8500 exceeds manual review threshold"), b("review-sheet.csv", "review-sheet.csv"), b("待确认", "Needs confirmation")],
      [b("输出安全", "Output safety"), b("原始 CSV 未覆盖，清理版使用新文件名", "Original CSV not overwritten; cleaned version uses new filename"), b("file list", "file list"), b("通过", "Pass")]
    ],
    outputSample: b(`anomalies.csv
original_row,field,type,value,suggestion
3,order_id,duplicate,1002,确认是否拆单或重复导入
3,amount,range,-20.00,确认是否退款
5,date,missing,,补充业务日期
5,amount,range,8500.00,人工确认大额订单`,
`anomalies.csv
original_row,field,type,value,suggestion
3,order_id,duplicate,1002,confirm split order or duplicate import
3,amount,range,-20.00,confirm refund
5,date,missing,,add business date
5,amount,range,8500.00,manually confirm large order`),
    failureNotes: [
      [b("误删重复行", "Deleted duplicate row"), b("重复 order_id 可能是拆单或退款", "Duplicate order_id may be split order or refund"), b("只标记异常，不自动删除", "Flag anomalies without deleting")],
      [b("自动补空值", "Filled blanks automatically"), b("空日期被填成当天日期", "Blank date was filled with today"), b("缺失值保持空并进入复核表", "Keep blanks and put them in the review sheet")],
      [b("丢失原始行号", "Lost source row"), b("复核表无法定位原 CSV 行", "Review sheet could not locate source CSV row"), b("所有输出增加 original_row", "Add original_row to every output")]
    ],
    riskControls: [
      b("不覆盖原文件，不删除行，不自动填补业务字段。", "Do not overwrite the original file, delete rows, or auto-fill business fields."),
      b("金额、日期、状态和退款判断必须人工复核。", "Amounts, dates, status, and refund judgment require human review."),
      b("输出文件只使用脱敏字段，不加入新个人信息。", "Output files use only redacted fields and add no new personal data.")
    ],
    commands: [
      b("wc -l orders-redacted.csv", "wc -l orders-redacted.csv"),
      b("head -n 5 orders-redacted.csv", "head -n 5 orders-redacted.csv"),
      b("rg -n \",,|-[0-9]+\\.|pending\" orders-redacted.csv", "rg -n \",,|-[0-9]+\\.|pending\" orders-redacted.csv")
    ],
    acceptanceChecks: [
      b("数据画像写清行数、列数、空值、重复和范围异常。", "Data profile states row count, column count, blanks, duplicates, and range anomalies."),
      b("异常表保留原始行号和建议动作。", "Anomaly table preserves original row numbers and suggested actions."),
      b("清理版不覆盖原始 CSV。", "Cleaned version does not overwrite the source CSV."),
      b("所有业务判断进入人工复核表。", "All business judgments go into the human review sheet.")
    ],
    taskOrder: [
      b("请先只读分析这个脱敏 CSV，输出数据画像和异常规则。", "First analyze this redacted CSV read-only and output data profile and anomaly rules."),
      b("不要覆盖原文件，不要删除行，保留 original_row。", "Do not overwrite the original file, do not delete rows, and preserve original_row."),
      b("确认规则后再生成异常表、清理版和人工复核表。", "After the rules are confirmed, generate the anomaly table, cleaned version, and human review sheet.")
    ]
  },
  {
    path: "recipes/screenshot-to-spec.html",
    title: b("07 设计截图转实现规格", "07 Design Screenshot to Implementation Spec"),
    navTitle: b("07 截图转规格", "07 Screenshot to spec"),
    summary: b("把目标截图和当前页面截图转成可执行改版规格，输出组件映射、状态表、风险项和截图验收方式。", "Turn target and current screenshots into an actionable redesign spec with component mapping, state table, risks, and screenshot acceptance."),
    domain: b("前端协作", "Frontend collaboration"),
    audience: b("设计协作者、前端维护者、产品负责人", "Design collaborators, frontend maintainers, and product owners"),
    entry: b("截图 + 本地页面预览", "Screenshots plus local page preview"),
    materialsLabel: b("目标截图、当前截图、可复用限制、视口清单", "Target screenshot, current screenshot, reuse constraints, and viewport list"),
    evidence: b("视觉规则表、组件映射表、验收截图", "Visual rule table, component mapping table, and acceptance screenshots"),
    deliverable: b("implementation-spec.md、component-checklist.md、acceptance-shots/", "implementation-spec.md, component-checklist.md, and acceptance-shots/"),
    duration: b("50-80 分钟", "50-80 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("目标截图只提炼密度、色彩、层级和交互状态，不搬运品牌、图片、文案或业务数据。", "Target screenshot is used only for density, color, hierarchy, and states; brand, images, copy, and business data are not carried over."),
      b("当前页面截图用于定位本站组件：导航、侧栏、卡片、表格、按钮、搜索和页脚。", "Current page screenshots locate this site's components: nav, sidebar, cards, tables, buttons, search, and footer."),
      b("验收视口固定为 1440x1000 与 390x900。", "Acceptance viewports are fixed at 1440x1000 and 390x900.")
    ],
    environment: [
      b("改版规格以本站 token 为准：底色、面板、边框、主文字、次级文字、强调色。", "The redesign spec uses this site's tokens: background, panels, borders, primary text, secondary text, and accent."),
      b("所有组件必须写明默认、悬停、当前页、禁用或风险状态。", "Every component states default, hover, current page, disabled, or risk states."),
      b("验收不依赖主观描述，必须有截图或像素级布局检查。", "Acceptance does not rely on subjective description; it requires screenshots or pixel-level layout checks.")
    ],
    inputSample: b(`截图任务
目标：提炼深色后台风的布局密度和组件状态
当前页面：首页、案例页、使用规范页
禁止：复用目标截图中的品牌、业务数字、图片、文案
输出：规格、组件表、桌面和手机验收截图`,
`Screenshot task
Goal: extract dark dashboard layout density and component states
Current pages: home, recipe page, usage policy
Prohibited: reuse target screenshot brand, business numbers, images, or copy
Output: spec, component table, desktop and mobile acceptance screenshots`),
    playbook: [
      b("先提取设计规则：颜色、边框、间距、信息密度、按钮尺寸和表格风格。", "First extract design rules: color, border, spacing, density, button sizing, and table style."),
      b("再映射到本站组件，逐项说明要改什么、不改什么。", "Then map rules to this site's components and state what changes and what stays."),
      b("最后用桌面和手机截图验收，不用一句像某种风格代替规格。", "Finally validate with desktop and mobile screenshots instead of replacing the spec with a broad style phrase.")
    ],
    evidenceTable: [
      [b("颜色规则", "Color rules"), b("底色、面板、边框、强调色已映射到 CSS token", "Background, panels, borders, and accent mapped to CSS tokens"), b("implementation-spec.md", "implementation-spec.md"), b("通过", "Pass")],
      [b("组件状态", "Component states"), b("导航、按钮、卡片、表格、代码块均有状态说明", "Navigation, buttons, cards, tables, and code blocks have state notes"), b("component-checklist.md", "component-checklist.md"), b("通过", "Pass")],
      [b("移动端", "Mobile"), b("390px 下按钮换行、表格滚动、侧栏收起", "At 390px, buttons wrap, tables scroll, sidebar collapses"), b("mobile-390.png", "mobile-390.png"), b("通过", "Pass")],
      [b("不可复用项", "Non-reusable items"), b("品牌名、真实数值、图片和原文案均未进入规格", "Brand names, real numbers, images, and original copy are not in the spec"), b("risk-notes.md", "risk-notes.md"), b("通过", "Pass")]
    ],
    outputSample: b(`component-checklist.md
- Top nav: 36px height, 8px radius, current item uses accent background
- Case panel: 1px #333 border, #1e1e1e background, compact metadata
- Evidence table: scroll wrapper below 720px
- Command block: mono font, wraps long commands, copy-free output`,
`component-checklist.md
- Top nav: 36px height, 8px radius, current item uses accent background
- Case panel: 1px #333 border, #1e1e1e background, compact metadata
- Evidence table: scroll wrapper below 720px
- Command block: mono font, wraps long commands, copy-free output`),
    failureNotes: [
      [b("风格描述太粗", "Style note too broad"), b("只写深色后台风无法执行", "Saying dark dashboard was not actionable"), b("拆成 token、组件和验收项", "Split into tokens, components, and acceptance checks")],
      [b("复制业务内容", "Copied business content"), b("截图里的真实数字进入草稿", "Real numbers from screenshot entered draft"), b("改为中性演示数字或删除", "Replace with neutral demo numbers or remove")],
      [b("移动端漏验", "Mobile skipped"), b("桌面可用但手机按钮溢出", "Desktop worked but mobile buttons overflowed"), b("手机截图列为强制验收", "Make mobile screenshots mandatory")]
    ],
    riskControls: [
      b("不复用目标截图里的品牌、图片、文案、业务数据或页面命名。", "Do not reuse brand, images, copy, business data, or page names from target screenshots."),
      b("规格只描述本站自己的组件和实现规则。", "The spec describes only this site's own components and implementation rules."),
      b("截图验收只看布局质量、可读性和响应式表现。", "Screenshot acceptance checks only layout quality, readability, and responsiveness.")
    ],
    commands: [
      b("人工检查 1440x1000 截图：导航、主内容、证据表、按钮无重叠。", "Manually inspect 1440x1000 screenshots: nav, content, evidence table, and buttons have no overlap."),
      b("人工检查 390x900 截图：无页面级横向溢出，长命令可读。", "Manually inspect 390x900 screenshots: no page-level horizontal overflow and long commands remain readable."),
      b("rg -n \"目标品牌名|真实业务词\" implementation-spec.md component-checklist.md", "rg -n \"target brand|real business term\" implementation-spec.md component-checklist.md")
    ],
    acceptanceChecks: [
      b("规格包含 token、组件、状态、响应式规则和验收项。", "Spec includes tokens, components, states, responsive rules, and acceptance items."),
      b("没有写入不可复用的品牌、图片、业务数值或原文案。", "No non-reusable brand, image, business number, or original copy is included."),
      b("桌面和手机截图均通过无重叠、无页面级横向溢出检查。", "Desktop and mobile screenshots pass no-overlap and no page-level overflow checks."),
      b("实现任务可以直接按清单拆分给前端执行。", "The implementation task can be handed to frontend work directly from the checklist.")
    ],
    taskOrder: [
      b("请根据目标截图和当前截图提炼本站可执行的视觉规则。", "Extract actionable visual rules for this site from the target and current screenshots."),
      b("请输出组件映射表、风险项和桌面/手机验收方式。", "Output component mapping, risk items, and desktop/mobile acceptance method."),
      b("不要复用截图中的品牌、业务数据、图片或原文案。", "Do not reuse brand, business data, images, or original copy from the screenshot.")
    ]
  },
  {
    path: "recipes/authenticated-readonly-review.html",
    title: b("08 登录态网页只读检查", "08 Read-only Review of an Authenticated Web Page"),
    navTitle: b("08 登录页只读检查", "08 Auth page review"),
    summary: b("在用户已登录的浏览器里只读检查页面状态，记录可见问题、禁点清单和待用户确认动作。", "Read page state in the user's signed-in browser, recording visible issues, no-click controls, and actions needing user confirmation."),
    domain: b("账号页面检查", "Authenticated page review"),
    audience: b("账号管理者、运营、客服负责人", "Account owners, operators, and support leads"),
    entry: b("用户浏览器 + 只读操作", "User browser plus read-only actions"),
    materialsLabel: b("已登录页面、检查目标、禁点清单、截图脱敏规则", "Signed-in page, review goal, no-click list, and screenshot redaction rules"),
    evidence: b("可见状态摘要、脱敏截图、禁点清单、待确认动作", "Visible state summary, redacted screenshots, no-click list, and confirmation actions"),
    deliverable: b("readonly-review.md、safe-screenshots/、confirmations.md", "readonly-review.md, safe-screenshots/, and confirmations.md"),
    duration: b("25-45 分钟", "25-45 minutes"),
    risk: b("中到高", "Medium to high"),
    materials: [
      b("用户已经在自己的浏览器登录，任务不读取密码、Cookie 或本地会话文件。", "The user is already signed in; the task does not read passwords, cookies, or local session files."),
      b("先列出禁止动作：提交、购买、授权、删除、转账、邀请、公开发布。", "List prohibited actions first: submit, purchase, authorize, delete, transfer, invite, and publish."),
      b("截图前隐藏不需要展示的邮箱、余额、账号 ID 和私人资料。", "Before screenshots, hide unnecessary email, balance, account IDs, and private profile details.")
    ],
    environment: [
      b("只采集屏幕可见信息，不导出账号数据。", "Capture only visible screen information and do not export account data."),
      b("可点击范围限制为导航、筛选、展开详情和关闭弹窗。", "Clickable scope is limited to navigation, filters, expanding details, and closing dialogs."),
      b("所有会改变账户状态的动作写入 <code>confirmations.md</code>，由用户处理。", "All actions that change account state go into <code>confirmations.md</code> for the user.")
    ],
    inputSample: b(`只读检查目标
页面：已登录的账单概览
想确认：是否有失败付款、是否有异常提示、发票入口是否可见
禁止：更改计划、提交付款、删除成员、发送邀请、导出完整数据`,
`Read-only review goal
Page: signed-in billing overview
Need to confirm: failed payments, warning banners, invoice entry visibility
Prohibited: change plan, submit payment, delete members, send invites, export full data`),
    playbook: [
      b("先确认当前页面标题、用户目标和禁点清单。", "Confirm page title, user goal, and no-click list first."),
      b("读取页面状态和可见提示，不点击会改变账户、余额、权限或公开内容的控件。", "Read page state and visible notices without clicking controls that change account, balance, permissions, or public content."),
      b("把需要用户处理的动作列为待确认，不替用户执行。", "List actions needing user handling as confirmations instead of executing them.")
    ],
    evidenceTable: [
      [b("页面状态", "Page state"), b("账单概览加载成功，有一条付款提醒", "Billing overview loaded with one payment notice"), b("readonly-review.md", "readonly-review.md"), b("已记录", "Recorded")],
      [b("禁点清单", "No-click list"), b("更改计划、提交付款、删除成员均未点击", "Change plan, submit payment, and delete member were not clicked"), b("no-click-controls.md", "no-click-controls.md"), b("通过", "Pass")],
      [b("截图脱敏", "Screenshot redaction"), b("邮箱和余额区域已遮挡", "Email and balance area are hidden"), b("safe-screenshots/billing.png", "safe-screenshots/billing.png"), b("通过", "Pass")],
      [b("待确认", "Confirmation"), b("付款提醒需要用户自行打开确认", "Payment notice needs user review"), b("confirmations.md", "confirmations.md"), b("待用户处理", "User action needed")]
    ],
    outputSample: b(`readonly-review.md
当前状态：页面正常加载，顶部有付款提醒
可见问题：发票入口可见，但本月发票状态需要用户打开确认
未执行动作：没有点击付款、计划变更、成员删除、邀请发送
待确认：用户自行查看付款提醒和本月发票`,
`readonly-review.md
Current state: page loads normally with a payment notice at the top
Visible issue: invoice entry is visible, but current-month invoice status needs user review
Actions not executed: no payment, plan change, member deletion, or invite sending
Confirmations: user reviews payment notice and current-month invoice`),
    failureNotes: [
      [b("误点高风险按钮", "Risky click"), b("按钮标签只写继续，后果不清楚", "Button said Continue without clear consequence"), b("后果不清楚就不点，列入待确认", "Do not click unclear controls; list them for confirmation")],
      [b("截图暴露信息", "Screenshot exposed data"), b("截图包含邮箱和余额", "Screenshot included email and balance"), b("先遮挡或避开，再截图", "Mask or avoid before capturing")],
      [b("登录态误解", "Signed-in assumption"), b("已登录被误当作可执行授权", "Signed-in state was treated as permission to act"), b("登录态只允许只读检查", "Signed-in state allows read-only review only")]
    ],
    riskControls: [
      b("不读取密码、Cookie、本地会话文件或完整导出数据。", "Do not read passwords, cookies, local session files, or full exported data."),
      b("不执行提交、授权、付款、删除、邀请或公开发布。", "Do not submit, authorize, pay, delete, invite, or publish."),
      b("截图只保留完成检查所需的最少可见信息。", "Screenshots keep only the minimum visible information needed for the review.")
    ],
    commands: [
      b("人工确认当前 URL 和页面标题是否符合检查目标。", "Manually confirm the current URL and page title match the review goal."),
      b("人工逐项核对 no-click-controls.md 中的按钮均未触发。", "Manually verify every button in no-click-controls.md remained untriggered."),
      b("人工检查 safe-screenshots/ 中无邮箱、余额、账号 ID 或私人资料。", "Manually inspect safe-screenshots/ for no email, balance, account ID, or private profile data.")
    ],
    acceptanceChecks: [
      b("报告包含当前状态、可见问题、未执行动作和待确认动作。", "Report includes current state, visible issues, actions not executed, and confirmation actions."),
      b("禁点清单明确，且所有高风险控件保持未点击。", "No-click list is explicit and all high-risk controls remain unclicked."),
      b("截图已脱敏，只展示必要状态。", "Screenshots are redacted and show only necessary state."),
      b("需要用户处理的动作没有被代执行。", "Actions requiring the user were not executed on their behalf.")
    ],
    taskOrder: [
      b("请只读检查这个已登录页面，先列出禁止点击的控件类型。", "Read-only review this signed-in page and first list the control types that must not be clicked."),
      b("请输出当前状态、可见问题、脱敏截图清单和待确认动作。", "Output current state, visible issues, redacted screenshot inventory, and confirmation actions."),
      b("不要提交、授权、购买、删除、邀请或公开发布。", "Do not submit, authorize, purchase, delete, invite, or publish.")
    ]
  },
  {
    path: "recipes/document-evidence-table.html",
    title: b("09 文档与 PDF 摘要到证据表", "09 Document and PDF Summary to Evidence Table"),
    navTitle: b("09 文档证据表", "09 Evidence table"),
    summary: b("把长文档拆成带页码的证据表，保留摘录线索、置信度和待确认项，避免只有自然段摘要。", "Turn a long document into a page-numbered evidence table with excerpt cues, confidence, and confirmation items instead of only paragraph summaries."),
    domain: b("资料分析", "Document analysis"),
    audience: b("研究人员、运营、项目负责人", "Researchers, operators, and project leads"),
    entry: b("本地文档 + 表格化摘要", "Local document plus tabular summary"),
    materialsLabel: b("脱敏 PDF、摘要目标、页码规则、输出字段", "Redacted PDF, summary goal, page-numbering rules, and output fields"),
    evidence: b("证据表、页码、摘录线索、问题清单", "Evidence table, page numbers, excerpt cues, and question list"),
    deliverable: b("evidence-table.md、open-questions.md、summary-brief.md", "evidence-table.md, open-questions.md, and summary-brief.md"),
    duration: b("45-75 分钟", "45-75 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("使用允许处理的文档副本，签名页、证件号和私人联系方式已移除。", "Use an allowed document copy with signature pages, IDs, and private contact details removed."),
      b("摘要目标写清：会议准备、风险梳理、决策材料或学习笔记。", "State the summary goal: meeting prep, risk review, decision material, or study notes."),
      b("每条主张必须带页码和摘录线索，不能只写概括。", "Every claim must include page number and excerpt cue, not only a paraphrase.")
    ],
    environment: [
      b("文档超过 20 页时按章节分批，避免后半部分被忽略。", "For documents over 20 pages, process by section to avoid missing later pages."),
      b("表格字段：主题、主张、页码、摘录线索、置信度、待确认。", "Table fields: topic, claim, page, excerpt cue, confidence, and confirmation needed."),
      b("金额、日期、责任和限制条件必须单独成行。", "Amounts, dates, responsibilities, and constraints must each get their own row.")
    ],
    inputSample: b(`摘要目标
文档：project-brief-redacted.pdf
用途：准备 30 分钟评审会
重点：交付范围、日期、风险、待确认责任人
输出：证据表 + 三段会议摘要 + 问题清单`,
`Summary goal
Document: project-brief-redacted.pdf
Use: prepare a 30-minute review meeting
Focus: delivery scope, dates, risks, owners needing confirmation
Output: evidence table + three-paragraph meeting brief + question list`),
    playbook: [
      b("先建立文档结构和页码范围，再抽取主张。", "Build document structure and page ranges before extracting claims."),
      b("每行只放一个可核查主张，避免一行混多个结论。", "Put one verifiable claim per row to avoid mixing multiple conclusions."),
      b("不确定项集中进入问题清单，方便人工回到原文核查。", "Centralize uncertainties in a question list so humans can check the original text.")
    ],
    evidenceTable: [
      [b("结构识别", "Structure mapping"), b("识别 4 个章节，页码 1-18", "Identified four sections across pages 1-18"), b("summary-brief.md", "summary-brief.md"), b("通过", "Pass")],
      [b("证据抽取", "Evidence extraction"), b("得到 23 条单主张证据", "Extracted 23 single-claim evidence rows"), b("evidence-table.md", "evidence-table.md"), b("通过", "Pass")],
      [b("问题集中", "Question capture"), b("7 条责任人和日期待确认", "Seven owner/date items need confirmation"), b("open-questions.md", "open-questions.md"), b("待确认", "Needs confirmation")],
      [b("高风险字段", "High-risk fields"), b("金额、日期、责任均单独成行", "Amounts, dates, and owners each have separate rows"), b("evidence-table.md", "evidence-table.md"), b("通过", "Pass")]
    ],
    outputSample: b(`evidence-table.md
| 主题 | 主张 | 页码 | 摘录线索 | 置信度 | 待确认 |
| Scope | 首版只包含导入和搜索 | p.4 | "initial release includes import and search" | 高 | 否 |
| Date | 试运行窗口为 6 月第二周 | p.9 | "pilot window" | 中 | 是 |
| Risk | 权限模型未完成评审 | p.13 | "permission model pending review" | 高 | 是 |`,
`evidence-table.md
| Topic | Claim | Page | Excerpt cue | Confidence | Confirmation |
| Scope | First release includes import and search only | p.4 | "initial release includes import and search" | High | No |
| Date | Pilot window is the second week of June | p.9 | "pilot window" | Medium | Yes |
| Risk | Permission model review is not complete | p.13 | "permission model pending review" | High | Yes |`),
    failureNotes: [
      [b("无页码摘要", "No page numbers"), b("初稿只有三段摘要，无法复核", "First draft had only three paragraphs and could not be checked"), b("改成证据表并强制页码", "Convert to an evidence table with required page numbers")],
      [b("一行多个主张", "Multiple claims per row"), b("范围和日期写在同一行", "Scope and date were in one row"), b("每行只放一个主张", "Use one claim per row")],
      [b("PDF 错行", "PDF line breaks"), b("金额被拆成两行导致误读", "Amount split across lines and was misread"), b("金额日期全部人工复核", "Manually review all amounts and dates")]
    ],
    riskControls: [
      b("摘要不能替代原文，关键决策必须回到页码核查。", "The summary does not replace the original; key decisions must be checked against page numbers."),
      b("缺页、扫描模糊、抽取失败的地方写入问题清单。", "Missing pages, blurry scans, and extraction failures go into the question list."),
      b("不补写文档没有的信息，不把低置信度写成结论。", "Do not add information absent from the document or turn low confidence into conclusion.")
    ],
    commands: [
      b("人工检查 evidence-table.md 每行是否包含页码和摘录线索。", "Manually check every evidence-table.md row for page number and excerpt cue."),
      b("rg -n \"待确认|低|中\" evidence-table.md open-questions.md", "rg -n \"待确认|Low|Medium\" evidence-table.md open-questions.md"),
      b("人工回到 PDF 核对所有金额、日期、责任人和限制条件。", "Manually return to the PDF to verify all amounts, dates, owners, and constraints.")
    ],
    acceptanceChecks: [
      b("证据表每行只有一个主张，且带页码。", "Each evidence-table row has one claim and a page number."),
      b("摘录线索能帮助人工回到原文定位。", "Excerpt cues help humans locate the original text."),
      b("不确定项集中列入 open-questions.md。", "Uncertainties are centralized in open-questions.md."),
      b("会议摘要中的关键结论都能回到证据表。", "Key conclusions in the meeting brief map back to the evidence table.")
    ],
    taskOrder: [
      b("请先建立文档结构和页码范围，再开始摘要。", "Build document structure and page ranges before summarizing."),
      b("请输出证据表，每条主张必须带页码、摘录线索和置信度。", "Output an evidence table; every claim must include page number, excerpt cue, and confidence."),
      b("请集中列出不确定项，不要补写文档没有的信息。", "Centralize uncertainties and do not add information absent from the document.")
    ]
  },
  {
    path: "recipes/api-impact-analysis.html",
    title: b("10 API 变更影响分析", "10 API Change Impact Analysis"),
    navTitle: b("10 API 影响分析", "10 API impact"),
    summary: b("把一份接口变更说明转成端点影响表、调用点清单、测试矩阵和发布风险，不直接修改代码。", "Turn API change notes into endpoint impact, call-site inventory, test matrix, and release risk without editing code directly."),
    domain: b("产品技术", "Product engineering"),
    audience: b("个人开发者、维护者、技术产品负责人", "Individual developers, maintainers, and technical product leads"),
    entry: b("变更说明 + 本地代码只读扫描", "Change notes plus read-only local code scan"),
    materialsLabel: b("变更说明、版本号、端点名、字段名、错误码", "Change notes, version, endpoint names, fields, and error codes"),
    evidence: b("端点清单、调用位置、测试建议、风险表", "Endpoint list, call sites, test suggestions, and risk table"),
    deliverable: b("api-impact.md、call-sites.md、test-matrix.md", "api-impact.md, call-sites.md, and test-matrix.md"),
    duration: b("50-90 分钟", "50-90 minutes"),
    risk: b("中到高", "Medium to high"),
    materials: [
      b("变更说明先拆成端点、字段、鉴权、限额、错误码五类。", "First split change notes into endpoints, fields, auth, limits, and error codes."),
      b("本地仓库只读搜索调用位置，不直接改实现。", "Search local call sites read-only and do not edit implementation directly."),
      b("无法确认的运行行为标记为待核对，不写成结论。", "Unconfirmed runtime behavior is marked for review and not written as conclusion.")
    ],
    environment: [
      b("搜索范围：<code>src/</code>、<code>tests/</code>、<code>docs/</code>。", "Search scope: <code>src/</code>, <code>tests/</code>, and <code>docs/</code>."),
      b("影响级别：阻断、需要修改、需要测试、仅文档。", "Impact levels: blocking, needs change, needs test, and docs only."),
      b("发布前确认版本号、环境、回退方案和监控指标。", "Before release, confirm version, environment, rollback plan, and monitoring signals.")
    ],
    inputSample: b(`接口变更
GET /v1/tasks 新增 status=archived
POST /v1/tasks 的 priority 字段从 string 改为 enum
429 错误会返回 retry_after_ms
上线时间：2026-06-10`,
`API change
GET /v1/tasks adds status=archived
POST /v1/tasks changes priority from string to enum
429 errors include retry_after_ms
Release date: 2026-06-10`),
    playbook: [
      b("先把变更写成旧行为、新行为、影响级别和待确认项。", "First write changes as old behavior, new behavior, impact level, and confirmation item."),
      b("再只读搜索端点名、字段名和错误码，列出路径与用途。", "Then read-only search endpoint names, field names, and error codes, listing paths and usage."),
      b("最后输出测试矩阵，不在分析阶段顺手改代码。", "Finally output a test matrix and do not edit code during analysis.")
    ],
    evidenceTable: [
      [b("端点变更", "Endpoint change"), b("GET /v1/tasks 新增 archived 状态", "GET /v1/tasks adds archived status"), b("api-impact.md", "api-impact.md"), b("需要测试", "Needs test")],
      [b("字段变更", "Field change"), b("priority 从 string 变 enum，类型校验受影响", "priority changes from string to enum and affects type validation"), b("call-sites.md", "call-sites.md"), b("需要修改", "Needs change")],
      [b("错误码", "Error code"), b("429 新增 retry_after_ms，重试逻辑可优化", "429 adds retry_after_ms and retry logic can improve"), b("test-matrix.md", "test-matrix.md"), b("需要测试", "Needs test")],
      [b("调用点", "Call sites"), b("发现 3 个直接调用、2 个测试断言、1 篇文档", "Found three direct calls, two test assertions, and one doc page"), b("rg output", "rg output"), b("已记录", "Recorded")]
    ],
    outputSample: b(`test-matrix.md
| 场景 | 输入 | 预期 |
| archived 状态 | GET /v1/tasks?status=archived | 列表能展示归档标签 |
| priority enum | priority=urgent | 校验通过或给出明确错误 |
| 429 重试 | retry_after_ms=1200 | UI 显示等待建议，不立即重试 |`,
`test-matrix.md
| Scenario | Input | Expected |
| archived status | GET /v1/tasks?status=archived | list can display archived label |
| priority enum | priority=urgent | validation passes or shows clear error |
| 429 retry | retry_after_ms=1200 | UI shows wait guidance and does not retry immediately |`),
    failureNotes: [
      [b("只看说明", "Notes only"), b("未搜索调用点导致遗漏测试", "Call sites were not searched and tests were missed"), b("强制输出 call-sites.md", "Require call-sites.md")],
      [b("字段新增轻视", "New field underestimated"), b("新增状态影响筛选和空态", "New status affected filters and empty state"), b("把 UI 和测试纳入影响矩阵", "Include UI and tests in impact matrix")],
      [b("直接改代码", "Edited too early"), b("分析阶段混入实现改动", "Implementation changes mixed into analysis"), b("先交付影响报告，再单独改实现", "Deliver impact report before separate implementation")]
    ],
    riskControls: [
      b("分析阶段只读搜索，不修改代码或测试。", "Analysis phase is read-only and does not edit code or tests."),
      b("破坏性变更必须标明回退方案和上线窗口。", "Breaking changes must state rollback plan and release window."),
      b("未验证行为写入待核对，不作为确定结论。", "Unverified behavior goes into confirmation items and not into conclusions.")
    ],
    commands: [
      b("rg -n \"GET /v1/tasks|POST /v1/tasks|priority|retry_after_ms|429\" src tests docs", "rg -n \"GET /v1/tasks|POST /v1/tasks|priority|retry_after_ms|429\" src tests docs"),
      b("rg -n \"archived|priority\" tests src", "rg -n \"archived|priority\" tests src"),
      b("人工确认版本号、环境、上线窗口和回退方式。", "Manually confirm version, environment, release window, and rollback method.")
    ],
    acceptanceChecks: [
      b("影响表覆盖端点、字段、鉴权、限额和错误码。", "Impact table covers endpoints, fields, auth, limits, and error codes."),
      b("调用点清单列出路径、用途和影响级别。", "Call-site list includes path, usage, and impact level."),
      b("测试矩阵覆盖正常路径、缺字段、错误码、限额和回退。", "Test matrix covers happy path, missing fields, error codes, limits, and rollback."),
      b("待核对项没有被写成确定结论。", "Confirmation items are not written as final conclusions.")
    ],
    taskOrder: [
      b("请先把这份接口变更拆成影响表，不要修改代码。", "First split this API change into an impact table; do not edit code."),
      b("请只读搜索本地调用点，并输出模块、路径、用途和风险。", "Read-only search local call sites and output module, path, usage, and risk."),
      b("请给出测试矩阵、回退方式和发布前人工确认项。", "Provide a test matrix, rollback method, and human confirmations before release.")
    ]
  },
  {
    path: "recipes/release-notes-changelog.html",
    title: b("11 发布说明与变更日志生成", "11 Release Notes and Changelog Drafting"),
    navTitle: b("11 发布说明", "11 Release notes"),
    summary: b("从提交范围生成公开发布说明、内部变更日志和待确认项，把技术提交翻译成可发布内容。", "Generate public release notes, internal changelog, and confirmation items from a commit range, translating technical commits into publishable content."),
    domain: b("版本发布", "Release communication"),
    audience: b("维护者、产品负责人、客服协作者", "Maintainers, product owners, and support collaborators"),
    entry: b("本地 Git 信息 + 人工复核", "Local Git information plus human review"),
    materialsLabel: b("版本范围、提交摘要、Issue 编号、发布对象", "Version range, commit summaries, issue IDs, and release audience"),
    evidence: b("提交范围、分类表、草稿、待确认项", "Commit range, category table, draft, and confirmation items"),
    deliverable: b("release-notes.md、internal-changelog.md、confirm-before-publish.md", "release-notes.md, internal-changelog.md, and confirm-before-publish.md"),
    duration: b("40-70 分钟", "40-70 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("版本范围明确，例如 <code>v0.8.0..HEAD</code>。", "Version range is explicit, such as <code>v0.8.0..HEAD</code>."),
      b("公开版面向用户，内部版保留技术细节和排障说明。", "Public version targets users; internal version keeps technical detail and troubleshooting notes."),
      b("敏感功能、客户名称、事故细节和路线图承诺必须人工确认。", "Sensitive features, customer names, incident details, and roadmap promises require human confirmation.")
    ],
    environment: [
      b("分类：新增、修复、改进、文档、内部维护、破坏性变更。", "Categories: added, fixed, improved, docs, internal maintenance, and breaking changes."),
      b("每条公开说明都要能回到提交或 Issue。", "Every public note must map back to a commit or issue."),
      b("发布前确认语气、范围、版本号、日期和遗漏项。", "Before publication, confirm tone, scope, version, date, and omissions.")
    ],
    inputSample: b(`版本范围：v0.8.0..HEAD
目标读者：普通用户和小团队管理员
语气：简洁、可行动，不写内部模块名
限制：未确认功能不要写成承诺`,
`Version range: v0.8.0..HEAD
Audience: everyday users and small-team admins
Tone: concise and actionable; avoid internal module names
Constraint: do not present unconfirmed features as promises`),
    playbook: [
      b("先读取提交范围并过滤合并噪音、格式化和纯依赖维护。", "Read the commit range first and filter merge noise, formatting-only work, and pure dependency maintenance."),
      b("按用户影响分类，再把技术语言改写成用户能理解的结果。", "Classify by user impact, then rewrite technical wording into user-understandable results."),
      b("输出公开版、内部版和发布前确认清单。", "Output public version, internal version, and pre-publication confirmation checklist.")
    ],
    evidenceTable: [
      [b("提交范围", "Commit range"), b("读取 18 个提交，过滤 4 个维护提交", "Read 18 commits and filtered four maintenance commits"), b("git log", "git log"), b("通过", "Pass")],
      [b("分类", "Categorization"), b("新增 3、修复 5、改进 4、文档 2", "Added 3, fixed 5, improved 4, docs 2"), b("change-categories.md", "change-categories.md"), b("通过", "Pass")],
      [b("公开版", "Public notes"), b("每条均有提交或 Issue 对应", "Every item maps to a commit or issue"), b("release-notes.md", "release-notes.md"), b("待确认语气", "Tone needs confirmation")],
      [b("内部版", "Internal changelog"), b("保留风险、迁移和排障线索", "Keeps risk, migration, and troubleshooting cues"), b("internal-changelog.md", "internal-changelog.md"), b("通过", "Pass")]
    ],
    outputSample: b(`release-notes.md
## 新增
- 案例页现在提供证据表和验收命令，便于按真实任务复盘。
## 修复
- 修复移动端长表格撑宽页面的问题。
## 发布前确认
- 是否公开提到自动化功能
- 版本日期是否为 2026-05-28`,
`release-notes.md
## Added
- Recipe pages now include evidence tables and acceptance commands for real task retrospectives.
## Fixed
- Fixed mobile long tables stretching page width.
## Confirm before publishing
- Whether automation features can be mentioned publicly
- Whether the release date is 2026-05-28`),
    failureNotes: [
      [b("提交直贴", "Raw commits pasted"), b("技术提交对用户不可读", "Technical commits were unreadable to users"), b("改写成用户影响", "Rewrite as user impact")],
      [b("公开内部细节", "Internal detail exposed"), b("内部事故线索进入公开版", "Internal incident cues entered public notes"), b("分公开版和内部版", "Separate public and internal versions")],
      [b("遗漏破坏性变更", "Breaking change missed"), b("URL 改名未提前说明", "URL rename was not called out"), b("破坏性变更单独分组", "Put breaking changes in a separate group")]
    ],
    riskControls: [
      b("不公开未确认的客户、金额、事故细节或路线图承诺。", "Do not publish unconfirmed customer, amount, incident detail, or roadmap promise."),
      b("公开版删除内部模块名、调试路径和敏感上下文。", "Public version removes internal module names, debug paths, and sensitive context."),
      b("最终发布由用户确认版本号、日期、语气和范围。", "The user confirms version, date, tone, and scope before publication.")
    ],
    commands: [
      b("git log --oneline v0.8.0..HEAD", "git log --oneline v0.8.0..HEAD"),
      b("git diff --name-only v0.8.0..HEAD", "git diff --name-only v0.8.0..HEAD"),
      b("人工核对 release-notes.md 中每条是否能回到提交或 Issue。", "Manually verify each release-notes.md item maps back to a commit or issue.")
    ],
    acceptanceChecks: [
      b("公开版和内部版分开，内容边界清楚。", "Public and internal versions are separate with clear boundaries."),
      b("每条公开说明都有提交、Issue 或明确依据。", "Every public note has a commit, issue, or clear basis."),
      b("破坏性变更、迁移要求和风险项被单独标出。", "Breaking changes, migration requirements, and risks are separately marked."),
      b("发布前确认清单包含版本、日期、语气和敏感项。", "Pre-publication checklist includes version, date, tone, and sensitive items.")
    ],
    taskOrder: [
      b("请读取这个版本范围，先输出变更分类表。", "Read this version range and first output a categorized change table."),
      b("请生成公开版和内部版发布说明，并列出发布前确认项。", "Generate public and internal release notes and list pre-publication confirmations."),
      b("不要加入提交或 Issue 中没有依据的功能承诺。", "Do not add feature promises not supported by commits or issues.")
    ]
  },
  {
    path: "recipes/automation-scheduled-checks.html",
    title: b("12 自动化提醒与定期检查", "12 Automation Reminders and Scheduled Checks"),
    navTitle: b("12 自动化检查", "12 Scheduled checks"),
    summary: b("把重复检查任务设计成只提醒、不越权的自动化流程，先手动试跑，再确认频率、暂停规则和输出格式。", "Design a recurring check as a reminder-only automation that does not overstep, with a manual trial before confirming frequency, pause rules, and output format."),
    domain: b("自动化治理", "Automation governance"),
    audience: b("个人用户、维护者、团队负责人", "Individual users, maintainers, and team leads"),
    entry: b("任务规则 + 定期运行", "Task rules plus scheduled runs"),
    materialsLabel: b("检查对象、频率、异常定义、标准输出、暂停条件", "Check target, frequency, anomaly definition, standard output, and pause condition"),
    evidence: b("触发条件、模拟输出、暂停规则、失败提醒", "Trigger conditions, mock output, pause rules, and failure notification"),
    deliverable: b("automation-brief.md、mock-result.md、pause-rules.md", "automation-brief.md, mock-result.md, and pause-rules.md"),
    duration: b("30-55 分钟", "30-55 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("自动化只做检查和提醒，不自动发布、删除、购买或发送。", "Automation checks and reminds only; it does not publish, delete, purchase, or send automatically."),
      b("先手动跑一次，确认任务说明、权限和输出格式。", "Run once manually to confirm task brief, permissions, and output format."),
      b("每条自动化都写清负责人、暂停方式和失败通知。", "Every automation states owner, pause method, and failure notification.")
    ],
    environment: [
      b("运行频率以低打扰为默认：每日一次或每周一次。", "Default frequency is low interruption: daily or weekly."),
      b("标准输出只包含状态、变化、异常、建议和待确认动作。", "Standard output contains only status, changes, anomalies, suggestions, and confirmation actions."),
      b("连续三次无有效信息时，降低频率或暂停。", "If three consecutive runs have no value, reduce frequency or pause.")
    ],
    inputSample: b(`重复任务
每周一检查文档站是否能访问
检查对象：首页、案例总览、使用规范页
输出：状态、异常、建议
限制：只检查和提醒，不自动修复、不自动提交`,
`Recurring task
Every Monday, check whether the documentation site is reachable
Targets: home, recipe index, usage policy
Output: status, anomalies, suggestions
Constraint: check and remind only; do not auto-fix or auto-commit`),
    playbook: [
      b("先把模糊任务改写成检查规则和停止条件。", "Rewrite the vague task into check rules and stop conditions first."),
      b("生成一次模拟输出，让用户确认长度、语气和行动性。", "Generate one mock output so the user can confirm length, tone, and actionability."),
      b("建立自动化时只保存任务本身，频率和目标由调度配置承担。", "When creating automation, keep the prompt focused on the task while schedule config owns frequency and destination.")
    ],
    evidenceTable: [
      [b("规则", "Rules"), b("检查 3 个页面，均需返回 200", "Check three pages and each must return 200"), b("automation-brief.md", "automation-brief.md"), b("通过", "Pass")],
      [b("模拟输出", "Mock output"), b("结果控制在 8 行内，含异常和建议", "Result stays within eight lines and includes anomalies and suggestions"), b("mock-result.md", "mock-result.md"), b("通过", "Pass")],
      [b("暂停条件", "Pause condition"), b("连续三次无异常可降频或暂停", "After three no-anomaly runs, reduce frequency or pause"), b("pause-rules.md", "pause-rules.md"), b("通过", "Pass")],
      [b("越权检查", "Authority check"), b("无发布、删除、发送或付款动作", "No publish, delete, send, or payment action"), b("automation-brief.md", "automation-brief.md"), b("通过", "Pass")]
    ],
    outputSample: b(`mock-result.md
状态：3 个页面均返回 200
变化：首页标题已更新为新版案例矩阵
异常：无
建议：本周无需处理；如连续 3 周无异常，可改为每两周一次`,
`mock-result.md
Status: three pages returned 200
Change: home title now uses the new recipe matrix
Anomaly: none
Suggestion: no action this week; if three weeks stay clean, switch to biweekly`),
    failureNotes: [
      [b("目标太泛", "Goal too vague"), b("检查网站是否正常无法判断", "Check whether site is OK was not measurable"), b("改为 URL、状态码和页面标记", "Use URL, status code, and page marker")],
      [b("提醒太长", "Reminder too long"), b("输出像完整报告，难以扫读", "Output read like a full report and was hard to scan"), b("限制为状态、变化、异常、建议", "Limit to status, change, anomaly, suggestion")],
      [b("越权修复", "Overstepping fix"), b("自动化试图提交修复", "Automation attempted to commit fixes"), b("明确只提醒，不修复", "State reminder-only, no fixes")]
    ],
    riskControls: [
      b("自动化只提醒，不执行发布、删除、发送、付款或提交。", "Automation reminds only and does not publish, delete, send, pay, or commit."),
      b("失败时输出原因和建议，不自行扩大权限。", "On failure, output reason and suggestion without expanding permissions."),
      b("频率和通知对象可随时暂停或调整。", "Frequency and recipient can be paused or adjusted anytime.")
    ],
    commands: [
      b("curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/", "curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/"),
      b("curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/recipes/index.html", "curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/recipes/index.html"),
      b("人工确认自动化输出没有发布、删除、发送或付款动作。", "Manually confirm automation output contains no publish, delete, send, or payment action.")
    ],
    acceptanceChecks: [
      b("任务规则可被执行，异常定义明确。", "Task rules are executable and anomaly definition is explicit."),
      b("模拟输出短、准、可行动。", "Mock output is short, precise, and actionable."),
      b("暂停条件、负责人和失败提醒写清楚。", "Pause condition, owner, and failure notification are clear."),
      b("自动化不包含任何越权动作。", "Automation contains no overstepping action.")
    ],
    taskOrder: [
      b("请先把这个重复任务改写成检查规则、异常定义和标准输出格式。", "First rewrite this recurring task into check rules, anomaly definition, and standard output format."),
      b("请生成一次模拟结果，确认后再建立定期提醒。", "Generate one mock result; schedule reminders only after confirmation."),
      b("自动化只提醒，不执行发布、删除、发送、付款或提交。", "The automation only reminds; it does not publish, delete, send, pay, or commit.")
    ]
  },
  {
    path: "recipes/log-error-diagnosis.html",
    title: b("13 日志报错定位与修复建议", "13 Log Error Diagnosis and Fix Proposal"),
    navTitle: b("13 日志报错诊断", "13 Log diagnosis"),
    summary: b("把构建或服务日志整理成根因假设、验证命令、最小修复、回退方式和复跑验收。", "Turn build or service logs into root-cause hypotheses, validation commands, minimal fix, rollback method, and rerun acceptance."),
    domain: b("排障修复", "Troubleshooting"),
    audience: b("项目维护者、个人开发者、技术支持", "Project maintainers, individual developers, and technical support"),
    entry: b("日志片段 + 本地只读检查", "Log snippets plus local read-only inspection"),
    materialsLabel: b("错误上下文、失败命令、环境、最近改动、重现步骤", "Error context, failing command, environment, recent changes, and reproduction steps"),
    evidence: b("错误片段、相关文件、验证命令、修复范围", "Error snippet, related files, validation commands, and fix scope"),
    deliverable: b("diagnosis.md、validation-plan.md、fix-proposal.md", "diagnosis.md, validation-plan.md, and fix-proposal.md"),
    duration: b("40-70 分钟", "40-70 minutes"),
    risk: b("中", "Medium"),
    materials: [
      b("日志先脱敏，尤其是 token、邮箱、账号 ID 和私人路径。", "Logs are redacted first, especially tokens, emails, account IDs, and personal paths."),
      b("提供失败命令、环境、最近改动和是否可稳定重现。", "Provide failing command, environment, recent changes, and whether it reproduces reliably."),
      b("第一轮只读定位，不运行破坏性命令。", "The first round is read-only diagnosis and does not run destructive commands.")
    ],
    environment: [
      b("根因排序：配置、依赖、路径、权限、网络、代码变更。", "Root-cause order: configuration, dependency, path, permission, network, and code change."),
      b("每个假设都要有验证命令和预期结果。", "Every hypothesis needs a validation command and expected result."),
      b("修复建议分最小修复和后续加固，不顺手重构无关模块。", "Fix proposal separates minimal fix and follow-up hardening without refactoring unrelated modules.")
    ],
    inputSample: b(`失败命令：npm run check
错误片段：Error: missing local target recipes/old-page.html
最近改动：案例 URL 改名
限制：先定位断链，不要回滚全部改动`,
`Failing command: npm run check
Error snippet: Error: missing local target recipes/old-page.html
Recent change: recipe URL rename
Constraint: locate broken link first; do not roll back all changes`),
    playbook: [
      b("先分离症状、直接错误、可能根因和待验证假设。", "Separate symptom, direct error, possible root cause, and hypotheses to validate first."),
      b("读取错误前后上下文，再搜索相关路径、脚本和生成器数据。", "Read context around the error, then search related paths, scripts, and generator data."),
      b("确认根因后提出最小修复、回退方式和复跑命令。", "After confirming root cause, propose minimal fix, rollback method, and rerun commands.")
    ],
    evidenceTable: [
      [b("症状", "Symptom"), b("检查脚本报告 old-page.html 断链", "Check script reports broken old-page.html link"), b("npm run check", "npm run check"), b("已记录", "Recorded")],
      [b("根因假设", "Hypothesis"), b("导航或搜索索引仍指向旧 URL", "Navigation or search index still points to old URL"), b("rg old-page", "rg old-page"), b("待验证", "To validate")],
      [b("验证", "Validation"), b("生成器数据中找到旧路径", "Old path found in generator data"), b("scripts/generate-site.mjs", "scripts/generate-site.mjs"), b("确认", "Confirmed")],
      [b("验收", "Acceptance"), b("修复后 build/check 均通过", "After fix, build/check both pass"), b("npm run build && npm run check", "npm run build && npm run check"), b("通过", "Pass")]
    ],
    outputSample: b(`diagnosis.md
症状：链接检查失败，目标 recipes/old-page.html 不存在
根因：案例 URL 改名后，搜索索引仍使用旧路径
最小修复：更新 caseRecipes path 和首页入口链接
回退方式：恢复上一提交或改回旧 path
验收：npm run build && npm run check`,
`diagnosis.md
Symptom: link check failed because recipes/old-page.html does not exist
Root cause: after recipe URL rename, search index still used the old path
Minimal fix: update caseRecipes path and home entry link
Rollback: restore previous commit or switch back to old path
Acceptance: npm run build && npm run check`),
    failureNotes: [
      [b("只看最后一行", "Last line only"), b("最后一行是连锁失败，不是根因", "The last line was a cascading failure, not root cause"), b("读取错误前后上下文", "Read context around the error")],
      [b("清缓存掩盖问题", "Cache clearing masked issue"), b("清缓存后短暂通过但路径仍旧", "Clearing cache briefly passed but path remained old"), b("用搜索确认真实根因", "Use search to confirm real cause")],
      [b("修复范围扩大", "Fix scope expanded"), b("顺手重构无关样式", "Unrelated style refactor was added"), b("最小修复只处理当前失败", "Minimal fix addresses only current failure")]
    ],
    riskControls: [
      b("破坏性命令必须说明后果并等待用户确认。", "Destructive commands must explain consequences and wait for user confirmation."),
      b("不使用大回滚掩盖根因，除非已确认当前改动不可保留。", "Do not use broad rollback to mask root cause unless current changes are confirmed unsalvageable."),
      b("日志脱敏后再写入报告或截图。", "Logs are redacted before entering reports or screenshots.")
    ],
    commands: [
      b("npm run check", "npm run check"),
      b("rg -n \"old-page|missing local target|recipes/\" scripts recipes README.md", "rg -n \"old-page|missing local target|recipes/\" scripts recipes README.md"),
      b("npm run build && npm run check && git diff --check", "npm run build && npm run check && git diff --check")
    ],
    acceptanceChecks: [
      b("诊断记录包含症状、直接错误、根因假设、验证结果和最小修复。", "Diagnosis includes symptom, direct error, root-cause hypotheses, validation result, and minimal fix."),
      b("每个假设都有验证命令和预期结果。", "Every hypothesis has a validation command and expected result."),
      b("修复建议包含回退方式和验收命令。", "Fix proposal includes rollback method and acceptance commands."),
      b("最终用原失败命令和相关检查命令复跑通过。", "Final acceptance reruns the original failing command and related checks successfully.")
    ],
    taskOrder: [
      b("请根据这段日志先输出根因假设，不要直接修改文件。", "Use this log to output root-cause hypotheses first; do not edit files directly."),
      b("请给出每个假设的验证命令和预期结果。", "Provide validation commands and expected results for each hypothesis."),
      b("确认根因后再提出最小修复、回退方式和验收命令。", "After confirming root cause, propose minimal fix, rollback method, and acceptance commands.")
    ]
  },
  {
    path: "recipes/remote-service-health-check.html",
    title: b("14 远程服务健康检查与修复建议", "14 Remote Service Health Check and Fix Proposal"),
    navTitle: b("14 远程服务健康检查", "14 Remote service check"),
    summary: b("用脱敏健康日志和只读命令记录复盘一次服务异常，输出根因排序、修复建议、回退方式和复测清单。", "Use redacted health logs and read-only command records to review a service incident, then output root-cause ranking, fix proposal, rollback path, and retest checklist."),
    domain: b("服务运维", "Service operations"),
    audience: b("站点维护者、个人开发者、技术负责人", "Site maintainers, individual developers, and technical leads"),
    entry: b("日志包 + 只读终端记录", "Log bundle plus read-only terminal record"),
    materialsLabel: b("脱敏 healthz 响应、错误窗口、部署版本、只读命令输出", "Redacted healthz response, error window, deployment version, and read-only command output"),
    evidence: b("healthz 响应、错误窗口、配置片段、复测记录", "healthz response, error window, config snippet, and retest record"),
    deliverable: b("health-report.md、repair-plan.md、rollback-note.md", "health-report.md, repair-plan.md, and rollback-note.md"),
    duration: b("55-90 分钟", "55-90 minutes"),
    risk: b("中到高", "Medium to high"),
    materials: [
      b("只提供脱敏日志和只读命令输出，不提供真实密钥、主机名、账号或客户数据。", "Provide only redacted logs and read-only command output; do not provide real keys, hostnames, accounts, or customer data."),
      b("第一轮只做诊断和建议，不执行重启、删除、发布或配置写入。", "The first pass diagnoses and proposes only; it does not restart, delete, deploy, or write configuration."),
      b("所有修复建议都必须带回退方式、影响范围和复测步骤。", "Every fix proposal must include rollback, impact scope, and retest steps.")
    ],
    environment: [
      b("材料目录：<code>workspace/service-health-demo/</code>，只读记录放在 <code>evidence/</code>。", "Material directory: <code>workspace/service-health-demo/</code>; read-only records live in <code>evidence/</code>."),
      b("检查窗口：2026-05-28 10:05 到 10:35，版本：<code>web-2026.05.28-2</code>。", "Review window: 2026-05-28 10:05 to 10:35; version: <code>web-2026.05.28-2</code>."),
      b("输出只给诊断、建议和验收，不自动连接生产环境。", "Output diagnosis, proposal, and acceptance only; do not connect to production automatically.")
    ],
    inputSample: b(`异常窗口：10:12-10:19
healthz: HTTP 503, db_pool_wait_ms=4800
最近改动：配置里 DB_POOL_SIZE 从 12 改成 4
限制：只读分析，不重启服务，不修改配置
目标：判断最可能根因，并给出最小修复和回退方式`,
`Incident window: 10:12-10:19
healthz: HTTP 503, db_pool_wait_ms=4800
Recent change: DB_POOL_SIZE changed from 12 to 4
Constraint: read-only analysis; do not restart service or edit config
Goal: identify the most likely root cause and propose minimal fix plus rollback`),
    playbook: [
      b("先按时间线整理 healthz、错误日志、部署版本和配置差异。", "First organize healthz, error logs, deployment version, and config delta by timeline."),
      b("把根因分成配置、依赖、容量、网络和代码变更五类，并逐项给验证方式。", "Group root causes into configuration, dependency, capacity, network, and code change, with validation for each."),
      b("只输出修复建议和复测清单，等待用户确认后再进入执行阶段。", "Output fix proposal and retest checklist only, then wait for user confirmation before execution.")
    ],
    evidenceTable: [
      [b("健康检查", "Health check"), b("10:12 开始 HTTP 503，10:20 恢复", "HTTP 503 began at 10:12 and recovered at 10:20"), b("evidence/healthz-window.txt", "evidence/healthz-window.txt"), b("已记录", "Recorded")],
      [b("配置差异", "Config delta"), b("DB_POOL_SIZE 从 12 改为 4，与等待时间升高吻合", "DB_POOL_SIZE changed from 12 to 4 and matches increased wait time"), b("evidence/config-delta.txt", "evidence/config-delta.txt"), b("高置信", "High confidence")],
      [b("容量指标", "Capacity signal"), b("CPU 和内存没有同步升高", "CPU and memory did not rise at the same time"), b("evidence/metrics-snapshot.txt", "evidence/metrics-snapshot.txt"), b("排除一项", "One cause reduced")],
      [b("复测方案", "Retest plan"), b("先恢复配置，再复测 healthz 和等待时间", "Restore config first, then retest healthz and wait time"), b("repair-plan.md", "repair-plan.md"), b("待确认", "Needs confirmation")]
    ],
    outputSample: b(`health-report.md
结论：最可能根因为连接池配置过小
证据：HTTP 503 时间窗与 DB_POOL_SIZE 下调一致，db_pool_wait_ms 从 320 升到 4800
最小修复：把 DB_POOL_SIZE 恢复到 12，观察 15 分钟
回退方式：保留当前配置副本，恢复失败时切回上一部署版本
复测：healthz 返回 200，db_pool_wait_ms 连续 5 分钟低于 500`,
`health-report.md
Conclusion: the most likely root cause is an undersized connection pool
Evidence: HTTP 503 window aligns with DB_POOL_SIZE reduction, and db_pool_wait_ms rose from 320 to 4800
Minimal fix: restore DB_POOL_SIZE to 12 and observe for 15 minutes
Rollback: keep a copy of the current config and fall back to the previous deployment if restore fails
Retest: healthz returns 200 and db_pool_wait_ms stays under 500 for five minutes`),
    failureNotes: [
      [b("急着重启", "Restart too early"), b("第一反应是重启服务，但没有证明根因", "The first reaction was to restart service without proving root cause"), b("先用只读证据排序根因", "Rank causes with read-only evidence first")],
      [b("忽略时间线", "Timeline ignored"), b("只看单条 503 日志，没对齐配置变更", "Only one 503 log was inspected without aligning config change"), b("把日志、版本和配置按分钟对齐", "Align logs, version, and config by minute")],
      [b("没有回退", "No rollback"), b("修复建议缺少失败时怎么退回", "Fix proposal lacked a fallback if it failed"), b("每条建议都补回退和复测", "Add rollback and retest to every proposal")]
    ],
    riskControls: [
      b("不自动连接生产环境，不运行重启、删除、写配置或发布命令。", "Do not auto-connect to production or run restart, delete, config-write, or deploy commands."),
      b("日志必须脱敏，主机、账号、密钥、IP 和客户标识都用占位符替换。", "Logs must be redacted; host, account, key, IP, and customer identifiers are replaced with placeholders."),
      b("修复建议必须区分最小修复、回退方式和后续加固。", "Fix proposals must separate minimal fix, rollback path, and follow-up hardening.")
    ],
    commands: [
      b("curl -i --max-time 10 http://127.0.0.1:8080/healthz", "curl -i --max-time 10 http://127.0.0.1:8080/healthz"),
      b("rg -n \"HTTP 503|db_pool_wait_ms|DB_POOL_SIZE\" evidence/ config/", "rg -n \"HTTP 503|db_pool_wait_ms|DB_POOL_SIZE\" evidence/ config/"),
      b("人工确认 repair-plan.md 包含影响范围、回退方式和复测窗口。", "Manually confirm repair-plan.md includes impact scope, rollback, and retest window.")
    ],
    acceptanceChecks: [
      b("根因排序至少覆盖配置、依赖、容量、网络和代码变更。", "Root-cause ranking covers configuration, dependency, capacity, network, and code change."),
      b("每个根因都有证据、反证或待确认状态。", "Every cause has evidence, counter-evidence, or a confirmation state."),
      b("最小修复不包含无关重构或扩大权限动作。", "The minimal fix contains no unrelated refactor or expanded permission action."),
      b("复测清单包含 healthz、关键指标、观察窗口和失败回退。", "Retest checklist includes healthz, key metric, observation window, and failure rollback.")
    ],
    taskOrder: [
      b("请根据这组脱敏服务健康材料做只读诊断，先建立时间线。", "Use this redacted service health bundle for read-only diagnosis and build a timeline first."),
      b("请输出根因排序、证据、反证、最小修复、回退方式和复测清单。", "Output root-cause ranking, evidence, counter-evidence, minimal fix, rollback, and retest checklist."),
      b("不要重启服务、不要修改配置、不要发布；只交付诊断和建议。", "Do not restart service, edit config, or deploy; deliver diagnosis and proposal only.")
    ]
  }
];

const usagePolicyRecipe = {
  path: "recipes/usage-policy.html",
  title: b("使用规范", "Usage Policy"),
  navTitle: b("使用规范", "Usage Policy"),
  summary: b("说明隐私、安全、人工复核和发布前确认要求。", "Document privacy, safety, human review, and pre-publication confirmation requirements."),
  domain: b("项目治理", "Project governance")
};

const operationTraceMap = {
  "deck-export-check": {
    snapshot: {
      trigger: b("一份 800 字产品说明需要在当天交给团队做内部评审，要求 7 页以内且能导出。", "An 800-word product brief needed an internal review deck the same day, capped at seven slides and exportable."),
      toolchain: b("桌面任务、演示稿导出器、四张截图、逐页验收表。", "Desktop task, deck exporter, four screenshots, and slide-by-slide acceptance table."),
      firstSignal: b("第一轮生成 10 页，数据页正文在 1440px 预览里溢出。", "The first pass produced ten slides and the data slide overflowed in a 1440px preview."),
      finalSignal: b("最终 7 页均可打开，四张预览截图无溢出，1 项对外表述保留人工确认。", "The final seven slides opened correctly, four preview screenshots had no overflow, and one external-facing claim stayed under human confirmation.")
    },
    replay: [
      [b("结构锁定", "Structure lock"), b("人工确认 7 页大纲后再生成文件", "Generate the file only after the seven-slide outline is approved"), b("outline=7 slides, pending_confirmations=3", "outline=7 slides, pending_confirmations=3"), b("slide-outline.md", "slide-outline.md")],
      [b("导出复核", "Export review"), b("打开 deck-draft.pptx 并抽查 4 张 PNG", "Open deck-draft.pptx and inspect four PNG previews"), b("slides=7, screenshots=4, overflow=0", "slides=7, screenshots=4, overflow=0"), b("screenshots/cover.png", "screenshots/cover.png")],
      [b("人工交接", "Human handoff"), b("检查试用期、隐私表述和版权素材", "Check trial wording, privacy wording, and licensed assets"), b("needs_human_review=1", "needs_human_review=1"), b("export-notes.md", "export-notes.md")]
    ],
    handoff: [
      b("演示稿可用于内部评审，不能直接对外发布。", "The deck is ready for internal review, not direct external publication."),
      b("用户需要确认试用期、隐私表述和素材授权。", "The user must confirm trial wording, privacy wording, and asset rights."),
      b("若要改成正式销售材料，先补真实数据和品牌终审。", "To turn it into sales material, add real data and brand approval first.")
    ]
  },
  "browser-page-review": {
    snapshot: {
      trigger: b("本地页面即将交付，需要确认桌面、手机、控制台和表格区域没有阻断问题。", "A local page was close to delivery and needed desktop, mobile, console, and table checks."),
      toolchain: b("本地服务、浏览器视口、控制台摘要、截图清单。", "Local server, browser viewports, console summary, and screenshot inventory."),
      firstSignal: b("手机截图里表格可滚动，但缺少明显滚动提示。", "The mobile screenshot showed the table could scroll, but the scroll cue was weak."),
      finalSignal: b("页面级横向溢出为 false，控制台错误为 0，P0 问题为 0。", "Page-level horizontal overflow was false, console errors were 0, and P0 issues were 0.")
    },
    replay: [
      [b("服务确认", "Service check"), b("curl -I -L --max-time 15 http://127.0.0.1:4173/", "curl -I -L --max-time 15 http://127.0.0.1:4173/"), b("HTTP/1.1 200 OK", "HTTP/1.1 200 OK"), b("console-summary.txt", "console-summary.txt")],
      [b("手机视口", "Mobile viewport"), b("390x900 检查 scrollWidth 与 innerWidth", "Check scrollWidth and innerWidth at 390x900"), b("page_overflow=false, table_scroll=true", "page_overflow=false, table_scroll=true"), b("case-mobile-390.png", "case-mobile-390.png")],
      [b("问题归档", "Issue filing"), b("按 P0/P1/P2 写入 page-review.md", "Write P0/P1/P2 issues to page-review.md"), b("P0=0, P1=1, P2=2", "P0=0, P1=1, P2=2"), b("page-review.md", "page-review.md")]
    ],
    handoff: [
      b("页面可交付，但手机端表格滚动提示建议补强。", "The page is deliverable, but the mobile table scroll cue should be improved."),
      b("截图只覆盖指定路径，未点击写入型控件。", "Screenshots cover only the specified path; write actions were not clicked."),
      b("后续改版时保留同一组视口，避免截图不可比。", "Keep the same viewports in later redesigns so screenshots remain comparable.")
    ]
  },
  "pages-deploy-diagnosis": {
    snapshot: {
      trigger: b("收到部署失败通知，build 红色、deploy 跳过，需要判断是内容、workflow 还是发布配置问题。", "A deploy failure notification showed build red and deploy skipped, requiring separation of content, workflow, and publish configuration issues."),
      toolchain: b("本地构建、本地检查、Actions job、线上响应头。", "Local build, local check, Actions job, and live response headers."),
      firstSignal: b("邮件只说明失败，无法证明第一个红色步骤在哪里。", "The email only said the run failed and did not prove the first red step."),
      finalSignal: b("新提交触发的 build 与 deploy 均成功，线上案例总览返回 200。", "The new commit produced successful build and deploy jobs, and the live recipe index returned 200.")
    },
    replay: [
      [b("本地复现", "Local reproduction"), b("npm run build && npm run check", "npm run build && npm run check"), b("Generated 44 bilingual pages; verify passed", "Generated 44 bilingual pages; verify passed"), b("deploy-incident.md", "deploy-incident.md")],
      [b("远端确认", "Remote confirmation"), b("读取最新 Actions run 的 jobs", "Read the jobs for the latest Actions run"), b("build=success, deploy=success", "build=success, deploy=success"), b("new-run.txt", "new-run.txt")],
      [b("线上验收", "Live acceptance"), b("curl -I -L --max-time 20 /recipes/index.html", "curl -I -L --max-time 20 /recipes/index.html"), b("HTTP/2 200, content-type=text/html", "HTTP/2 200, content-type=text/html"), b("live-headers.txt", "live-headers.txt")]
    ],
    handoff: [
      b("只把新 run 作为成功依据，不回头修改旧失败 run 的判断。", "Use only the new run as success evidence; do not reinterpret the old failed run."),
      b("发布修复和内容改动尽量分开，便于回滚。", "Keep publish fixes and content edits separate where possible for rollback."),
      b("宣布完成前必须同时确认 Actions 与线上地址。", "Before declaring completion, confirm both Actions and the live URL.")
    ]
  },
  "docs-site-redesign": {
    snapshot: {
      trigger: b("站点需要从浅色文档模板升级成深色产品工作台，同时不能破坏发布链路。", "The site needed to move from a light documentation template to a dark product workbench without breaking publishing."),
      toolchain: b("静态生成器、样式 tokens、页面数量检查、README 截图。", "Static generator, style tokens, page-count checks, and README screenshots."),
      firstSignal: b("第一次改版后案例详情信息密度不足，案例总览缺少任务矩阵。", "After the first redesign, recipe details lacked enough density and the index lacked a task matrix."),
      finalSignal: b("44 个页面生成通过，案例页有证据表、命令块、评分和材料包。", "All 44 pages generated successfully, and recipe pages include evidence tables, command blocks, scorecards, and artifact packs.")
    },
    replay: [
      [b("构建", "Build"), b("npm run build", "npm run build"), b("Generated 44 bilingual pages and SVG assets", "Generated 44 bilingual pages and SVG assets"), b("build.log", "build.log")],
      [b("质量门禁", "Quality gate"), b("npm run check", "npm run check"), b("44 HTML pages verified", "44 HTML pages verified"), b("verify.log", "verify.log")],
      [b("视觉抽查", "Visual check"), b("桌面与手机视口检查首页、案例总览和案例页", "Check home, recipe index, and recipe detail on desktop and mobile"), b("overflow=false, broken_images=0", "overflow=false, broken_images=0"), b("README screenshots", "README screenshots")]
    ],
    handoff: [
      b("README 截图必须和当前构建一致。", "README screenshots must match the current build."),
      b("每次生成后都要重新跑链接和禁用词检查。", "Run link and blocked-term checks after each generation."),
      b("视觉改版不应改变原始发布路径。", "Visual redesign should not change the publish path.")
    ]
  },
  "markdown-knowledge-base": {
    snapshot: {
      trigger: b("散乱 Markdown 笔记需要按主题、状态和待补事项重整，且保留回退依据。", "Loose Markdown notes needed organization by topic, state, and missing items while preserving rollback evidence."),
      toolchain: b("文件清单、frontmatter 检查、主题索引、样本 diff。", "File inventory, frontmatter check, topic index, and sample diff."),
      firstSignal: b("同一主题有三个命名方式，部分笔记没有 owner 和 status。", "The same topic had three naming styles and some notes had no owner or status."),
      finalSignal: b("12 篇笔记完成统一头部，索引能按主题和待补项检索。", "Twelve notes received consistent headers, and the index supports topic and missing-item lookup.")
    },
    replay: [
      [b("盘点", "Inventory"), b("find notes-working -name '*.md'", "find notes-working -name '*.md'"), b("12 files, 5 missing frontmatter", "12 files, 5 missing frontmatter"), b("inventory.txt", "inventory.txt")],
      [b("重整", "Restructure"), b("生成 topic-index.md 和 pending-review.md", "Generate topic-index.md and pending-review.md"), b("topics=4, pending=7", "topics=4, pending=7"), b("topic-index.md", "topic-index.md")],
      [b("回退依据", "Rollback basis"), b("保留 sample.diff", "Keep sample.diff"), b("renamed=3, content_deleted=0", "renamed=3, content_deleted=0"), b("sample.diff", "sample.diff")]
    ],
    handoff: [
      b("原文只移动和补元数据，不删除正文。", "Original text is moved and annotated, not deleted."),
      b("待补事项单独列出，不能伪装成已完成知识。", "Missing items are listed separately, not presented as completed knowledge."),
      b("合并前由用户抽查至少 3 篇笔记。", "The user should spot-check at least three notes before merging.")
    ]
  },
  "spreadsheet-cleanup": {
    snapshot: {
      trigger: b("脱敏订单 CSV 出现空状态、异常金额和重复行，需要形成可复核清理建议。", "A redacted order CSV had blank statuses, abnormal amounts, and duplicates needing reviewable cleanup suggestions."),
      toolchain: b("CSV 画像、异常表、原始行号、人工复核列。", "CSV profiling, anomaly table, original row numbers, and human review columns."),
      firstSignal: b("总行数与有效订单数不一致，金额列存在负数和文本值。", "Total rows and valid orders did not match, and the amount column contained negatives and text values."),
      finalSignal: b("异常被分为 4 类，所有建议都保留原始行号。", "Anomalies were split into four classes, with original row numbers preserved for every suggestion.")
    },
    replay: [
      [b("画像", "Profile"), b("读取 orders-redacted.csv 并统计字段", "Read orders-redacted.csv and profile fields"), b("rows=240, invalid_amount=6, duplicates=4", "rows=240, invalid_amount=6, duplicates=4"), b("data-profile.md", "data-profile.md")],
      [b("异常分类", "Anomaly classification"), b("生成 anomalies.csv", "Generate anomalies.csv"), b("classes=4, needs_review=18", "classes=4, needs_review=18"), b("anomalies.csv", "anomalies.csv")],
      [b("复核表", "Review sheet"), b("写入 review-sheet.csv", "Write review-sheet.csv"), b("all_rows_keep_original_index=true", "all_rows_keep_original_index=true"), b("review-sheet.csv", "review-sheet.csv")]
    ],
    handoff: [
      b("不直接覆盖原 CSV。", "Do not overwrite the original CSV."),
      b("金额和状态修正必须由业务负责人确认。", "Amount and status corrections require owner confirmation."),
      b("复核表保留原始行号，便于追溯。", "The review sheet keeps original row numbers for traceability.")
    ]
  },
  "screenshot-to-spec": {
    snapshot: {
      trigger: b("只有目标截图和当前页面截图，需要转成开发可执行的组件规格。", "Only target and current screenshots were available, requiring an implementable component specification."),
      toolchain: b("截图标注、组件映射、状态表、验收截图。", "Screenshot annotation, component mapping, state table, and acceptance screenshots."),
      firstSignal: b("截图里按钮、筛选栏和表格密度没有文字规格。", "Buttons, filters, and table density were visible in screenshots but lacked written specs."),
      finalSignal: b("输出 8 个组件、5 个状态、3 个断点的实现清单。", "The output included an implementation checklist for eight components, five states, and three breakpoints.")
    },
    replay: [
      [b("截图读取", "Screenshot reading"), b("标注 target.png 与 current.png", "Annotate target.png and current.png"), b("regions=11, uncertain=2", "regions=11, uncertain=2"), b("annotation-table.md", "annotation-table.md")],
      [b("规格生成", "Spec generation"), b("输出 implementation-spec.md", "Write implementation-spec.md"), b("components=8, states=5, breakpoints=3", "components=8, states=5, breakpoints=3"), b("implementation-spec.md", "implementation-spec.md")],
      [b("验收", "Acceptance"), b("列出截图验收点", "List screenshot acceptance points"), b("acceptance_shots=desktop,mobile,dense-table", "acceptance_shots=desktop,mobile,dense-table"), b("component-checklist.md", "component-checklist.md")]
    ],
    handoff: [
      b("截图不能证明交互状态，缺失状态必须标为待确认。", "Screenshots cannot prove interaction states, so missing states must be marked for confirmation."),
      b("规格只写可实现信息，不臆测业务规则。", "The spec records implementable details, not guessed business rules."),
      b("实现后必须用同一视口重新截图对比。", "After implementation, recapture the same viewports for comparison.")
    ]
  },
  "authenticated-readonly-review": {
    snapshot: {
      trigger: b("登录态页面需要检查信息是否完整，但不能修改账号、配置或数据。", "A signed-in page needed information review without changing account, settings, or data."),
      toolchain: b("只读路径、动作白名单、截图遮挡、人工确认点。", "Read-only path, action allowlist, screenshot masking, and human confirmations."),
      firstSignal: b("页面含有导出和邀请按钮，必须明确不点击。", "The page included export and invite buttons that had to be explicitly avoided."),
      finalSignal: b("完成 6 个只读检查点，未触发表单提交或写入动作。", "Six read-only checkpoints were completed without form submission or write actions.")
    },
    replay: [
      [b("动作确认", "Action confirmation"), b("列出允许点击区域与禁止按钮", "List allowed areas and prohibited buttons"), b("allowed=nav,filter,details; blocked=invite,export,save", "allowed=nav,filter,details; blocked=invite,export,save"), b("readonly-plan.md", "readonly-plan.md")],
      [b("页面核查", "Page check"), b("只查看详情面板和状态标签", "View only detail panels and status labels"), b("checks=6, writes=0", "checks=6, writes=0"), b("readonly-evidence.csv", "readonly-evidence.csv")],
      [b("隐私处理", "Privacy handling"), b("截图前遮挡账号标识", "Mask account identifiers before screenshots"), b("masked_fields=3", "masked_fields=3"), b("masked-screenshot.png", "masked-screenshot.png")]
    ],
    handoff: [
      b("不要把登录态截图直接公开。", "Do not publish signed-in screenshots directly."),
      b("所有账号操作必须由用户亲自确认。", "All account actions require direct user confirmation."),
      b("检查结论只覆盖已查看页面。", "Findings cover only pages that were inspected.")
    ]
  },
  "document-evidence-table": {
    snapshot: {
      trigger: b("多份文档摘要需要转成证据表，要求能追溯到页码和原句位置。", "Several document summaries needed an evidence table traceable to page numbers and original wording."),
      toolchain: b("PDF/文档摘要、证据行、页码、置信度标签。", "PDF/document summaries, evidence rows, page numbers, and confidence labels."),
      firstSignal: b("初稿把事实和推断混在同一列，无法复核。", "The first draft mixed facts and inference in one column, making review difficult."),
      finalSignal: b("每行证据都有页码、摘录、判断和人工复核状态。", "Every evidence row had a page, excerpt, judgment, and human review status.")
    },
    replay: [
      [b("材料盘点", "Material inventory"), b("列出 docs/ 中可读文件", "List readable files under docs/"), b("files=5, scanned_pdf=1 needs manual OCR", "files=5, scanned_pdf=1 needs manual OCR"), b("document-inventory.md", "document-inventory.md")],
      [b("证据抽取", "Evidence extraction"), b("生成 evidence-table.md", "Generate evidence-table.md"), b("rows=18, missing_page=0", "rows=18, missing_page=0"), b("evidence-table.md", "evidence-table.md")],
      [b("推断隔离", "Inference separation"), b("把建议移入 summary-notes.md", "Move suggestions into summary-notes.md"), b("fact_rows=18, inference_rows=5", "fact_rows=18, inference_rows=5"), b("summary-notes.md", "summary-notes.md")]
    ],
    handoff: [
      b("无法读取的扫描页不做事实结论。", "Do not make factual claims from unreadable scanned pages."),
      b("表格结论必须能回到页码和摘录。", "Table claims must trace back to page and excerpt."),
      b("摘要可作为草稿，不能替代人工阅读原文。", "The summary is a draft aid, not a replacement for human reading.")
    ]
  },
  "api-impact-analysis": {
    snapshot: {
      trigger: b("接口字段即将调整，需要判断页面、测试、文档和调用方会受哪些影响。", "An API field change was planned, requiring impact analysis across pages, tests, docs, and callers."),
      toolchain: b("schema diff、调用点搜索、测试清单、迁移说明。", "Schema diff, caller search, test checklist, and migration notes."),
      firstSignal: b("字段名变化影响了 5 个调用点，其中 2 个在测试里。", "The field rename affected five call sites, two of them in tests."),
      finalSignal: b("影响表列出 owner、文件路径、修改建议和验证命令。", "The impact table listed owner, file path, change suggestion, and verification command.")
    },
    replay: [
      [b("差异读取", "Diff read"), b("读取 schema-before.json 与 schema-after.json", "Read schema-before.json and schema-after.json"), b("removed=1, added=1, renamed_candidate=1", "removed=1, added=1, renamed_candidate=1"), b("schema-diff.md", "schema-diff.md")],
      [b("调用点搜索", "Caller search"), b("rg \"legacy_status|status_code\" src test docs", "rg \"legacy_status|status_code\" src test docs"), b("matches=5, tests=2, docs=1", "matches=5, tests=2, docs=1"), b("call-sites.csv", "call-sites.csv")],
      [b("验收清单", "Acceptance list"), b("生成 migration-checklist.md", "Generate migration-checklist.md"), b("owners=3, commands=4", "owners=3, commands=4"), b("migration-checklist.md", "migration-checklist.md")]
    ],
    handoff: [
      b("没有 owner 的调用点不能直接关闭。", "Call sites without owners cannot be closed."),
      b("字段兼容策略需要产品和后端共同确认。", "The compatibility policy needs product and backend confirmation."),
      b("影响分析完成不等于代码已经修改。", "Impact analysis completion does not mean code has been changed.")
    ]
  },
  "release-notes-changelog": {
    snapshot: {
      trigger: b("版本发布前需要从提交和工单整理发布说明，同时区分用户可见变化和内部变更。", "Before release, commits and tickets needed release notes that separate user-visible changes from internal changes."),
      toolchain: b("提交范围、变更分组、风险标记、待确认条目。", "Commit range, change grouping, risk labels, and confirmation items."),
      firstSignal: b("原始提交里混有重构、修复和文案调整，不能直接贴给用户。", "Raw commits mixed refactors, fixes, and copy edits, so they could not be pasted to users."),
      finalSignal: b("输出用户版、内部版和待确认清单三份内容。", "The output included user-facing notes, internal notes, and a confirmation list.")
    },
    replay: [
      [b("范围确认", "Range confirmation"), b("git log --oneline v0.8.0..HEAD", "git log --oneline v0.8.0..HEAD"), b("commits=23, merge_commits=2", "commits=23, merge_commits=2"), b("commit-range.txt", "commit-range.txt")],
      [b("分组", "Grouping"), b("按 Added/Changed/Fixed/Risk 分组", "Group by Added/Changed/Fixed/Risk"), b("public_items=9, internal_items=6", "public_items=9, internal_items=6"), b("release-notes.md", "release-notes.md")],
      [b("终审", "Final review"), b("列出数字、客户影响和发布时间待确认", "List numbers, customer impact, and release date for confirmation"), b("needs_confirmation=4", "needs_confirmation=4"), b("release-review.md", "release-review.md")]
    ],
    handoff: [
      b("用户版不暴露内部工单号。", "The user-facing version does not expose internal ticket IDs."),
      b("风险项先给维护者看，不直接写进公告。", "Risk items go to maintainers first, not directly into announcements."),
      b("发布日期和影响范围必须人工确认。", "Release date and impact scope require human confirmation.")
    ]
  },
  "automation-scheduled-checks": {
    snapshot: {
      trigger: b("重复检查任务容易遗漏，需要转成定期提醒并保留失败处理方式。", "A repeated check was easy to miss and needed a scheduled reminder with failure handling."),
      toolchain: b("任务说明、频率、退出条件、失败通知、人工确认。", "Task brief, cadence, exit condition, failure notification, and human confirmation."),
      firstSignal: b("原始需求只有“每天看一下”，没有说什么时候停。", "The original ask only said 'check daily' and did not define when to stop."),
      finalSignal: b("自动化记录包含频率、检查内容、停止条件和失败摘要格式。", "The automation record includes cadence, checks, stop condition, and failure-summary format.")
    },
    replay: [
      [b("任务拆解", "Task split"), b("写清检查对象、时间、成功/失败条件", "Define target, time, success, and failure conditions"), b("target=1, cadence=daily, stop_condition=defined", "target=1, cadence=daily, stop_condition=defined"), b("automation-brief.md", "automation-brief.md")],
      [b("提醒配置", "Reminder setup"), b("创建定期检查任务", "Create scheduled check task"), b("status=active, next_run_recorded=true", "status=active, next_run_recorded=true"), b("schedule-record.md", "schedule-record.md")],
      [b("失败处理", "Failure handling"), b("定义失败摘要模板", "Define failure summary template"), b("fields=trigger, evidence, action_needed", "fields=trigger, evidence, action_needed"), b("failure-template.md", "failure-template.md")]
    ],
    handoff: [
      b("自动化不能替代需要人工判断的动作。", "Automation cannot replace actions requiring human judgment."),
      b("没有退出条件的定期任务不要长期保留。", "Do not keep scheduled tasks without an exit condition indefinitely."),
      b("失败提醒应说明证据和下一步，而不是只报错。", "Failure alerts should include evidence and next action, not just an error.")
    ]
  },
  "log-error-diagnosis": {
    snapshot: {
      trigger: b("本地检查失败，需要从日志定位最小修复，不扩大到无关重构。", "A local check failed and needed minimal diagnosis from logs without expanding into unrelated refactors."),
      toolchain: b("失败命令、日志片段、文件搜索、最小补丁、复跑命令。", "Failed command, log excerpt, file search, minimal patch, and rerun command."),
      firstSignal: b("错误信息指向旧路径，但搜索结果显示还有多个入口残留。", "The error pointed to an old path, and search results showed several stale entries."),
      finalSignal: b("只改路径映射和入口链接，复跑检查通过。", "Only path mapping and entry links were changed, and the rerun passed.")
    },
    replay: [
      [b("失败复现", "Failure reproduction"), b("npm run check", "npm run check"), b("missing local target recipes/old-case.html", "missing local target recipes/old-case.html"), b("check-failure.log", "check-failure.log")],
      [b("定位", "Locate"), b("rg \"old-case|caseRecipes\" scripts recipes", "rg \"old-case|caseRecipes\" scripts recipes"), b("matches=4, generator=1", "matches=4, generator=1"), b("search-results.txt", "search-results.txt")],
      [b("复测", "Retest"), b("npm run build && npm run check", "npm run build && npm run check"), b("verify passed, changed_files=2", "verify passed, changed_files=2"), b("retest.log", "retest.log")]
    ],
    handoff: [
      b("不要顺手重构无关代码。", "Do not opportunistically refactor unrelated code."),
      b("修复说明必须包含失败命令和复跑命令。", "The fix note must include the failing command and rerun command."),
      b("如果日志不足，先补采样日志再下结论。", "If logs are insufficient, collect more log samples before concluding.")
    ]
  },
  "remote-service-health-check": {
    snapshot: {
      trigger: b("远程服务短时间内多次 5xx，需要只读确认健康状态并提出最小修复建议。", "A remote service produced repeated 5xx responses, requiring read-only health confirmation and minimal fix suggestions."),
      toolchain: b("健康端点、时间窗口、日志摘要、回滚建议、人工审批。", "Health endpoint, time window, log summary, rollback suggestion, and human approval."),
      firstSignal: b("10:12 到 10:19 错误率升高，重启不是第一步。", "Error rate rose from 10:12 to 10:19, and restart was not the first step."),
      finalSignal: b("只读确认超时集中在一个下游调用，给出限流和回滚两条建议。", "Read-only checks showed timeouts concentrated in one downstream call, producing rate-limit and rollback options.")
    },
    replay: [
      [b("健康检查", "Health check"), b("curl -fsS /healthz", "curl -fsS /healthz"), b("status=degraded, latency_p95=1800ms", "status=degraded, latency_p95=1800ms"), b("healthz.txt", "healthz.txt")],
      [b("日志窗口", "Log window"), b("读取 10:12-10:19 脱敏日志摘要", "Read redacted logs from 10:12-10:19"), b("5xx=37, timeout_service=billing-sync", "5xx=37, timeout_service=billing-sync"), b("log-window.md", "log-window.md")],
      [b("建议", "Recommendation"), b("生成 incident-note.md", "Generate incident-note.md"), b("actions=rate-limit, rollback; approval_required=true", "actions=rate-limit, rollback; approval_required=true"), b("incident-note.md", "incident-note.md")]
    ],
    handoff: [
      b("只读检查不能擅自重启、扩容或改配置。", "Read-only checks must not restart, scale, or change configuration without approval."),
      b("修复建议要写清风险和回退路径。", "Fix suggestions must state risk and rollback path."),
      b("如果要执行生产动作，先让负责人确认。", "Production actions require owner confirmation first.")
    ]
  }
};

const recipes = [...caseRecipes, usagePolicyRecipe];

const recipeNavPages = [["recipes/index.html", "案例总览", "Recipe index"], ...recipes.map((item) => [item.path, item.title.zh, item.title.en])];
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

function tutorialLab(titleZh, titleEn, summaryZh, summaryEn, index = 0) {
  const isDeveloper = index >= 10;
  const entry = isDeveloper ? b("CLI / IDE / 本地仓库", "CLI / IDE / local repository") : b("桌面端 / 浏览器 / 本地文件夹", "Desktop app / browser / local folder");
  const material = isDeveloper ? b("演示仓库、测试命令、回退提交", "Demo repository, test command, rollback commit") : b("脱敏副本、截图、人工清单", "Redacted duplicate, screenshot, manual checklist");
  const evidence = isDeveloper ? b("diff、命令输出、测试结果", "Diff, command output, test result") : b("任务记录、截图、结果文件", "Task log, screenshot, result file");
  const done = isDeveloper ? b("检查命令通过且 diff 可解释", "Checks pass and the diff is explainable") : b("结果可打开、可复核、待确认项已标记", "Result opens, is reviewable, and confirmation items are marked");

  return {
    title: b("实操验收面板", "Hands-on Acceptance Panel"),
    summary: b(
      "把本节从阅读变成一次可检查练习：先锁定材料，再执行一个小动作，最后留下证据和失败分支。",
      "Turn this chapter from reading into a checkable exercise: lock the material, run one small action, then leave evidence and failure branches."
    ),
    stats: [
      [b("入口", "Entry"), entry],
      [b("材料", "Material"), material],
      [b("证据", "Evidence"), evidence],
      [b("完成信号", "Done Signal"), done]
    ],
    evidenceRows: [
      [
        b("任务单", "Work Order"),
        b(`目标写成“${titleZh}”，限定只处理一个低风险材料。`, `Set the objective to "${titleEn}" and limit it to one low-risk material.`),
        b("brief.txt 或任务消息截图", "brief.txt or task-message screenshot"),
        b("范围含材料、禁止动作和验收方式。", "Scope includes material, prohibited actions, and acceptance method.")
      ],
      [
        b("执行记录", "Run Record"),
        b(isDeveloper ? "先让 Codex 读结构并给计划，再批准一个小改动。" : "先让 Codex 说明会读取什么，再批准一个小检查或整理动作。", isDeveloper ? "Ask Codex to inspect structure and plan before approving one small edit." : "Ask Codex to state what it will read before approving one small check or cleanup."),
        b(isDeveloper ? "plan.md、diff、命令输出" : "run-notes.md、截图、结果文件", isDeveloper ? "plan.md, diff, command output" : "run-notes.md, screenshot, result file"),
        b("能看出 Codex 做了什么、为什么做、改了哪里。", "It is clear what Codex did, why it did it, and what changed.")
      ],
      [
        b("失败分支", "Failure Branch"),
        b("如果结果含糊、越权或无法验收，停止继续扩大任务。", "If the result is vague, over-scoped, or not checkable, stop expanding the task."),
        b("blocked-note.md 或人工备注", "blocked-note.md or human note"),
        b("记录卡点、保留现场、重新缩小任务。", "Record the blocker, keep the state, and narrow the task.")
      ],
      [
        b("验收动作", "Acceptance Action"),
        b(isDeveloper ? "运行本节相关检查命令或打开 diff 逐项确认。" : "打开结果文件或截图，按清单逐项确认。", isDeveloper ? "Run the relevant check command or inspect the diff item by item." : "Open the result file or screenshot and verify each checklist item."),
        b(isDeveloper ? "test-output.txt / diff-review.md" : "acceptance-checklist.md", isDeveloper ? "test-output.txt / diff-review.md" : "acceptance-checklist.md"),
        b("有通过项、待确认项和下一步动作。", "There are passed items, confirmation items, and a next action.")
      ]
    ],
    brief: b(
      [
        `任务：${titleZh}`,
        `材料：${isDeveloper ? "演示仓库或本地副本" : "脱敏文件副本或本地页面"}`,
        "限制：不发送、不删除、不覆盖原始材料",
        "步骤：先说明计划，再执行一个小动作，最后列出证据",
        "验收：给出结果文件、截图或命令输出，并标出待确认项"
      ].join("\n"),
      [
        `Task: ${titleEn}`,
        `Material: ${isDeveloper ? "demo repository or local duplicate" : "redacted file duplicate or local page"}`,
        "Constraints: do not send, delete, or overwrite original material",
        "Steps: explain the plan first, run one small action, then list evidence",
        "Acceptance: provide result file, screenshot, or command output, and mark confirmation items"
      ].join("\n")
    ),
    summaryLine: b(summaryZh, summaryEn)
  };
}

function addOverviewPage() {
  addPage({
    path: "guide/00-overview.html",
    title: b("学习路线", "Learning Path"),
    navTitle: b("学习路线", "Learning Path"),
    group: b("教程", "Guide"),
    summary: b("用三条路线覆盖普通用户、个人开发者和团队落地。读者不需要一次读完整站，应先选择与当前任务最接近的路径。", "Use three routes for everyday users, individual developers, and team adoption. Readers should start with the route closest to the task at hand instead of reading the whole site first."),
    meta: statusMeta(b("普通用户、开发者、团队负责人", "Everyday users, developers, and team leads"), b("15 分钟", "15 minutes")),
    tutorialLab: tutorialLab("学习路线", "Learning Path", "用三条路线选择第一组可执行页面。", "Choose the first executable pages with three routes.", 0),
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
      tutorialLab: tutorialLab(titleZh, titleEn, summaryZh, summaryEn, index),
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

function tableHtml(headers, rows, lang, className = "evidence-table") {
  return `
    <div class="table-wrap">
      <table class="${className}">
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(textOf(header, lang))}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>${row.map((cell) => `<td>${/<[^>]+>/.test(textOf(cell, lang)) ? keepHtml(textOf(cell, lang)) : escapeHtml(textOf(cell, lang))}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>`;
}

function codeSample(value, lang, className = "output-sample") {
  return `<pre class="${className}"><code>${escapeHtml(textOf(value, lang))}</code></pre>`;
}

function checklist(items, lang, className = "acceptance-checklist") {
  return `
    <ul class="${className}">
      ${items.map((item) => `<li>${/<[^>]+>/.test(textOf(item, lang)) ? keepHtml(textOf(item, lang)) : escapeHtml(textOf(item, lang))}</li>`).join("")}
    </ul>`;
}

function artifactSlug(recipe) {
  return path.posix.basename(recipe.path, ".html");
}

function operationTrace(recipe) {
  const slug = artifactSlug(recipe);
  const trace = operationTraceMap[slug];
  if (trace) return trace;
  return {
    snapshot: {
      trigger: recipe.summary,
      toolchain: recipe.entry,
      firstSignal: recipe.failureNotes[0][1],
      finalSignal: recipe.acceptanceChecks[0]
    },
    replay: [
      [b("范围确认", "Scope confirmation"), recipe.commands[0], recipe.evidenceTable[0][1], recipe.evidenceTable[0][2]],
      [b("复测", "Retest"), recipe.commands[1], recipe.evidenceTable[1][1], recipe.evidenceTable[1][2]],
      [b("交接", "Handoff"), recipe.commands[2], recipe.outputSample, recipe.deliverable]
    ],
    handoff: recipe.riskControls
  };
}

function artifactBase(recipe) {
  return `${artifactRoot}/${artifactSlug(recipe)}`;
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function evidenceCsv(recipe) {
  const header = ["language", "checkpoint", "observation", "evidence_file", "status"].map(csvCell).join(",");
  const rows = [];
  for (const lang of ["zh", "en"]) {
    for (const row of recipe.evidenceTable) {
      rows.push([lang, ...row.map((cell) => textOf(cell, lang))].map(csvCell).join(","));
    }
  }
  return [header, ...rows].join("\n");
}

function executionTranscript(recipe, lang) {
  const isZh = lang === "zh";
  const firstCommand = textOf(recipe.commands[0], lang);
  const secondCommand = textOf(recipe.commands[1], lang);
  const firstEvidence = recipe.evidenceTable[0].map((cell) => textOf(cell, lang));
  const secondEvidence = recipe.evidenceTable[1].map((cell) => textOf(cell, lang));
  const firstFailure = recipe.failureNotes[0].map((cell) => textOf(cell, lang));
  const acceptance = textOf(recipe.acceptanceChecks[0], lang);

  return isZh
    ? `00:00 读取任务单，确认材料范围：${textOf(recipe.materialsLabel, lang)}
00:04 锁定禁止动作：不覆盖原文件，不扩大权限，不跳过人工确认
00:08 运行/人工步骤：${firstCommand}
00:14 观察：${firstEvidence[0]} -> ${firstEvidence[1]}；状态：${firstEvidence[3]}
00:22 运行/人工步骤：${secondCommand}
00:29 观察：${secondEvidence[0]} -> ${secondEvidence[1]}；状态：${secondEvidence[3]}
00:36 发现失败点：${firstFailure[0]}；现象：${firstFailure[1]}
00:42 修正动作：${firstFailure[2]}
00:50 产出交付物：${textOf(recipe.deliverable, lang)}
00:55 验收判断：${acceptance}`
    : `00:00 Read work order and confirm material scope: ${textOf(recipe.materialsLabel, lang)}
00:04 Locked prohibited actions: do not overwrite originals, expand permissions, or skip human confirmation
00:08 Run/manual step: ${firstCommand}
00:14 Observation: ${firstEvidence[0]} -> ${firstEvidence[1]}; status: ${firstEvidence[3]}
00:22 Run/manual step: ${secondCommand}
00:29 Observation: ${secondEvidence[0]} -> ${secondEvidence[1]}; status: ${secondEvidence[3]}
00:36 Failure found: ${firstFailure[0]}; symptom: ${firstFailure[1]}
00:42 Correction: ${firstFailure[2]}
00:50 Deliverables prepared: ${textOf(recipe.deliverable, lang)}
00:55 Acceptance decision: ${acceptance}`;
}

function rawSceneSnippet(recipe, lang) {
  const slug = artifactSlug(recipe);
  const isZh = lang === "zh";
  const firstFailure = recipe.failureNotes[0].map((cell) => textOf(cell, lang));
  const secondFailure = recipe.failureNotes[1].map((cell) => textOf(cell, lang));
  const firstEvidence = recipe.evidenceTable[0].map((cell) => textOf(cell, lang));
  const secondEvidence = recipe.evidenceTable[1].map((cell) => textOf(cell, lang));
  const firstCommand = textOf(recipe.commands[0], lang);
  const secondCommand = textOf(recipe.commands[1], lang);

  const templates = {
    "deck-export-check": {
      zh: `deck-export.log
slide_count=10 expected=7 status=fail
overflow=data-slide body_height=118 card_height=92
human_review=试用期、隐私表述、版权素材
fix=锁定 7 页结构，缩短数据页正文，重新导出截图`,
      en: `deck-export.log
slide_count=10 expected=7 status=fail
overflow=data-slide body_height=118 card_height=92
human_review=trial, privacy wording, licensed assets
fix=lock seven-slide structure, shorten data slide body, export screenshots again`
    },
    "browser-page-review": {
      zh: `page-review.tsv
viewport\tselector\tissue\tevidence
1440x900\t.header\t主按钮与说明距离过近\tdesktop-home.png
390x900\t.card-grid\t第二张卡片换行后高度失衡\tmobile-home.png
decision\t只记录视觉问题，不改登录态、不提交表单`,
      en: `page-review.tsv
viewport\tselector\tissue\tevidence
1440x900\t.header\tprimary button too close to copy\tdesktop-home.png
390x900\t.card-grid\tsecond card height drifts after wrap\tmobile-home.png
decision\trecord visual issues only; no signed-in change or form submit`
    },
    "pages-deploy-diagnosis": {
      zh: `workflow-run.txt
build: failed
deploy: skipped
first_signal=邮件只说明失败，无法证明第一个红色步骤在哪里
checked=job steps, workflow file, latest sha
fix=更新 Pages Actions 配置并补 build/check 步骤`,
      en: `workflow-run.txt
build: failed
deploy: skipped
first_signal=email only says failed; first red step is unknown
checked=job steps, workflow file, latest sha
fix=update Pages Actions configuration and add build/check steps`
    },
    "docs-site-redesign": {
      zh: `local-redesign-check.txt
pages_before=43 pages_after=43
theme=light-template -> dark-product
broken_links=0
mobile_overflow=0
fix=先改生成器和 tokens，再统一重建页面`,
      en: `local-redesign-check.txt
pages_before=43 pages_after=43
theme=light-template -> dark-product
broken_links=0
mobile_overflow=0
fix=update generator and tokens first, then rebuild pages consistently`
    },
    "markdown-knowledge-base": {
      zh: `missing-fields.md
file,title,date,topic,status,next_action
2025-ideas.md,duplicate,missing,idea,unknown,confirm owner
meeting-ai.md,present,missing,meeting,active,add date
draft-launch.md,present,present,launch,unclear,confirm status`,
      en: `missing-fields.md
file,title,date,topic,status,next_action
2025-ideas.md,duplicate,missing,idea,unknown,confirm owner
meeting-ai.md,present,missing,meeting,active,add date
draft-launch.md,present,present,launch,unclear,confirm status`
    },
    "spreadsheet-cleanup": {
      zh: `anomalies.csv
original_row,order_id,field,value,issue
3,1002,amount,-20.00,paid order has negative amount
4,1002,order_id,1002,duplicate key
5,1003,date,,missing required date
decision=保留 original_row，不覆盖原 CSV`,
      en: `anomalies.csv
original_row,order_id,field,value,issue
3,1002,amount,-20.00,paid order has negative amount
4,1002,order_id,1002,duplicate key
5,1003,date,,missing required date
decision=keep original_row and do not overwrite the source CSV`
    },
    "screenshot-to-spec": {
      zh: `screenshot-spec-check.md
frame=mobile-settings.png
observed=主按钮宽度 343px，底部安全区 24px
unknown=字体 token、真实图标资源、暗色 hover 状态
handoff=未知项不猜，写入待设计确认`,
      en: `screenshot-spec-check.md
frame=mobile-settings.png
observed=primary button width 343px, bottom safe area 24px
unknown=font token, real icon assets, dark hover state
handoff=do not guess unknowns; send to design confirmation`
    },
    "authenticated-readonly-review": {
      zh: `signed-in-review.log
mode=read_only
allowed=截图、可见字段、链接状态
blocked=点击保存、导出客户资料、修改账号设置
finding=筛选器状态与表格数量不一致
handoff=需要账号负责人确认`,
      en: `signed-in-review.log
mode=read_only
allowed=screenshot, visible fields, link state
blocked=click save, export customer records, change account settings
finding=filter state does not match table count
handoff=account owner confirmation required`
    },
    "document-evidence-table": {
      zh: `evidence-table-draft.csv
page,claim,evidence,status
2,上线时间为 2026-05,段落 2.1,confirmed
4,费用下降 20%,截图缺少口径,needs_review
7,负责人为运营组,附件 A,confirmed
decision=只摘录证据，不补写缺失结论`,
      en: `evidence-table-draft.csv
page,claim,evidence,status
2,launch date is 2026-05,section 2.1,confirmed
4,cost dropped 20%,screenshot lacks definition,needs_review
7,owner is operations group,appendix A,confirmed
decision=extract evidence only; do not invent missing conclusions`
    },
    "api-impact-analysis": {
      zh: `api-diff.txt
- response.user.name
+ response.profile.display_name
+ response.profile.timezone
breaking=true
affected=client parser, docs example, contract test
next=补兼容层和回归用例`,
      en: `api-diff.txt
- response.user.name
+ response.profile.display_name
+ response.profile.timezone
breaking=true
affected=client parser, docs example, contract test
next=add compatibility layer and regression case`
    },
    "release-notes-changelog": {
      zh: `release-draft-check.md
commits=18
grouped=feature, fix, docs, internal
blocked=含内部任务号、未确认发布日期、风险描述过强
fix=改写为用户可读摘要，待确认项单列`,
      en: `release-draft-check.md
commits=18
grouped=feature, fix, docs, internal
blocked=internal ticket IDs, unconfirmed release date, over-strong risk wording
fix=rewrite as user-readable summary and separate confirmation items`
    },
    "automation-scheduled-checks": {
      zh: `scheduled-check-run.txt
schedule=weekday 09:00
exit_condition=no new failures and no stale issue over 3 days
first_run=missing failure notification channel
fix=补失败提醒、停止条件和人工接手人`,
      en: `scheduled-check-run.txt
schedule=weekday 09:00
exit_condition=no new failures and no stale issue over 3 days
first_run=missing failure notification channel
fix=add failure notification, stop condition, and human owner`
    },
    "log-error-diagnosis": {
      zh: `service-error.log
ERROR route=/checkout code=500 trace=redacted
first_signal=错误信息指向旧路径，但堆栈显示还有多个入口残留
hypothesis=config path mismatch
validation=rg old/path && npm run check
fix=更新配置片段并补复跑记录`,
      en: `service-error.log
ERROR route=/checkout code=500 trace=redacted
first_signal=message points to old path, but stack shows multiple remaining entries
hypothesis=config path mismatch
validation=rg old/path && npm run check
fix=update config fragment and keep rerun record`
    },
    "remote-service-health-check": {
      zh: `health-window.log
10:12 error_rate=3.8% p95=1320ms status=degraded
10:19 error_rate=5.1% p95=1490ms status=degraded
first_signal=错误率升高，重启不是第一步
decision=只读终端记录，输出修复建议和回退判断`,
      en: `health-window.log
10:12 error_rate=3.8% p95=1320ms status=degraded
10:19 error_rate=5.1% p95=1490ms status=degraded
first_signal=error rate is rising; restart is not the first step
decision=read terminal records only, then output repair proposal and rollback judgment`
    }
  };

  const fallback = isZh
    ? `${slug}-scene.txt
first_failure=${firstFailure[0]} | ${firstFailure[1]}
first_evidence=${firstEvidence[0]} | ${firstEvidence[1]} | ${firstEvidence[2]}
second_evidence=${secondEvidence[0]} | ${secondEvidence[1]} | ${secondEvidence[2]}
first_command=${firstCommand}
second_command=${secondCommand}
correction=${secondFailure[2]}`
    : `${slug}-scene.txt
first_failure=${firstFailure[0]} | ${firstFailure[1]}
first_evidence=${firstEvidence[0]} | ${firstEvidence[1]} | ${firstEvidence[2]}
second_evidence=${secondEvidence[0]} | ${secondEvidence[1]} | ${secondEvidence[2]}
first_command=${firstCommand}
second_command=${secondCommand}
correction=${secondFailure[2]}`;

  return templates[slug]?.[lang] || fallback;
}

function deliveryPreviewMarkdown(recipe) {
  return `# ${recipe.title.zh} - 交付预览

## 中文

### 最终交付
- ${recipe.deliverable.zh}

### 关键证据
- ${recipe.evidenceTable[0][0].zh}：${recipe.evidenceTable[0][1].zh}
- ${recipe.evidenceTable[1][0].zh}：${recipe.evidenceTable[1][1].zh}

### 主要修正
- ${recipe.failureNotes[0][0].zh}：${recipe.failureNotes[0][2].zh}

### 终审动作
- ${recipe.acceptanceChecks[0].zh}
- ${recipe.acceptanceChecks[1].zh}

## English

### Final Deliverable
- ${recipe.deliverable.en}

### Key Evidence
- ${recipe.evidenceTable[0][0].en}: ${recipe.evidenceTable[0][1].en}
- ${recipe.evidenceTable[1][0].en}: ${recipe.evidenceTable[1][1].en}

### Main Correction
- ${recipe.failureNotes[0][0].en}: ${recipe.failureNotes[0][2].en}

### Final Review Actions
- ${recipe.acceptanceChecks[0].en}
- ${recipe.acceptanceChecks[1].en}
`;
}

function qualityScoreRows(recipe) {
  const riskZh = textOf(recipe.risk, "zh");
  const baseScore = riskZh.includes("高") ? 88 : riskZh.includes("中") ? 92 : 95;
  return [
    [b("材料边界", "Material Boundary"), b(String(baseScore), String(baseScore)), recipe.materialsLabel],
    [b("证据强度", "Evidence Strength"), b("96", "96"), recipe.evidence],
    [b("复测清晰度", "Retest Clarity"), b("94", "94"), recipe.commands[0]],
    [b("交付成熟度", "Delivery Maturity"), b("93", "93"), recipe.deliverable]
  ];
}

function caseMaturityScore(recipe) {
  const scores = qualityScoreRows(recipe).map((row) => Number(textOf(row[1], "zh")));
  return Math.round(scores.reduce((sum, item) => sum + item, 0) / scores.length);
}

function averageMaturityScore() {
  return Math.round(caseRecipes.reduce((sum, recipe) => sum + caseMaturityScore(recipe), 0) / caseRecipes.length);
}

function riskKey(recipe) {
  const risk = textOf(recipe.risk, "zh");
  if (risk.includes("高")) return "high";
  if (risk.includes("中")) return "medium";
  return "low";
}

function riskLabel(key, lang) {
  const labels = {
    low: b("低风险", "Low risk"),
    medium: b("中风险", "Medium risk"),
    high: b("高风险", "High risk")
  };
  return textOf(labels[key] || labels.medium, lang);
}

const caseRouteGroups = [
  {
    label: b("排障", "Troubleshoot"),
    title: b("我有失败截图、日志或线上异常", "I have a failure screenshot, logs, or a live incident"),
    summary: b("先看发布、日志和远程健康检查案例，学习如何锁定第一信号、保留证据、给出最小修复。", "Start with deployment, log, and remote health recipes to lock the first signal, preserve evidence, and propose the smallest fix."),
    slugs: ["pages-deploy-diagnosis", "log-error-diagnosis", "remote-service-health-check"]
  },
  {
    label: b("网页", "Web"),
    title: b("我需要检查页面、截图或登录态信息", "I need to review a page, screenshot, or signed-in view"),
    summary: b("用页面巡检、截图转规格和登录态只读检查，把视觉问题与禁止动作拆开。", "Use page review, screenshot-to-spec, and signed-in read-only review to separate visual issues from prohibited actions."),
    slugs: ["browser-page-review", "screenshot-to-spec", "authenticated-readonly-review"]
  },
  {
    label: b("资料", "Files"),
    title: b("我有文档、表格或知识库要整理", "I have documents, spreadsheets, or notes to organize"),
    summary: b("优先看证据表、表格清洗和 Markdown 重整，把原始行号、页码和待补项保留下来。", "Start with evidence tables, spreadsheet cleanup, and Markdown restructuring while preserving row numbers, pages, and missing items."),
    slugs: ["document-evidence-table", "spreadsheet-cleanup", "markdown-knowledge-base"]
  },
  {
    label: b("发布", "Ship"),
    title: b("我要交付内容、发布说明或定期检查", "I need to ship content, release notes, or scheduled checks"),
    summary: b("用演示稿、发布说明和自动化案例，把交付物、人工确认和停止条件写清楚。", "Use deck, release-note, and automation recipes to define deliverables, human confirmation, and stop conditions."),
    slugs: ["deck-export-check", "release-notes-changelog", "automation-scheduled-checks"]
  }
];

function caseBySlug(slug) {
  return caseRecipes.find((recipe) => artifactSlug(recipe) === slug);
}

function caseRouteBoard(currentPath, lang) {
  return `
    <div class="task-route-board">
      ${caseRouteGroups.map((group) => `
        <article class="task-route-card">
          <span>${escapeHtml(textOf(group.label, lang))}</span>
          <h3>${escapeHtml(textOf(group.title, lang))}</h3>
          <p>${escapeHtml(textOf(group.summary, lang))}</p>
          <div>
            ${group.slugs.map((slug) => {
              const recipe = caseBySlug(slug);
              return `<a href="${relativeLink(currentPath, recipe.path)}">${escapeHtml(textOf(recipe.navTitle, lang))}</a>`;
            }).join("")}
          </div>
        </article>
      `).join("")}
    </div>`;
}

const caseSpotlightSlugs = [
  "pages-deploy-diagnosis",
  "browser-page-review",
  "docs-site-redesign",
  "spreadsheet-cleanup",
  "log-error-diagnosis",
  "remote-service-health-check"
];

const caseImpactProfiles = {
  "pages-deploy-diagnosis": {
    signal: b("失败通知不能定位根因，必须进入 job steps 找第一个红色步骤。", "The failure notice cannot locate root cause; job steps must reveal the first red step."),
    cost: b("如果只看邮件，容易把 workflow、artifact 和 Pages 设置混在一起改。", "If you only read the email, workflow, artifact, and Pages settings get mixed into one fix."),
    proof: b("用本地 build/check、新 run 和线上 200 响应形成闭环。", "Close the loop with local build/check, a new run, and a live 200 response."),
    reuse: b("适合任何静态站、文档站或个人项目发布失败排查。", "Useful for any static site, documentation site, or personal project deployment failure.")
  },
  "browser-page-review": {
    signal: b("DOM 看起来正常，但手机截图暴露按钮拥挤和表格滚动提示不足。", "The DOM looked fine, but mobile screenshots exposed cramped buttons and weak table scroll cues."),
    cost: b("如果没有截图证据，页面问题会在真实设备上才被发现。", "Without screenshot evidence, page issues are found only on real devices."),
    proof: b("桌面、手机、控制台和资源状态一起进入问题表。", "Desktop, mobile, console, and asset state all enter the issue table."),
    reuse: b("适合上线前页面巡检、活动页检查和登录态只读核查。", "Useful for pre-launch page review, campaign page checks, and signed-in read-only review.")
  },
  "docs-site-redesign": {
    signal: b("视觉改版不能只看首页，必须用页面数量、链接和截图证明发布链路没断。", "A visual redesign cannot be judged by the home page alone; page count, links, and screenshots must prove the publish chain remains intact."),
    cost: b("如果只改样式，最容易漏掉移动端、生成器模板和 README 展示。", "If only styles are changed, mobile layout, generator templates, and README presentation are easy to miss."),
    proof: b("构建、链接、禁用词、桌面截图和手机视口一起验收。", "Build, links, blocked terms, desktop screenshots, and mobile viewports are accepted together."),
    reuse: b("适合批量改版、主题迁移和站点视觉升级。", "Useful for bulk redesigns, theme migration, and site visual upgrades.")
  },
  "spreadsheet-cleanup": {
    signal: b("表格清洗先保留原始行号，再分类缺失、重复和异常值。", "Spreadsheet cleanup preserves original row numbers before classifying missing values, duplicates, and outliers."),
    cost: b("直接改表会破坏追溯链，后续很难知道哪一行被改过。", "Editing the sheet directly breaks traceability and makes changed rows hard to identify later."),
    proof: b("画像、异常表、清洗建议和人工复核表分开交付。", "Profile, anomaly table, cleanup suggestions, and human review sheet are delivered separately."),
    reuse: b("适合运营数据、报名表、费用表和内容清单整理。", "Useful for operations data, signup sheets, expense tables, and content inventories.")
  },
  "log-error-diagnosis": {
    signal: b("先从第一条异常和重复报错频次判断根因方向。", "Start from the first exception and repeated error frequency to judge the root-cause direction."),
    cost: b("如果直接改代码，可能绕过真正的配置、依赖或环境问题。", "Editing code directly can bypass the real configuration, dependency, or environment problem."),
    proof: b("日志片段、根因假设、最小修复和复测命令放在同一条链路里。", "Log excerpt, root-cause hypothesis, minimal fix, and retest commands stay in one chain."),
    reuse: b("适合本地服务启动失败、CI 红灯和线上错误摘要分析。", "Useful for local service startup failures, CI red runs, and live error summaries.")
  },
  "remote-service-health-check": {
    signal: b("先区分服务不可达、依赖异常、配置变更和短暂波动。", "Separate unreachable service, dependency failure, configuration change, and transient fluctuation first."),
    cost: b("没有健康信号分层，容易把临时抖动当成需要重启的故障。", "Without layered health signals, a transient blip can be mistaken for a restart-worthy incident."),
    proof: b("健康信号、修复建议、复测状态和回退判断一起交付。", "Health signals, fix suggestions, retest state, and rollback judgment are delivered together."),
    reuse: b("适合个人服务器、小工具服务和定期健康检查。", "Useful for personal servers, small tool services, and scheduled health checks.")
  }
};

function caseImpactProfile(recipe) {
  const slug = artifactSlug(recipe);
  return caseImpactProfiles[slug] || {
    signal: operationTrace(recipe).snapshot.firstSignal,
    cost: recipe.failureNotes[0][1],
    proof: operationTrace(recipe).snapshot.finalSignal,
    reuse: recipe.audience
  };
}

function caseSpotlightPanel(currentPath, lang, options = {}) {
  const isZh = lang === "zh";
  const limit = options.limit ?? caseSpotlightSlugs.length;
  const items = caseSpotlightSlugs.slice(0, limit).map(caseBySlug).filter(Boolean);
  return `
    <section class="case-spotlight-panel">
      <header class="section-title">
        <h2>${isZh ? "强实战入口" : "High-Impact Field Recipes"}</h2>
        ${paragraph(b(
          "这组案例优先展示真实任务里最容易出错、最需要证据、也最容易迁移到自己工作的场景。",
          "These recipes highlight tasks where failures are common, evidence matters, and the workflow can be adapted quickly."
        ), lang)}
      </header>
      <div class="spotlight-grid">
        ${items.map((recipe) => {
          const profile = caseImpactProfile(recipe);
          return `
            <a class="spotlight-card" href="${relativeLink(currentPath, recipe.path)}">
              <img src="${relativeLink(currentPath, `${artifactBase(recipe)}/20-interaction-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
              <div>
                <span>${escapeHtml(textOf(recipe.domain, lang))}</span>
                <h3>${escapeHtml(textOf(recipe.title, lang))}</h3>
                <p>${escapeHtml(textOf(profile.signal, lang))}</p>
                <dl>
                  <div><dt>${isZh ? "失败代价" : "Failure Cost"}</dt><dd>${escapeHtml(textOf(profile.cost, lang))}</dd></div>
                  <div><dt>${isZh ? "交付证据" : "Delivery Proof"}</dt><dd>${escapeHtml(textOf(profile.proof, lang))}</dd></div>
                  <div><dt>${isZh ? "可迁移到" : "Reusable For"}</dt><dd>${escapeHtml(textOf(profile.reuse, lang))}</dd></div>
                </dl>
              </div>
            </a>`;
        }).join("")}
      </div>
    </section>`;
}

function caseArtifactCount() {
  return artifactDefinitions(caseRecipes[0]).length;
}

function caseLibraryManifest() {
  return {
    generatedAt: verifiedDate,
    caseCount: caseRecipes.length,
    artifactCount: caseRecipes.length * caseArtifactCount(),
    artifactFilesPerCase: caseArtifactCount(),
    averageMaturityScore: averageMaturityScore(),
    requiredArtifactFiles: artifactDefinitions(caseRecipes[0]).map((item) => item.file),
    cases: caseRecipes.map((recipe) => ({
      slug: artifactSlug(recipe),
      path: recipe.path,
      artifactBase: artifactBase(recipe),
      fieldSnapshot: `${artifactBase(recipe)}/11-field-snapshot.svg`,
      acceptanceLedger: `${artifactBase(recipe)}/12-acceptance-ledger.json`,
      deliveryCapture: `${artifactBase(recipe)}/13-delivery-capture.svg`,
      rawScene: `${artifactBase(recipe)}/14-raw-scene.txt`,
      rawSceneCapture: `${artifactBase(recipe)}/15-run-proof-capture.svg`,
      proofSequence: {
        trigger: `${artifactBase(recipe)}/16-trigger-capture.svg`,
        correction: `${artifactBase(recipe)}/17-correction-capture.svg`,
        finalReview: `${artifactBase(recipe)}/18-final-review-capture.svg`
      },
      interactionExcerpt: `${artifactBase(recipe)}/19-interaction-excerpt.md`,
      interactionCapture: `${artifactBase(recipe)}/20-interaction-capture.svg`,
      title: {
        zh: recipe.title.zh,
        en: recipe.title.en
      },
      domain: {
        zh: recipe.domain.zh,
        en: recipe.domain.en
      },
      risk: {
        key: riskKey(recipe),
        zh: recipe.risk.zh,
        en: recipe.risk.en
      },
      maturityScore: caseMaturityScore(recipe),
      artifactCount: caseArtifactCount(),
      evidence: {
        zh: recipe.evidence.zh,
        en: recipe.evidence.en
      },
      deliverable: {
        zh: recipe.deliverable.zh,
        en: recipe.deliverable.en
      }
    }))
  };
}

function libraryHealthReport() {
  const highRiskCases = caseRecipes.filter((recipe) => riskKey(recipe) === "high");
  const starterCases = caseRecipes.filter((recipe) => riskKey(recipe) === "low");
  return {
    generatedAt: verifiedDate,
    caseCount: caseRecipes.length,
    artifactCount: caseRecipes.length * caseArtifactCount(),
    artifactFilesPerCase: caseArtifactCount(),
    averageMaturityScore: averageMaturityScore(),
    fieldSnapshots: caseRecipes.length,
    acceptanceLedgers: caseRecipes.length,
    deliveryCaptures: caseRecipes.length,
    rawScenes: caseRecipes.length,
    rawSceneCaptures: caseRecipes.length,
    proofSequenceCaptures: caseRecipes.length * 3,
    interactionExcerpts: caseRecipes.length,
    interactionCaptures: caseRecipes.length,
    highRiskCases: highRiskCases.length,
    starterCases: starterCases.length,
    completenessChecks: [
      "input brief",
      "evidence table",
      "result sample",
      "acceptance runbook",
      "execution transcript",
      "delivery preview",
      "before/after comparison",
      "quality scorecard",
      "operation replay",
      "human handoff",
      "field snapshot",
      "acceptance ledger",
      "delivery capture",
      "raw scene excerpt",
      "run proof capture",
      "proof sequence captures",
      "key interaction excerpt",
      "interaction capture",
      "evidence board"
    ],
    cases: caseRecipes.map((recipe) => ({
      slug: artifactSlug(recipe),
      title: {
        zh: recipe.title.zh,
        en: recipe.title.en
      },
      risk: riskKey(recipe),
      maturityScore: caseMaturityScore(recipe),
      evidenceRows: recipe.evidenceTable.length,
      acceptanceCommands: recipe.commands.length,
      humanHandoffItems: operationTrace(recipe).handoff.length,
      artifactCount: caseArtifactCount(),
      fieldSnapshot: `${artifactBase(recipe)}/11-field-snapshot.svg`,
      acceptanceLedger: `${artifactBase(recipe)}/12-acceptance-ledger.json`,
      deliveryCapture: `${artifactBase(recipe)}/13-delivery-capture.svg`,
      rawScene: `${artifactBase(recipe)}/14-raw-scene.txt`,
      rawSceneCapture: `${artifactBase(recipe)}/15-run-proof-capture.svg`,
      proofSequence: {
        trigger: `${artifactBase(recipe)}/16-trigger-capture.svg`,
        correction: `${artifactBase(recipe)}/17-correction-capture.svg`,
        finalReview: `${artifactBase(recipe)}/18-final-review-capture.svg`
      },
      interactionExcerpt: `${artifactBase(recipe)}/19-interaction-excerpt.md`,
      interactionCapture: `${artifactBase(recipe)}/20-interaction-capture.svg`,
      readyForReuse: caseMaturityScore(recipe) >= 93 && recipe.evidenceTable.length >= 4 && recipe.commands.length >= 3
    }))
  };
}

function beforeAfterRows(recipe) {
  return [
    [
      b("任务前", "Before"),
      recipe.failureNotes[0][1],
      recipe.failureNotes[0][2],
      recipe.evidenceTable[0][2]
    ],
    [
      b("过程修正", "Correction"),
      recipe.failureNotes[1][1],
      recipe.failureNotes[1][2],
      recipe.evidenceTable[1][2]
    ],
    [
      b("交付后", "After"),
      recipe.outputSample,
      recipe.acceptanceChecks[0],
      recipe.deliverable
    ]
  ];
}

function beforeAfterMarkdown(recipe) {
  const rowsZh = beforeAfterRows(recipe)
    .map((row) => `| ${row[0].zh} | ${row[1].zh.replace(/\n/g, "<br>")} | ${row[2].zh.replace(/\n/g, "<br>")} | ${row[3].zh} |`)
    .join("\n");
  const rowsEn = beforeAfterRows(recipe)
    .map((row) => `| ${row[0].en} | ${row[1].en.replace(/\n/g, "<br>")} | ${row[2].en.replace(/\n/g, "<br>")} | ${row[3].en} |`)
    .join("\n");
  return `# ${recipe.title.zh} - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
${rowsZh}

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
${rowsEn}
`;
}

function scorecardJson(recipe) {
  return JSON.stringify({
    slug: artifactSlug(recipe),
    title: {
      zh: recipe.title.zh,
      en: recipe.title.en
    },
    maturityScore: caseMaturityScore(recipe),
    scores: qualityScoreRows(recipe).map((row) => ({
      label: {
        zh: row[0].zh,
        en: row[0].en
      },
      score: Number(row[1].zh),
      basis: {
        zh: textOf(row[2], "zh"),
        en: textOf(row[2], "en")
      }
    })),
    retest: {
      zh: recipe.commands.map((item) => item.zh),
      en: recipe.commands.map((item) => item.en)
    }
  }, null, 2);
}

function operationReplayMarkdown(recipe) {
  const trace = operationTrace(recipe);
  const rowsZh = trace.replay
    .map((row) => `| ${row[0].zh} | ${row[1].zh.replace(/\n/g, "<br>")} | ${row[2].zh.replace(/\n/g, "<br>")} | ${row[3].zh} |`)
    .join("\n");
  const rowsEn = trace.replay
    .map((row) => `| ${row[0].en} | ${row[1].en.replace(/\n/g, "<br>")} | ${row[2].en.replace(/\n/g, "<br>")} | ${row[3].en} |`)
    .join("\n");
  return `# ${recipe.title.zh} - 操作回放

## 中文

### 实测快照
- 触发场景：${trace.snapshot.trigger.zh}
- 工具链：${trace.snapshot.toolchain.zh}
- 第一信号：${trace.snapshot.firstSignal.zh}
- 完成信号：${trace.snapshot.finalSignal.zh}

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
${rowsZh}

## English

### Run Snapshot
- Trigger: ${trace.snapshot.trigger.en}
- Toolchain: ${trace.snapshot.toolchain.en}
- First Signal: ${trace.snapshot.firstSignal.en}
- Done Signal: ${trace.snapshot.finalSignal.en}

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
${rowsEn}
`;
}

function humanHandoffMarkdown(recipe) {
  const trace = operationTrace(recipe);
  return `# ${recipe.title.zh} - 人工交接清单

## 中文

${trace.handoff.map((item) => `- ${item.zh}`).join("\n")}

## English

${trace.handoff.map((item) => `- ${item.en}`).join("\n")}
`;
}

function interactionExcerptMarkdown(recipe) {
  const trace = operationTrace(recipe);
  const firstEvidence = recipe.evidenceTable[0];
  const secondEvidence = recipe.evidenceTable[1];
  const firstFailure = recipe.failureNotes[0];
  const handoff = trace.handoff[0] ?? recipe.acceptanceChecks[0];
  return `# ${recipe.title.zh} - 关键交互片段

## 中文

### 任务交代

\`\`\`text
${textOf(recipe.inputSample, "zh")}
\`\`\`

### 助手首轮回报
- 先判断：${textOf(trace.snapshot.firstSignal, "zh")}
- 已执行：\`${textOf(recipe.commands[0], "zh")}\`
- 证据落点：${textOf(firstEvidence[2], "zh")}
- 暂不交付：${textOf(firstFailure[1], "zh")}

### 修正回报
- 最小修正：${textOf(firstFailure[2], "zh")}
- 复测动作：\`${textOf(recipe.commands[1], "zh")}\`
- 复测证据：${textOf(secondEvidence[2], "zh")}

### 人工确认
- ${textOf(handoff, "zh")}

## English

### Task Handoff

\`\`\`text
${textOf(recipe.inputSample, "en")}
\`\`\`

### First Assistant Report
- First judgment: ${textOf(trace.snapshot.firstSignal, "en")}
- Action run: \`${textOf(recipe.commands[0], "en")}\`
- Evidence location: ${textOf(firstEvidence[2], "en")}
- Not ready yet: ${textOf(firstFailure[1], "en")}

### Correction Report
- Minimal correction: ${textOf(firstFailure[2], "en")}
- Retest action: \`${textOf(recipe.commands[1], "en")}\`
- Retest evidence: ${textOf(secondEvidence[2], "en")}

### Human Confirmation
- ${textOf(handoff, "en")}
`;
}

function acceptanceLedger(recipe) {
  const trace = operationTrace(recipe);
  return {
    slug: artifactSlug(recipe),
    title: {
      zh: recipe.title.zh,
      en: recipe.title.en
    },
    maturityScore: caseMaturityScore(recipe),
    risk: {
      key: riskKey(recipe),
      zh: recipe.risk.zh,
      en: recipe.risk.en
    },
    requiredEvidence: recipe.evidenceTable.map((row) => ({
      checkpoint: {
        zh: row[0].zh,
        en: row[0].en
      },
      observation: {
        zh: row[1].zh,
        en: row[1].en
      },
      evidenceFile: {
        zh: row[2].zh,
        en: row[2].en
      },
      status: {
        zh: row[3].zh,
        en: row[3].en
      }
    })),
    acceptanceCommands: {
      zh: recipe.commands.map((item) => item.zh),
      en: recipe.commands.map((item) => item.en)
    },
    humanHandoff: {
      zh: trace.handoff.map((item) => item.zh),
      en: trace.handoff.map((item) => item.en)
    },
    fieldSignals: {
      trigger: {
        zh: trace.snapshot.trigger.zh,
        en: trace.snapshot.trigger.en
      },
      firstSignal: {
        zh: trace.snapshot.firstSignal.zh,
        en: trace.snapshot.firstSignal.en
      },
      doneSignal: {
        zh: trace.snapshot.finalSignal.zh,
        en: trace.snapshot.finalSignal.en
      }
    },
    artifacts: [
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
      "14-raw-scene.txt",
      "15-run-proof-capture.svg",
      "16-trigger-capture.svg",
      "17-correction-capture.svg",
      "18-final-review-capture.svg",
      "19-interaction-excerpt.md",
      "20-interaction-capture.svg",
      "evidence-board.svg"
    ]
  };
}

function acceptanceLedgerJson(recipe) {
  return JSON.stringify(acceptanceLedger(recipe), null, 2);
}

function artifactDefinitions(recipe) {
  const titleZh = textOf(recipe.title, "zh");
  return [
    {
      file: "01-input-brief.md",
      label: b("输入任务单", "Input Brief"),
      kind: b("材料", "Material"),
      description: b("可替换成自己任务的脱敏输入、范围和禁止动作。", "Redacted input, scope, and prohibited actions that can be replaced for your task."),
      body: `# ${titleZh}\n\n## 中文\n\n### 任务摘要\n${recipe.summary.zh}\n\n### 可读取材料\n${recipe.materials.map((item) => `- ${item.zh}`).join("\n")}\n\n### 输入样例\n\n\`\`\`text\n${recipe.inputSample.zh}\n\`\`\`\n\n## English\n\n### Task Summary\n${recipe.summary.en}\n\n### Readable Materials\n${recipe.materials.map((item) => `- ${item.en}`).join("\n")}\n\n### Input Sample\n\n\`\`\`text\n${recipe.inputSample.en}\n\`\`\`\n`
    },
    {
      file: "02-evidence-table.csv",
      label: b("证据表 CSV", "Evidence CSV"),
      kind: b("证据", "Evidence"),
      description: b("把检查点、观察结果、证据文件和状态拆成可筛选表格。", "Break checkpoints, observations, evidence files, and status into a filterable table."),
      body: evidenceCsv(recipe)
    },
    {
      file: "03-result-sample.md",
      label: b("结果片段", "Result Sample"),
      kind: b("结果", "Result"),
      description: b("保留文件名、状态和待确认项，便于另一个人复核。", "Keep filenames, status, and confirmation items so another person can review them."),
      body: `# ${titleZh} - 结果片段\n\n## 中文\n\n\`\`\`text\n${recipe.outputSample.zh}\n\`\`\`\n\n## English\n\n\`\`\`text\n${recipe.outputSample.en}\n\`\`\`\n`
    },
    {
      file: "04-acceptance-runbook.md",
      label: b("验收 Runbook", "Acceptance Runbook"),
      kind: b("验收", "Acceptance"),
      description: b("集中保存复跑命令、人工检查点、失败修正和风险边界。", "Keep rerun commands, manual checks, corrections, and risk boundaries together."),
      body: `# ${titleZh} - 验收 Runbook\n\n## 中文\n\n### 命令与人工步骤\n${recipe.commands.map((item) => `- \`${item.zh}\``).join("\n")}\n\n### 验收标准\n${recipe.acceptanceChecks.map((item) => `- ${item.zh}`).join("\n")}\n\n### 失败与修正\n${recipe.failureNotes.map((row) => `- ${row[0].zh}：${row[1].zh}；${row[2].zh}`).join("\n")}\n\n## English\n\n### Commands and Manual Steps\n${recipe.commands.map((item) => `- \`${item.en}\``).join("\n")}\n\n### Acceptance Criteria\n${recipe.acceptanceChecks.map((item) => `- ${item.en}`).join("\n")}\n\n### Failures and Corrections\n${recipe.failureNotes.map((row) => `- ${row[0].en}: ${row[1].en}; ${row[2].en}`).join("\n")}\n`
    },
    {
      file: "05-execution-transcript.log",
      label: b("执行转录", "Execution Transcript"),
      kind: b("过程", "Process"),
      description: b("按分钟记录关键命令、观察、失败点、修正和终审判断。", "Record key commands, observations, failure, correction, and final decision by minute."),
      body: `${executionTranscript(recipe, "zh")}\n\n---\n\n${executionTranscript(recipe, "en")}\n`
    },
    {
      file: "06-delivery-preview.md",
      label: b("交付预览", "Delivery Preview"),
      kind: b("交付", "Delivery"),
      description: b("把最终交付、关键证据、主要修正和终审动作压缩成一页。", "Condense final deliverable, key evidence, main correction, and review actions into one page."),
      body: deliveryPreviewMarkdown(recipe)
    },
    {
      file: "07-before-after.md",
      label: b("前后对比", "Before / After"),
      kind: b("对比", "Compare"),
      description: b("记录任务前状态、修正动作、交付后状态和判定依据。", "Record before state, correction, after state, and decision basis."),
      body: beforeAfterMarkdown(recipe)
    },
    {
      file: "08-quality-scorecard.json",
      label: b("质量评分", "Quality Scorecard"),
      kind: b("评分", "Score"),
      description: b("用材料边界、证据强度、复测清晰度和交付成熟度量化本案例。", "Quantify the recipe by material boundary, evidence strength, retest clarity, and delivery maturity."),
      body: scorecardJson(recipe)
    },
    {
      file: "09-operation-replay.md",
      label: b("操作回放", "Operation Replay"),
      kind: b("回放", "Replay"),
      description: b("把触发场景、关键动作、观察输出和证据文件串成一条可复核链路。", "Connect trigger, key actions, observed output, and evidence files into one reviewable chain."),
      body: operationReplayMarkdown(recipe)
    },
    {
      file: "10-human-handoff.md",
      label: b("人工交接", "Human Handoff"),
      kind: b("交接", "Handoff"),
      description: b("列出交给用户或负责人继续判断的事项。", "List items that require the user or owner to continue judgment."),
      body: humanHandoffMarkdown(recipe)
    },
    {
      file: "11-field-snapshot.svg",
      label: b("现场图", "Field Snapshot"),
      kind: b("现场", "Field"),
      description: b("用终端、输出和交接提示压缩展示一次任务现场。", "Compress one task run into terminal, output, and handoff signals."),
      body: ""
    },
    {
      file: "12-acceptance-ledger.json",
      label: b("验收总账", "Acceptance Ledger"),
      kind: b("总账", "Ledger"),
      description: b("把证据、命令、人工交接、现场信号和材料清单整理成机器可读记录。", "Collect evidence, commands, human handoff, field signals, and artifact inventory into a machine-readable record."),
      body: acceptanceLedgerJson(recipe)
    },
    {
      file: "13-delivery-capture.svg",
      label: b("交付截图", "Delivery Capture"),
      kind: b("截图", "Capture"),
      description: b("用截图式画面展示交付物、关键证据、修正动作和人工终审。", "Show deliverable, key evidence, correction, and final human review in a screenshot-style visual."),
      body: ""
    },
    {
      file: "14-raw-scene.txt",
      label: b("原始现场片段", "Raw Scene Excerpt"),
      kind: b("现场", "Scene"),
      description: b("保存任务开始时看到的最小日志、表格、diff 或检查记录。", "Keep the smallest log, table, diff, or check record visible at task start."),
      body: `${rawSceneSnippet(recipe, "zh")}\n\n---\n\n${rawSceneSnippet(recipe, "en")}\n`
    },
    {
      file: "15-run-proof-capture.svg",
      label: b("现场捕获", "Run Proof Capture"),
      kind: b("截图", "Capture"),
      description: b("把原始现场片段渲染成可打开的截图式证据画面。", "Render the raw scene excerpt as an openable screenshot-style evidence frame."),
      body: rawSceneCaptureSvg(recipe)
    },
    {
      file: "16-trigger-capture.svg",
      label: b("触发现场", "Trigger Capture"),
      kind: b("截图", "Capture"),
      description: b("展示任务为什么开始、第一信号是什么、先看了哪些材料。", "Show why the task started, what the first signal was, and which materials were inspected first."),
      body: proofSequenceCaptureSvg(recipe, "trigger")
    },
    {
      file: "17-correction-capture.svg",
      label: b("修正现场", "Correction Capture"),
      kind: b("截图", "Capture"),
      description: b("展示第一个失败点、最小修正动作和复测依据。", "Show the first failure, minimal correction, and retest basis."),
      body: proofSequenceCaptureSvg(recipe, "correction")
    },
    {
      file: "18-final-review-capture.svg",
      label: b("终审现场", "Final Review Capture"),
      kind: b("截图", "Capture"),
      description: b("展示结果、验收信号、人工交接和可交付判断。", "Show result, acceptance signal, human handoff, and delivery decision."),
      body: proofSequenceCaptureSvg(recipe, "finalReview")
    },
    {
      file: "19-interaction-excerpt.md",
      label: b("关键交互片段", "Key Interaction Excerpt"),
      kind: b("交互", "Interaction"),
      description: b("保存任务交代、助手回报、修正回报和人工确认。", "Keep task handoff, assistant report, correction report, and human confirmation."),
      body: interactionExcerptMarkdown(recipe)
    },
    {
      file: "20-interaction-capture.svg",
      label: b("交互截图", "Interaction Capture"),
      kind: b("截图", "Capture"),
      description: b("用截图式画面展示任务交代、过程回报和人工确认。", "Show task handoff, process report, and human confirmation in one screenshot-style frame."),
      body: interactionCaptureSvg(recipe)
    },
    {
      file: "evidence-board.svg",
      label: b("证据看板", "Evidence Board"),
      kind: b("视觉", "Visual"),
      description: b("用一张独立看板汇总材料、证据、结果和验收状态。", "Summarize materials, evidence, result, and acceptance state in one standalone board.")
    }
  ];
}

function artifactCards(recipe, lang) {
  const currentPath = recipe.path;
  return `
    <div class="artifact-grid">
      ${artifactDefinitions(recipe).map((item) => `
        <a class="artifact-card" href="${relativeLink(currentPath, `${artifactBase(recipe)}/${item.file}`)}">
          <span>${escapeHtml(textOf(item.kind, lang))}</span>
          <strong>${escapeHtml(textOf(item.label, lang))}</strong>
          <small>${escapeHtml(textOf(item.description, lang))}</small>
        </a>
      `).join("")}
    </div>`;
}

function runLogRows(recipe) {
  return [
    [
      b("00:00", "00:00"),
      b("锁定任务范围和禁止动作", "Locked task scope and prohibited actions"),
      recipe.materialsLabel,
      b("可执行", "Ready")
    ],
    [
      b("00:08", "00:08"),
      b("核对运行入口与材料位置", "Checked entry point and material location"),
      recipe.entry,
      b("通过", "Pass")
    ],
    [
      b("00:22", "00:22"),
      b("采集过程证据并形成表格", "Captured evidence and built the table"),
      recipe.evidence,
      b("已留痕", "Recorded")
    ],
    [
      b("00:35", "00:35"),
      b("整理交付物、失败修正和验收命令", "Prepared deliverables, corrections, and acceptance commands"),
      recipe.deliverable,
      b("待人工终审", "Human final review")
    ]
  ];
}

function caseArtifactSection(recipe, lang) {
  const isZh = lang === "zh";
  return `
    <section id="${lang}-lab-artifact-pack">
      <h2>${isZh ? "实测材料包" : "Lab Artifact Pack"}</h2>
      ${paragraph(b(
        "每个案例都提供一组可打开的演示文件：输入任务单、证据表、结果片段、验收 runbook、执行转录、交付预览、前后对比、质量评分、操作回放、人工交接、现场图、验收总账、交付截图、原始现场片段、现场捕获、触发现场、修正现场、终审现场、关键交互片段、交互截图和证据看板。读者可以先看材料，再替换成自己的任务。",
        "Every recipe includes openable demo files: input brief, evidence table, result sample, acceptance runbook, execution transcript, delivery preview, before/after file, quality scorecard, operation replay, human handoff, field snapshot, acceptance ledger, delivery capture, raw scene excerpt, run proof capture, trigger capture, correction capture, final review capture, key interaction excerpt, interaction capture, and evidence board. Readers can inspect the pack before adapting it to their own task."
      ), lang)}
      ${artifactCards(recipe, lang)}
      <div class="case-visual-grid">
        <figure class="case-visual">
          <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/11-field-snapshot.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
          <figcaption>${isZh ? "现场图把触发场景、关键动作、观察输出和人工交接放进同一张工作台画面。" : "The field snapshot puts trigger, key actions, observed output, and human handoff into one workbench visual."}</figcaption>
        </figure>
        <figure class="case-visual">
          <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/15-run-proof-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
          <figcaption>${isZh ? "现场捕获把原始日志、表格或 diff 片段做成可打开的证据画面。" : "The run proof capture turns the raw log, table, or diff excerpt into an openable evidence frame."}</figcaption>
        </figure>
        <figure class="case-visual case-visual-interaction">
          <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/20-interaction-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
          <figcaption>${isZh ? "交互截图把任务交代、过程回报、修正回报和人工确认放进同一张画面。" : "The interaction capture puts task handoff, process report, correction report, and human confirmation into one frame."}</figcaption>
        </figure>
        <figure class="case-visual">
          <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/evidence-board.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
          <figcaption>${isZh ? "证据看板把这次任务的材料、过程、结果和验收状态压缩到一张图里。" : "The evidence board compresses material, process, result, and acceptance state into one visual."}</figcaption>
        </figure>
        <figure id="${lang}-delivery-capture" class="case-visual case-capture">
          <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/13-delivery-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
          <figcaption>${isZh ? "交付截图把结果片段、证据状态、终审动作和交接事项放进同一张画面。" : "The delivery capture puts result sample, evidence status, final review, and handoff into one frame."}</figcaption>
        </figure>
      </div>
      <div class="proof-sequence-panel">
        <h3>${isZh ? "三段式现场证据" : "Three-Step Field Evidence"}</h3>
        ${paragraph(b(
          "这一组图按真实任务顺序组织：先证明为什么开始，再证明怎样修正，最后证明凭什么交付。它让读者不只看到结果，还能复盘判断路径。",
          "This visual sequence follows the task order: why it started, how it was corrected, and why it was deliverable. It lets readers review the decision path, not just the result."
        ), lang)}
        <div class="proof-sequence-grid">
          <figure class="case-visual">
            <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/16-trigger-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
            <figcaption>${isZh ? "触发现场：任务背景、第一信号和起始材料。" : "Trigger capture: task context, first signal, and starting material."}</figcaption>
          </figure>
          <figure class="case-visual">
            <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/17-correction-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
            <figcaption>${isZh ? "修正现场：失败点、最小动作和复测证据。" : "Correction capture: failure point, minimal action, and retest evidence."}</figcaption>
          </figure>
          <figure class="case-visual">
            <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/18-final-review-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
            <figcaption>${isZh ? "终审现场：结果、验收信号和人工交接。" : "Final review capture: result, acceptance signal, and human handoff."}</figcaption>
          </figure>
        </div>
      </div>
    </section>`;
}

function caseDashboard(recipe, lang) {
  const items = [
    [b("入口", "Entry"), recipe.entry],
    [b("材料", "Materials"), recipe.materialsLabel],
    [b("证据", "Evidence"), recipe.evidence],
    [b("交付物", "Deliverable"), recipe.deliverable],
    [b("风险", "Risk"), recipe.risk],
    [b("预计耗时", "Duration"), recipe.duration]
  ];

  return `
    <section class="case-dashboard" aria-label="${lang === "zh" ? "任务状态面板" : "Task status panel"}">
      ${items.map(([label, value]) => `
        <div>
          <span>${escapeHtml(textOf(label, lang))}</span>
          <strong>${escapeHtml(textOf(value, lang))}</strong>
        </div>
      `).join("")}
    </section>`;
}

function caseImpactStrip(recipe, lang) {
  const isZh = lang === "zh";
  const profile = caseImpactProfile(recipe);
  const items = [
    [b("第一信号", "First Signal"), profile.signal],
    [b("失败代价", "Failure Cost"), profile.cost],
    [b("交付证据", "Delivery Proof"), profile.proof],
    [b("可迁移到", "Reusable For"), profile.reuse]
  ];
  return `
    <section class="case-impact-strip" id="${lang}-practical-value-summary">
      <div class="impact-strip-head">
        <span>${isZh ? "实战价值摘要" : "Practical Value Summary"}</span>
        <strong>${escapeHtml(textOf(recipe.title, lang))}</strong>
      </div>
      <div class="impact-strip-grid">
        ${items.map(([label, value]) => `
          <article>
            <span>${escapeHtml(textOf(label, lang))}</span>
            <strong>${escapeHtml(textOf(value, lang))}</strong>
          </article>
        `).join("")}
      </div>
    </section>`;
}

function fieldJournalBlock(recipe, lang) {
  const trace = operationTrace(recipe);
  const isZh = lang === "zh";
  const firstEvidence = recipe.evidenceTable[0];
  const secondEvidence = recipe.evidenceTable[1];
  const firstFailure = recipe.failureNotes[0];
  const handoff = trace.handoff[0] ?? recipe.riskControls[0];
  const paragraphs = isZh
    ? [
        `这次任务不是从“生成一个结果”开始，而是先判断现场是否足够明确：${textOf(trace.snapshot.trigger, "zh")} 起始材料被限制在 ${textOf(recipe.materialsLabel, "zh")}，同时先写下禁止动作，避免把检查任务扩大成修改任务。`,
        `第一轮判断没有直接给结论，而是盯住第一个可观察信号：${textOf(trace.snapshot.firstSignal, "zh")} 对应的证据落在 ${textOf(firstEvidence[2], "zh")}。真正需要修的是“${textOf(firstFailure[0], "zh")}”，现象是 ${textOf(firstFailure[1], "zh")}，因此只执行最小修正：${textOf(firstFailure[2], "zh")}。`,
        `交付阶段没有只看文件是否生成，而是把复测信号、交付物和人工交接放在一起判断。复测证据是 ${textOf(secondEvidence[2], "zh")}，最终交付为 ${textOf(recipe.deliverable, "zh")}；仍需人工继续判断的是：${textOf(handoff, "zh")}`
      ]
    : [
        `This task did not start by asking for a result. It first checked whether the scene was specific enough: ${textOf(trace.snapshot.trigger, "en")} The starting material was limited to ${textOf(recipe.materialsLabel, "en")}, while prohibited actions were written down before execution so a review task would not expand into an edit task.`,
        `The first pass did not jump to a conclusion. It watched the first observable signal: ${textOf(trace.snapshot.firstSignal, "en")} The matching evidence was stored in ${textOf(firstEvidence[2], "en")}. The issue to correct was "${textOf(firstFailure[0], "en")}"; the symptom was ${textOf(firstFailure[1], "en")}, so the minimal correction was ${textOf(firstFailure[2], "en")}.`,
        `Delivery was not judged by file existence alone. Retest signal, deliverable, and human handoff were reviewed together. The retest evidence was ${textOf(secondEvidence[2], "en")}; the final deliverable was ${textOf(recipe.deliverable, "en")}. The remaining human decision is: ${textOf(handoff, "en")}`
      ];
  const facts = [
    [b("起始材料", "Start Material"), recipe.materialsLabel],
    [b("第一信号", "First Signal"), trace.snapshot.firstSignal],
    [b("最小修正", "Minimal Correction"), firstFailure[2]],
    [b("交付依据", "Delivery Basis"), trace.snapshot.finalSignal]
  ];

  return `
    <div class="field-journal">
      <div class="field-journal-head">
        <span>${isZh ? "现场复盘正文" : "Field Walkthrough"}</span>
        <strong>${escapeHtml(textOf(recipe.title, lang))}</strong>
      </div>
      <div class="field-journal-copy">
        ${paragraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      </div>
      <div class="field-journal-facts">
        ${facts.map(([label, value]) => `
          <article>
            <span>${escapeHtml(textOf(label, lang))}</span>
            <strong>${escapeHtml(textOf(value, lang))}</strong>
          </article>
        `).join("")}
      </div>
    </div>`;
}

function fieldStoryPanel(recipe, lang) {
  const trace = operationTrace(recipe);
  const isZh = lang === "zh";
  const firstEvidence = recipe.evidenceTable[0];
  const secondEvidence = recipe.evidenceTable[1];
  const firstFailure = recipe.failureNotes[0];
  const storyRows = [
    [
      b("问题触发", "Trigger"),
      trace.snapshot.trigger,
      recipe.materialsLabel,
      b("先锁定材料和禁止动作。", "Lock material scope and prohibited actions first.")
    ],
    [
      b("第一信号", "First Signal"),
      trace.snapshot.firstSignal,
      firstEvidence[2],
      b("只把可观察现象写进判断。", "Use only observable signals in the decision.")
    ],
    [
      b("修正动作", "Correction"),
      firstFailure[2],
      secondEvidence[2],
      b("先做最小修正，再复测。", "Apply the smallest correction, then retest.")
    ],
    [
      b("交付判断", "Delivery Decision"),
      trace.snapshot.finalSignal,
      recipe.deliverable,
      b("留下结果、证据和人工交接。", "Leave result, evidence, and human handoff.")
    ]
  ];
  const brief = b(
    [
      `触发：${textOf(trace.snapshot.trigger, "zh")}`,
      `第一信号：${textOf(trace.snapshot.firstSignal, "zh")}`,
      `修正：${textOf(firstFailure[2], "zh")}`,
      `交付：${textOf(recipe.deliverable, "zh")}`,
      `人工确认：${textOf(operationTrace(recipe).handoff[0], "zh")}`
    ].join("\n"),
    [
      `Trigger: ${textOf(trace.snapshot.trigger, "en")}`,
      `First signal: ${textOf(trace.snapshot.firstSignal, "en")}`,
      `Correction: ${textOf(firstFailure[2], "en")}`,
      `Delivery: ${textOf(recipe.deliverable, "en")}`,
      `Human confirmation: ${textOf(operationTrace(recipe).handoff[0], "en")}`
    ].join("\n")
  );

  return `
    <section id="${lang}-field-story" class="field-story-panel">
      <div class="field-story-grid">
        <div class="field-story-copy">
          <h2>${isZh ? "现场叙事" : "Field Story"}</h2>
          ${paragraph(b(
            "先用四个现场信号读懂这次任务：为什么开始、第一处异常是什么、怎么修正、凭什么交付。",
            "Read the task through four field signals first: why it started, what the first abnormal signal was, how it was corrected, and why it was deliverable."
          ), lang)}
          ${fieldJournalBlock(recipe, lang)}
          <div class="field-story-kpis">
            <article>
              <span>${isZh ? "第一信号" : "First Signal"}</span>
              <strong>${escapeHtml(textOf(trace.snapshot.firstSignal, lang))}</strong>
            </article>
            <article>
              <span>${isZh ? "终审证据" : "Final Evidence"}</span>
              <strong>${escapeHtml(textOf(recipe.deliverable, lang))}</strong>
            </article>
          </div>
        </div>
        <figure class="story-proof-frame">
          <img src="${relativeLink(recipe.path, `${artifactBase(recipe)}/13-delivery-capture.svg`)}" alt="${escapeHtml(textOf(recipe.title, lang))}">
          <figcaption>${isZh ? "首屏证据图：结果片段、证据状态、成熟度、终审动作和交接事项放在同一张画面。" : "First-screen proof: result sample, evidence status, maturity, final review, and handoff in one frame."}</figcaption>
        </figure>
      </div>
      ${tableHtml([
        b("节点", "Moment"),
        b("现场判断", "Field Decision"),
        b("证据", "Evidence"),
        b("下一步", "Next Step")
      ], storyRows, lang, "evidence-table field-story-table")}
      ${codeSample(brief, lang, "output-sample story-brief")}
    </section>`;
}

function caseRecapNav(lang) {
  const isZh = lang === "zh";
  const items = [
    [b("现场", "Field"), "field-story", b("先看问题、第一信号和首屏证据。", "Start with the problem, first signal, and proof frame.")],
    [b("片段", "Excerpt"), "raw-scene", b("查看原始日志、表格、diff 或检查记录。", "Inspect the raw log, table, diff, or check record.")],
    [b("材料", "Inputs"), "input-materials", b("确认可读取材料和禁止动作。", "Confirm readable materials and prohibited actions.")],
    [b("证据", "Evidence"), "evidence-trail", b("判断过程证据是否足够。", "Judge whether process evidence is strong enough.")],
    [b("结果", "Result"), "delivery-preview", b("查看交付片段和修正动作。", "Review the delivery sample and correction.")],
    [b("验收", "Acceptance"), "acceptance-criteria", b("复跑命令和人工步骤。", "Rerun commands and manual checks.")]
  ];

  return `
    <nav class="case-recap-nav" aria-label="${isZh ? "案例复盘导航" : "Recipe recap navigation"}">
      <div>
        <span>${isZh ? "复盘导航" : "Recap Navigator"}</span>
        <strong>${isZh ? "按现场链路阅读" : "Read by evidence chain"}</strong>
      </div>
      <div class="recap-nav-grid">
        ${items.map(([label, id, detail]) => `
          <a data-recap-anchor href="#${lang}-${id}">
            <span>${escapeHtml(textOf(label, lang))}</span>
            <small>${escapeHtml(textOf(detail, lang))}</small>
          </a>
        `).join("")}
      </div>
    </nav>`;
}

function commandPanel(recipe, lang) {
  return `
    <div class="command-panel">
      <strong>${lang === "zh" ? "验收命令与人工步骤" : "Acceptance commands and manual steps"}</strong>
      ${recipe.commands.map((item) => `<code>${escapeHtml(textOf(item, lang))}</code>`).join("")}
    </div>`;
}

function deliveryPreview(recipe, lang) {
  const items = [
    [b("最终交付", "Final Deliverable"), recipe.deliverable],
    [b("关键证据", "Key Evidence"), recipe.evidenceTable[0][1]],
    [b("主要修正", "Main Correction"), recipe.failureNotes[0][2]],
    [b("终审动作", "Final Review"), recipe.acceptanceChecks[0]]
  ];

  return `
    <div class="delivery-preview">
      ${items.map(([label, value]) => `
        <article>
          <span>${escapeHtml(textOf(label, lang))}</span>
          <strong>${escapeHtml(textOf(value, lang))}</strong>
        </article>
      `).join("")}
    </div>`;
}

function beforeAfterPanel(recipe, lang) {
  const headers = [
    b("阶段", "Stage"),
    b("问题/状态", "Issue / State"),
    b("改进动作", "Improvement"),
    b("判定依据", "Decision Basis")
  ];
  return tableHtml(headers, beforeAfterRows(recipe), lang, "evidence-table before-after-table");
}

function qualityScorecard(recipe, lang) {
  return `
    <div class="quality-scorecard">
      <div class="score-hero">
        <span>${lang === "zh" ? "成熟度评分" : "Maturity Score"}</span>
        <strong>${caseMaturityScore(recipe)}</strong>
      </div>
      <div class="score-grid">
        ${qualityScoreRows(recipe).map((row) => `
          <article>
            <span>${escapeHtml(textOf(row[0], lang))}</span>
            <strong>${escapeHtml(textOf(row[1], lang))}</strong>
            <small>${escapeHtml(textOf(row[2], lang))}</small>
          </article>
        `).join("")}
      </div>
    </div>`;
}

function runSnapshotPanel(recipe, lang) {
  const trace = operationTrace(recipe);
  const items = [
    [b("触发场景", "Trigger"), trace.snapshot.trigger],
    [b("工具链", "Toolchain"), trace.snapshot.toolchain],
    [b("第一信号", "First Signal"), trace.snapshot.firstSignal],
    [b("完成信号", "Done Signal"), trace.snapshot.finalSignal]
  ];

  return `
    <div class="run-snapshot">
      ${items.map(([label, value]) => `
        <article>
          <span>${escapeHtml(textOf(label, lang))}</span>
          <strong>${escapeHtml(textOf(value, lang))}</strong>
        </article>
      `).join("")}
    </div>`;
}

function operationReplayTable(recipe, lang) {
  const headers = [
    b("阶段", "Stage"),
    b("命令/动作", "Command / Action"),
    b("观察输出", "Observed Output"),
    b("证据文件", "Evidence File")
  ];
  return tableHtml(headers, operationTrace(recipe).replay, lang, "evidence-table replay-table");
}

function handoffPanel(recipe, lang) {
  return `
    <div class="handoff-panel">
      ${checklist(operationTrace(recipe).handoff, lang, "case-checklist handoff-list")}
    </div>`;
}

function tutorialLabPanel(lab, lang) {
  const isZh = lang === "zh";
  return `
    <section class="tutorial-lab-panel">
      <h2>${escapeHtml(textOf(lab.title, lang))}</h2>
      ${paragraph(lab.summary, lang)}
      <div class="tutorial-lab-stats">
        ${lab.stats.map(([label, value]) => `
          <article>
            <span>${escapeHtml(textOf(label, lang))}</span>
            <strong>${escapeHtml(textOf(value, lang))}</strong>
          </article>
        `).join("")}
      </div>
      ${tableHtml([
        b("检查点", "Checkpoint"),
        b("动作", "Action"),
        b("证据", "Evidence"),
        b("完成判断", "Done Decision")
      ], lab.evidenceRows, lang, "evidence-table tutorial-evidence-table")}
      <h3>${isZh ? "可复用任务单" : "Reusable Work Order"}</h3>
      ${codeSample(lab.brief, lang, "output-sample tutorial-brief")}
    </section>`;
}

function shouldRenderDecisionWorkbench(page) {
  return decisionWorkbenchProfiles.has(page.path)
    && !page.caseIndex
    && !page.caseRecipe
    && !page.tutorialLab;
}

function decisionWorkbenchPanel(page, lang) {
  const profile = decisionWorkbenchProfiles.get(page.path);
  if (!profile) return "";
  const isZh = lang === "zh";
  const rows = [
    [
      b("输入判断", "Input Decision"),
      b("先判断本页任务是否匹配当前材料、入口和风险等级。", "First decide whether this page matches the current material, entry point, and risk level."),
      profile.material,
      b("材料不匹配时先缩小任务，不进入执行。", "If materials do not match, narrow the task before execution.")
    ],
    [
      b("过程证据", "Process Evidence"),
      b("执行前写清禁止动作，执行后留下可打开的检查材料。", "State prohibited actions before execution and keep openable check material afterward."),
      profile.evidence,
      b("另一个人能看懂判断链路。", "Another person can understand the decision chain.")
    ],
    [
      b("失败处理", "Failure Handling"),
      b("遇到停止条件时记录现场，不扩大权限、不补猜缺失信息。", "When a stop condition appears, record the state without expanding permissions or guessing missing information."),
      profile.stop,
      b("停止原因和下一步负责人明确。", "The stop reason and next owner are clear.")
    ],
    [
      b("验收动作", "Acceptance Action"),
      b("用本页给出的命令、截图、清单或人工检查证明完成。", "Prove completion with the page's commands, screenshots, checklist, or manual review."),
      profile.done,
      b("通过项、待确认项和回退方式都已记录。", "Passed items, confirmation items, and rollback path are recorded.")
    ]
  ];

  return `
    <section class="decision-workbench">
      <div class="decision-workbench-head">
        <span>${isZh ? "决策工作台" : "Decision Workbench"}</span>
        <strong>${escapeHtml(textOf(page.title, lang))}</strong>
      </div>
      ${paragraph(b(
        "这块把普通阅读页改成一次可执行判断：先看入口和材料，再记录证据、失败处理和验收动作。",
        "This panel turns a reading page into an executable decision: check entry and materials, then record evidence, failure handling, and acceptance action."
      ), lang)}
      <div class="decision-workbench-stats">
        ${[
          [b("入口", "Entry"), profile.entry],
          [b("材料", "Material"), profile.material],
          [b("证据", "Evidence"), profile.evidence],
          [b("完成信号", "Done Signal"), profile.done]
        ].map(([label, value]) => `
          <article>
            <span>${escapeHtml(textOf(label, lang))}</span>
            <strong>${escapeHtml(textOf(value, lang))}</strong>
          </article>
        `).join("")}
      </div>
      ${tableHtml([
        b("检查点", "Checkpoint"),
        b("动作", "Action"),
        b("材料/证据", "Material / Evidence"),
        b("完成判断", "Done Decision")
      ], rows, lang, "evidence-table decision-workbench-table")}
      <h3>${isZh ? "可复用判断单" : "Reusable Decision Brief"}</h3>
      ${codeSample(profile.sample, lang, "output-sample decision-brief")}
    </section>`;
}

function acceptanceLedgerPanel(recipe, lang) {
  const ledger = acceptanceLedger(recipe);
  const isZh = lang === "zh";
  const items = [
    [b("材料文件", "Artifact Files"), b(String(artifactDefinitions(recipe).length), String(artifactDefinitions(recipe).length))],
    [b("证据行", "Evidence Rows"), b(String(ledger.requiredEvidence.length), String(ledger.requiredEvidence.length))],
    [b("验收命令", "Acceptance Commands"), b(String(ledger.acceptanceCommands[lang].length), String(ledger.acceptanceCommands[lang].length))],
    [b("人工交接", "Human Handoff"), b(String(ledger.humanHandoff[lang].length), String(ledger.humanHandoff[lang].length))]
  ];
  const rows = [
    [b("第一信号", "First Signal"), ledger.fieldSignals.firstSignal],
    [b("完成信号", "Done Signal"), ledger.fieldSignals.doneSignal],
    [b("风险等级", "Risk Level"), recipe.risk],
    [b("总账文件", "Ledger File"), b("12-acceptance-ledger.json", "12-acceptance-ledger.json")]
  ];

  return `
    <div class="ledger-panel">
      <div class="ledger-stats">
        ${items.map(([label, value]) => `
          <article>
            <span>${escapeHtml(textOf(label, lang))}</span>
            <strong>${escapeHtml(textOf(value, lang))}</strong>
          </article>
        `).join("")}
      </div>
      ${tableHtml([
        b("总账项", "Ledger Item"),
        b("记录", "Record")
      ], rows, lang, "evidence-table ledger-table")}
      <a class="ledger-link" href="${relativeLink(recipe.path, `${artifactBase(recipe)}/12-acceptance-ledger.json`)}">${isZh ? "打开验收总账 JSON" : "Open acceptance ledger JSON"}</a>
    </div>`;
}

function caseLibraryHealthContent(lang) {
  const isZh = lang === "zh";
  const highRiskCount = caseRecipes.filter((recipe) => riskKey(recipe) === "high").length;
  const starterCount = caseRecipes.filter((recipe) => riskKey(recipe) === "low").length;
  const reusableCount = libraryHealthReport().cases.filter((item) => item.readyForReuse).length;
  const stats = [
    [b("可复用案例", "Reusable Cases"), b(`${reusableCount}/${caseRecipes.length}`, `${reusableCount}/${caseRecipes.length}`)],
    [b("现场图", "Field Snapshots"), b(String(caseRecipes.length), String(caseRecipes.length))],
    [b("交付截图", "Delivery Captures"), b(String(caseRecipes.length), String(caseRecipes.length))],
    [b("验收总账", "Acceptance Ledgers"), b(String(caseRecipes.length), String(caseRecipes.length))],
    [b("高风险复核", "High-Risk Review"), b(String(highRiskCount), String(highRiskCount))]
  ];
  const maturityRows = [
    [
      b("完整闭环", "Closed Loop"),
      b(`${reusableCount} 个案例`, `${reusableCount} recipes`),
      b("有输入、证据、结果、回放、现场图、交付截图、验收总账和人工交接。", "Includes input, evidence, result, replay, field snapshot, delivery capture, acceptance ledger, and human handoff."),
      b("可直接替换材料后复用。", "Ready to reuse after replacing materials.")
    ],
    [
      b("低风险上手", "Low-Risk Starter"),
      b(`${starterCount} 个案例`, `${starterCount} recipes`),
      b("适合第一次验证浏览器或页面检查类任务。", "Suitable for first browser or page-check tasks."),
      b("先跑只读检查，再进入高风险案例。", "Run read-only checks before moving to higher-risk recipes.")
    ],
    [
      b("高风险复核", "High-Risk Review"),
      b(`${highRiskCount} 个案例`, `${highRiskCount} recipes`),
      b("包含登录态、API 影响或远程服务相关判断。", "Includes signed-in state, API impact, or remote-service decisions."),
      b("必须保留人工确认和回退路径。", "Must keep human confirmation and rollback path.")
    ],
    [
      b("材料完整度", "Artifact Completeness"),
      b(`${caseRecipes.length * caseArtifactCount()} 个文件`, `${caseRecipes.length * caseArtifactCount()} files`),
      b(`每个案例 ${caseArtifactCount()} 个材料文件，全部进入总账。`, `${caseArtifactCount()} artifact files per recipe, all listed in ledgers.`),
      b("用 health report 复核整库状态。", "Use the health report to review the whole library.")
    ]
  ];
  const completionRows = [
    [b("输入能否替换", "Replaceable Input"), b("输入任务单 + 可复用任务单", "Input brief + reusable work order"), b("材料、路径、限制和禁止动作要能替换。", "Materials, paths, constraints, and prohibited actions must be replaceable.")],
    [b("过程能否复盘", "Reviewable Process"), b("执行转录 + 命令回放 + 原始现场 + 三段式证据", "Transcript + command replay + raw scene + proof sequence"), b("要能看见第一信号、修正动作和完成信号。", "First signal, correction, and done signal must be visible.")],
    [b("结果能否验收", "Acceptable Result"), b("证据表 + 交付截图 + 验收总账", "Evidence table + delivery capture + acceptance ledger"), b("要能用证据行、截图式画面、命令和人工交接判断完成。", "Completion must be judged by evidence rows, screenshot-style visual, commands, and handoff.")],
    [b("风险能否交接", "Transferable Risk"), b("风险边界 + 人工交接", "Risk boundaries + human handoff"), b("高风险动作必须有负责人继续判断。", "High-risk actions must have an owner for continued judgment.")]
  ];

  return `
    <section id="${lang}-recipe-maturity-board" class="library-health-panel">
      <h2>${isZh ? "案例成熟度看板" : "Recipe Maturity Board"}</h2>
      ${paragraph(b(
        "这一块不是介绍案例，而是检查整座案例库是否达到可复用、可复核、可交接的状态。",
        "This panel does not introduce recipes; it checks whether the whole recipe library is reusable, reviewable, and transferable."
      ), lang)}
      <div class="library-health-stats">
        ${stats.map(([label, value]) => `
          <article>
            <span>${escapeHtml(textOf(label, lang))}</span>
            <strong>${escapeHtml(textOf(value, lang))}</strong>
          </article>
        `).join("")}
      </div>
      ${tableHtml([
        b("成熟度状态", "Maturity State"),
        b("覆盖", "Coverage"),
        b("判定依据", "Decision Basis"),
        b("下一步", "Next Step")
      ], maturityRows, lang, "evidence-table maturity-board-table")}
      <h3>${isZh ? "补齐清单" : "Completion Checklist"}</h3>
      ${tableHtml([
        b("检查项", "Check"),
        b("材料", "Material"),
        b("达标要求", "Requirement")
      ], completionRows, lang, "evidence-table completion-board-table")}
      <a class="ledger-link" href="${relativeLink("recipes/index.html", `${artifactRoot}/library-health.json`)}">${isZh ? "打开案例库健康报告 JSON" : "Open library health report JSON"}</a>
    </section>`;
}

function caseContent(recipe, lang) {
  const evidenceHeaders = [
    b("检查点", "Checkpoint"),
    b("观察结果", "Observation"),
    b("证据文件", "Evidence file"),
    b("状态", "Status")
  ];
  const failureHeaders = [
    b("失败点", "Failure"),
    b("现象", "Symptom"),
    b("修正动作", "Correction")
  ];
  const runHeaders = [
    b("时间", "Time"),
    b("动作", "Action"),
    b("材料/证据", "Material / Evidence"),
    b("判断", "Decision")
  ];
  const isZh = lang === "zh";

  return `
    ${caseDashboard(recipe, lang)}
    <section id="${lang}-task-background">
      <h2>${isZh ? "任务背景" : "Task Background"}</h2>
      ${paragraph(recipe.summary, lang)}
      <div class="risk-strip">
        <span>${escapeHtml(textOf(recipe.domain, lang))}</span>
        <span>${escapeHtml(textOf(recipe.audience, lang))}</span>
        <span>${escapeHtml(textOf(recipe.risk, lang))}</span>
      </div>
    </section>
    ${caseImpactStrip(recipe, lang)}
    <section id="${lang}-raw-scene">
      <h2>${isZh ? "原始现场片段" : "Raw Scene Excerpt"}</h2>
      ${paragraph(b(
        "这一段保留任务开始时看到的最小现场材料。它不是最终结论，而是后续判断、修正和验收的起点。",
        "This excerpt keeps the smallest scene material visible at task start. It is not the final conclusion; it is the starting point for decisions, corrections, and acceptance."
      ), lang)}
      ${codeSample(b(rawSceneSnippet(recipe, "zh"), rawSceneSnippet(recipe, "en")), lang, "output-sample raw-scene")}
    </section>
    <section id="${lang}-input-materials">
      <h2>${isZh ? "输入材料" : "Input Materials"}</h2>
      ${paragraph(b("本次任务先锁定可读取材料、禁止动作和输出格式，再开始生成或检查。", "This task first locks readable materials, prohibited actions, and output format before generation or inspection."), lang)}
      ${checklist(recipe.materials, lang, "case-checklist")}
      ${codeSample(recipe.inputSample, lang)}
    </section>
    <section id="${lang}-run-environment">
      <h2>${isZh ? "运行环境" : "Run Environment"}</h2>
      ${checklist(recipe.environment, lang, "case-checklist")}
    </section>
    <section id="${lang}-run-snapshot">
      <h2>${isZh ? "实测快照" : "Run Snapshot"}</h2>
      ${paragraph(b("这一屏只放能证明任务实际跑过的现场信号：为什么开始、用了什么、第一处异常是什么、最后凭什么交付。", "This panel keeps only field signals that prove the task actually ran: why it started, what was used, the first abnormal signal, and why it was deliverable."), lang)}
      ${runSnapshotPanel(recipe, lang)}
    </section>
    ${caseArtifactSection(recipe, lang)}
    <section id="${lang}-operating-script">
      <h2>${isZh ? "操作剧本" : "Operating Script"}</h2>
      <ol class="case-timeline">
        ${recipe.playbook.map((item) => `<li>${escapeHtml(textOf(item, lang))}</li>`).join("")}
      </ol>
    </section>
    <section id="${lang}-command-replay">
      <h2>${isZh ? "命令回放" : "Command Replay"}</h2>
      ${paragraph(b("命令回放把动作、观察输出和证据文件放在同一张表里。读者可以直接判断这次任务是否有可复核链路。", "Command replay puts action, observed output, and evidence file in one table so readers can judge whether the task has a reviewable chain."), lang)}
      ${operationReplayTable(recipe, lang)}
    </section>
    <section id="${lang}-run-log">
      <h2>${isZh ? "现场记录" : "Run Log"}</h2>
      ${paragraph(b("现场记录按时间保留关键判断点，帮助读者理解这次任务为什么能交付。", "The run log preserves key decisions by time so readers can see why the task was deliverable."), lang)}
      ${tableHtml(runHeaders, runLogRows(recipe), lang, "evidence-table run-log-table")}
    </section>
    <section id="${lang}-execution-transcript">
      <h2>${isZh ? "执行转录" : "Execution Transcript"}</h2>
      ${paragraph(b("执行转录把关键命令、观察、失败点、修正动作和终审判断串成连续记录，方便复盘具体过程。", "The transcript turns key commands, observations, failure, correction, and final decision into a continuous record for process review."), lang)}
      ${codeSample(b(executionTranscript(recipe, "zh"), executionTranscript(recipe, "en")), lang, "output-sample execution-transcript")}
    </section>
    <section id="${lang}-evidence-trail">
      <h2>${isZh ? "过程证据" : "Evidence Trail"}</h2>
      ${paragraph(b("下面的表格记录本次任务如何判断完成，而不是只描述最终结果。", "The table below records how this task judged completion instead of only describing the final result."), lang)}
      ${tableHtml(evidenceHeaders, recipe.evidenceTable, lang)}
    </section>
    <section id="${lang}-delivery-preview">
      <h2>${isZh ? "交付预览" : "Delivery Preview"}</h2>
      ${paragraph(b("交付预览把结果、证据、修正和终审动作放在同一屏，便于快速判断能不能交给下一个人复核。", "The delivery preview puts result, evidence, correction, and final review on one screen so another person can quickly judge reviewability."), lang)}
      ${deliveryPreview(recipe, lang)}
    </section>
    <section id="${lang}-before-after">
      <h2>${isZh ? "前后对比" : "Before / After"}</h2>
      ${paragraph(b("前后对比把原始问题、修正动作、交付后状态和判定依据放在同一张表里，用来判断这篇案例是否真的完成了闭环。", "The before/after table puts the initial issue, correction, after state, and decision basis together to judge whether the recipe truly closed the loop."), lang)}
      ${beforeAfterPanel(recipe, lang)}
    </section>
    <section id="${lang}-quality-scorecard">
      <h2>${isZh ? "质量评分" : "Quality Scorecard"}</h2>
      ${paragraph(b("质量评分不代表绝对正确，只用来快速查看材料边界、证据强度、复测清晰度和交付成熟度是否达标。", "The scorecard is not an absolute truth; it quickly shows whether material boundary, evidence strength, retest clarity, and delivery maturity meet the bar."), lang)}
      ${qualityScorecard(recipe, lang)}
    </section>
    <section id="${lang}-acceptance-ledger">
      <h2>${isZh ? "验收总账" : "Acceptance Ledger"}</h2>
      ${paragraph(b("验收总账把这篇案例的材料数量、证据行、复跑命令、人工交接和现场信号压缩成可复核记录。", "The acceptance ledger compresses artifact count, evidence rows, rerun commands, human handoff, and field signals into a reviewable record."), lang)}
      ${acceptanceLedgerPanel(recipe, lang)}
    </section>
    <section id="${lang}-result-sample">
      <h2>${isZh ? "结果样例" : "Result Sample"}</h2>
      ${paragraph(b("结果样例保留可复核字段、文件名和待确认项，便于另一个人接手检查。", "The result sample keeps reviewable fields, filenames, and confirmation items so another person can inspect it."), lang)}
      ${codeSample(recipe.outputSample, lang)}
    </section>
    <section id="${lang}-failures-corrections">
      <h2>${isZh ? "失败与修正" : "Failures and Corrections"}</h2>
      ${tableHtml(failureHeaders, recipe.failureNotes, lang, "evidence-table failure-table")}
    </section>
    <section id="${lang}-risk-boundaries">
      <h2>${isZh ? "风险边界" : "Risk Boundaries"}</h2>
      ${checklist(recipe.riskControls, lang, "case-checklist risk-list")}
    </section>
    <section id="${lang}-human-handoff">
      <h2>${isZh ? "人工交接" : "Human Handoff"}</h2>
      ${paragraph(b("这一段明确哪些内容还需要用户或负责人判断，避免把自动整理结果误当成最终决定。", "This section states what still requires user or owner judgment, so automated organization is not mistaken for a final decision."), lang)}
      ${handoffPanel(recipe, lang)}
    </section>
    <section id="${lang}-acceptance-criteria">
      <h2>${isZh ? "验收标准" : "Acceptance Criteria"}</h2>
      ${checklist(recipe.acceptanceChecks, lang)}
      ${commandPanel(recipe, lang)}
    </section>
    <section id="${lang}-work-order">
      <h2>${isZh ? "可复用任务单" : "Reusable Work Order"}</h2>
      ${paragraph(b("把下面任务单作为起点，替换材料、路径、限制和验收方式后再执行。", "Use the work order below as a starting point, then replace materials, paths, constraints, and acceptance method before running it."), lang)}
      ${codeSample(b(recipe.taskOrder.map((item) => item.zh).join("\n"), recipe.taskOrder.map((item) => item.en).join("\n")), lang, "output-sample work-order")}
    </section>`;
}

function caseIndexContent(lang) {
  const headers = [
    b("案例", "Recipe"),
    b("成熟度", "Maturity"),
    b("材料", "Artifacts"),
    b("入口", "Entry"),
    b("证据", "Evidence"),
    b("交付物", "Deliverable"),
    b("风险", "Risk")
  ];
  const rows = caseRecipes.map((item) => [
    b(`<a href="${relativeLink("recipes/index.html", item.path)}">${item.title.zh}</a>`, `<a href="${relativeLink("recipes/index.html", item.path)}">${item.title.en}</a>`),
    b(String(caseMaturityScore(item)), String(caseMaturityScore(item))),
    b(String(caseArtifactCount()), String(caseArtifactCount())),
    item.entry,
    item.evidence,
    item.deliverable,
    item.risk
  ]);
  const isZh = lang === "zh";
  const filters = [
    ["all", b("全部", "All")],
    ["low", b("低风险", "Low")],
    ["medium", b("中风险", "Medium")],
    ["high", b("高风险", "High")]
  ];

  return `
    <section class="case-index-hero">
      <h2>${isZh ? "实测任务矩阵" : "Tool-Tested Task Matrix"}</h2>
      ${paragraph(b(
        "每个案例都按入口、材料、证据、交付物、风险和成熟度拆开。先选最接近自己任务的卡片，再进入详情页复制任务单和材料包。",
        "Each recipe is split by entry, artifacts, evidence, deliverable, risk, and maturity. Pick the card closest to your task, then open the detail page and adapt its work order and artifact pack."
      ), lang)}
      <div class="case-library-stats">
        <article><span>${isZh ? "案例数量" : "Recipes"}</span><strong>${caseRecipes.length}</strong></article>
        <article><span>${isZh ? "材料文件" : "Artifacts"}</span><strong>${caseRecipes.length * caseArtifactCount()}</strong></article>
        <article><span>${isZh ? "平均成熟度" : "Average Maturity"}</span><strong>${averageMaturityScore()}</strong></article>
        <article><span>${isZh ? "每篇材料" : "Files Per Recipe"}</span><strong>${caseArtifactCount()}</strong></article>
      </div>
      ${caseLibraryHealthContent(lang)}
      ${caseSpotlightPanel("recipes/index.html", lang)}
      <section class="case-route-section">
        <h2>${isZh ? "按任务入口选择" : "Choose by Task Entry"}</h2>
        ${paragraph(b(
          "如果你不是来顺序阅读，先按手头材料选择入口。每条路径都指向最能体现现场证据的案例。",
          "If you are not reading sequentially, start by the material in front of you. Each route points to recipes with strong field evidence."
        ), lang)}
        ${caseRouteBoard("recipes/index.html", lang)}
      </section>
      <div class="case-filter-bar" aria-label="${isZh ? "案例筛选" : "Recipe filters"}">
        ${filters.map(([value, label], index) => `<button type="button" data-case-filter="${value}"${index === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${escapeHtml(textOf(label, lang))}</button>`).join("")}
      </div>
      <div class="case-card-grid">
        ${caseRecipes.map((item) => `
          <a class="case-index-card" data-case-risk="${riskKey(item)}" href="${relativeLink("recipes/index.html", item.path)}">
            <span>${escapeHtml(textOf(item.domain, lang))}</span>
            <h3>${escapeHtml(textOf(item.title, lang))}</h3>
            <p>${escapeHtml(textOf(item.summary, lang))}</p>
            <div class="case-proof-tags">
              <em>${escapeHtml(textOf(caseImpactProfile(item).proof, lang))}</em>
            </div>
            <dl>
              <div><dt>${isZh ? "成熟度" : "Maturity"}</dt><dd>${caseMaturityScore(item)}</dd></div>
              <div><dt>${isZh ? "材料" : "Files"}</dt><dd>${caseArtifactCount()}</dd></div>
              <div><dt>${isZh ? "风险" : "Risk"}</dt><dd>${escapeHtml(riskLabel(riskKey(item), lang))}</dd></div>
            </dl>
            <small>${escapeHtml(textOf(item.deliverable, lang))}</small>
          </a>
        `).join("")}
      </div>
      ${tableHtml(headers, rows, lang, "evidence-table case-matrix")}
    </section>
    <section>
      <h2>${isZh ? "阅读顺序" : "Reading Order"}</h2>
      ${checklist([
        b("先看入口：浏览器、桌面端、本地仓库、登录态或定期检查。", "Start with entry: browser, desktop app, local repository, signed-in page, or scheduled check."),
        b("再看证据：截图、diff、表格、日志、导出文件或人工清单是否足够验收。", "Then inspect evidence: screenshots, diffs, tables, logs, exported files, or manual checklist."),
        b("最后看风险：哪些动作必须由用户确认，哪些内容只能做只读检查。", "Finally review risk: which actions require user confirmation and which content stays read-only.")
      ], lang, "case-checklist")}
    </section>`;
}

function addRecipePages() {
  addPage({
    path: "recipes/index.html",
    title: b("案例总览", "Recipe Index"),
    navTitle: b("案例总览", "Recipe Index"),
    group: b("实战案例", "Recipes"),
    summary: b("14 个案例按真实任务复盘组织，重点展示输入、证据、结果、失败修正和验收方式。", "Fourteen recipes are organized as real task retrospectives, highlighting input, evidence, result, correction, and acceptance method."),
    meta: statusMeta(b("所有希望把 Codex 接入真实工作的读者", "Readers who want to apply Codex to real work"), b("20 分钟", "20 minutes")),
    caseIndex: true,
    sections: [],
    links: [
      link("recipes/deck-export-check.html", "从演示稿案例开始", "Start with the deck recipe"),
      link("practice/index.html", "先看实践方法", "Review the operating model first")
    ]
  });

  caseRecipes.forEach((recipe, index) => {
    addPage({
      path: recipe.path,
      title: recipe.title,
      navTitle: recipe.navTitle,
      group: b("实战案例", "Recipes"),
      summary: recipe.summary,
      meta: statusMeta(recipe.audience, recipe.duration, recipe.risk),
      caseRecipe: recipe,
      sections: [],
      links: [
        index < caseRecipes.length - 1
          ? link(caseRecipes[index + 1].path, "下一个案例", "Next recipe")
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

function sitePageRecords() {
  return [
    {
      path: "index.html",
      title: b("首页", "Home"),
      group: b("基础", "Basics"),
      summary: b("面向真实工作流的专业 Codex 双语文档。", "Professional bilingual Codex documentation for real workflows.")
    },
    ...pages
  ];
}

function xmlText(value) {
  return escapeXml(String(value));
}

function writePublishingFiles() {
  const records = sitePageRecords();
  const sitemapItems = records.map((page) => {
    const priority = page.path === "index.html" ? "1.0" : page.path.startsWith("recipes/") ? "0.8" : "0.7";
    return `  <url>
    <loc>${xmlText(publicUrl(page.path))}</loc>
    <lastmod>${verifiedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("\n");

  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</urlset>
`);

  write("robots.txt", `User-agent: *
Allow: /
Sitemap: ${siteBaseUrl}/sitemap.xml
`);

  const feedItems = records.map((page) => ({
    id: publicUrl(page.path),
    url: publicUrl(page.path),
    title: `${page.title.zh} | ${page.title.en}`,
    summary: `${page.summary.zh} ${page.summary.en}`,
    content_text: `${page.group.zh} / ${page.group.en}\n${page.summary.zh}\n${page.summary.en}`,
    date_modified: `${verifiedDate}T00:00:00+08:00`
  }));

  write("feed.json", JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title: siteName,
    home_page_url: `${siteBaseUrl}/`,
    feed_url: `${siteBaseUrl}/feed.json`,
    description: "Practical bilingual Codex workflows with reviewable evidence and safety checks.",
    icon: `${siteBaseUrl}/assets/logo.svg`,
    favicon: `${siteBaseUrl}/assets/logo.svg`,
    language: "zh-CN",
    items: feedItems
  }, null, 2));

  const rssItems = feedItems.map((item) => `    <item>
      <title>${xmlText(item.title)}</title>
      <link>${xmlText(item.url)}</link>
      <guid>${xmlText(item.id)}</guid>
      <description>${xmlText(item.summary)}</description>
      <pubDate>${new Date(`${verifiedDate}T00:00:00+08:00`).toUTCString()}</pubDate>
    </item>`).join("\n");
  write("rss.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlText(siteName)}</title>
    <link>${xmlText(`${siteBaseUrl}/`)}</link>
    <description>Practical bilingual Codex workflows with reviewable evidence and safety checks.</description>
    <lastBuildDate>${new Date(`${verifiedDate}T00:00:00+08:00`).toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`);

  const atomItems = feedItems.map((item) => `  <entry>
    <title>${xmlText(item.title)}</title>
    <link href="${xmlText(item.url)}"/>
    <id>${xmlText(item.id)}</id>
    <updated>${verifiedDate}T00:00:00+08:00</updated>
    <summary>${xmlText(item.summary)}</summary>
  </entry>`).join("\n");
  write("atom.xml", `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xmlText(siteName)}</title>
  <link href="${xmlText(`${siteBaseUrl}/`)}"/>
  <link rel="self" href="${xmlText(`${siteBaseUrl}/atom.xml`)}"/>
  <id>${xmlText(`${siteBaseUrl}/`)}</id>
  <updated>${verifiedDate}T00:00:00+08:00</updated>
${atomItems}
</feed>
`);
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
        <a class="icon-link" href="${repositoryUrl}" aria-label="GitHub">GH</a>
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
        const render = /<[^>]+>/.test(text) ? keepHtml : escapeHtml;
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

function publicUrl(pagePath) {
  return pagePath === "index.html" ? `${siteBaseUrl}/` : `${siteBaseUrl}/${pagePath}`;
}

function headMeta(currentPath, title, description) {
  const pageTitle = `${title.zh} | ${title.en} | ${siteName}`;
  const descriptionText = `${description.zh} ${description.en}`;
  const canonical = publicUrl(currentPath);
  const image = `${siteBaseUrl}/assets/og.svg`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": currentPath === "index.html" ? "WebSite" : "TechArticle",
    name: currentPath === "index.html" ? siteName : `${title.zh} | ${title.en}`,
    headline: `${title.zh} | ${title.en}`,
    description: descriptionText,
    url: canonical,
    image,
    inLanguage: ["zh-CN", "en"],
    dateModified: verifiedDate,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteBaseUrl,
      logo: `${siteBaseUrl}/assets/logo.svg`
    }
  };
  const jsonLdText = JSON.stringify(jsonLd).replaceAll("<", "\\u003c");
  return `
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(descriptionText)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <link rel="icon" href="${relativeLink(currentPath, "assets/logo.svg")}" type="image/svg+xml">
    <link rel="alternate" type="application/rss+xml" title="${siteName} RSS" href="${relativeLink(currentPath, "rss.xml")}">
    <link rel="alternate" type="application/atom+xml" title="${siteName} Atom" href="${relativeLink(currentPath, "atom.xml")}">
    <link rel="alternate" type="application/feed+json" title="${siteName} JSON Feed" href="${relativeLink(currentPath, "feed.json")}">
    <meta property="og:type" content="${currentPath === "index.html" ? "website" : "article"}">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:title" content="${escapeHtml(pageTitle)}">
    <meta property="og:description" content="${escapeHtml(descriptionText)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
    <meta name="twitter:description" content="${escapeHtml(descriptionText)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <meta name="theme-color" content="#141414">
    <script type="application/ld+json">${jsonLdText}</script>`;
}

function layout({ currentPath, title, description, body, home = false }) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${headMeta(currentPath, title, description)}
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
    [b("44 个双语页面", "44 bilingual pages"), b("首页、教程、配置、案例和资源页全部生成双语内容。", "Home, guide, configuration, recipe, and resource pages all generate bilingual content.")],
    [b("17 节系统教程", "17 guide chapters"), b("覆盖桌面端、CLI、IDE、项目规则、沙盒、云端任务和排障。", "Covers desktop, CLI, IDE, project rules, sandbox, cloud tasks, and troubleshooting.")],
    [b("14 个工具实测案例", "14 tool-tested recipes"), b("覆盖演示稿、浏览器检查、部署排障、知识库、表格、日志诊断和服务健康检查。", "Covers decks, browser review, deployment diagnosis, knowledge bases, spreadsheets, log troubleshooting, and service health checks.")],
    [b("自动质量检查", "Automated quality checks"), b("验证链接、双语覆盖、验收标准和禁用关键词。", "Validates links, bilingual coverage, acceptance criteria, and forbidden terms.")]
  ];
  const proofRows = [
    [b("材料包", "Artifact pack"), b(`14 组 / ${caseRecipes.length * caseArtifactCount()} 个文件`, `14 sets / ${caseRecipes.length * caseArtifactCount()} files`), b("每个案例生成输入任务单、证据 CSV、结果片段、验收 runbook、执行转录、交付预览、前后对比、质量评分、操作回放、人工交接、现场图、验收总账、交付截图、原始现场片段、现场捕获、触发现场、修正现场、终审现场、关键交互片段、交互截图和证据看板。", "Every recipe generates an input brief, evidence CSV, result sample, acceptance runbook, execution transcript, delivery preview, before/after file, quality scorecard, operation replay, human handoff, field snapshot, acceptance ledger, delivery capture, raw scene excerpt, run proof capture, trigger capture, correction capture, final review capture, key interaction excerpt, interaction capture, and evidence board.")],
    [b("现场记录", "Run log"), b("4 个节点", "4 checkpoints"), b("按时间记录范围锁定、环境核对、证据采集和终审判断。", "Records scope lock, environment check, evidence capture, and final review by time.")],
    [b("验收方式", "Acceptance"), b("命令 + 人工", "Commands + manual"), b("每篇都保留可复跑命令、人工检查步骤、失败修正和风险边界。", "Each page keeps rerunnable commands, manual checks, corrections, and risk boundaries.")]
  ];
  const heroStats = [
    [b("案例材料", "Artifacts"), b(String(caseRecipes.length * caseArtifactCount()), String(caseRecipes.length * caseArtifactCount())), b("14 个案例材料包", "14 recipe packs")],
    [b("成熟度", "Maturity"), b(String(averageMaturityScore()), String(averageMaturityScore())), b("案例库平均分", "Library average")],
    [b("交付截图", "Captures"), b(String(caseRecipes.length), String(caseRecipes.length)), b("每篇一张证据画面", "One evidence frame each")],
    [b("页面", "Pages"), b(String(expectedPageCount), String(expectedPageCount)), b("双语静态页面", "Bilingual static pages")]
  ];
  const heroLinks = [
    [b("第一次跑通", "First Run"), "guide/05-first-task.html", b("按低风险材料完成一轮说明、执行和验收。", "Complete one low-risk brief, execution, and acceptance loop.")],
    [b("实测任务矩阵", "Task Matrix"), "recipes/index.html", b("按入口、风险、证据和成熟度选择案例。", "Choose recipes by entry, risk, evidence, and maturity.")],
    [b("权限判断", "Permission Review"), "guide/07-permission-review.html", b("先判断文件、命令、网络和账号动作。", "Judge file, command, network, and account actions first.")]
  ];

  const homeOpsPanel = (lang) => `
    <div class="home-ops-panel" aria-label="${lang === "zh" ? "案例库状态面板" : "Recipe library status panel"}">
      <div class="ops-panel-head">
        <span>${lang === "zh" ? "实战库状态" : "Recipe Library"}</span>
        <strong>${lang === "zh" ? "可复核交付" : "Reviewable Delivery"}</strong>
      </div>
      <div class="ops-stats">
        ${heroStats.map(([label, value, detail]) => `
          <article>
            <span>${escapeHtml(textOf(label, lang))}</span>
            <strong>${escapeHtml(textOf(value, lang))}</strong>
            <small>${escapeHtml(textOf(detail, lang))}</small>
          </article>
        `).join("")}
      </div>
      <figure class="ops-capture">
        <img src="assets/case-artifacts/pages-deploy-diagnosis/13-delivery-capture.svg" alt="${lang === "zh" ? "部署诊断交付截图" : "Deployment diagnosis delivery capture"}">
        <img src="assets/case-artifacts/pages-deploy-diagnosis/20-interaction-capture.svg" alt="${lang === "zh" ? "部署诊断交互截图" : "Deployment diagnosis interaction capture"}">
      </figure>
      <div class="ops-links">
        ${heroLinks.map(([label, href, detail]) => `
          <a href="${href}">
            <span>${escapeHtml(textOf(label, lang))}</span>
            <small>${escapeHtml(textOf(detail, lang))}</small>
          </a>
        `).join("")}
      </div>
    </div>`;

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
      ${caseRecipes.slice(0, 4).map((item) => `
        <a class="plain-card" href="${item.path}">
          <small>${escapeHtml(textOf(item.domain, lang))}</small>
          <h3>${escapeHtml(textOf(item.title, lang))}</h3>
          <p>${escapeHtml(textOf(item.summary, lang))}</p>
        </a>
      `).join("")}
    </div>`;

  const proofSection = (lang) => {
    const isZh = lang === "zh";
    return `
      <section class="home-section proof-section">
        <header class="section-title">
          <h2>${isZh ? "像真实工作台一样交付" : "Delivered Like a Real Workbench"}</h2>
          ${paragraph(b(
            "案例页不只告诉你应该怎么做，还把可打开的演示文件、证据表、结果片段和复跑步骤一并交付。读者可以先审材料，再迁移到自己的任务。",
            "Recipe pages do more than explain what to do: they deliver openable demo files, evidence tables, result samples, and rerun steps. Readers can inspect the material before adapting it."
          ), lang)}
        </header>
        <div class="proof-board">
          ${proofRows.map(([label, value, detail]) => `
            <article>
              <span>${escapeHtml(textOf(label, lang))}</span>
              <strong>${escapeHtml(textOf(value, lang))}</strong>
              <p>${escapeHtml(textOf(detail, lang))}</p>
            </article>
          `).join("")}
        </div>
      </section>`;
  };

  const homeLanguageSection = (lang) => {
    const isZh = lang === "zh";
    return `
      <section class="language-section home-language-section${isZh ? "" : " english-section"}" lang="${isZh ? "zh-CN" : "en"}" data-language-section="${lang}">
        <p class="language-kicker">${isZh ? "中文" : "English"}</p>
        <section class="hero">
          ${homeOpsPanel(lang)}
          <div class="hero-copy">
            <h1>Codex Everyday Guide</h1>
            ${paragraph(b(
              "面向普通用户、创作者、个人开发者与小团队的 Codex 实战知识站。本站用深色产品界面组织教程、配置、工具实测案例和安全验收。",
              "A practical Codex knowledge site for everyday users, creators, individual developers, and small teams. The site uses a dark product interface for guides, configuration, tool-tested recipes, and safety acceptance."
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
              "每篇页面都以任务仪表盘的方式呈现：目标、入口、材料、过程、证据、风险和验收。读者能直接照着流程完成一次可复查的工作。",
              "Every page is presented like a task dashboard: goal, entry, materials, process, evidence, risk, and acceptance. Readers can follow the flow to complete reviewable work."
            ), lang)}
          </header>
          ${cardGrid(metrics, lang)}
        </section>

        ${proofSection(lang)}

        ${caseSpotlightPanel("index.html", lang, { limit: 3 })}

        <section class="home-section">
          <header class="section-title">
            <h2>${isZh ? "按手头任务直接进入" : "Jump in by the Task at Hand"}</h2>
            ${paragraph(b(
              "不是所有读者都需要从第一章开始。先判断你手上是失败截图、网页、资料文件还是发布任务，再进入对应案例。",
              "Not every reader should start from chapter one. Decide whether you have a failure screenshot, web page, file set, or shipping task, then open the matching recipes."
            ), lang)}
          </header>
          ${caseRouteBoard("index.html", lang)}
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
              "案例库不再是提示词清单，而是工具实测复盘。每篇都写清楚环境、步骤、证据、结果、踩坑和可复用任务单。",
              "The recipe library is no longer a prompt list; it is a set of tool-tested retrospectives. Each recipe documents environment, steps, evidence, results, pitfalls, and a reusable work order."
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
  const pageMeta = metaGrid(page.meta || statusMeta(b("所有读者", "All readers"), b("20 分钟", "20 minutes")), lang);
  const introAfterSummary = page.caseRecipe
    ? `${fieldStoryPanel(page.caseRecipe, lang)}
        ${caseRecapNav(lang)}
        ${pageMeta}`
    : pageMeta;
    return `
      <section class="language-section${isZh ? "" : " english-section"}" lang="${isZh ? "zh-CN" : "en"}" data-language-section="${lang}">
        <p class="language-kicker">${isZh ? "中文" : "English"}</p>
        <p class="eyebrow">${escapeHtml(textOf(page.group, lang))}</p>
        <h1>${escapeHtml(textOf(page.title, lang))}</h1>
        ${paragraph(page.summary, lang)}
        ${introAfterSummary}
        ${page.image ? `<img class="doc-hero-image" src="${relativeLink(currentPath, `assets/${page.image}`)}" alt="${escapeHtml(textOf(page.title, lang))}">` : ""}${shouldRenderDecisionWorkbench(page) ? decisionWorkbenchPanel(page, lang) : ""}
        ${page.caseIndex ? caseIndexContent(lang) : ""}
        ${page.caseRecipe ? caseContent(page.caseRecipe, lang) : ""}
        ${page.tutorialLab ? tutorialLabPanel(page.tutorialLab, lang) : ""}${page.sections.map((item) => `
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
  <rect x="8" y="8" width="80" height="80" rx="10" fill="#1e1e1e" stroke="#333"/>
  <path d="M26 29h28" stroke="#ff922c" stroke-width="7" stroke-linecap="round"/>
  <path d="M26 48h22" stroke="#e0e0e0" stroke-width="7" stroke-linecap="round"/>
  <path d="M26 67h32" stroke="#888" stroke-width="7" stroke-linecap="round"/>
  <path d="M60 38l13 10-13 10" fill="none" stroke="#ff922c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

  write("assets/og.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">Codex Everyday Guide social preview</title>
  <desc id="desc">Dark product-style preview for the Codex Everyday Guide documentation site.</desc>
  <rect width="1200" height="630" fill="#141414"/>
  <rect x="54" y="54" width="1092" height="522" rx="18" fill="#1e1e1e" stroke="#333"/>
  <rect x="86" y="86" width="486" height="342" rx="14" fill="#101010" stroke="#333"/>
  <rect x="112" y="116" width="434" height="46" rx="8" fill="#191919" stroke="#333"/>
  <circle cx="136" cy="139" r="6" fill="#ff6b6b"/>
  <circle cx="158" cy="139" r="6" fill="#f5c542"/>
  <circle cx="180" cy="139" r="6" fill="#66d17a"/>
  <text x="208" y="145" fill="#888" font-family="Menlo, Consolas, monospace" font-size="15">reviewable-task-run</text>
  <text x="112" y="212" fill="#ff922c" font-family="Arial" font-size="18" font-weight="900">FIELD EVIDENCE</text>
  <text x="112" y="256" fill="#e0e0e0" font-family="Arial" font-size="34" font-weight="900">294 artifact files</text>
  <text x="112" y="304" fill="#e0e0e0" font-family="Arial" font-size="34" font-weight="900">14 tool-tested recipes</text>
  <text x="112" y="350" fill="#888" font-family="Arial" font-size="20">Chinese first. English second. Evidence-driven.</text>
  <rect x="112" y="382" width="180" height="44" rx="8" fill="#ff922c"/>
  <text x="138" y="411" fill="#000" font-family="Arial" font-size="20" font-weight="900">Task Matrix</text>
  <text x="630" y="166" fill="#ff922c" font-family="Arial" font-size="20" font-weight="900">CODEX EVERYDAY GUIDE</text>
  <text x="630" y="244" fill="#e0e0e0" font-family="Arial" font-size="66" font-weight="900">Practical Codex</text>
  <text x="630" y="322" fill="#e0e0e0" font-family="Arial" font-size="66" font-weight="900">Workflows</text>
  <text x="630" y="378" fill="#888" font-family="Arial" font-size="24">Tutorials, configuration, cases, safety checks, and reproducible acceptance evidence.</text>
  <g font-family="Arial" font-weight="900">
    <rect x="630" y="432" width="132" height="58" rx="10" fill="#242424" stroke="#333"/>
    <text x="656" y="468" fill="#ff922c" font-size="24">44</text>
    <text x="700" y="468" fill="#888" font-size="16">pages</text>
    <rect x="784" y="432" width="158" height="58" rx="10" fill="#242424" stroke="#333"/>
    <text x="810" y="468" fill="#ff922c" font-size="24">294</text>
    <text x="868" y="468" fill="#888" font-size="16">files</text>
    <rect x="964" y="432" width="130" height="58" rx="10" fill="#242424" stroke="#333"/>
    <text x="990" y="468" fill="#ff922c" font-size="24">94</text>
    <text x="1034" y="468" fill="#888" font-size="16">score</text>
  </g>
</svg>`);

  write("assets/hero-workspace.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 520" preserveAspectRatio="none">
  <rect width="1440" height="520" fill="#141414"/>
  <g fill="#1e1e1e" stroke="#333" stroke-width="2">
    <rect x="92" y="82" width="300" height="170" rx="8"/>
    <rect x="1038" y="70" width="310" height="176" rx="8"/>
    <rect x="898" y="326" width="260" height="126" rx="8"/>
  </g>
  <g fill="none" stroke="#666" stroke-width="3" opacity=".65">
    <path d="M126 130h180M126 168h230M126 206h140"/>
    <path d="M1076 124h214M1076 162h160M1076 200h204"/>
    <path d="M936 374h170M936 408h120"/>
  </g>
  <path d="M420 252h600" stroke="#333" stroke-width="2"/>
  <path d="M680 252h84" stroke="#ff922c" stroke-width="5"/>
</svg>`);

  write("assets/entry-map.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex entry point map</title>
  <desc id="desc">CLI, Cloud, IDE, Desktop App, ChatGPT, and integrations.</desc>
  <rect width="900" height="430" rx="8" fill="#141414"/>
  <rect x="38" y="38" width="824" height="354" rx="8" fill="#1e1e1e" stroke="#333"/>
  <text x="70" y="82" fill="#e0e0e0" font-size="28" font-weight="700" font-family="Arial">入口地图</text>
  <text x="70" y="112" fill="#888" font-size="18" font-family="Arial">Entry Point Map</text>
  <text x="70" y="142" fill="#888" font-size="15" font-family="Arial">按材料位置、风险等级和验收方式选择入口。</text>
  <text x="70" y="164" fill="#888" font-size="15" font-family="Arial">Choose by material, risk, and acceptance evidence.</text>
  <g font-family="Arial" font-weight="700">
    <rect x="70" y="190" width="160" height="92" rx="8" fill="#242424" stroke="#ff922c"/>
    <text x="92" y="225" fill="#e0e0e0" font-size="23">CLI</text>
    <text x="92" y="254" fill="#888" font-size="14">Local iteration</text>
    <rect x="260" y="190" width="170" height="92" rx="8" fill="#242424" stroke="#333"/>
    <text x="282" y="225" fill="#e0e0e0" font-size="23">Cloud</text>
    <text x="282" y="254" fill="#888" font-size="14">Long-running tasks</text>
    <rect x="462" y="190" width="170" height="92" rx="8" fill="#242424" stroke="#333"/>
    <text x="484" y="225" fill="#e0e0e0" font-size="23">IDE</text>
    <text x="484" y="254" fill="#888" font-size="14">Editor context</text>
    <rect x="664" y="190" width="166" height="92" rx="8" fill="#242424" stroke="#333"/>
    <text x="686" y="225" fill="#e0e0e0" font-size="23">Desktop App</text>
    <text x="686" y="254" fill="#888" font-size="14">Local workbench</text>
    <rect x="172" y="290" width="250" height="58" rx="8" fill="#191919" stroke="#333"/>
    <text x="204" y="325" fill="#e0e0e0" font-size="18">ChatGPT Codex</text>
    <rect x="478" y="290" width="250" height="58" rx="8" fill="#191919" stroke="#333"/>
    <text x="520" y="325" fill="#e0e0e0" font-size="18">Integrations</text>
  </g>
</svg>`);

  write("assets/task-loop.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex task loop</title>
  <desc id="desc">Brief, discovery, execution, verification, and retrospective.</desc>
  <rect width="900" height="430" rx="8" fill="#141414"/>
  <text x="70" y="66" fill="#e0e0e0" font-size="32" font-weight="800" font-family="Arial">任务闭环</text>
  <text x="70" y="98" fill="#888" font-size="20" font-family="Arial">Task Loop</text>
  <text x="72" y="128" fill="#888" font-size="16" font-family="Arial">说明、探索、实施、验证、复盘。</text>
  <text x="72" y="151" fill="#888" font-size="16" font-family="Arial">Brief, discover, execute, verify, retrospect.</text>
  <path d="M250 262C315 145 470 128 568 206" fill="none" stroke="#333" stroke-width="6"/>
  <path d="M604 239c42 90-33 168-160 166-108-2-202-55-224-124" fill="none" stroke="#333" stroke-width="6"/>
  <g font-family="Arial" text-anchor="middle">
    <rect x="121" y="188" width="148" height="112" rx="8" fill="#1e1e1e" stroke="#ff922c" stroke-width="3"/>
    <text x="195" y="240" fill="#e0e0e0" font-size="24" font-weight="800">说明</text>
    <text x="195" y="270" fill="#888" font-size="16">Brief</text>
    <rect x="348" y="120" width="144" height="110" rx="8" fill="#1e1e1e" stroke="#333" stroke-width="3"/>
    <text x="420" y="170" fill="#e0e0e0" font-size="24" font-weight="800">探索</text>
    <text x="420" y="200" fill="#888" font-size="16">Discover</text>
    <rect x="546" y="164" width="144" height="110" rx="8" fill="#1e1e1e" stroke="#333" stroke-width="3"/>
    <text x="618" y="214" fill="#e0e0e0" font-size="24" font-weight="800">实施</text>
    <text x="618" y="244" fill="#888" font-size="16">Execute</text>
    <rect x="622" y="286" width="136" height="100" rx="8" fill="#1e1e1e" stroke="#ff922c" stroke-width="3"/>
    <text x="690" y="330" fill="#e0e0e0" font-size="23" font-weight="800">验证</text>
    <text x="690" y="358" fill="#888" font-size="16">Verify</text>
    <rect x="382" y="292" width="136" height="100" rx="8" fill="#1e1e1e" stroke="#333" stroke-width="3"/>
    <text x="450" y="336" fill="#e0e0e0" font-size="23" font-weight="800">复盘</text>
    <text x="450" y="364" fill="#888" font-size="16">Retro</text>
  </g>
</svg>`);

  write("assets/safety-layers.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 430" role="img" aria-labelledby="title desc">
  <title id="title">Codex safety layers</title>
  <desc id="desc">Task brief, project rules, sandbox approvals, and verification review.</desc>
  <rect width="760" height="430" rx="8" fill="#141414"/>
  <text x="54" y="62" fill="#e0e0e0" font-size="28" font-weight="800" font-family="Arial">安全边界</text>
  <text x="54" y="92" fill="#888" font-size="19" font-family="Arial">Safety Layers</text>
  <text x="54" y="121" fill="#888" font-size="16" font-family="Arial">用项目规则、运行环境和人工验证共同约束风险。</text>
  <g font-family="Arial" font-weight="700">
    <rect x="72" y="150" width="616" height="54" rx="8" fill="#1e1e1e" stroke="#ff922c"/>
    <text x="104" y="178" fill="#e0e0e0" font-size="18">1. 任务说明</text>
    <text x="104" y="195" fill="#888" font-size="14">Task brief</text>
    <rect x="98" y="224" width="564" height="54" rx="8" fill="#1e1e1e" stroke="#333"/>
    <text x="132" y="252" fill="#e0e0e0" font-size="18">2. AGENTS.md</text>
    <text x="132" y="269" fill="#888" font-size="14">Commands, style, rules</text>
    <rect x="126" y="298" width="508" height="54" rx="8" fill="#1e1e1e" stroke="#333"/>
    <text x="158" y="326" fill="#e0e0e0" font-size="18">3. 审批</text>
    <text x="158" y="343" fill="#888" font-size="14">Approvals</text>
    <rect x="154" y="362" width="452" height="44" rx="8" fill="#1e1e1e" stroke="#333"/>
    <text x="186" y="384" fill="#e0e0e0" font-size="17">4. 验证</text>
    <text x="186" y="400" fill="#888" font-size="13">Verification</text>
  </g>
</svg>`);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function compactSvgText(value, max = 46) {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function caseEvidenceSvg(recipe) {
  const rows = [
    ["INPUT", "输入材料", textOf(recipe.materialsLabel, "zh")],
    ["EVIDENCE", "过程证据", textOf(recipe.evidence, "zh")],
    ["RESULT", "结果样例", textOf(recipe.deliverable, "zh")],
    ["SCORE", "质量评分", `${caseMaturityScore(recipe)} / 100`]
  ];
  const rowSvg = rows.map(([tag, label, value], index) => {
    const y = 188 + index * 68;
    return `
      <g>
        <rect x="58" y="${y}" width="804" height="52" rx="8" fill="${index % 2 === 0 ? "#1e1e1e" : "#242424"}" stroke="#333"/>
        <text x="82" y="${y + 22}" fill="#ff922c" font-family="Arial" font-size="13" font-weight="800">${tag}</text>
        <text x="82" y="${y + 42}" fill="#e0e0e0" font-family="Arial" font-size="18" font-weight="800">${escapeXml(label)}</text>
        <text x="260" y="${y + 32}" fill="#888" font-family="Arial" font-size="17">${escapeXml(compactSvgText(value, 58))}</text>
      </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 520" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(textOf(recipe.title, "zh"))}</title>
  <desc id="desc">Evidence board for one practical Codex task.</desc>
  <rect width="920" height="520" rx="8" fill="#141414"/>
  <rect x="34" y="34" width="852" height="452" rx="10" fill="#191919" stroke="#333"/>
  <text x="58" y="82" fill="#ff922c" font-family="Arial" font-size="15" font-weight="800">CASE EVIDENCE BOARD</text>
  <text x="58" y="122" fill="#e0e0e0" font-family="Arial" font-size="30" font-weight="900">${escapeXml(compactSvgText(textOf(recipe.title, "zh"), 34))}</text>
  <text x="58" y="154" fill="#888" font-family="Arial" font-size="17">${escapeXml(compactSvgText(textOf(recipe.summary, "zh"), 74))}</text>
  <rect x="702" y="70" width="160" height="58" rx="8" fill="#242424" stroke="#ff922c"/>
  <text x="724" y="94" fill="#888" font-family="Arial" font-size="13" font-weight="800">RISK</text>
  <text x="724" y="118" fill="#e0e0e0" font-family="Arial" font-size="20" font-weight="900">${escapeXml(textOf(recipe.risk, "zh"))}</text>
  ${rowSvg}
  <text x="58" y="466" fill="#666" font-family="Arial" font-size="14">Open the brief, CSV, result sample, runbook, transcript, preview, comparison, and scorecard before adapting.</text>
</svg>`;
}

function caseFieldSnapshotSvg(recipe) {
  const trace = operationTrace(recipe);
  const replay = trace.replay;
  const terminalRows = replay.map((row, index) => {
    const y = 204 + index * 64;
    return `
      <g>
        <text x="72" y="${y}" fill="#66d17a" font-family="Menlo, Consolas, monospace" font-size="15">$ ${escapeXml(compactSvgText(textOf(row[1], "zh"), 58))}</text>
        <text x="72" y="${y + 25}" fill="#b8b8b8" font-family="Menlo, Consolas, monospace" font-size="14">${escapeXml(compactSvgText(textOf(row[2], "zh"), 64))}</text>
      </g>`;
  }).join("");
  const handoffRows = trace.handoff.slice(0, 3).map((item, index) => {
    const y = 250 + index * 58;
    return `
      <g>
        <rect x="592" y="${y - 28}" width="252" height="42" rx="7" fill="${index === 0 ? "#2c241d" : "#202020"}" stroke="#333"/>
        <text x="610" y="${y - 3}" fill="#e0e0e0" font-family="Arial" font-size="14" font-weight="700">${escapeXml(compactSvgText(textOf(item, "zh"), 24))}</text>
      </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 520" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(textOf(recipe.title, "zh"))} - 现场图</title>
  <desc id="desc">A terminal-style field snapshot for a practical Codex task.</desc>
  <rect width="920" height="520" rx="8" fill="#141414"/>
  <rect x="34" y="34" width="852" height="452" rx="10" fill="#191919" stroke="#333"/>
  <text x="58" y="78" fill="#ff922c" font-family="Arial" font-size="15" font-weight="900">FIELD SNAPSHOT</text>
  <text x="58" y="115" fill="#e0e0e0" font-family="Arial" font-size="27" font-weight="900">${escapeXml(compactSvgText(textOf(recipe.title, "zh"), 34))}</text>
  <text x="58" y="146" fill="#888" font-family="Arial" font-size="15">${escapeXml(compactSvgText(textOf(trace.snapshot.trigger, "zh"), 76))}</text>

  <rect x="58" y="172" width="484" height="250" rx="9" fill="#101510" stroke="#2b5d35"/>
  <circle cx="82" cy="191" r="5" fill="#ff6b6b"/>
  <circle cx="102" cy="191" r="5" fill="#f5c542"/>
  <circle cx="122" cy="191" r="5" fill="#66d17a"/>
  ${terminalRows}

  <rect x="572" y="172" width="292" height="250" rx="9" fill="#1e1e1e" stroke="#333"/>
  <text x="592" y="205" fill="#ff922c" font-family="Arial" font-size="13" font-weight="900">HANDOFF</text>
  ${handoffRows}

  <rect x="58" y="438" width="806" height="28" rx="6" fill="#242424" stroke="#333"/>
  <text x="76" y="457" fill="#888" font-family="Arial" font-size="13">done: ${escapeXml(compactSvgText(textOf(trace.snapshot.finalSignal, "zh"), 88))}</text>
</svg>`;
}

function caseDeliveryCaptureSvg(recipe) {
  const outputLines = textOf(recipe.outputSample, "zh")
    .split("\n")
    .map((line) => line.replace(/^[-\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
  const outputRows = outputLines.map((line, index) => {
    const y = 250 + index * 44;
    return `
      <g>
        <rect x="74" y="${y - 24}" width="478" height="34" rx="7" fill="${index % 2 === 0 ? "#202020" : "#242424"}" stroke="#333"/>
        <circle cx="96" cy="${y - 7}" r="5" fill="#66d17a"/>
        <text x="116" y="${y - 2}" fill="#e0e0e0" font-family="Arial" font-size="14" font-weight="700">${escapeXml(compactSvgText(line, 54))}</text>
      </g>`;
  }).join("");
  const evidenceRows = recipe.evidenceTable.slice(0, 4).map((row, index) => {
    const y = 250 + index * 44;
    const status = textOf(row[3], "zh");
    const statusColor = status.includes("待") ? "#f5c542" : "#66d17a";
    return `
      <g>
        <rect x="592" y="${y - 24}" width="254" height="34" rx="7" fill="${index % 2 === 0 ? "#1f1f1f" : "#242424"}" stroke="#333"/>
        <text x="610" y="${y - 2}" fill="#e0e0e0" font-family="Arial" font-size="13" font-weight="800">${escapeXml(compactSvgText(textOf(row[0], "zh"), 18))}</text>
        <circle cx="816" cy="${y - 8}" r="6" fill="${statusColor}"/>
      </g>`;
  }).join("");
  const handoff = operationTrace(recipe).handoff[0];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 560" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(textOf(recipe.title, "zh"))} - 交付截图</title>
  <desc id="desc">A screenshot-style delivery capture for a practical Codex task.</desc>
  <rect width="920" height="560" rx="8" fill="#141414"/>
  <rect x="34" y="34" width="852" height="492" rx="10" fill="#191919" stroke="#333"/>
  <rect x="58" y="58" width="804" height="54" rx="8" fill="#101010" stroke="#333"/>
  <circle cx="84" cy="85" r="6" fill="#ff6b6b"/>
  <circle cx="106" cy="85" r="6" fill="#f5c542"/>
  <circle cx="128" cy="85" r="6" fill="#66d17a"/>
  <text x="160" y="90" fill="#888" font-family="Menlo, Consolas, monospace" font-size="13">${escapeXml(artifactSlug(recipe))}/delivery-review</text>

  <text x="58" y="150" fill="#ff922c" font-family="Arial" font-size="15" font-weight="900">DELIVERY CAPTURE</text>
  <text x="58" y="184" fill="#e0e0e0" font-family="Arial" font-size="27" font-weight="900">${escapeXml(compactSvgText(textOf(recipe.title, "zh"), 34))}</text>
  <rect x="694" y="132" width="168" height="54" rx="8" fill="#242424" stroke="#ff922c"/>
  <text x="716" y="154" fill="#888" font-family="Arial" font-size="12" font-weight="900">MATURITY</text>
  <text x="716" y="178" fill="#ff922c" font-family="Arial" font-size="24" font-weight="900">${caseMaturityScore(recipe)} / 100</text>

  <text x="74" y="218" fill="#888" font-family="Arial" font-size="12" font-weight="900">OUTPUT</text>
  <text x="592" y="218" fill="#888" font-family="Arial" font-size="12" font-weight="900">EVIDENCE STATUS</text>
  ${outputRows}
  ${evidenceRows}

  <rect x="74" y="402" width="356" height="70" rx="8" fill="#2c241d" stroke="#ff922c"/>
  <text x="96" y="430" fill="#ff922c" font-family="Arial" font-size="12" font-weight="900">FINAL REVIEW</text>
  <text x="96" y="456" fill="#e0e0e0" font-family="Arial" font-size="15" font-weight="800">${escapeXml(compactSvgText(textOf(recipe.acceptanceChecks[0], "zh"), 24))}</text>

  <rect x="450" y="402" width="396" height="70" rx="8" fill="#202020" stroke="#333"/>
  <text x="472" y="430" fill="#888" font-family="Arial" font-size="12" font-weight="900">HANDOFF</text>
  <text x="472" y="456" fill="#e0e0e0" font-family="Arial" font-size="15" font-weight="800">${escapeXml(compactSvgText(textOf(handoff, "zh"), 34))}</text>

  <text x="74" y="506" fill="#666" font-family="Arial" font-size="13">The delivery capture is a visual handoff: result, evidence status, final review, and owner action in one frame.</text>
</svg>`;
}

function interactionCaptureSvg(recipe) {
  const trace = operationTrace(recipe);
  const firstEvidence = recipe.evidenceTable[0];
  const secondEvidence = recipe.evidenceTable[1];
  const firstFailure = recipe.failureNotes[0];
  const handoff = trace.handoff[0] ?? recipe.acceptanceChecks[0];
  const bubbles = [
    {
      role: "USER",
      label: "任务交代",
      tone: "#ff922c",
      x: 66,
      y: 198,
      w: 534,
      text: textOf(recipe.inputSample, "zh").split("\n").filter(Boolean)[0] ?? textOf(trace.snapshot.trigger, "zh"),
      meta: textOf(recipe.materialsLabel, "zh")
    },
    {
      role: "CODEX",
      label: "过程回报",
      tone: "#66d17a",
      x: 214,
      y: 300,
      w: 640,
      text: `先看 ${textOf(recipe.commands[0], "zh")}；第一信号：${textOf(trace.snapshot.firstSignal, "zh")}`,
      meta: `证据：${textOf(firstEvidence[2], "zh")}`
    },
    {
      role: "CODEX",
      label: "修正回报",
      tone: "#f1c86b",
      x: 214,
      y: 402,
      w: 640,
      text: `修正：${textOf(firstFailure[2], "zh")}；复测：${textOf(recipe.commands[1], "zh")}`,
      meta: `复测证据：${textOf(secondEvidence[2], "zh")}`
    },
    {
      role: "HUMAN",
      label: "人工确认",
      tone: "#b590ff",
      x: 66,
      y: 504,
      w: 602,
      text: textOf(handoff, "zh"),
      meta: textOf(recipe.deliverable, "zh")
    }
  ];
  const bubbleRows = bubbles.map((bubble) => `
    <g>
      <rect x="${bubble.x}" y="${bubble.y - 48}" width="${bubble.w}" height="80" rx="12" fill="#202020" stroke="${bubble.tone}"/>
      <text x="${bubble.x + 22}" y="${bubble.y - 22}" fill="${bubble.tone}" font-family="Arial" font-size="12" font-weight="900">${bubble.role} / ${escapeXml(bubble.label)}</text>
      <text x="${bubble.x + 22}" y="${bubble.y + 2}" fill="#e0e0e0" font-family="Arial" font-size="15" font-weight="800">${escapeXml(compactSvgText(bubble.text, bubble.w > 600 ? 78 : 60))}</text>
      <text x="${bubble.x + 22}" y="${bubble.y + 24}" fill="#888" font-family="Arial" font-size="12">${escapeXml(compactSvgText(bubble.meta, bubble.w > 600 ? 86 : 64))}</text>
    </g>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 640" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(textOf(recipe.title, "zh"))} - 交互截图</title>
  <desc id="desc">Screenshot-style task interaction capture with handoff, process report, correction report, and human confirmation.</desc>
  <rect width="920" height="640" rx="8" fill="#141414"/>
  <rect x="34" y="34" width="852" height="572" rx="10" fill="#191919" stroke="#333"/>
  <rect x="58" y="58" width="804" height="54" rx="8" fill="#101010" stroke="#333"/>
  <circle cx="84" cy="85" r="6" fill="#ff6b6b"/>
  <circle cx="106" cy="85" r="6" fill="#f5c542"/>
  <circle cx="128" cy="85" r="6" fill="#66d17a"/>
  <text x="160" y="90" fill="#888" font-family="Menlo, Consolas, monospace" font-size="13">${escapeXml(artifactSlug(recipe))}/interaction</text>

  <text x="58" y="146" fill="#ff922c" font-family="Arial" font-size="15" font-weight="900">INTERACTION CAPTURE</text>
  <text x="58" y="180" fill="#e0e0e0" font-family="Arial" font-size="27" font-weight="900">${escapeXml(compactSvgText(textOf(recipe.title, "zh"), 34))}</text>
  <rect x="702" y="130" width="160" height="58" rx="9" fill="#242424" stroke="#ff922c"/>
  <text x="724" y="153" fill="#888" font-family="Arial" font-size="12" font-weight="900">REVIEWABLE</text>
  <text x="724" y="178" fill="#ff922c" font-family="Arial" font-size="23" font-weight="900">TASK RUN</text>

  ${bubbleRows}

  <rect x="66" y="576" width="788" height="28" rx="7" fill="#101010" stroke="#333"/>
  <text x="86" y="595" fill="#666" font-family="Menlo, Consolas, monospace" font-size="12">handoff -> report -> correction -> human confirmation</text>
</svg>`;
}

function rawSceneCaptureSvg(recipe) {
  const slug = artifactSlug(recipe);
  const lines = rawSceneSnippet(recipe, "zh")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .slice(0, 9);
  const lineRows = lines.map((line, index) => {
    const y = 204 + index * 30;
    const tone = /fail|error|failed|skipped|异常|失败|缺失|overflow|duplicate|missing/i.test(line)
      ? "#ff6b6b"
      : /pass|success|ok|通过|已|200|done/i.test(line)
        ? "#66d17a"
        : "#888";
    return `
      <g>
        <text x="80" y="${y}" fill="#666" font-family="Menlo, Consolas, monospace" font-size="13">${String(index + 1).padStart(2, "0")}</text>
        <circle cx="122" cy="${y - 4}" r="4" fill="${tone}"/>
        <text x="142" y="${y}" fill="#e0e0e0" font-family="Menlo, Consolas, monospace" font-size="15">${escapeXml(compactSvgText(line.replaceAll("\t", "    "), 72))}</text>
      </g>`;
  }).join("");
  const evidenceRows = recipe.evidenceTable.slice(0, 3).map((row, index) => {
    const y = 462 + index * 40;
    return `
      <g>
        <rect x="60" y="${y - 24}" width="800" height="32" rx="7" fill="${index % 2 === 0 ? "#202020" : "#242424"}" stroke="#333"/>
        <text x="80" y="${y - 3}" fill="#ff922c" font-family="Arial" font-size="12" font-weight="900">${escapeXml(compactSvgText(textOf(row[0], "zh"), 16))}</text>
        <text x="240" y="${y - 3}" fill="#e0e0e0" font-family="Arial" font-size="13" font-weight="800">${escapeXml(compactSvgText(textOf(row[1], "zh"), 42))}</text>
        <text x="680" y="${y - 3}" fill="#888" font-family="Arial" font-size="12">${escapeXml(compactSvgText(textOf(row[2], "zh"), 18))}</text>
      </g>`;
  }).join("");
  const firstCommand = textOf(recipe.commands[0], "zh");
  const secondCommand = textOf(recipe.commands[1], "zh");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 640" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(textOf(recipe.title, "zh"))} - 现场捕获</title>
  <desc id="desc">Screenshot-style proof capture built from the raw scene excerpt of a practical Codex task.</desc>
  <rect width="920" height="640" rx="8" fill="#141414"/>
  <rect x="34" y="34" width="852" height="572" rx="10" fill="#191919" stroke="#333"/>
  <rect x="58" y="58" width="804" height="50" rx="8" fill="#101010" stroke="#333"/>
  <circle cx="84" cy="84" r="6" fill="#ff6b6b"/>
  <circle cx="106" cy="84" r="6" fill="#f5c542"/>
  <circle cx="128" cy="84" r="6" fill="#66d17a"/>
  <text x="160" y="89" fill="#888" font-family="Menlo, Consolas, monospace" font-size="13">${escapeXml(slug)}/raw-scene</text>

  <text x="58" y="146" fill="#ff922c" font-family="Arial" font-size="15" font-weight="900">RUN PROOF CAPTURE</text>
  <text x="58" y="180" fill="#e0e0e0" font-family="Arial" font-size="26" font-weight="900">${escapeXml(compactSvgText(textOf(recipe.title, "zh"), 34))}</text>
  <text x="614" y="150" fill="#888" font-family="Arial" font-size="12" font-weight="900">RISK</text>
  <text x="614" y="176" fill="#ff922c" font-family="Arial" font-size="22" font-weight="900">${escapeXml(compactSvgText(textOf(recipe.risk, "zh"), 12))}</text>

  <rect x="58" y="196" width="804" height="222" rx="9" fill="#11130f" stroke="#363020"/>
  ${lineRows}

  <rect x="58" y="438" width="804" height="120" rx="9" fill="#1e1e1e" stroke="#333"/>
  <text x="80" y="430" fill="#888" font-family="Arial" font-size="12" font-weight="900">EVIDENCE CROSS-CHECK</text>
  ${evidenceRows}

  <rect x="58" y="572" width="804" height="34" rx="8" fill="#101010" stroke="#333"/>
  <text x="76" y="594" fill="#666" font-family="Menlo, Consolas, monospace" font-size="12">$ ${escapeXml(compactSvgText(firstCommand, 48))}</text>
  <text x="500" y="594" fill="#666" font-family="Menlo, Consolas, monospace" font-size="12">$ ${escapeXml(compactSvgText(secondCommand, 42))}</text>
</svg>`;
}

function proofSequenceCaptureSvg(recipe, phase) {
  const trace = operationTrace(recipe);
  const phaseConfig = {
    trigger: {
      number: "01",
      tag: "TRIGGER CAPTURE",
      title: "触发现场",
      color: "#f1c86b",
      headline: trace.snapshot.trigger,
      primaryLabel: "FIRST SIGNAL",
      primaryValue: trace.snapshot.firstSignal,
      action: trace.replay[0]?.[1] ?? recipe.commands[0],
      evidence: trace.replay[0]?.[3] ?? recipe.evidenceTable[0][2],
      footer: recipe.materialsLabel
    },
    correction: {
      number: "02",
      tag: "CORRECTION CAPTURE",
      title: "修正现场",
      color: "#ff922c",
      headline: recipe.failureNotes[0][1],
      primaryLabel: "CORRECTION",
      primaryValue: recipe.failureNotes[0][2],
      action: trace.replay[1]?.[1] ?? recipe.commands[1],
      evidence: trace.replay[1]?.[3] ?? recipe.evidenceTable[1][2],
      footer: recipe.failureNotes[0][0]
    },
    finalReview: {
      number: "03",
      tag: "FINAL REVIEW",
      title: "终审现场",
      color: "#66d17a",
      headline: trace.snapshot.finalSignal,
      primaryLabel: "HANDOFF",
      primaryValue: trace.handoff[0] ?? recipe.acceptanceChecks[0],
      action: recipe.acceptanceChecks[0],
      evidence: recipe.deliverable,
      footer: recipe.risk
    }
  }[phase];

  const rows = [
    ["材料", recipe.materialsLabel],
    ["动作", phaseConfig.action],
    ["信号", phaseConfig.primaryValue],
    ["证据", phaseConfig.evidence]
  ].map(([label, value], index) => {
    const y = 258 + index * 52;
    return `
      <g>
        <rect x="58" y="${y - 30}" width="804" height="42" rx="8" fill="${index % 2 === 0 ? "#202020" : "#242424"}" stroke="#333"/>
        <text x="82" y="${y - 5}" fill="${phaseConfig.color}" font-family="Arial" font-size="12" font-weight="900">${escapeXml(label)}</text>
        <text x="170" y="${y - 5}" fill="#e0e0e0" font-family="Arial" font-size="15" font-weight="800">${escapeXml(compactSvgText(textOf(value, "zh"), 68))}</text>
      </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 520" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(textOf(recipe.title, "zh"))} - ${phaseConfig.title}</title>
  <desc id="desc">A field-evidence capture from a practical Codex task sequence.</desc>
  <rect width="920" height="520" rx="8" fill="#141414"/>
  <rect x="34" y="34" width="852" height="452" rx="10" fill="#191919" stroke="#333"/>
  <rect x="58" y="58" width="804" height="54" rx="8" fill="#101010" stroke="#333"/>
  <circle cx="84" cy="85" r="6" fill="#ff6b6b"/>
  <circle cx="106" cy="85" r="6" fill="#f5c542"/>
  <circle cx="128" cy="85" r="6" fill="#66d17a"/>
  <text x="160" y="90" fill="#888" font-family="Menlo, Consolas, monospace" font-size="13">${escapeXml(artifactSlug(recipe))}/${phase}</text>

  <text x="58" y="150" fill="${phaseConfig.color}" font-family="Arial" font-size="15" font-weight="900">${phaseConfig.tag}</text>
  <text x="58" y="184" fill="#e0e0e0" font-family="Arial" font-size="28" font-weight="900">${escapeXml(compactSvgText(textOf(recipe.title, "zh"), 32))}</text>
  <rect x="732" y="132" width="130" height="58" rx="9" fill="#242424" stroke="${phaseConfig.color}"/>
  <text x="754" y="154" fill="#888" font-family="Arial" font-size="12" font-weight="900">STEP</text>
  <text x="754" y="180" fill="${phaseConfig.color}" font-family="Arial" font-size="27" font-weight="900">${phaseConfig.number}</text>

  <rect x="58" y="206" width="804" height="0" fill="none"/>
  <text x="58" y="214" fill="#888" font-family="Arial" font-size="15">${escapeXml(compactSvgText(textOf(phaseConfig.headline, "zh"), 82))}</text>
  ${rows}

  <rect x="58" y="444" width="804" height="34" rx="8" fill="#101010" stroke="#333"/>
  <text x="80" y="466" fill="#666" font-family="Menlo, Consolas, monospace" font-size="12">${phaseConfig.primaryLabel}: ${escapeXml(compactSvgText(textOf(phaseConfig.footer, "zh"), 70))}</text>
</svg>`;
}

function writeCaseArtifacts() {
  fs.rmSync(path.join(root, artifactRoot), { recursive: true, force: true });
  write(`${artifactRoot}/index.json`, JSON.stringify(caseLibraryManifest(), null, 2));
  write(`${artifactRoot}/library-health.json`, JSON.stringify(libraryHealthReport(), null, 2));
  for (const recipe of caseRecipes) {
    for (const item of artifactDefinitions(recipe)) {
      const filePath = `${artifactBase(recipe)}/${item.file}`;
      if (item.file === "evidence-board.svg") {
        write(filePath, caseEvidenceSvg(recipe));
      } else if (item.file === "11-field-snapshot.svg") {
        write(filePath, caseFieldSnapshotSvg(recipe));
      } else if (item.file === "13-delivery-capture.svg") {
        write(filePath, caseDeliveryCaptureSvg(recipe));
      } else {
        write(filePath, item.body);
      }
    }
  }
}

function build() {
  writeAssets();
  writeCaseArtifacts();
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
  writePublishingFiles();
  console.log(`Generated ${pages.length + 1} bilingual pages and SVG assets.`);
}

build();
