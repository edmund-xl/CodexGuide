# 11 发布说明与变更日志生成 - 验收 Runbook

## 中文

### 命令与人工步骤
- `git log --oneline v0.8.0..HEAD`
- `git diff --name-only v0.8.0..HEAD`
- `人工核对 release-notes.md 中每条是否能回到提交或 Issue。`

### 验收标准
- 公开版和内部版分开，内容边界清楚。
- 每条公开说明都有提交、Issue 或明确依据。
- 破坏性变更、迁移要求和风险项被单独标出。
- 发布前确认清单包含版本、日期、语气和敏感项。

### 失败与修正
- 提交直贴：技术提交对用户不可读；改写成用户影响
- 公开内部细节：内部事故线索进入公开版；分公开版和内部版
- 遗漏破坏性变更：URL 改名未提前说明；破坏性变更单独分组

## English

### Commands and Manual Steps
- `git log --oneline v0.8.0..HEAD`
- `git diff --name-only v0.8.0..HEAD`
- `Manually verify each release-notes.md item maps back to a commit or issue.`

### Acceptance Criteria
- Public and internal versions are separate with clear boundaries.
- Every public note has a commit, issue, or clear basis.
- Breaking changes, migration requirements, and risks are separately marked.
- Pre-publication checklist includes version, date, tone, and sensitive items.

### Failures and Corrections
- Raw commits pasted: Technical commits were unreadable to users; Rewrite as user impact
- Internal detail exposed: Internal incident cues entered public notes; Separate public and internal versions
- Breaking change missed: URL rename was not called out; Put breaking changes in a separate group
