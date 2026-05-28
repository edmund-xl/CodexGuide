# 06 表格数据清洗与异常核对

## 中文

### 任务摘要
对一份脱敏 CSV 做只读画像、异常分类、清理建议和人工复核表，保留原始行号便于追溯。

### 可读取材料
- CSV 已替换真实姓名、电话、证件号和完整地址。
- 唯一键为 order_id，金额单位为 CNY，允许空值字段为 note。
- 第一轮只读分析，不删除行、不覆盖原文件。

### 输入样例

```text
order_id,date,amount,status,note
1001,2026-05-01,199.00,paid,
1002,2026/05/02,-20.00,paid,refund?
1002,2026-05-02,20.00,paid,duplicate?
1003,,8500.00,pending,large order
```

## English

### Task Summary
Profile a redacted CSV read-only, classify anomalies, produce cleanup suggestions and a human review sheet, and keep original row numbers for traceability.

### Readable Materials
- The CSV has real names, phone numbers, IDs, and full addresses replaced.
- The unique key is order_id, amount unit is CNY, and allowed blank field is note.
- The first round is read-only: no rows deleted and no source file overwritten.

### Input Sample

```text
order_id,date,amount,status,note
1001,2026-05-01,199.00,paid,
1002,2026/05/02,-20.00,paid,refund?
1002,2026-05-02,20.00,paid,duplicate?
1003,,8500.00,pending,large order
```
