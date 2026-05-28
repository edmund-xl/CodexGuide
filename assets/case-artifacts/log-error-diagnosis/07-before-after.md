# 13 日志报错定位与修复建议 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 最后一行是连锁失败，不是根因 | 读取错误前后上下文 | npm run check |
| 过程修正 | 清缓存后短暂通过但路径仍旧 | 用搜索确认真实根因 | rg old-page |
| 交付后 | diagnosis.md<br>症状：链接检查失败，目标 recipes/old-page.html 不存在<br>根因：案例 URL 改名后，搜索索引仍使用旧路径<br>最小修复：更新 caseRecipes path 和首页入口链接<br>回退方式：恢复上一提交或改回旧 path<br>验收：npm run build && npm run check | 诊断记录包含症状、直接错误、根因假设、验证结果和最小修复。 | diagnosis.md、validation-plan.md、fix-proposal.md |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | The last line was a cascading failure, not root cause | Read context around the error | npm run check |
| Correction | Clearing cache briefly passed but path remained old | Use search to confirm real cause | rg old-page |
| After | diagnosis.md<br>Symptom: link check failed because recipes/old-page.html does not exist<br>Root cause: after recipe URL rename, search index still used the old path<br>Minimal fix: update caseRecipes path and home entry link<br>Rollback: restore previous commit or switch back to old path<br>Acceptance: npm run build && npm run check | Diagnosis includes symptom, direct error, root-cause hypotheses, validation result, and minimal fix. | diagnosis.md, validation-plan.md, and fix-proposal.md |
