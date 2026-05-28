# 08 登录态网页只读检查 - 验收 Runbook

## 中文

### 命令与人工步骤
- `人工确认当前 URL 和页面标题是否符合检查目标。`
- `人工逐项核对 no-click-controls.md 中的按钮均未触发。`
- `人工检查 safe-screenshots/ 中无邮箱、余额、账号 ID 或私人资料。`

### 验收标准
- 报告包含当前状态、可见问题、未执行动作和待确认动作。
- 禁点清单明确，且所有高风险控件保持未点击。
- 截图已脱敏，只展示必要状态。
- 需要用户处理的动作没有被代执行。

### 失败与修正
- 误点高风险按钮：按钮标签只写继续，后果不清楚；后果不清楚就不点，列入待确认
- 截图暴露信息：截图包含邮箱和余额；先遮挡或避开，再截图
- 登录态误解：已登录被误当作可执行授权；登录态只允许只读检查

## English

### Commands and Manual Steps
- `Manually confirm the current URL and page title match the review goal.`
- `Manually verify every button in no-click-controls.md remained untriggered.`
- `Manually inspect safe-screenshots/ for no email, balance, account ID, or private profile data.`

### Acceptance Criteria
- Report includes current state, visible issues, actions not executed, and confirmation actions.
- No-click list is explicit and all high-risk controls remain unclicked.
- Screenshots are redacted and show only necessary state.
- Actions requiring the user were not executed on their behalf.

### Failures and Corrections
- Risky click: Button said Continue without clear consequence; Do not click unclear controls; list them for confirmation
- Screenshot exposed data: Screenshot included email and balance; Mask or avoid before capturing
- Signed-in assumption: Signed-in state was treated as permission to act; Signed-in state allows read-only review only
