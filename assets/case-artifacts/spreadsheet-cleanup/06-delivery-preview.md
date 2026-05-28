# 06 表格数据清洗与异常核对 - 交付预览

## 中文

### 最终交付
- data-profile.md、anomalies.csv、review-sheet.csv

### 关键证据
- 数据画像：4 行、5 列，order_id 有重复，date 有缺失
- 重复检测：order_id=1002 出现 2 次，金额符号不一致

### 主要修正
- 误删重复行：只标记异常，不自动删除

### 终审动作
- 数据画像写清行数、列数、空值、重复和范围异常。
- 异常表保留原始行号和建议动作。

## English

### Final Deliverable
- data-profile.md, anomalies.csv, and review-sheet.csv

### Key Evidence
- Data profile: 4 rows, 5 columns, duplicate order_id, missing date
- Duplicate check: order_id=1002 appears twice with inconsistent amount signs

### Main Correction
- Deleted duplicate row: Flag anomalies without deleting

### Final Review Actions
- Data profile states row count, column count, blanks, duplicates, and range anomalies.
- Anomaly table preserves original row numbers and suggested actions.
