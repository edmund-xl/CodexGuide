# 05 Markdown 知识库重整 - 验收 Runbook

## 中文

### 命令与人工步骤
- `rg --files notes-working | sort`
- `rg -n "^title:|^date:|^topic:|^status:" notes-working`
- `git diff -- notes-working index.md pending-review.md`

### 验收标准
- 每篇笔记都有统一字段或明确待补标记。
- index.md 能按主题和状态快速定位材料。
- pending-review.md 集中列出需要人工补充的信息。
- 样本 diff 可读，单篇文件可回退。

### 失败与修正
- 自动猜日期：文件名年份被误当成完整日期；只保留可证明日期，其他标待补
- 索引太像目录：初版只列文件名，无法行动；改为 topic、status、next_action 三列
- 批量范围过大：一次改全部文件难以审阅；先做样本 diff 再批量

## English

### Commands and Manual Steps
- `rg --files notes-working | sort`
- `rg -n "^title:|^date:|^topic:|^status:" notes-working`
- `git diff -- notes-working index.md pending-review.md`

### Acceptance Criteria
- Every note has consistent fields or explicit pending markers.
- index.md supports quick lookup by topic and status.
- pending-review.md centralizes information needing human input.
- Sample diffs are readable and individual files can be reverted.

### Failures and Corrections
- Guessed dates: Filename year was treated as full date; Keep only provable dates and mark others pending
- Index looked like a folder tree: First version listed only filenames and was not actionable; Switch to topic, status, and next_action columns
- Batch too large: Editing all files at once was hard to review; Create sample diffs before batching
