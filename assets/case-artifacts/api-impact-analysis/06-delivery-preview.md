# 10 API 变更影响分析 - 交付预览

## 中文

### 最终交付
- api-impact.md、call-sites.md、test-matrix.md

### 关键证据
- 端点变更：GET /v1/tasks 新增 archived 状态
- 字段变更：priority 从 string 变 enum，类型校验受影响

### 主要修正
- 只看说明：强制输出 call-sites.md

### 终审动作
- 影响表覆盖端点、字段、鉴权、限额和错误码。
- 调用点清单列出路径、用途和影响级别。

## English

### Final Deliverable
- api-impact.md, call-sites.md, and test-matrix.md

### Key Evidence
- Endpoint change: GET /v1/tasks adds archived status
- Field change: priority changes from string to enum and affects type validation

### Main Correction
- Notes only: Require call-sites.md

### Final Review Actions
- Impact table covers endpoints, fields, auth, limits, and error codes.
- Call-site list includes path, usage, and impact level.
