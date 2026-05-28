# 13 日志报错定位与修复建议

## 中文

### 任务摘要
把构建或服务日志整理成根因假设、验证命令、最小修复、回退方式和复跑验收。

### 可读取材料
- 日志先脱敏，尤其是 token、邮箱、账号 ID 和私人路径。
- 提供失败命令、环境、最近改动和是否可稳定重现。
- 第一轮只读定位，不运行破坏性命令。

### 输入样例

```text
失败命令：npm run check
错误片段：Error: missing local target recipes/old-page.html
最近改动：案例 URL 改名
限制：先定位断链，不要回滚全部改动
```

## English

### Task Summary
Turn build or service logs into root-cause hypotheses, validation commands, minimal fix, rollback method, and rerun acceptance.

### Readable Materials
- Logs are redacted first, especially tokens, emails, account IDs, and personal paths.
- Provide failing command, environment, recent changes, and whether it reproduces reliably.
- The first round is read-only diagnosis and does not run destructive commands.

### Input Sample

```text
Failing command: npm run check
Error snippet: Error: missing local target recipes/old-page.html
Recent change: recipe URL rename
Constraint: locate broken link first; do not roll back all changes
```
