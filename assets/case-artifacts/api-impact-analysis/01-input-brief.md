# 10 API 变更影响分析

## 中文

### 任务摘要
把一份接口变更说明转成端点影响表、调用点清单、测试矩阵和发布风险，不直接修改代码。

### 可读取材料
- 变更说明先拆成端点、字段、鉴权、限额、错误码五类。
- 本地仓库只读搜索调用位置，不直接改实现。
- 无法确认的运行行为标记为待核对，不写成结论。

### 输入样例

```text
接口变更
GET /v1/tasks 新增 status=archived
POST /v1/tasks 的 priority 字段从 string 改为 enum
429 错误会返回 retry_after_ms
上线时间：2026-06-10
```

## English

### Task Summary
Turn API change notes into endpoint impact, call-site inventory, test matrix, and release risk without editing code directly.

### Readable Materials
- First split change notes into endpoints, fields, auth, limits, and error codes.
- Search local call sites read-only and do not edit implementation directly.
- Unconfirmed runtime behavior is marked for review and not written as conclusion.

### Input Sample

```text
API change
GET /v1/tasks adds status=archived
POST /v1/tasks changes priority from string to enum
429 errors include retry_after_ms
Release date: 2026-06-10
```
