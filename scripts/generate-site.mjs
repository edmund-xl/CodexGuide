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
      [b("本地构建", "Local build"), b("43 个页面生成成功", "43 pages generated successfully"), b("npm run build", "npm run build"), b("通过", "Pass")],
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
页面数量保持 43
README 需要展示新版截图
本地路径和线上路径都要可访问`,
`Redesign constraints
Background #141414, panels #1e1e1e / #242424, border #333, accent #ff922c
Keep 43 pages
README must show updated screenshots
Local and live paths must be accessible`),
    playbook: [
      b("先改数据结构和渲染组件，再改 CSS，最后更新截图和 README。", "Change data structure and rendering components first, then CSS, then screenshots and README."),
      b("每完成一个大块就运行构建，尽早发现模板错误。", "Run the build after each major block to catch template errors early."),
      b("视觉验收必须用浏览器截图，不只看代码。", "Visual acceptance requires browser screenshots, not code review alone.")
    ],
    evidenceTable: [
      [b("页面数量", "Page count"), b("HTML 页面仍为 43", "HTML page count remains 43"), b("npm run check", "npm run check"), b("通过", "Pass")],
      [b("链接", "Links"), b("导航、搜索、README 链接均指向现有文件", "Navigation, search, and README links point to existing files"), b("verify-site.mjs", "verify-site.mjs"), b("通过", "Pass")],
      [b("移动端", "Mobile"), b("390px 下无页面横向溢出", "No page-level horizontal overflow at 390px"), b("mobile screenshots", "mobile screenshots"), b("通过", "Pass")],
      [b("截图", "Screenshots"), b("README 五张截图均为新版深色界面", "All five README screenshots show the redesigned dark interface"), b("assets/screenshots/", "assets/screenshots/"), b("通过", "Pass")]
    ],
    outputSample: b(`改版结果
- 43 个页面重新生成
- 案例页新增任务状态面板、证据表、命令块和验收清单
- README 更新首页、案例总览、两个案例页、使用规范页截图
- 本地根路径和 /CodexGuide/ 均返回 200`,
`Redesign result
- 43 pages regenerated
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
      b("43 个 HTML 页面全部生成并通过链接检查。", "All 43 HTML pages are generated and pass link checks."),
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
  }
];

