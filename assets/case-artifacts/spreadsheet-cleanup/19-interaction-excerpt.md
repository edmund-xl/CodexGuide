# 06 表格数据清洗与异常核对 - 关键交互片段

## 中文

### 任务交代

```text
order_id,date,amount,status,note
1001,2026-05-01,199.00,paid,
1002,2026/05/02,-20.00,paid,refund?
1002,2026-05-02,20.00,paid,duplicate?
1003,,8500.00,pending,large order
```

### 助手首轮回报
- 先判断：总行数与有效订单数不一致，金额列存在负数和文本值。
- 已执行：`wc -l orders-redacted.csv`
- 证据落点：data-profile.md
- 暂不交付：重复 order_id 可能是拆单或退款

### 修正回报
- 最小修正：只标记异常，不自动删除
- 复测动作：`head -n 5 orders-redacted.csv`
- 复测证据：anomalies.csv

### 人工确认
- 不直接覆盖原 CSV。

## English

### Task Handoff

```text
order_id,date,amount,status,note
1001,2026-05-01,199.00,paid,
1002,2026/05/02,-20.00,paid,refund?
1002,2026-05-02,20.00,paid,duplicate?
1003,,8500.00,pending,large order
```

### First Assistant Report
- First judgment: Total rows and valid orders did not match, and the amount column contained negatives and text values.
- Action run: `wc -l orders-redacted.csv`
- Evidence location: data-profile.md
- Not ready yet: Duplicate order_id may be split order or refund

### Correction Report
- Minimal correction: Flag anomalies without deleting
- Retest action: `head -n 5 orders-redacted.csv`
- Retest evidence: anomalies.csv

### Human Confirmation
- Do not overwrite the original CSV.
