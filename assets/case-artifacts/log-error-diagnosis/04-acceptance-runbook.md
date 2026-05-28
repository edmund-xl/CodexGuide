# 13 日志报错定位与修复建议 - 验收 Runbook

## 中文

### 命令与人工步骤
- `npm run check`
- `rg -n "old-page|missing local target|recipes/" scripts recipes README.md`
- `npm run build && npm run check && git diff --check`

### 验收标准
- 诊断记录包含症状、直接错误、根因假设、验证结果和最小修复。
- 每个假设都有验证命令和预期结果。
- 修复建议包含回退方式和验收命令。
- 最终用原失败命令和相关检查命令复跑通过。

### 失败与修正
- 只看最后一行：最后一行是连锁失败，不是根因；读取错误前后上下文
- 清缓存掩盖问题：清缓存后短暂通过但路径仍旧；用搜索确认真实根因
- 修复范围扩大：顺手重构无关样式；最小修复只处理当前失败

## English

### Commands and Manual Steps
- `npm run check`
- `rg -n "old-page|missing local target|recipes/" scripts recipes README.md`
- `npm run build && npm run check && git diff --check`

### Acceptance Criteria
- Diagnosis includes symptom, direct error, root-cause hypotheses, validation result, and minimal fix.
- Every hypothesis has a validation command and expected result.
- Fix proposal includes rollback method and acceptance commands.
- Final acceptance reruns the original failing command and related checks successfully.

### Failures and Corrections
- Last line only: The last line was a cascading failure, not root cause; Read context around the error
- Cache clearing masked issue: Clearing cache briefly passed but path remained old; Use search to confirm real cause
- Fix scope expanded: Unrelated style refactor was added; Minimal fix addresses only current failure
