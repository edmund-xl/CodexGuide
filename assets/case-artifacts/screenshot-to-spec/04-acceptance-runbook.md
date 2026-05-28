# 07 设计截图转实现规格 - 验收 Runbook

## 中文

### 命令与人工步骤
- `人工检查 1440x1000 截图：导航、主内容、证据表、按钮无重叠。`
- `人工检查 390x900 截图：无页面级横向溢出，长命令可读。`
- `rg -n "目标品牌名|真实业务词" implementation-spec.md component-checklist.md`

### 验收标准
- 规格包含 token、组件、状态、响应式规则和验收项。
- 没有写入不可复用的品牌、图片、业务数值或原文案。
- 桌面和手机截图均通过无重叠、无页面级横向溢出检查。
- 实现任务可以直接按清单拆分给前端执行。

### 失败与修正
- 风格描述太粗：只写深色后台风无法执行；拆成 token、组件和验收项
- 复制业务内容：截图里的真实数字进入草稿；改为中性演示数字或删除
- 移动端漏验：桌面可用但手机按钮溢出；手机截图列为强制验收

## English

### Commands and Manual Steps
- `Manually inspect 1440x1000 screenshots: nav, content, evidence table, and buttons have no overlap.`
- `Manually inspect 390x900 screenshots: no page-level horizontal overflow and long commands remain readable.`
- `rg -n "target brand|real business term" implementation-spec.md component-checklist.md`

### Acceptance Criteria
- Spec includes tokens, components, states, responsive rules, and acceptance items.
- No non-reusable brand, image, business number, or original copy is included.
- Desktop and mobile screenshots pass no-overlap and no page-level overflow checks.
- The implementation task can be handed to frontend work directly from the checklist.

### Failures and Corrections
- Style note too broad: Saying dark dashboard was not actionable; Split into tokens, components, and acceptance checks
- Copied business content: Real numbers from screenshot entered draft; Replace with neutral demo numbers or remove
- Mobile skipped: Desktop worked but mobile buttons overflowed; Make mobile screenshots mandatory
