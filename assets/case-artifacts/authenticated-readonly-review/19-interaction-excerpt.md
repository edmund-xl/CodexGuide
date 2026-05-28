# 08 登录态网页只读检查 - 关键交互片段

## 中文

### 任务交代

```text
只读检查目标
页面：已登录的账单概览
想确认：是否有失败付款、是否有异常提示、发票入口是否可见
禁止：更改计划、提交付款、删除成员、发送邀请、导出完整数据
```

### 助手首轮回报
- 先判断：页面含有导出和邀请按钮，必须明确不点击。
- 已执行：`人工确认当前 URL 和页面标题是否符合检查目标。`
- 证据落点：readonly-review.md
- 暂不交付：按钮标签只写继续，后果不清楚

### 修正回报
- 最小修正：后果不清楚就不点，列入待确认
- 复测动作：`人工逐项核对 no-click-controls.md 中的按钮均未触发。`
- 复测证据：no-click-controls.md

### 人工确认
- 不要把登录态截图直接公开。

## English

### Task Handoff

```text
Read-only review goal
Page: signed-in billing overview
Need to confirm: failed payments, warning banners, invoice entry visibility
Prohibited: change plan, submit payment, delete members, send invites, export full data
```

### First Assistant Report
- First judgment: The page included export and invite buttons that had to be explicitly avoided.
- Action run: `Manually confirm the current URL and page title match the review goal.`
- Evidence location: readonly-review.md
- Not ready yet: Button said Continue without clear consequence

### Correction Report
- Minimal correction: Do not click unclear controls; list them for confirmation
- Retest action: `Manually verify every button in no-click-controls.md remained untriggered.`
- Retest evidence: no-click-controls.md

### Human Confirmation
- Do not publish signed-in screenshots directly.
