# 14 远程服务健康检查与修复建议 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 第一反应是重启服务，但没有证明根因 | 先用只读证据排序根因 | evidence/healthz-window.txt |
| 过程修正 | 只看单条 503 日志，没对齐配置变更 | 把日志、版本和配置按分钟对齐 | evidence/config-delta.txt |
| 交付后 | health-report.md<br>结论：最可能根因为连接池配置过小<br>证据：HTTP 503 时间窗与 DB_POOL_SIZE 下调一致，db_pool_wait_ms 从 320 升到 4800<br>最小修复：把 DB_POOL_SIZE 恢复到 12，观察 15 分钟<br>回退方式：保留当前配置副本，恢复失败时切回上一部署版本<br>复测：healthz 返回 200，db_pool_wait_ms 连续 5 分钟低于 500 | 根因排序至少覆盖配置、依赖、容量、网络和代码变更。 | health-report.md、repair-plan.md、rollback-note.md |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | The first reaction was to restart service without proving root cause | Rank causes with read-only evidence first | evidence/healthz-window.txt |
| Correction | Only one 503 log was inspected without aligning config change | Align logs, version, and config by minute | evidence/config-delta.txt |
| After | health-report.md<br>Conclusion: the most likely root cause is an undersized connection pool<br>Evidence: HTTP 503 window aligns with DB_POOL_SIZE reduction, and db_pool_wait_ms rose from 320 to 4800<br>Minimal fix: restore DB_POOL_SIZE to 12 and observe for 15 minutes<br>Rollback: keep a copy of the current config and fall back to the previous deployment if restore fails<br>Retest: healthz returns 200 and db_pool_wait_ms stays under 500 for five minutes | Root-cause ranking covers configuration, dependency, capacity, network, and code change. | health-report.md, repair-plan.md, and rollback-note.md |
