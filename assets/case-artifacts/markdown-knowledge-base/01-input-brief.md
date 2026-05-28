# 05 Markdown 知识库重整

## 中文

### 任务摘要
把散乱 Markdown 笔记整理成统一 frontmatter、主题索引和待补清单，并保留样本 diff 便于回退。

### 可读取材料
- 只处理笔记目录副本，原始目录保持只读。
- 统一字段为 title、date、topic、status、summary、next_action。
- 缺失字段标记为待补，不猜作者、日期或结论。

### 输入样例

```text
notes-working/
  2025-ideas.md       # 无 frontmatter，标题重复
  meeting-ai.md       # 有标题，无日期
  draft-launch.md     # 状态不清楚
目标字段: title, date, topic, status, summary, next_action
```

## English

### Task Summary
Restructure scattered Markdown notes into consistent frontmatter, a topic index, and a pending list while keeping sample diffs for rollback.

### Readable Materials
- Only the copied notes folder is processed; the original folder stays read-only.
- Consistent fields are title, date, topic, status, summary, and next_action.
- Missing fields are marked pending; author, date, and conclusion are not guessed.

### Input Sample

```text
notes-working/
  2025-ideas.md       # no frontmatter, duplicate heading
  meeting-ai.md       # has title, no date
  draft-launch.md     # unclear status
Target fields: title, date, topic, status, summary, next_action
```
