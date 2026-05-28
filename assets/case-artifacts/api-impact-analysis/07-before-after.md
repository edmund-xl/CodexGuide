# 10 API 变更影响分析 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 未搜索调用点导致遗漏测试 | 强制输出 call-sites.md | api-impact.md |
| 过程修正 | 新增状态影响筛选和空态 | 把 UI 和测试纳入影响矩阵 | call-sites.md |
| 交付后 | test-matrix.md<br>| 场景 | 输入 | 预期 |<br>| archived 状态 | GET /v1/tasks?status=archived | 列表能展示归档标签 |<br>| priority enum | priority=urgent | 校验通过或给出明确错误 |<br>| 429 重试 | retry_after_ms=1200 | UI 显示等待建议，不立即重试 | | 影响表覆盖端点、字段、鉴权、限额和错误码。 | api-impact.md、call-sites.md、test-matrix.md |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | Call sites were not searched and tests were missed | Require call-sites.md | api-impact.md |
| Correction | New status affected filters and empty state | Include UI and tests in impact matrix | call-sites.md |
| After | test-matrix.md<br>| Scenario | Input | Expected |<br>| archived status | GET /v1/tasks?status=archived | list can display archived label |<br>| priority enum | priority=urgent | validation passes or shows clear error |<br>| 429 retry | retry_after_ms=1200 | UI shows wait guidance and does not retry immediately | | Impact table covers endpoints, fields, auth, limits, and error codes. | api-impact.md, call-sites.md, and test-matrix.md |
