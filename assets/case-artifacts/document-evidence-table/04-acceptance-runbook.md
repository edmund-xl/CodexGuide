# 09 文档与 PDF 摘要到证据表 - 验收 Runbook

## 中文

### 命令与人工步骤
- `人工检查 evidence-table.md 每行是否包含页码和摘录线索。`
- `rg -n "待确认|低|中" evidence-table.md open-questions.md`
- `人工回到 PDF 核对所有金额、日期、责任人和限制条件。`

### 验收标准
- 证据表每行只有一个主张，且带页码。
- 摘录线索能帮助人工回到原文定位。
- 不确定项集中列入 open-questions.md。
- 会议摘要中的关键结论都能回到证据表。

### 失败与修正
- 无页码摘要：初稿只有三段摘要，无法复核；改成证据表并强制页码
- 一行多个主张：范围和日期写在同一行；每行只放一个主张
- PDF 错行：金额被拆成两行导致误读；金额日期全部人工复核

## English

### Commands and Manual Steps
- `Manually check every evidence-table.md row for page number and excerpt cue.`
- `rg -n "待确认|Low|Medium" evidence-table.md open-questions.md`
- `Manually return to the PDF to verify all amounts, dates, owners, and constraints.`

### Acceptance Criteria
- Each evidence-table row has one claim and a page number.
- Excerpt cues help humans locate the original text.
- Uncertainties are centralized in open-questions.md.
- Key conclusions in the meeting brief map back to the evidence table.

### Failures and Corrections
- No page numbers: First draft had only three paragraphs and could not be checked; Convert to an evidence table with required page numbers
- Multiple claims per row: Scope and date were in one row; Use one claim per row
- PDF line breaks: Amount split across lines and was misread; Manually review all amounts and dates
