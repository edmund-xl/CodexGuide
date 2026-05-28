# 10 API 变更影响分析 - 验收 Runbook

## 中文

### 命令与人工步骤
- `rg -n "GET /v1/tasks|POST /v1/tasks|priority|retry_after_ms|429" src tests docs`
- `rg -n "archived|priority" tests src`
- `人工确认版本号、环境、上线窗口和回退方式。`

### 验收标准
- 影响表覆盖端点、字段、鉴权、限额和错误码。
- 调用点清单列出路径、用途和影响级别。
- 测试矩阵覆盖正常路径、缺字段、错误码、限额和回退。
- 待核对项没有被写成确定结论。

### 失败与修正
- 只看说明：未搜索调用点导致遗漏测试；强制输出 call-sites.md
- 字段新增轻视：新增状态影响筛选和空态；把 UI 和测试纳入影响矩阵
- 直接改代码：分析阶段混入实现改动；先交付影响报告，再单独改实现

## English

### Commands and Manual Steps
- `rg -n "GET /v1/tasks|POST /v1/tasks|priority|retry_after_ms|429" src tests docs`
- `rg -n "archived|priority" tests src`
- `Manually confirm version, environment, release window, and rollback method.`

### Acceptance Criteria
- Impact table covers endpoints, fields, auth, limits, and error codes.
- Call-site list includes path, usage, and impact level.
- Test matrix covers happy path, missing fields, error codes, limits, and rollback.
- Confirmation items are not written as final conclusions.

### Failures and Corrections
- Notes only: Call sites were not searched and tests were missed; Require call-sites.md
- New field underestimated: New status affected filters and empty state; Include UI and tests in impact matrix
- Edited too early: Implementation changes mixed into analysis; Deliver impact report before separate implementation