const usagePolicyRecipe = {
  path: "recipes/usage-policy.html",
  title: b("使用规范", "Usage Policy"),
  navTitle: b("使用规范", "Usage Policy"),
  summary: b("说明隐私、安全、人工复核和发布前确认要求。", "Document privacy, safety, human review, and pre-publication confirmation requirements."),
  domain: b("项目治理", "Project governance")
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

function commandPanel(recipe, lang) {
  return `
    <div class="command-panel">
      <strong>${lang === "zh" ? "验收命令与人工步骤" : "Acceptance commands and manual steps"}</strong>
      ${recipe.commands.map((item) => `<code>${escapeHtml(textOf(item, lang))}</code>`).join("")}
    </div>`;
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
  const isZh = lang === "zh";

  return `
    ${caseDashboard(recipe, lang)}
    <section>
      <h2>${isZh ? "任务背景" : "Task Background"}</h2>
      ${paragraph(recipe.summary, lang)}
      <div class="risk-strip">
        <span>${escapeHtml(textOf(recipe.domain, lang))}</span>
        <span>${escapeHtml(textOf(recipe.audience, lang))}</span>
        <span>${escapeHtml(textOf(recipe.risk, lang))}</span>
      </div>
    </section>
    <section>
      <h2>${isZh ? "输入材料" : "Input Materials"}</h2>
      ${paragraph(b("本次任务先锁定可读取材料、禁止动作和输出格式，再开始生成或检查。", "This task first locks readable materials, prohibited actions, and output format before generation or inspection."), lang)}
      ${checklist(recipe.materials, lang, "case-checklist")}
      ${codeSample(recipe.inputSample, lang)}
    </section>
    <section>
      <h2>${isZh ? "运行环境" : "Run Environment"}</h2>
      ${checklist(recipe.environment, lang, "case-checklist")}
    </section>
    <section>
      <h2>${isZh ? "操作剧本" : "Operating Script"}</h2>
      <ol class="case-timeline">
        ${recipe.playbook.map((item) => `<li>${escapeHtml(textOf(item, lang))}</li>`).join("")}
      </ol>
    </section>
    <section>
      <h2>${isZh ? "过程证据" : "Evidence Trail"}</h2>
      ${paragraph(b("下面的表格记录本次任务如何判断完成，而不是只描述最终结果。", "The table below records how this task judged completion instead of only describing the final result."), lang)}
      ${tableHtml(evidenceHeaders, recipe.evidenceTable, lang)}
    </section>
    <section>
      <h2>${isZh ? "结果样例" : "Result Sample"}</h2>
      ${paragraph(b("结果样例保留可复核字段、文件名和待确认项，便于另一个人接手检查。", "The result sample keeps reviewable fields, filenames, and confirmation items so another person can inspect it."), lang)}
      ${codeSample(recipe.outputSample, lang)}
    </section>
    <section>
      <h2>${isZh ? "失败与修正" : "Failures and Corrections"}</h2>
      ${tableHtml(failureHeaders, recipe.failureNotes, lang, "evidence-table failure-table")}
    </section>
    <section>
      <h2>${isZh ? "风险边界" : "Risk Boundaries"}</h2>
      ${checklist(recipe.riskControls, lang, "case-checklist risk-list")}
    </section>
    <section>
      <h2>${isZh ? "验收标准" : "Acceptance Criteria"}</h2>
      ${checklist(recipe.acceptanceChecks, lang)}
      ${commandPanel(recipe, lang)}
    </section>
    <section>
      <h2>${isZh ? "可复用任务单" : "Reusable Work Order"}</h2>
      ${paragraph(b("把下面任务单作为起点，替换材料、路径、限制和验收方式后再执行。", "Use the work order below as a starting point, then replace materials, paths, constraints, and acceptance method before running it."), lang)}
      ${codeSample(b(recipe.taskOrder.map((item) => item.zh).join("\n"), recipe.taskOrder.map((item) => item.en).join("\n")), lang, "output-sample work-order")}
    </section>`;
}

function caseIndexContent(lang) {
  const headers = [
    b("案例", "Recipe"),
    b("入口", "Entry"),
    b("证据", "Evidence"),
    b("交付物", "Deliverable"),
    b("风险", "Risk")
  ];
  const rows = caseRecipes.map((item) => [
    b(`<a href="${relativeLink("recipes/index.html", item.path)}">${item.title.zh}</a>`, `<a href="${relativeLink("recipes/index.html", item.path)}">${item.title.en}</a>`),
    item.entry,
    item.evidence,
    item.deliverable,
    item.risk
  ]);
  const isZh = lang === "zh";

  return `
    <section class="case-index-hero">
      <h2>${isZh ? "实测任务矩阵" : "Tool-Tested Task Matrix"}</h2>
      ${paragraph(b(
        "每个案例都按入口、材料、证据、交付物和风险拆开。先选最接近自己任务的行，再进入详情页复制任务单。",
        "Each recipe is split by entry, materials, evidence, deliverable, and risk. Pick the row closest to your task, then open the detail page and adapt the work order."
      ), lang)}
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
    summary: b("13 个案例按真实任务复盘组织，重点展示输入、证据、结果、失败修正和验收方式。", "Thirteen recipes are organized as real task retrospectives, highlighting input, evidence, result, correction, and acceptance method."),
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
        index < 12
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
    [b("13 个工具实测案例", "13 tool-tested recipes"), b("覆盖演示稿、浏览器检查、部署排障、知识库、表格和日志诊断。", "Covers decks, browser review, deployment diagnosis, knowledge bases, spreadsheets, and log troubleshooting.")],
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
      ${caseRecipes.slice(0, 4).map((item) => `
        <a class="plain-card" href="${item.path}">
          <small>${escapeHtml(textOf(item.domain, lang))}</small>
          <h3>${escapeHtml(textOf(item.title, lang))}</h3>
          <p>${escapeHtml(textOf(item.summary, lang))}</p>
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
    return `
      <section class="language-section${isZh ? "" : " english-section"}" lang="${isZh ? "zh-CN" : "en"}" data-language-section="${lang}">
        <p class="language-kicker">${isZh ? "中文" : "English"}</p>
        <p class="eyebrow">${escapeHtml(textOf(page.group, lang))}</p>
        <h1>${escapeHtml(textOf(page.title, lang))}</h1>
        ${paragraph(page.summary, lang)}
        ${metaGrid(page.meta || statusMeta(b("所有读者", "All readers"), b("20 分钟", "20 minutes")), lang)}
        ${page.image ? `<img class="doc-hero-image" src="${relativeLink(currentPath, `assets/${page.image}`)}" alt="${escapeHtml(textOf(page.title, lang))}">` : ""}
        ${page.caseIndex ? caseIndexContent(lang) : ""}
        ${page.caseRecipe ? caseContent(page.caseRecipe, lang) : ""}
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
  <rect x="8" y="8" width="80" height="80" rx="10" fill="#1e1e1e" stroke="#333"/>
  <path d="M26 29h28" stroke="#ff922c" stroke-width="7" stroke-linecap="round"/>
  <path d="M26 48h22" stroke="#e0e0e0" stroke-width="7" stroke-linecap="round"/>
  <path d="M26 67h32" stroke="#888" stroke-width="7" stroke-linecap="round"/>
  <path d="M60 38l13 10-13 10" fill="none" stroke="#ff922c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
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
