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
    path: "recipes/newsletter-brief.html",
    title: b("01 演示稿生成与导出核查", "01 Deck Generation and Export Verification"),
    navTitle: b("01 演示稿生成核查", "01 Deck export check"),
    summary: b("把一份产品说明整理成演示稿，并用导出文件、页面截图和逐页检查表确认结果可交付。", "Turn a product brief into a deck, then validate the exported file, screenshots, and slide-by-slide checklist."),
    domain: b("演示材料", "Presentation work"),
    entry: b("桌面端 + 演示文档工具", "Desktop app plus presentation tooling"),
    evidence: b("PPTX 文件、导出预览截图、逐页验收表", "PPTX file, export preview screenshots, and slide acceptance sheet"),
    risk: b("低到中", "Low to medium"),
    environment: [
      b("准备一份 800 字以内的产品说明，去掉客户姓名、报价和内部链接。", "Prepare a product brief under 800 words, with customer names, quotes, and internal links removed."),
      b("准备品牌色、字号要求、目标页数和必须出现的三条关键信息。", "Prepare brand colors, type-size requirements, target slide count, and three required messages."),
      b("只允许 Codex 生成草稿和检查清单，不允许直接对外发送。", "Allow Codex to generate drafts and checklists only; do not allow direct external sending.")
    ],
    playbook: [
      b("先让 Codex 把材料拆成受众、主张、证据、行动建议四块。", "Ask Codex to split the brief into audience, claim, evidence, and call-to-action first."),
      b("要求输出 6-8 页结构，每页包含标题、正文、视觉建议和备注。", "Request a 6-8 slide structure with title, body, visual direction, and speaker notes per slide."),
      b("生成文件后，要求逐页核查标题长度、术语一致性、空白页、图片占位和导出可读性。", "After generating the file, check every slide for title length, terminology consistency, blank slides, image placeholders, and export readability.")
    ],
    steps: [
      b("第一轮只做大纲，不生成文件；确认每页意图后再进入文件制作。", "Round one produces only the outline; generate the file after each slide intention is confirmed."),
      b("第二轮生成演示稿，同时保留一个逐页变更表，记录每页用到的输入材料。", "Round two creates the deck while keeping a slide change table that records the input used by each slide."),
      b("第三轮导出并截图首页、目录页、数据页和结尾页，检查文字是否溢出。", "Round three exports the deck and captures the cover, agenda, data, and closing slides to check text overflow.")
    ],
    result: [
      b("交付物包含 <code>deck-draft.pptx</code>、<code>slide-checklist.md</code> 和四张预览截图。", "Deliverables include <code>deck-draft.pptx</code>, <code>slide-checklist.md</code>, and four preview screenshots."),
      b("验收表标记每页状态：通过、需改写、需补素材、需人工确认。", "The checklist marks each slide as passed, needs rewrite, needs assets, or requires human confirmation."),
      b("最终发送前由用户确认品牌、事实、金额、日期和对外承诺。", "Before final sending, the user confirms branding, facts, amounts, dates, and external promises.")
    ],
    pitfalls: [
      b("一次性要求生成完整文件容易出现页数失控；先锁大纲再生成。", "Generating the full file immediately can lose control of slide count; lock the outline first."),
      b("截图只看封面不够，必须抽查正文密集页和数据页。", "Checking only the cover is insufficient; inspect dense content slides and data slides."),
      b("视觉建议不能替代版权检查，外部图片必须由用户确认可用。", "Visual suggestions do not replace usage checks; the user must confirm external image usability.")
    ],
    taskOrder: [
      b("请先根据这份产品说明生成 7 页演示稿结构，不要生成文件。", "First create a 7-slide deck structure from this product brief; do not generate the file yet."),
      b("每页请输出：页标题、核心信息、证据、视觉建议、备注、待确认项。", "For each slide, output title, core message, evidence, visual direction, notes, and confirmation items."),
      b("确认后再生成文件，并同时生成逐页验收表和导出检查步骤。", "After confirmation, generate the file together with a slide checklist and export validation steps.")
    ]
  },
  {
    path: "recipes/spreadsheet-cleanup.html",
    title: b("02 浏览器页面巡检与截图证据", "02 Browser Page Review with Screenshot Evidence"),
    navTitle: b("02 页面巡检截图", "02 Page screenshot review"),
    summary: b("用浏览器打开本地或测试页面，检查标题、按钮、表单、移动端布局和截图证据。", "Open a local or staging page in the browser and review headings, buttons, forms, mobile layout, and screenshot evidence."),
    domain: b("网页质量", "Web quality"),
    entry: b("桌面端 + 浏览器检查", "Desktop app plus browser inspection"),
    evidence: b("桌面截图、移动截图、控制台摘要、问题表", "Desktop screenshot, mobile screenshot, console summary, and issue table"),
    risk: b("低", "Low"),
    environment: [
      b("使用本地页面、测试环境页面或已公开页面，不输入账号密码。", "Use a local page, staging page, or public page; do not enter credentials."),
      b("提前定义要检查的视口：桌面 1440px、平板 900px、手机 390px。", "Define viewports up front: desktop 1440px, tablet 900px, and mobile 390px."),
      b("准备页面目标：用户要看到什么、点击什么、完成什么。", "Prepare the page goal: what users should see, click, and complete.")
    ],
    playbook: [
      b("先让 Codex 读取页面结构，列出关键区域和交互点。", "Ask Codex to read page structure first and list key regions and interactions."),
      b("按视口分别截图，不用同一张图替代所有设备。", "Capture screenshots per viewport; do not use one screenshot for all devices."),
      b("把问题按阻断、影响体验、文字瑕疵、后续优化四类归档。", "Classify issues as blocking, experience impact, copy polish, or follow-up improvement.")
    ],
    steps: [
      b("打开目标地址并确认页面标题、主标题、导航和核心按钮都可见。", "Open the target URL and confirm the page title, main heading, navigation, and primary button are visible."),
      b("执行一次主路径点击，只记录可见状态，不提交真实交易或表单。", "Run one primary-path click and record visible state without submitting real transactions or forms."),
      b("切换移动视口，检查导航折叠、按钮换行和长词是否溢出。", "Switch to mobile viewport and check navigation collapse, button wrapping, and long-word overflow.")
    ],
    result: [
      b("输出 <code>page-review.md</code>，每条问题包含位置、现象、截图名、建议和优先级。", "Output <code>page-review.md</code>; each issue includes location, symptom, screenshot name, recommendation, and priority."),
      b("通过项也要记录，例如导航可用、主按钮可见、移动端无横向滚动。", "Record passing checks too, such as usable navigation, visible primary button, and no horizontal mobile scrolling."),
      b("截图文件命名使用页面、视口和时间，例如 <code>home-mobile-390.png</code>。", "Screenshot names include page, viewport, and time, such as <code>home-mobile-390.png</code>.")
    ],
    pitfalls: [
      b("不要只看 DOM 文本；视觉重叠、遮挡和空白必须用截图判断。", "Do not inspect DOM text only; overlap, occlusion, and empty areas require screenshots."),
      b("不要在真实账号页面随意点击提交、购买、删除或授权按钮。", "Do not click submit, purchase, delete, or authorization buttons on real account pages."),
      b("移动端问题通常来自固定宽度、长按钮文案和表格列宽。", "Mobile issues often come from fixed widths, long button text, and table column widths.")
    ],
    taskOrder: [
      b("请打开这个页面做只读巡检，先说明会检查哪些区域。", "Open this page for read-only review and first state which areas will be checked."),
      b("请分别检查桌面和手机视口，输出截图清单和问题表。", "Check desktop and mobile viewports separately, then output screenshot inventory and issue table."),
      b("不要提交表单、不要修改数据、不要触发账号动作。", "Do not submit forms, modify data, or trigger account actions.")
    ]
  },
  {
    path: "recipes/docs-site-refresh.html",
    title: b("03 GitHub Pages 部署失败诊断", "03 GitHub Pages Deployment Failure Diagnosis"),
    navTitle: b("03 Pages 部署诊断", "03 Pages deploy diagnosis"),
    summary: b("从失败截图、Actions 日志和仓库设置定位 Pages 部署问题，并形成可复用排障记录。", "Use failure screenshots, Actions logs, and repository settings to diagnose a Pages deployment issue and create a reusable incident note."),
    domain: b("发布排障", "Deployment troubleshooting"),
    entry: b("本地仓库 + GitHub Actions 日志", "Local repository plus GitHub Actions logs"),
    evidence: b("失败 run、job 步骤、修复提交、线上 200 检查", "Failed run, job steps, fix commit, and live 200 check"),
    risk: b("中", "Medium"),
    environment: [
      b("准备失败截图、最新提交 SHA、workflow 文件和本地检查命令。", "Prepare the failure screenshot, latest commit SHA, workflow file, and local check commands."),
      b("确认本地工作区干净，避免把部署修复和无关内容混在同一次提交。", "Confirm the local worktree is clean so deployment fixes are not mixed with unrelated changes."),
      b("只改 workflow 或仓库 Pages 设置，不改业务内容。", "Change only the workflow or repository Pages setting, not business content.")
    ],
    playbook: [
      b("先区分内容构建失败、artifact 上传失败、Pages 配置失败和部署失败。", "First separate content build failure, artifact upload failure, Pages configuration failure, and deploy failure."),
      b("从 job steps 看第一个失败步骤，不被最终的 skipped 状态误导。", "Read job steps for the first failed step instead of being misled by final skipped jobs."),
      b("修复后必须用新 run 验证，旧失败 run 不会自动变绿。", "After fixing, validate with a new run; old failed runs do not become green automatically.")
    ],
    steps: [
      b("本地运行 <code>npm run build</code> 和 <code>npm run check</code>，排除站点内容问题。", "Run <code>npm run build</code> and <code>npm run check</code> locally to rule out site content issues."),
      b("查看 workflow job：如果构建成功但配置失败，检查 Pages 发布源是否为 Actions。", "Inspect workflow jobs: if build succeeds but configuration fails, check whether Pages source is Actions."),
      b("提交最小修复并推送，记录 run id、成功步骤和线上地址响应。", "Commit the minimal fix, push it, and record the run id, successful steps, and live URL response.")
    ],
    result: [
      b("排障记录包含：现象、失败步骤、根因、修复、验证命令和线上地址。", "The incident note includes symptom, failed step, root cause, fix, verification commands, and live URL."),
      b("验收条件是 build 与 deploy 都成功，线上页面返回 <code>200 OK</code>。", "Acceptance requires both build and deploy to pass and the live page to return <code>200 OK</code>."),
      b("保留修复提交信息，便于以后排查相同问题。", "Keep the fix commit message so similar issues can be diagnosed later.")
    ],
    pitfalls: [
      b("只看邮件摘要不够，必须进入 job steps 找到第一个红色步骤。", "Email summaries are not enough; inspect job steps to find the first red step."),
      b("如果 Pages 设置没启用，workflow 文件本身可能完全正确但仍失败。", "If Pages is not enabled, the workflow can be correct and still fail."),
      b("线上缓存可能延迟，先用响应头和页面标题确认部署状态。", "Live cache can lag; validate deploy state with response headers and page title.")
    ],
    taskOrder: [
      b("请根据这次失败 run 先判断失败类型，不要直接修改业务页面。", "Use this failed run to identify the failure type first; do not edit content pages directly."),
      b("请列出第一个失败步骤、失败信息、最小修复和验证命令。", "List the first failed step, error message, minimal fix, and verification commands."),
      b("修复完成后请提交、推送，并确认新的 run 与线上地址。", "After fixing, commit, push, and verify the new run and live URL.")
    ]
  },
  {
    path: "recipes/accessibility-audit.html",
    title: b("04 本地文档站批量改版", "04 Local Documentation Site Redesign"),
    navTitle: b("04 文档站批量改版", "04 Docs site redesign"),
    summary: b("把一个静态文档站统一改成新的产品风格，同时保留页面路径、链接和质量检查。", "Apply a new product style to a static documentation site while preserving paths, links, and quality checks."),
    domain: b("文档工程", "Documentation engineering"),
    entry: b("本地仓库 + 静态生成器", "Local repository plus static generator"),
    evidence: b("diff、构建日志、截图、链接检查", "Diff, build logs, screenshots, and link checks"),
    risk: b("中", "Medium"),
    environment: [
      b("确认生成器、样式表、脚本和截图目录的位置。", "Confirm the generator, stylesheet, scripts, and screenshot directory locations."),
      b("先锁定不可破坏项：页面数量、URL 路径、发布 workflow、本地服务命令。", "Lock non-breaking requirements first: page count, URL paths, deploy workflow, and local serve command."),
      b("改视觉前先记录当前质量门禁，避免只顾样式导致链接失效。", "Record current quality gates before visual work so styling does not break links.")
    ],
    playbook: [
      b("先改数据结构和渲染能力，再改 CSS；不要同时重写所有文件。", "Change data structure and rendering first, then CSS; do not rewrite every file at once."),
      b("每完成一个大块就运行构建，尽早发现模板错误。", "Run the build after each major block to catch template errors early."),
      b("用截图验证视觉，不只依赖代码审阅。", "Validate visuals with screenshots, not code review alone.")
    ],
    steps: [
      b("改生成器：新增产品化卡片、案例区块、证据表和任务单渲染。", "Update the generator with product cards, recipe blocks, evidence tables, and task-order rendering."),
      b("改样式：统一深色 tokens、导航、侧栏、卡片、按钮、表格和移动端断点。", "Update styles with dark tokens, navigation, sidebar, cards, buttons, tables, and mobile breakpoints."),
      b("重新生成截图并更新 README，保证仓库首页也展示新版风格。", "Regenerate screenshots and update README so the repository front page shows the new style.")
    ],
    result: [
      b("保留 43 个 HTML 页面，所有旧路径继续可访问。", "Keep 43 HTML pages and preserve all existing paths."),
      b("首页、案例页和规范页截图都反映新版深色界面。", "Home, recipe, and policy screenshots all reflect the new dark interface."),
      b("质量门禁仍覆盖双语顺序、链接、验收标准和禁用语境。", "Quality gates still cover bilingual order, links, acceptance criteria, and blocked wording.")
    ],
    pitfalls: [
      b("只改 CSS 不能解决案例弱的问题，内容结构也要升级。", "CSS alone will not fix weak recipes; content structure must improve too."),
      b("移动端最容易出问题的是侧栏、表格和长英文标题。", "Mobile issues most often come from sidebars, tables, and long English titles."),
      b("截图是仓库门面，改版后必须同步更新。", "Screenshots are the repository front door and must be updated after redesign.")
    ],
    taskOrder: [
      b("请先列出不可破坏项，再开始改生成器和样式。", "List non-breaking requirements before changing the generator and styles."),
      b("每轮修改后运行构建与检查，最终用浏览器截图验收。", "Run build and checks after each round; use browser screenshots for final acceptance."),
      b("提交前请确认 README 截图、线上路径和本地路径一致。", "Before committing, confirm README screenshots, live paths, and local paths are aligned.")
    ]
  },
  {
    path: "recipes/photo-archive.html",
    title: b("05 Markdown 知识库重整", "05 Markdown Knowledge Base Restructure"),
    navTitle: b("05 知识库重整", "05 Knowledge base cleanup"),
    summary: b("把散乱 Markdown 笔记整理成统一字段、目录索引和可搜索主题清单。", "Restructure scattered Markdown notes into consistent fields, an index, and searchable topic list."),
    domain: b("知识管理", "Knowledge management"),
    entry: b("本地文件 + Markdown 检查", "Local files plus Markdown checks"),
    evidence: b("字段清单、迁移 diff、索引页、缺口表", "Field inventory, migration diff, index page, and gap table"),
    risk: b("低到中", "Low to medium"),
    environment: [
      b("复制一份笔记目录作为工作副本，避免直接改原始资料。", "Duplicate the notes directory as a working copy before editing original material."),
      b("选定统一字段：标题、日期、主题、状态、摘要、行动项。", "Choose consistent fields: title, date, topic, status, summary, and action items."),
      b("先处理 5 篇样本，确认规则后再批量迁移。", "Process five samples first and batch-migrate only after rules are confirmed.")
    ],
    playbook: [
      b("先让 Codex 扫描文件名和标题，输出字段缺失矩阵。", "Ask Codex to scan filenames and headings, then output a missing-field matrix."),
      b("把迁移规则写成清单：哪些字段可自动推断，哪些必须人工补。", "Write migration rules as a checklist: which fields can be inferred and which require manual input."),
      b("批量修改后生成索引页，按主题和状态分组。", "After batch edits, generate an index grouped by topic and status.")
    ],
    steps: [
      b("抽样读取笔记，识别命名混乱、标题重复、日期缺失和标签不一致。", "Sample notes to detect naming drift, duplicate headings, missing dates, and inconsistent tags."),
      b("生成 frontmatter 模板和迁移计划，先展示 diff 再写入。", "Generate the frontmatter template and migration plan, then show diffs before writing."),
      b("创建 <code>index.md</code>，列出主题、状态、摘要和下一步。", "Create <code>index.md</code> with topic, status, summary, and next action.")
    ],
    result: [
      b("每篇笔记都有统一字段，缺失内容标为待补，不编造。", "Every note has consistent fields; missing content is marked pending, not invented."),
      b("目录索引可按主题快速找到材料，也能看到过期或未完成项。", "The index supports quick topic lookup and highlights stale or incomplete items."),
      b("迁移 diff 可复查，必要时能回退单篇文件。", "Migration diffs are reviewable and individual files can be reverted if needed.")
    ],
    pitfalls: [
      b("不要让 Codex 猜具体日期、作者或结论；缺失就标注待确认。", "Do not let Codex guess dates, authors, or conclusions; mark missing fields for confirmation."),
      b("一次性处理全部文件风险较高，先用样本校准规则。", "Processing all files at once is risky; calibrate rules on samples first."),
      b("索引页不是目录树复制，应突出状态和下一步。", "The index is not a copied folder tree; it should emphasize status and next actions.")
    ],
    taskOrder: [
      b("请扫描这个 Markdown 目录，先输出字段缺失矩阵和迁移规则。", "Scan this Markdown directory and first output a missing-field matrix and migration rules."),
      b("请先处理 5 个样本文件，展示 diff 后再等待确认。", "Process five sample files first, show the diff, and wait for confirmation."),
      b("确认后批量迁移，并生成主题索引和待补清单。", "After confirmation, batch-migrate and generate a topic index plus pending list.")
    ]
  },
  {
    path: "recipes/expense-report.html",
    title: b("06 表格数据清洗与异常核对", "06 Spreadsheet Cleanup and Anomaly Review"),
    navTitle: b("06 表格清洗核对", "06 Spreadsheet review"),
    summary: b("清理 CSV 或表格数据，输出异常行、修正建议和人工复核清单。", "Clean CSV or spreadsheet data and output anomalous rows, correction suggestions, and a human review checklist."),
    domain: b("数据整理", "Data cleanup"),
    entry: b("本地表格文件 + 只读分析", "Local spreadsheet file plus read-only analysis"),
    evidence: b("清洗前后行数、异常分类、样本行、校验公式", "Before-after row counts, anomaly classes, sample rows, and validation formulas"),
    risk: b("中", "Medium"),
    environment: [
      b("使用脱敏样本，移除真实姓名、电话、证件号和完整地址。", "Use anonymized samples and remove real names, phone numbers, IDs, and full addresses."),
      b("提前定义关键字段、唯一键、金额范围、日期范围和允许空值。", "Define key fields, unique key, amount range, date range, and allowed blanks."),
      b("默认先只读分析，确认后再生成清理版本。", "Start with read-only analysis and generate the cleaned version only after confirmation.")
    ],
    playbook: [
      b("第一步只输出数据画像：行数、列数、类型推断、空值、重复。", "Step one outputs only a data profile: row count, columns, inferred types, blanks, and duplicates."),
      b("第二步列出异常规则，不直接删除行。", "Step two lists anomaly rules without deleting rows."),
      b("第三步生成清理建议和人工复核表，保留原始行号。", "Step three generates cleanup suggestions and a review sheet while preserving original row numbers.")
    ],
    steps: [
      b("读取列名和前几行样本，确认字段含义与单位。", "Read column names and sample rows to confirm field meaning and units."),
      b("按重复、缺失、格式、范围、跨字段矛盾五类标记问题。", "Flag issues as duplicate, missing, format, range, or cross-field conflict."),
      b("输出清理版时保留 <code>original_row</code>，方便追溯。", "When outputting a cleaned version, keep <code>original_row</code> for traceability.")
    ],
    result: [
      b("交付物包含数据画像、异常表、清理建议和待确认行。", "Deliverables include data profile, anomaly table, cleanup suggestions, and rows needing confirmation."),
      b("清理版不能覆盖原文件，文件名使用 <code>-cleaned</code> 后缀。", "The cleaned file must not overwrite the original; use a <code>-cleaned</code> suffix."),
      b("金额、日期和业务状态必须由用户最终确认。", "Amounts, dates, and business status must be finally confirmed by the user.")
    ],
    pitfalls: [
      b("不要把空值自动填成平均数，除非业务规则明确要求。", "Do not fill blanks with averages unless business rules explicitly require it."),
      b("重复行可能是分期、部分退款或拆单，不能直接删除。", "Duplicate rows can represent installments, partial refunds, or split orders; do not delete them directly."),
      b("列名相似不代表含义相同，先确认单位和口径。", "Similar column names do not mean identical meaning; confirm units and definitions first.")
    ],
    taskOrder: [
      b("请先只读分析这个 CSV，输出数据画像和异常规则。", "First analyze this CSV read-only and output the data profile and anomaly rules."),
      b("不要覆盖原文件，不要删除行，保留原始行号。", "Do not overwrite the original file, do not delete rows, and preserve original row numbers."),
      b("确认规则后再生成清理版和人工复核表。", "After the rules are confirmed, generate the cleaned version and human review sheet.")
    ]
  },
  {
    path: "recipes/podcast-notes.html",
    title: b("07 设计截图转实现规格", "07 Design Screenshot to Implementation Spec"),
    navTitle: b("07 截图转规格", "07 Screenshot to spec"),
    summary: b("把页面截图转成可执行的前端改版规格，明确布局、颜色、状态和验收方式。", "Turn page screenshots into an actionable frontend specification with layout, colors, states, and acceptance checks."),
    domain: b("前端协作", "Frontend collaboration"),
    entry: b("截图 + 本地页面预览", "Screenshots plus local page preview"),
    evidence: b("视觉要点表、组件状态表、改版验收截图", "Visual notes table, component state table, and redesign acceptance screenshots"),
    risk: b("中", "Medium"),
    environment: [
      b("准备目标截图和当前页面截图，标明哪些只是风格方向，哪些必须精确实现。", "Prepare target and current screenshots, marking style direction versus exact requirements."),
      b("确认不可复制的内容：品牌名、图片、文案和业务数据都必须替换。", "Confirm non-reusable items: brand names, images, copy, and business data must be replaced."),
      b("列出必须支持的屏幕宽度和主要页面。", "List required screen widths and primary pages.")
    ],
    playbook: [
      b("先描述视觉系统：底色、面板、边框、强调色、字号和间距。", "Describe the visual system first: background, panels, borders, accent color, type size, and spacing."),
      b("再拆页面结构：顶栏、侧栏、主内容、卡片、表格、按钮、状态。", "Then decompose page structure: top bar, sidebar, main content, cards, tables, buttons, and states."),
      b("最后输出验收清单，明确哪些地方不能照搬。", "Finally output an acceptance checklist and state which parts must not be copied.")
    ],
    steps: [
      b("从截图提取颜色和密度，只记录设计原则，不记录对方品牌元素。", "Extract colors and density from screenshots, recording design principles rather than another brand's elements."),
      b("把目标风格映射到本站组件：导航、案例卡、流程块、代码块、截图区。", "Map the target style to this site's components: navigation, recipe cards, workflow blocks, code blocks, and screenshot areas."),
      b("用桌面和移动截图验收布局，不用主观描述代替验证。", "Validate layout with desktop and mobile screenshots instead of subjective descriptions.")
    ],
    result: [
      b("实现规格包含颜色 tokens、组件清单、响应式规则和页面验收项。", "The implementation spec includes color tokens, component list, responsive rules, and page acceptance items."),
      b("改版结果不出现目标站品牌、业务数据、图片或页面文案。", "The redesign contains none of the target site's brand, business data, images, or page copy."),
      b("截图对比只用于检查密度和风格方向，不作为复制依据。", "Screenshot comparison is used only for density and style direction, not as copying basis.")
    ],
    pitfalls: [
      b("不要把截图里的真实业务数值搬进本站。", "Do not move real business values from screenshots into this site."),
      b("深色风格容易对比度不足，次级文字也要可读。", "Dark style can lose contrast; secondary text must remain readable."),
      b("卡片圆角、边框和按钮密度要统一，否则会像拼贴。", "Card radius, borders, and button density must be unified or the page feels patchy.")
    ],
    taskOrder: [
      b("请根据这两张截图提炼风格规则，不要复用其中的品牌和业务内容。", "Extract style rules from these two screenshots without reusing their brand or business content."),
      b("请把规则映射成本站组件改版清单和验收标准。", "Map the rules into this site's component redesign list and acceptance criteria."),
      b("完成后用桌面和手机截图验证无重叠、无横向溢出。", "After implementation, verify with desktop and mobile screenshots for no overlap and no horizontal overflow.")
    ]
  },
  {
    path: "recipes/api-changelog.html",
    title: b("08 登录态网页只读检查", "08 Read-only Review of an Authenticated Web Page"),
    navTitle: b("08 登录页只读检查", "08 Auth page review"),
    summary: b("在已有登录态下只读检查页面状态、数据展示和交互入口，不触发账号动作。", "Use an existing signed-in session to read page state, displayed data, and interaction entries without triggering account actions."),
    domain: b("账号页面检查", "Authenticated page review"),
    entry: b("用户浏览器 + 只读操作", "User browser plus read-only actions"),
    evidence: b("可见状态摘要、截图、禁点清单、待确认项", "Visible-state summary, screenshots, no-click list, and confirmation items"),
    risk: b("中到高", "Medium to high"),
    environment: [
      b("用户已在自己的浏览器登录，Codex 不读取密码、Cookie 或本地会话文件。", "The user is already signed in; Codex does not read passwords, cookies, or local session files."),
      b("先列出禁止动作：提交、购买、授权、删除、转账、邀请、公开发布。", "List prohibited actions first: submit, purchase, authorize, delete, transfer, invite, and publish."),
      b("只采集屏幕可见信息，敏感数值可打码描述。", "Capture only visible screen information; sensitive values can be masked in notes.")
    ],
    playbook: [
      b("先确认当前 URL、页面标题和用户想检查的目标。", "Confirm current URL, page title, and the user's inspection goal first."),
      b("读页面状态，不点会改变账户、余额、权限或公开内容的控件。", "Read page state and avoid controls that change account, balance, permissions, or public content."),
      b("把需要用户决定的动作列为待确认，而不是替用户执行。", "List user decisions as confirmation items instead of executing them.")
    ],
    steps: [
      b("获取当前页面快照，识别导航、数据卡、表格、按钮和警告提示。", "Capture the current page snapshot and identify navigation, data cards, tables, buttons, and warnings."),
      b("截图前先隐藏或避开不需要展示的个人信息区域。", "Before screenshots, hide or avoid personal information areas that are not needed."),
      b("输出状态摘要：页面是否正常、关键数据是否显示、是否有报错或空态。", "Output a state summary: whether the page loads, key data displays, and errors or empty states appear.")
    ],
    result: [
      b("报告包含当前状态、可见问题、未执行动作和需要用户确认的下一步。", "The report includes current state, visible issues, actions not executed, and next steps requiring user confirmation."),
      b("截图只用于页面状态，不包含不必要的个人资料。", "Screenshots are used only for page state and exclude unnecessary personal details."),
      b("任何写入或高风险按钮都保持未点击。", "All write or high-risk buttons remain unclicked.")
    ],
    pitfalls: [
      b("登录态不等于授权执行账号操作，仍然要逐项确认。", "Being signed in does not authorize account actions; each action still requires confirmation."),
      b("按钮文字可能不完整，点击前必须理解后果。", "Button labels can be incomplete; understand consequences before clicking."),
      b("截图可能暴露资产、邮箱或账号 ID，应先判断是否必须展示。", "Screenshots can expose assets, email, or account IDs; decide whether they are necessary first.")
    ],
    taskOrder: [
      b("请只读检查这个已登录页面，先列出禁止点击的控件类型。", "Read-only review this signed-in page and first list the control types that must not be clicked."),
      b("请输出当前状态、可见问题、截图清单和待确认动作。", "Output current state, visible issues, screenshot inventory, and confirmation actions."),
      b("不要提交、授权、购买、删除、邀请或公开发布。", "Do not submit, authorize, purchase, delete, invite, or publish.")
    ]
  },
  {
    path: "recipes/shop-copy.html",
    title: b("09 文档与 PDF 摘要到证据表", "09 Document and PDF Summary to Evidence Table"),
    navTitle: b("09 文档证据表", "09 Evidence table"),
    summary: b("把长文档或 PDF 摘要成可审阅证据表，保留页码、原句线索和不确定项。", "Summarize long documents or PDFs into a reviewable evidence table with page numbers, quote cues, and uncertainties."),
    domain: b("资料分析", "Document analysis"),
    entry: b("本地文档 + 表格化摘要", "Local documents plus tabular summary"),
    evidence: b("证据表、页码、摘录线索、问题清单", "Evidence table, page numbers, excerpt cues, and question list"),
    risk: b("中", "Medium"),
    environment: [
      b("使用允许处理的文档副本，移除合同签名页、证件和私人联系方式。", "Use an allowed document copy and remove signature pages, IDs, and private contact details."),
      b("定义摘要目标：决策、学习、核查、会议准备或问题发现。", "Define the summary goal: decision, learning, review, meeting prep, or issue discovery."),
      b("要求输出表格，不只输出自然段摘要。", "Require a table output, not just paragraph summaries.")
    ],
    playbook: [
      b("先让 Codex 建立文档目录和页码范围。", "Ask Codex to build a document outline and page ranges first."),
      b("每条结论必须配页码、摘录线索和置信度。", "Every conclusion must include page number, excerpt cue, and confidence."),
      b("不确定项集中列出，便于人工回到原文核查。", "Centralize uncertain items so a human can check the original text.")
    ],
    steps: [
      b("读取目录、标题和首尾页，判断文档结构。", "Read the table of contents, headings, and first/last pages to understand structure."),
      b("按主题抽取证据：事实、限制、日期、金额、责任、待确认。", "Extract evidence by topic: facts, limits, dates, amounts, responsibilities, and confirmations."),
      b("生成 <code>evidence-table.md</code>，每行只放一个可核查主张。", "Generate <code>evidence-table.md</code>, with one verifiable claim per row.")
    ],
    result: [
      b("证据表列包含：主题、主张、页码、摘录线索、置信度、待确认。", "Evidence table columns include topic, claim, page, excerpt cue, confidence, and confirmation needed."),
      b("摘要不能替代原文；关键决策必须回到页码核查。", "The summary does not replace the original; key decisions must be checked against page numbers."),
      b("长文档按章节分批处理，避免遗漏后半部分。", "Long documents are processed by chapter to avoid missing later sections.")
    ],
    pitfalls: [
      b("不要把没有页码的总结当成证据。", "Do not treat summaries without page numbers as evidence."),
      b("PDF 文字提取可能错行，金额和日期要特别复核。", "PDF text extraction can break lines; amounts and dates need extra review."),
      b("一条证据承载多个主张会导致后续难以核查。", "One evidence row carrying multiple claims becomes hard to review later.")
    ],
    taskOrder: [
      b("请先建立文档结构和页码范围，再做摘要。", "Build document structure and page ranges before summarizing."),
      b("请输出证据表，每条主张必须带页码和摘录线索。", "Output an evidence table; every claim must include page number and excerpt cue."),
      b("请集中列出不确定项，不要补写文档没有的信息。", "Centralize uncertainties and do not add information absent from the document.")
    ]
  },
  {
    path: "recipes/learning-plan.html",
    title: b("10 API 变更影响分析", "10 API Change Impact Analysis"),
    navTitle: b("10 API 影响分析", "10 API impact"),
    summary: b("把接口变更说明转成影响范围、改动清单、测试点和上线风险。", "Turn API change notes into impacted areas, change list, test points, and release risk."),
    domain: b("产品技术", "Product engineering"),
    entry: b("变更说明 + 本地代码只读扫描", "Change notes plus read-only local code scan"),
    evidence: b("端点清单、调用位置、测试建议、风险表", "Endpoint list, call sites, test suggestions, and risk table"),
    risk: b("中到高", "Medium to high"),
    environment: [
      b("准备变更说明、版本号、预期上线时间和相关模块名。", "Prepare change notes, version, expected release date, and related module names."),
      b("本地代码先只读扫描，找调用位置，不直接改实现。", "Scan local code read-only first to find call sites without changing implementation."),
      b("区分破坏性变更、可选字段、新限制和文档澄清。", "Separate breaking changes, optional fields, new limits, and documentation clarifications.")
    ],
    playbook: [
      b("先把变更拆成端点、字段、鉴权、限额、错误码五类。", "Break changes into endpoints, fields, auth, limits, and error codes first."),
      b("再搜索本地调用位置，标注直接影响和间接影响。", "Then search local call sites and mark direct and indirect impact."),
      b("最后输出测试矩阵和发布前确认项。", "Finally output a test matrix and pre-release confirmations.")
    ],
    steps: [
      b("读取变更说明，生成变更表：旧行为、新行为、影响级别。", "Read change notes and create a table: old behavior, new behavior, and impact level."),
      b("只读搜索端点名、字段名和错误码，列出文件路径与用途。", "Read-only search endpoint names, field names, and error codes; list file paths and usage."),
      b("生成测试建议：正常路径、缺字段、错误码、超限和回退。", "Generate test suggestions for happy path, missing fields, error codes, limits, and rollback.")
    ],
    result: [
      b("影响分析包含模块、调用点、风险、建议修改和验证方式。", "Impact analysis includes modules, call sites, risks, recommended changes, and validation method."),
      b("无法确认的接口行为标记为待核对，不写成结论。", "Unconfirmed API behavior is marked for review, not written as a conclusion."),
      b("上线前必须有人确认版本号、环境和回退方案。", "Before release, someone must confirm version, environment, and rollback plan.")
    ],
    pitfalls: [
      b("只读变更说明不够，必须搜索真实调用位置。", "Reading change notes is not enough; actual call sites must be searched."),
      b("字段新增也可能破坏解析、类型校验或展示逻辑。", "New fields can still break parsing, type validation, or display logic."),
      b("不要把未验证的环境行为当成全局行为。", "Do not treat unverified environment behavior as universal.")
    ],
    taskOrder: [
      b("请先把这份接口变更拆成影响表，不要修改代码。", "First split this API change into an impact table; do not edit code."),
      b("请只读搜索本地调用点，并输出模块、路径和风险。", "Read-only search local call sites and output modules, paths, and risks."),
      b("请给出测试矩阵和发布前人工确认项。", "Provide a test matrix and human confirmations before release.")
    ]
  },
  {
    path: "recipes/support-triage.html",
    title: b("11 发布说明与变更日志生成", "11 Release Notes and Changelog Drafting"),
    navTitle: b("11 发布说明", "11 Release notes"),
    summary: b("从提交摘要、Issue 和 PR 信息整理出可发布的版本说明和内部变更日志。", "Create publishable release notes and an internal changelog from commit summaries, issues, and pull requests."),
    domain: b("版本发布", "Release communication"),
    entry: b("本地 Git 信息 + 人工复核", "Local Git information plus human review"),
    evidence: b("提交范围、分类表、草稿、待确认项", "Commit range, category table, draft, and confirmation items"),
    risk: b("中", "Medium"),
    environment: [
      b("确认版本范围，例如上一个 tag 到当前 main。", "Confirm the version range, such as previous tag to current main."),
      b("准备发布对象：用户、内部团队、维护者或客户支持。", "Prepare target readers: users, internal team, maintainers, or support."),
      b("敏感功能、未发布功能和客户名称必须人工确认是否可写。", "Sensitive features, unreleased features, and customer names require human confirmation before inclusion.")
    ],
    playbook: [
      b("先把变更分成新增、修复、改进、文档、内部维护。", "First classify changes into added, fixed, improved, docs, and internal maintenance."),
      b("把技术提交翻译成用户能理解的影响，不夸大结果。", "Translate technical commits into user-visible impact without exaggeration."),
      b("输出公开版和内部版，避免把内部细节放进公开说明。", "Output public and internal versions so internal details are not placed in public notes.")
    ],
    steps: [
      b("读取提交范围，过滤合并噪音和纯格式化变更。", "Read the commit range and filter merge noise and formatting-only changes."),
      b("按用户影响排序，高风险修复和破坏性变更提前写。", "Sort by user impact, putting high-risk fixes and breaking changes early."),
      b("生成草稿后列出需要人工确认的功能名、日期和兼容性描述。", "After drafting, list feature names, dates, and compatibility wording needing human confirmation.")
    ],
    result: [
      b("交付物包含公开发布说明、内部变更日志和待确认清单。", "Deliverables include public release notes, internal changelog, and confirmation checklist."),
      b("每条公开说明都能回到提交或 Issue。", "Every public note maps back to a commit or issue."),
      b("发布前由用户确认语气、范围和是否遗漏重要变更。", "Before publication, the user confirms tone, scope, and whether important changes are missing.")
    ],
    pitfalls: [
      b("提交信息通常偏技术，不能直接贴给用户。", "Commit messages are usually too technical to paste directly to users."),
      b("不要公开未确认的客户、金额、事故细节或路线图承诺。", "Do not publish unconfirmed customer, amount, incident detail, or roadmap promise."),
      b("修复类变更要写影响和版本，不只写修了问题。", "Fix entries should include impact and version, not only say a bug was fixed.")
    ],
    taskOrder: [
      b("请读取这个版本范围，先输出变更分类表。", "Read this version range and first output a categorized change table."),
      b("请生成公开版和内部版发布说明，并列出待确认项。", "Generate public and internal release notes and list confirmation items."),
      b("不要加入提交或 Issue 中没有依据的功能承诺。", "Do not add feature promises not supported by commits or issues.")
    ]
  },
  {
    path: "recipes/markdown-knowledge-base.html",
    title: b("12 自动化提醒与定期检查", "12 Automation Reminders and Scheduled Checks"),
    navTitle: b("12 自动化检查", "12 Scheduled checks"),
    summary: b("把重复检查任务设计成可暂停、可复核、不会越权执行的自动化流程。", "Design repeated checks as automations that are pausable, reviewable, and unable to overstep authority."),
    domain: b("自动化治理", "Automation governance"),
    entry: b("任务规则 + 定期运行", "Task rules plus scheduled runs"),
    evidence: b("触发条件、输出样例、暂停规则、失败提醒", "Trigger conditions, sample output, pause rules, and failure notifications"),
    risk: b("中", "Medium"),
    environment: [
      b("明确自动化只做检查和提醒，不自动发布、删除、购买或发送。", "Define automation as check-and-remind only; it does not publish, delete, purchase, or send automatically."),
      b("设定运行频率、时间窗口、输入范围和停止条件。", "Set frequency, time window, input scope, and stop conditions."),
      b("准备一份标准输出格式，便于每次结果可比较。", "Prepare a standard output format so results can be compared across runs.")
    ],
    playbook: [
      b("先手动跑一次，确认任务说明、权限和结果格式。", "Run manually once to confirm task brief, permissions, and output format."),
      b("再设定自动化，只让它输出摘要、异常和建议。", "Then schedule automation to output only summaries, anomalies, and suggestions."),
      b("每条自动化都要有暂停方式和负责人。", "Every automation needs a pause method and an owner.")
    ],
    steps: [
      b("写清楚检查对象、检查频率、异常定义和通知对象。", "Document check target, frequency, anomaly definition, and notification recipient."),
      b("先生成一份模拟输出，让用户确认是否足够短、准、可行动。", "Generate a mock output so the user can confirm it is concise, accurate, and actionable."),
      b("上线后记录最近三次结果，判断是否需要调低频率或改规则。", "After launch, review the last three results to decide whether frequency or rules need adjustment.")
    ],
    result: [
      b("自动化输出包含状态、变化、异常、建议和需要人工确认的动作。", "Automation output includes status, changes, anomalies, suggestions, and actions needing human confirmation."),
      b("如果连续多次没有价值，应暂停或降低频率。", "If it has no value across repeated runs, pause it or reduce frequency."),
      b("任何会改变外部状态的动作都不放进自动化执行。", "Any action that changes external state is excluded from automated execution.")
    ],
    pitfalls: [
      b("不要把模糊目标做成自动化，先把判断规则写清楚。", "Do not automate vague goals; define judgment rules first."),
      b("提醒过长会被忽略，输出要固定、短、可扫读。", "Long reminders get ignored; output should be fixed, short, and scannable."),
      b("自动化不是免审，异常仍要人工判断。", "Automation does not remove review; anomalies still need human judgment.")
    ],
    taskOrder: [
      b("请先把这个重复任务改写成检查规则和标准输出格式。", "First rewrite this recurring task into check rules and a standard output format."),
      b("请生成一次模拟结果，确认后再建立定期提醒。", "Generate one mock result; schedule reminders only after confirmation."),
      b("自动化只提醒，不执行发布、删除、发送或付款。", "The automation only reminds; it does not publish, delete, send, or pay.")
    ]
  },
  {
    path: "recipes/github-release.html",
    title: b("13 日志报错定位与修复建议", "13 Log Error Diagnosis and Fix Proposal"),
    navTitle: b("13 日志报错诊断", "13 Log diagnosis"),
    summary: b("把终端报错、构建日志或服务日志整理成根因假设、验证命令和最小修复建议。", "Turn terminal errors, build logs, or service logs into root-cause hypotheses, verification commands, and minimal fix proposals."),
    domain: b("排障修复", "Troubleshooting"),
    entry: b("日志片段 + 本地只读检查", "Log snippets plus local read-only inspection"),
    evidence: b("错误片段、相关文件、验证命令、修复范围", "Error snippet, related files, verification commands, and fix scope"),
    risk: b("中", "Medium"),
    environment: [
      b("提供完整错误上下文：命令、时间、环境、最近改动和重现步骤。", "Provide complete error context: command, time, environment, recent changes, and reproduction steps."),
      b("敏感日志先脱敏，尤其是 token、邮箱、路径中的私人信息。", "Redact sensitive logs first, especially tokens, emails, and personal path segments."),
      b("先只读定位，不直接运行破坏性命令。", "Locate the issue read-only first and do not run destructive commands.")
    ],
    playbook: [
      b("先分离症状、直接错误、可能根因和需要验证的假设。", "Separate symptom, direct error, possible root cause, and hypotheses to validate."),
      b("用最小命令验证假设，不扩大改动范围。", "Use minimal commands to validate hypotheses without expanding change scope."),
      b("修复建议必须包含回退方式和验收命令。", "Fix proposals must include rollback method and acceptance commands.")
    ],
    steps: [
      b("读取错误前后 30 行，找到第一个有意义的失败点。", "Read 30 lines around the error and find the first meaningful failure point."),
      b("搜索相关配置、脚本和依赖声明，确认是否版本、路径或权限问题。", "Search related config, scripts, and dependency declarations to confirm version, path, or permission issues."),
      b("输出两档建议：最小修复和后续加固。", "Output two tiers of recommendations: minimal fix and follow-up hardening.")
    ],
    result: [
      b("排障记录包含根因排序、验证命令、建议补丁、风险和回退方式。", "The diagnosis includes ranked root causes, verification commands, proposed patch, risk, and rollback method."),
      b("最小修复只处理当前失败，不顺手重构无关模块。", "The minimal fix addresses the current failure without refactoring unrelated modules."),
      b("最终验收用原失败命令和相关检查命令复跑。", "Final acceptance reruns the original failing command and related checks.")
    ],
    pitfalls: [
      b("最后一行错误不一定是根因，常常只是连锁失败。", "The last error line is not always the root cause; it is often a cascading failure."),
      b("不要用清缓存、重装、回滚覆盖真正原因，除非已经验证。", "Do not use cache clearing, reinstall, or rollback to mask the real cause unless verified."),
      b("破坏性命令必须明确说明后果并等待确认。", "Destructive commands must explain consequences and wait for confirmation.")
    ],
    taskOrder: [
      b("请根据这段日志先输出根因假设，不要直接修改文件。", "Use this log to output root-cause hypotheses first; do not edit files directly."),
      b("请给出每个假设的验证命令和预期结果。", "Provide validation commands and expected results for each hypothesis."),
      b("确认根因后再提出最小修复、回退方式和验收命令。", "After confirming the root cause, propose the minimal fix, rollback method, and acceptance commands.")
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

function recipeSections(recipe) {
  return [
    section(
      b("任务背景", "Task Background"),
      recipe.summary,
      [
        b(`场景：${recipe.domain.zh}。`, `Scenario: ${recipe.domain.en}.`),
        b(`入口：${recipe.entry.zh}。`, `Entry: ${recipe.entry.en}.`),
        b(`证据：${recipe.evidence.zh}。`, `Evidence: ${recipe.evidence.en}.`)
      ]
    ),
    section(
      b("环境与材料", "Environment and Materials"),
      b("先把可用环境、允许读取的材料和禁止动作写清楚，再让 Codex 开始处理。", "Define the available environment, allowed materials, and prohibited actions before Codex starts processing."),
      recipe.environment
    ),
    section(
      b("操作剧本", "Operating Script"),
      b("把任务拆成可观察的步骤，要求 Codex 先说明处理方式，再产出文件、表格或报告。", "Split the task into observable steps and ask Codex to state the handling method before producing files, tables, or reports."),
      recipe.playbook
    ),
    section(
      b("关键步骤", "Key Steps"),
      b("每一步都要留下中间结果，避免只得到一份无法复查的最终文本。", "Every step should leave an intermediate result instead of only producing final text that cannot be reviewed."),
      recipe.steps
    ),
    section(
      b("过程证据", "Evidence Trail"),
      b("实战案例的价值不在于说做完了，而在于能展示做了什么、怎么判断、哪里需要人确认。", "The value of a practical recipe is not saying it is done, but showing what was done, how it was judged, and what needs human confirmation."),
      [
        b(`本案例的核心证据是：${recipe.evidence.zh}。`, `The core evidence for this recipe is: ${recipe.evidence.en}.`),
        b("证据文件和截图应使用稳定命名，方便回看和比对。", "Evidence files and screenshots should use stable names for review and comparison."),
        b("不确定项必须集中记录，不夹在正文里被忽略。", "Uncertainties must be centralized instead of being buried in body text.")
      ]
    ),
    section(
      b("结果样例", "Result Sample"),
      b("输出必须能被另一个人独立检查，不能只是一段聊天记录。", "The output must be independently reviewable by another person, not just a chat transcript."),
      recipe.result
    ),
    section(
      b("踩坑记录", "Pitfalls"),
      b("以下问题在真实任务中最容易导致返工，应在任务单里提前写明。", "The following issues most often cause rework in real tasks and should be stated in the work order up front."),
      recipe.pitfalls
    ),
    section(
      b("风险边界", "Risk Boundaries"),
      b("Codex 可以协助分析、生成和检查，但账号动作、公开发布和高风险改动必须由用户确认。", "Codex can assist with analysis, generation, and checking, but account actions, publication, and high-risk changes require user confirmation."),
      recipe.taskOrder.slice(-1).concat([
        b("保留原始材料或原始文件，改动版使用新文件名。", "Keep original materials or files and use a new filename for edited versions."),
        b("涉及金额、日期、权限、对外承诺和个人信息时，必须人工复核。", "Amounts, dates, permissions, external promises, and personal information must be manually reviewed.")
      ])
    ),
    section(
      b("可复用任务单", "Reusable Work Order"),
      b("把下面三句复制成任务起点，再替换成自己的材料、约束和验收方式。", "Use the following three lines as the starting work order, then replace them with your own materials, constraints, and acceptance method."),
      recipe.taskOrder
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
        b("每篇案例都按真实任务复盘写法组织。先看任务背景，再看材料、剧本、证据、结果、踩坑和验收方式。", "Each recipe is structured like a real task retrospective. Read task background first, then materials, script, evidence, results, pitfalls, and acceptance."),
        [
          b("看入口：任务适合桌面端、浏览器、本地仓库还是定期检查。", "Entry: whether the task fits desktop, browser, local repository, or scheduled checks."),
          b("看证据：截图、diff、表格、日志或导出文件是否足够验收。", "Evidence: whether screenshots, diffs, tables, logs, or exports are sufficient for acceptance."),
          b("看边界：哪些按钮、账号动作和公开发布必须保留给用户。", "Boundary: which buttons, account actions, and publication steps must stay with the user."),
          b("看复用：把任务单替换成自己的材料和限制，而不是照搬示例。", "Reuse: replace the work order with your own materials and constraints instead of copying the sample.")
        ]
      ),
      section(
        b("案例清单", "Recipe list"),
        b("以下案例全部使用中性任务材料，覆盖演示稿、浏览器检查、发布排障、文档站改版、知识库、表格、截图规格、登录态只读检查、文档摘要、API、发布说明、自动化和日志排障。", "The recipes use neutral task materials across decks, browser review, deployment diagnosis, documentation redesign, knowledge bases, spreadsheets, screenshot specs, authenticated read-only review, document summaries, API impact, release notes, automation, and log diagnosis."),
        caseRecipes.map((item) => b(`<a href="${relativeLink("recipes/index.html", item.path)}">${item.title.zh}</a>`, `<a href="${relativeLink("recipes/index.html", item.path)}">${item.title.en}</a>`))
      )
    ],
    links: [
      link("recipes/newsletter-brief.html", "从演示稿案例开始", "Start with the deck recipe"),
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
      meta: statusMeta(b("业务人员、创作者、项目维护者", "Operators, creators, and project maintainers"), b("35-60 分钟", "35-60 minutes"), recipe.risk),
      sections: recipeSections(recipe),
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
