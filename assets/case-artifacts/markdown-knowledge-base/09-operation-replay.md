# 05 Markdown 知识库重整 - 操作回放

## 中文

### 实测快照
- 触发场景：散乱 Markdown 笔记需要按主题、状态和待补事项重整，且保留回退依据。
- 工具链：文件清单、frontmatter 检查、主题索引、样本 diff。
- 第一信号：同一主题有三个命名方式，部分笔记没有 owner 和 status。
- 完成信号：12 篇笔记完成统一头部，索引能按主题和待补项检索。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 盘点 | find notes-working -name '*.md' | 12 files, 5 missing frontmatter | inventory.txt |
| 重整 | 生成 topic-index.md 和 pending-review.md | topics=4, pending=7 | topic-index.md |
| 回退依据 | 保留 sample.diff | renamed=3, content_deleted=0 | sample.diff |

## English

### Run Snapshot
- Trigger: Loose Markdown notes needed organization by topic, state, and missing items while preserving rollback evidence.
- Toolchain: File inventory, frontmatter check, topic index, and sample diff.
- First Signal: The same topic had three naming styles and some notes had no owner or status.
- Done Signal: Twelve notes received consistent headers, and the index supports topic and missing-item lookup.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Inventory | find notes-working -name '*.md' | 12 files, 5 missing frontmatter | inventory.txt |
| Restructure | Generate topic-index.md and pending-review.md | topics=4, pending=7 | topic-index.md |
| Rollback basis | Keep sample.diff | renamed=3, content_deleted=0 | sample.diff |
