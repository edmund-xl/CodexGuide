# 14 远程服务健康检查与修复建议 - 关键交互片段

## 中文

### 任务交代

```text
异常窗口：10:12-10:19
healthz: HTTP 503, db_pool_wait_ms=4800
最近改动：配置里 DB_POOL_SIZE 从 12 改成 4
限制：只读分析，不重启服务，不修改配置
目标：判断最可能根因，并给出最小修复和回退方式
```

### 助手首轮回报
- 先判断：10:12 到 10:19 错误率升高，重启不是第一步。
- 已执行：`curl -i --max-time 10 http://127.0.0.1:8080/healthz`
- 证据落点：evidence/healthz-window.txt
- 暂不交付：第一反应是重启服务，但没有证明根因

### 修正回报
- 最小修正：先用只读证据排序根因
- 复测动作：`rg -n "HTTP 503|db_pool_wait_ms|DB_POOL_SIZE" evidence/ config/`
- 复测证据：evidence/config-delta.txt

### 人工确认
- 只读检查不能擅自重启、扩容或改配置。

## English

### Task Handoff

```text
Incident window: 10:12-10:19
healthz: HTTP 503, db_pool_wait_ms=4800
Recent change: DB_POOL_SIZE changed from 12 to 4
Constraint: read-only analysis; do not restart service or edit config
Goal: identify the most likely root cause and propose minimal fix plus rollback
```

### First Assistant Report
- First judgment: Error rate rose from 10:12 to 10:19, and restart was not the first step.
- Action run: `curl -i --max-time 10 http://127.0.0.1:8080/healthz`
- Evidence location: evidence/healthz-window.txt
- Not ready yet: The first reaction was to restart service without proving root cause

### Correction Report
- Minimal correction: Rank causes with read-only evidence first
- Retest action: `rg -n "HTTP 503|db_pool_wait_ms|DB_POOL_SIZE" evidence/ config/`
- Retest evidence: evidence/config-delta.txt

### Human Confirmation
- Read-only checks must not restart, scale, or change configuration without approval.
