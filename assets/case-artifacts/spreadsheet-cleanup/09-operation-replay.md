# 06 表格数据清洗与异常核对 - 操作回放

## 中文

### 实测快照
- 触发场景：脱敏订单 CSV 出现空状态、异常金额和重复行，需要形成可复核清理建议。
- 工具链：CSV 画像、异常表、原始行号、人工复核列。
- 第一信号：总行数与有效订单数不一致，金额列存在负数和文本值。
- 完成信号：异常被分为 4 类，所有建议都保留原始行号。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 画像 | 读取 orders-redacted.csv 并统计字段 | rows=240, invalid_amount=6, duplicates=4 | data-profile.md |
| 异常分类 | 生成 anomalies.csv | classes=4, needs_review=18 | anomalies.csv |
| 复核表 | 写入 review-sheet.csv | all_rows_keep_original_index=true | review-sheet.csv |

## English

### Run Snapshot
- Trigger: A redacted order CSV had blank statuses, abnormal amounts, and duplicates needing reviewable cleanup suggestions.
- Toolchain: CSV profiling, anomaly table, original row numbers, and human review columns.
- First Signal: Total rows and valid orders did not match, and the amount column contained negatives and text values.
- Done Signal: Anomalies were split into four classes, with original row numbers preserved for every suggestion.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Profile | Read orders-redacted.csv and profile fields | rows=240, invalid_amount=6, duplicates=4 | data-profile.md |
| Anomaly classification | Generate anomalies.csv | classes=4, needs_review=18 | anomalies.csv |
| Review sheet | Write review-sheet.csv | all_rows_keep_original_index=true | review-sheet.csv |
