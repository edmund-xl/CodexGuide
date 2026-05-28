# 14 远程服务健康检查与修复建议 - 验收 Runbook

## 中文

### 命令与人工步骤
- `curl -i --max-time 10 http://127.0.0.1:8080/healthz`
- `rg -n "HTTP 503|db_pool_wait_ms|DB_POOL_SIZE" evidence/ config/`
- `人工确认 repair-plan.md 包含影响范围、回退方式和复测窗口。`

### 验收标准
- 根因排序至少覆盖配置、依赖、容量、网络和代码变更。
- 每个根因都有证据、反证或待确认状态。
- 最小修复不包含无关重构或扩大权限动作。
- 复测清单包含 healthz、关键指标、观察窗口和失败回退。

### 失败与修正
- 急着重启：第一反应是重启服务，但没有证明根因；先用只读证据排序根因
- 忽略时间线：只看单条 503 日志，没对齐配置变更；把日志、版本和配置按分钟对齐
- 没有回退：修复建议缺少失败时怎么退回；每条建议都补回退和复测

## English

### Commands and Manual Steps
- `curl -i --max-time 10 http://127.0.0.1:8080/healthz`
- `rg -n "HTTP 503|db_pool_wait_ms|DB_POOL_SIZE" evidence/ config/`
- `Manually confirm repair-plan.md includes impact scope, rollback, and retest window.`

### Acceptance Criteria
- Root-cause ranking covers configuration, dependency, capacity, network, and code change.
- Every cause has evidence, counter-evidence, or a confirmation state.
- The minimal fix contains no unrelated refactor or expanded permission action.
- Retest checklist includes healthz, key metric, observation window, and failure rollback.

### Failures and Corrections
- Restart too early: The first reaction was to restart service without proving root cause; Rank causes with read-only evidence first
- Timeline ignored: Only one 503 log was inspected without aligning config change; Align logs, version, and config by minute
- No rollback: Fix proposal lacked a fallback if it failed; Add rollback and retest to every proposal
