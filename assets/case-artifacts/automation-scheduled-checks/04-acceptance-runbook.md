# 12 自动化提醒与定期检查 - 验收 Runbook

## 中文

### 命令与人工步骤
- `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/`
- `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/recipes/index.html`
- `人工确认自动化输出没有发布、删除、发送或付款动作。`

### 验收标准
- 任务规则可被执行，异常定义明确。
- 模拟输出短、准、可行动。
- 暂停条件、负责人和失败提醒写清楚。
- 自动化不包含任何越权动作。

### 失败与修正
- 目标太泛：检查网站是否正常无法判断；改为 URL、状态码和页面标记
- 提醒太长：输出像完整报告，难以扫读；限制为状态、变化、异常、建议
- 越权修复：自动化试图提交修复；明确只提醒，不修复

## English

### Commands and Manual Steps
- `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/`
- `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/recipes/index.html`
- `Manually confirm automation output contains no publish, delete, send, or payment action.`

### Acceptance Criteria
- Task rules are executable and anomaly definition is explicit.
- Mock output is short, precise, and actionable.
- Pause condition, owner, and failure notification are clear.
- Automation contains no overstepping action.

### Failures and Corrections
- Goal too vague: Check whether site is OK was not measurable; Use URL, status code, and page marker
- Reminder too long: Output read like a full report and was hard to scan; Limit to status, change, anomaly, suggestion
- Overstepping fix: Automation attempted to commit fixes; State reminder-only, no fixes
