# 10 API 变更影响分析 - 结果片段

## 中文

```text
test-matrix.md
| 场景 | 输入 | 预期 |
| archived 状态 | GET /v1/tasks?status=archived | 列表能展示归档标签 |
| priority enum | priority=urgent | 校验通过或给出明确错误 |
| 429 重试 | retry_after_ms=1200 | UI 显示等待建议，不立即重试 |
```

## English

```text
test-matrix.md
| Scenario | Input | Expected |
| archived status | GET /v1/tasks?status=archived | list can display archived label |
| priority enum | priority=urgent | validation passes or shows clear error |
| 429 retry | retry_after_ms=1200 | UI shows wait guidance and does not retry immediately |
```
