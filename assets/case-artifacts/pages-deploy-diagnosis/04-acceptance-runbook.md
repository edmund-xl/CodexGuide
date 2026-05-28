# 03 GitHub Pages 部署失败诊断 - 验收 Runbook

## 中文

### 命令与人工步骤
- `npm run build && npm run check && git diff --check`
- `git status --short --branch`
- `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/`

### 验收标准
- 本地 build 和 check 均通过。
- 失败记录写清现象、失败步骤、根因、修复和验证命令。
- 新 run 的 build 与 deploy 均为 success。
- 线上地址返回 200，并能看到新页面内容。

### 失败与修正
- 只看邮件：邮件没有第一个失败步骤；必须打开 job steps
- 旧 run 误判：修复后旧 run 仍显示失败；以新提交触发的新 run 为准
- 缓存延迟：线上页面短时间仍显示旧内容；用响应头和页面标题共同判断

## English

### Commands and Manual Steps
- `npm run build && npm run check && git diff --check`
- `git status --short --branch`
- `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/`

### Acceptance Criteria
- Local build and check both pass.
- Incident record states symptom, failed step, root cause, fix, and verification commands.
- The new run has build and deploy both successful.
- Live URL returns 200 and displays the new page content.

### Failures and Corrections
- Email-only diagnosis: Email did not show the first failed step; Open job steps
- Old run confusion: Old run still showed failure after fix; Use the new run from the new commit
- Cache delay: Live page briefly showed old content; Check both response headers and page title
