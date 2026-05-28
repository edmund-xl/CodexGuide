# 12 自动化提醒与定期检查 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 检查网站是否正常无法判断 | 改为 URL、状态码和页面标记 | automation-brief.md |
| 过程修正 | 输出像完整报告，难以扫读 | 限制为状态、变化、异常、建议 | mock-result.md |
| 交付后 | mock-result.md<br>状态：3 个页面均返回 200<br>变化：首页标题已更新为新版案例矩阵<br>异常：无<br>建议：本周无需处理；如连续 3 周无异常，可改为每两周一次 | 任务规则可被执行，异常定义明确。 | automation-brief.md、mock-result.md、pause-rules.md |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | Check whether site is OK was not measurable | Use URL, status code, and page marker | automation-brief.md |
| Correction | Output read like a full report and was hard to scan | Limit to status, change, anomaly, suggestion | mock-result.md |
| After | mock-result.md<br>Status: three pages returned 200<br>Change: home title now uses the new recipe matrix<br>Anomaly: none<br>Suggestion: no action this week; if three weeks stay clean, switch to biweekly | Task rules are executable and anomaly definition is explicit. | automation-brief.md, mock-result.md, and pause-rules.md |
