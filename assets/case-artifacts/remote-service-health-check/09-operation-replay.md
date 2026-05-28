# 14 远程服务健康检查与修复建议 - 操作回放

## 中文

### 实测快照
- 触发场景：远程服务短时间内多次 5xx，需要只读确认健康状态并提出最小修复建议。
- 工具链：健康端点、时间窗口、日志摘要、回滚建议、人工审批。
- 第一信号：10:12 到 10:19 错误率升高，重启不是第一步。
- 完成信号：只读确认超时集中在一个下游调用，给出限流和回滚两条建议。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 健康检查 | curl -fsS /healthz | status=degraded, latency_p95=1800ms | healthz.txt |
| 日志窗口 | 读取 10:12-10:19 脱敏日志摘要 | 5xx=37, timeout_service=billing-sync | log-window.md |
| 建议 | 生成 incident-note.md | actions=rate-limit, rollback; approval_required=true | incident-note.md |

## English

### Run Snapshot
- Trigger: A remote service produced repeated 5xx responses, requiring read-only health confirmation and minimal fix suggestions.
- Toolchain: Health endpoint, time window, log summary, rollback suggestion, and human approval.
- First Signal: Error rate rose from 10:12 to 10:19, and restart was not the first step.
- Done Signal: Read-only checks showed timeouts concentrated in one downstream call, producing rate-limit and rollback options.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Health check | curl -fsS /healthz | status=degraded, latency_p95=1800ms | healthz.txt |
| Log window | Read redacted logs from 10:12-10:19 | 5xx=37, timeout_service=billing-sync | log-window.md |
| Recommendation | Generate incident-note.md | actions=rate-limit, rollback; approval_required=true | incident-note.md |
