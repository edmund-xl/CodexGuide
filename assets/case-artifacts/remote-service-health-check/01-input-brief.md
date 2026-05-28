# 14 远程服务健康检查与修复建议

## 中文

### 任务摘要
用脱敏健康日志和只读命令记录复盘一次服务异常，输出根因排序、修复建议、回退方式和复测清单。

### 可读取材料
- 只提供脱敏日志和只读命令输出，不提供真实密钥、主机名、账号或客户数据。
- 第一轮只做诊断和建议，不执行重启、删除、发布或配置写入。
- 所有修复建议都必须带回退方式、影响范围和复测步骤。

### 输入样例

```text
异常窗口：10:12-10:19
healthz: HTTP 503, db_pool_wait_ms=4800
最近改动：配置里 DB_POOL_SIZE 从 12 改成 4
限制：只读分析，不重启服务，不修改配置
目标：判断最可能根因，并给出最小修复和回退方式
```

## English

### Task Summary
Use redacted health logs and read-only command records to review a service incident, then output root-cause ranking, fix proposal, rollback path, and retest checklist.

### Readable Materials
- Provide only redacted logs and read-only command output; do not provide real keys, hostnames, accounts, or customer data.
- The first pass diagnoses and proposes only; it does not restart, delete, deploy, or write configuration.
- Every fix proposal must include rollback, impact scope, and retest steps.

### Input Sample

```text
Incident window: 10:12-10:19
healthz: HTTP 503, db_pool_wait_ms=4800
Recent change: DB_POOL_SIZE changed from 12 to 4
Constraint: read-only analysis; do not restart service or edit config
Goal: identify the most likely root cause and propose minimal fix plus rollback
```
