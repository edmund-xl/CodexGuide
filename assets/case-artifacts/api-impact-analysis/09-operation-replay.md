# 10 API 变更影响分析 - 操作回放

## 中文

### 实测快照
- 触发场景：接口字段即将调整，需要判断页面、测试、文档和调用方会受哪些影响。
- 工具链：schema diff、调用点搜索、测试清单、迁移说明。
- 第一信号：字段名变化影响了 5 个调用点，其中 2 个在测试里。
- 完成信号：影响表列出 owner、文件路径、修改建议和验证命令。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 差异读取 | 读取 schema-before.json 与 schema-after.json | removed=1, added=1, renamed_candidate=1 | schema-diff.md |
| 调用点搜索 | rg "legacy_status|status_code" src test docs | matches=5, tests=2, docs=1 | call-sites.csv |
| 验收清单 | 生成 migration-checklist.md | owners=3, commands=4 | migration-checklist.md |

## English

### Run Snapshot
- Trigger: An API field change was planned, requiring impact analysis across pages, tests, docs, and callers.
- Toolchain: Schema diff, caller search, test checklist, and migration notes.
- First Signal: The field rename affected five call sites, two of them in tests.
- Done Signal: The impact table listed owner, file path, change suggestion, and verification command.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Diff read | Read schema-before.json and schema-after.json | removed=1, added=1, renamed_candidate=1 | schema-diff.md |
| Caller search | rg "legacy_status|status_code" src test docs | matches=5, tests=2, docs=1 | call-sites.csv |
| Acceptance list | Generate migration-checklist.md | owners=3, commands=4 | migration-checklist.md |
