# 11 发布说明与变更日志生成 - 操作回放

## 中文

### 实测快照
- 触发场景：版本发布前需要从提交和工单整理发布说明，同时区分用户可见变化和内部变更。
- 工具链：提交范围、变更分组、风险标记、待确认条目。
- 第一信号：原始提交里混有重构、修复和文案调整，不能直接贴给用户。
- 完成信号：输出用户版、内部版和待确认清单三份内容。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 范围确认 | git log --oneline v0.8.0..HEAD | commits=23, merge_commits=2 | commit-range.txt |
| 分组 | 按 Added/Changed/Fixed/Risk 分组 | public_items=9, internal_items=6 | release-notes.md |
| 终审 | 列出数字、客户影响和发布时间待确认 | needs_confirmation=4 | release-review.md |

## English

### Run Snapshot
- Trigger: Before release, commits and tickets needed release notes that separate user-visible changes from internal changes.
- Toolchain: Commit range, change grouping, risk labels, and confirmation items.
- First Signal: Raw commits mixed refactors, fixes, and copy edits, so they could not be pasted to users.
- Done Signal: The output included user-facing notes, internal notes, and a confirmation list.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Range confirmation | git log --oneline v0.8.0..HEAD | commits=23, merge_commits=2 | commit-range.txt |
| Grouping | Group by Added/Changed/Fixed/Risk | public_items=9, internal_items=6 | release-notes.md |
| Final review | List numbers, customer impact, and release date for confirmation | needs_confirmation=4 | release-review.md |
