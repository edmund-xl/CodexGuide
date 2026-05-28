# 12 自动化提醒与定期检查

## 中文

### 任务摘要
把重复检查任务设计成只提醒、不越权的自动化流程，先手动试跑，再确认频率、暂停规则和输出格式。

### 可读取材料
- 自动化只做检查和提醒，不自动发布、删除、购买或发送。
- 先手动跑一次，确认任务说明、权限和输出格式。
- 每条自动化都写清负责人、暂停方式和失败通知。

### 输入样例

```text
重复任务
每周一检查文档站是否能访问
检查对象：首页、案例总览、使用规范页
输出：状态、异常、建议
限制：只检查和提醒，不自动修复、不自动提交
```

## English

### Task Summary
Design a recurring check as a reminder-only automation that does not overstep, with a manual trial before confirming frequency, pause rules, and output format.

### Readable Materials
- Automation checks and reminds only; it does not publish, delete, purchase, or send automatically.
- Run once manually to confirm task brief, permissions, and output format.
- Every automation states owner, pause method, and failure notification.

### Input Sample

```text
Recurring task
Every Monday, check whether the documentation site is reachable
Targets: home, recipe index, usage policy
Output: status, anomalies, suggestions
Constraint: check and remind only; do not auto-fix or auto-commit
```
