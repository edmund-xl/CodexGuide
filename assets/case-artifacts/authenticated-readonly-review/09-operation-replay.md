# 08 登录态网页只读检查 - 操作回放

## 中文

### 实测快照
- 触发场景：登录态页面需要检查信息是否完整，但不能修改账号、配置或数据。
- 工具链：只读路径、动作白名单、截图遮挡、人工确认点。
- 第一信号：页面含有导出和邀请按钮，必须明确不点击。
- 完成信号：完成 6 个只读检查点，未触发表单提交或写入动作。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 动作确认 | 列出允许点击区域与禁止按钮 | allowed=nav,filter,details; blocked=invite,export,save | readonly-plan.md |
| 页面核查 | 只查看详情面板和状态标签 | checks=6, writes=0 | readonly-evidence.csv |
| 隐私处理 | 截图前遮挡账号标识 | masked_fields=3 | masked-screenshot.png |

## English

### Run Snapshot
- Trigger: A signed-in page needed information review without changing account, settings, or data.
- Toolchain: Read-only path, action allowlist, screenshot masking, and human confirmations.
- First Signal: The page included export and invite buttons that had to be explicitly avoided.
- Done Signal: Six read-only checkpoints were completed without form submission or write actions.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Action confirmation | List allowed areas and prohibited buttons | allowed=nav,filter,details; blocked=invite,export,save | readonly-plan.md |
| Page check | View only detail panels and status labels | checks=6, writes=0 | readonly-evidence.csv |
| Privacy handling | Mask account identifiers before screenshots | masked_fields=3 | masked-screenshot.png |
