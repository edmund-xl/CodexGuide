# 05 Markdown 知识库重整 - 关键交互片段

## 中文

### 任务交代

```text
notes-working/
  2025-ideas.md       # 无 frontmatter，标题重复
  meeting-ai.md       # 有标题，无日期
  draft-launch.md     # 状态不清楚
目标字段: title, date, topic, status, summary, next_action
```

### 助手首轮回报
- 先判断：同一主题有三个命名方式，部分笔记没有 owner 和 status。
- 已执行：`rg --files notes-working | sort`
- 证据落点：missing-fields.md
- 暂不交付：文件名年份被误当成完整日期

### 修正回报
- 最小修正：只保留可证明日期，其他标待补
- 复测动作：`rg -n "^title:|^date:|^topic:|^status:" notes-working`
- 复测证据：sample-diff.patch

### 人工确认
- 原文只移动和补元数据，不删除正文。

## English

### Task Handoff

```text
notes-working/
  2025-ideas.md       # no frontmatter, duplicate heading
  meeting-ai.md       # has title, no date
  draft-launch.md     # unclear status
Target fields: title, date, topic, status, summary, next_action
```

### First Assistant Report
- First judgment: The same topic had three naming styles and some notes had no owner or status.
- Action run: `rg --files notes-working | sort`
- Evidence location: missing-fields.md
- Not ready yet: Filename year was treated as full date

### Correction Report
- Minimal correction: Keep only provable dates and mark others pending
- Retest action: `rg -n "^title:|^date:|^topic:|^status:" notes-working`
- Retest evidence: sample-diff.patch

### Human Confirmation
- Original text is moved and annotated, not deleted.
