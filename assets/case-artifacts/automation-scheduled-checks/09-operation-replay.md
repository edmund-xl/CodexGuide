# 12 自动化提醒与定期检查 - 操作回放

## 中文

### 实测快照
- 触发场景：重复检查任务容易遗漏，需要转成定期提醒并保留失败处理方式。
- 工具链：任务说明、频率、退出条件、失败通知、人工确认。
- 第一信号：原始需求只有“每天看一下”，没有说什么时候停。
- 完成信号：自动化记录包含频率、检查内容、停止条件和失败摘要格式。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 任务拆解 | 写清检查对象、时间、成功/失败条件 | target=1, cadence=daily, stop_condition=defined | automation-brief.md |
| 提醒配置 | 创建定期检查任务 | status=active, next_run_recorded=true | schedule-record.md |
| 失败处理 | 定义失败摘要模板 | fields=trigger, evidence, action_needed | failure-template.md |

## English

### Run Snapshot
- Trigger: A repeated check was easy to miss and needed a scheduled reminder with failure handling.
- Toolchain: Task brief, cadence, exit condition, failure notification, and human confirmation.
- First Signal: The original ask only said 'check daily' and did not define when to stop.
- Done Signal: The automation record includes cadence, checks, stop condition, and failure-summary format.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Task split | Define target, time, success, and failure conditions | target=1, cadence=daily, stop_condition=defined | automation-brief.md |
| Reminder setup | Create scheduled check task | status=active, next_run_recorded=true | schedule-record.md |
| Failure handling | Define failure summary template | fields=trigger, evidence, action_needed | failure-template.md |
