# 09 文档与 PDF 摘要到证据表 - 关键交互片段

## 中文

### 任务交代

```text
摘要目标
文档：project-brief-redacted.pdf
用途：准备 30 分钟评审会
重点：交付范围、日期、风险、待确认责任人
输出：证据表 + 三段会议摘要 + 问题清单
```

### 助手首轮回报
- 先判断：初稿把事实和推断混在同一列，无法复核。
- 已执行：`人工检查 evidence-table.md 每行是否包含页码和摘录线索。`
- 证据落点：summary-brief.md
- 暂不交付：初稿只有三段摘要，无法复核

### 修正回报
- 最小修正：改成证据表并强制页码
- 复测动作：`rg -n "待确认|低|中" evidence-table.md open-questions.md`
- 复测证据：evidence-table.md

### 人工确认
- 无法读取的扫描页不做事实结论。

## English

### Task Handoff

```text
Summary goal
Document: project-brief-redacted.pdf
Use: prepare a 30-minute review meeting
Focus: delivery scope, dates, risks, owners needing confirmation
Output: evidence table + three-paragraph meeting brief + question list
```

### First Assistant Report
- First judgment: The first draft mixed facts and inference in one column, making review difficult.
- Action run: `Manually check every evidence-table.md row for page number and excerpt cue.`
- Evidence location: summary-brief.md
- Not ready yet: First draft had only three paragraphs and could not be checked

### Correction Report
- Minimal correction: Convert to an evidence table with required page numbers
- Retest action: `rg -n "待确认|Low|Medium" evidence-table.md open-questions.md`
- Retest evidence: evidence-table.md

### Human Confirmation
- Do not make factual claims from unreadable scanned pages.
