# 10 API 变更影响分析 - 关键交互片段

## 中文

### 任务交代

```text
接口变更
GET /v1/tasks 新增 status=archived
POST /v1/tasks 的 priority 字段从 string 改为 enum
429 错误会返回 retry_after_ms
上线时间：2026-06-10
```

### 助手首轮回报
- 先判断：字段名变化影响了 5 个调用点，其中 2 个在测试里。
- 已执行：`rg -n "GET /v1/tasks|POST /v1/tasks|priority|retry_after_ms|429" src tests docs`
- 证据落点：api-impact.md
- 暂不交付：未搜索调用点导致遗漏测试

### 修正回报
- 最小修正：强制输出 call-sites.md
- 复测动作：`rg -n "archived|priority" tests src`
- 复测证据：call-sites.md

### 人工确认
- 没有 owner 的调用点不能直接关闭。

## English

### Task Handoff

```text
API change
GET /v1/tasks adds status=archived
POST /v1/tasks changes priority from string to enum
429 errors include retry_after_ms
Release date: 2026-06-10
```

### First Assistant Report
- First judgment: The field rename affected five call sites, two of them in tests.
- Action run: `rg -n "GET /v1/tasks|POST /v1/tasks|priority|retry_after_ms|429" src tests docs`
- Evidence location: api-impact.md
- Not ready yet: Call sites were not searched and tests were missed

### Correction Report
- Minimal correction: Require call-sites.md
- Retest action: `rg -n "archived|priority" tests src`
- Retest evidence: call-sites.md

### Human Confirmation
- Call sites without owners cannot be closed.
