# 06 表格数据清洗与异常核对 - 验收 Runbook

## 中文

### 命令与人工步骤
- `wc -l orders-redacted.csv`
- `head -n 5 orders-redacted.csv`
- `rg -n ",,|-[0-9]+\.|pending" orders-redacted.csv`

### 验收标准
- 数据画像写清行数、列数、空值、重复和范围异常。
- 异常表保留原始行号和建议动作。
- 清理版不覆盖原始 CSV。
- 所有业务判断进入人工复核表。

### 失败与修正
- 误删重复行：重复 order_id 可能是拆单或退款；只标记异常，不自动删除
- 自动补空值：空日期被填成当天日期；缺失值保持空并进入复核表
- 丢失原始行号：复核表无法定位原 CSV 行；所有输出增加 original_row

## English

### Commands and Manual Steps
- `wc -l orders-redacted.csv`
- `head -n 5 orders-redacted.csv`
- `rg -n ",,|-[0-9]+\.|pending" orders-redacted.csv`

### Acceptance Criteria
- Data profile states row count, column count, blanks, duplicates, and range anomalies.
- Anomaly table preserves original row numbers and suggested actions.
- Cleaned version does not overwrite the source CSV.
- All business judgments go into the human review sheet.

### Failures and Corrections
- Deleted duplicate row: Duplicate order_id may be split order or refund; Flag anomalies without deleting
- Filled blanks automatically: Blank date was filled with today; Keep blanks and put them in the review sheet
- Lost source row: Review sheet could not locate source CSV row; Add original_row to every output
