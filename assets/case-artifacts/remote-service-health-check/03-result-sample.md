# 14 远程服务健康检查与修复建议 - 结果片段

## 中文

```text
health-report.md
结论：最可能根因为连接池配置过小
证据：HTTP 503 时间窗与 DB_POOL_SIZE 下调一致，db_pool_wait_ms 从 320 升到 4800
最小修复：把 DB_POOL_SIZE 恢复到 12，观察 15 分钟
回退方式：保留当前配置副本，恢复失败时切回上一部署版本
复测：healthz 返回 200，db_pool_wait_ms 连续 5 分钟低于 500
```

## English

```text
health-report.md
Conclusion: the most likely root cause is an undersized connection pool
Evidence: HTTP 503 window aligns with DB_POOL_SIZE reduction, and db_pool_wait_ms rose from 320 to 4800
Minimal fix: restore DB_POOL_SIZE to 12 and observe for 15 minutes
Rollback: keep a copy of the current config and fall back to the previous deployment if restore fails
Retest: healthz returns 200 and db_pool_wait_ms stays under 500 for five minutes
```
