# 13 日志报错定位与修复建议 - 操作回放

## 中文

### 实测快照
- 触发场景：本地检查失败，需要从日志定位最小修复，不扩大到无关重构。
- 工具链：失败命令、日志片段、文件搜索、最小补丁、复跑命令。
- 第一信号：错误信息指向旧路径，但搜索结果显示还有多个入口残留。
- 完成信号：只改路径映射和入口链接，复跑检查通过。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 失败复现 | npm run check | missing local target recipes/old-case.html | check-failure.log |
| 定位 | rg "old-case|caseRecipes" scripts recipes | matches=4, generator=1 | search-results.txt |
| 复测 | npm run build && npm run check | verify passed, changed_files=2 | retest.log |

## English

### Run Snapshot
- Trigger: A local check failed and needed minimal diagnosis from logs without expanding into unrelated refactors.
- Toolchain: Failed command, log excerpt, file search, minimal patch, and rerun command.
- First Signal: The error pointed to an old path, and search results showed several stale entries.
- Done Signal: Only path mapping and entry links were changed, and the rerun passed.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Failure reproduction | npm run check | missing local target recipes/old-case.html | check-failure.log |
| Locate | rg "old-case|caseRecipes" scripts recipes | matches=4, generator=1 | search-results.txt |
| Retest | npm run build && npm run check | verify passed, changed_files=2 | retest.log |
