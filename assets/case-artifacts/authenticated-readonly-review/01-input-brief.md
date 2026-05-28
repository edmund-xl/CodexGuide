# 08 登录态网页只读检查

## 中文

### 任务摘要
在用户已登录的浏览器里只读检查页面状态，记录可见问题、禁点清单和待用户确认动作。

### 可读取材料
- 用户已经在自己的浏览器登录，任务不读取密码、Cookie 或本地会话文件。
- 先列出禁止动作：提交、购买、授权、删除、转账、邀请、公开发布。
- 截图前隐藏不需要展示的邮箱、余额、账号 ID 和私人资料。

### 输入样例

```text
只读检查目标
页面：已登录的账单概览
想确认：是否有失败付款、是否有异常提示、发票入口是否可见
禁止：更改计划、提交付款、删除成员、发送邀请、导出完整数据
```

## English

### Task Summary
Read page state in the user's signed-in browser, recording visible issues, no-click controls, and actions needing user confirmation.

### Readable Materials
- The user is already signed in; the task does not read passwords, cookies, or local session files.
- List prohibited actions first: submit, purchase, authorize, delete, transfer, invite, and publish.
- Before screenshots, hide unnecessary email, balance, account IDs, and private profile details.

### Input Sample

```text
Read-only review goal
Page: signed-in billing overview
Need to confirm: failed payments, warning banners, invoice entry visibility
Prohibited: change plan, submit payment, delete members, send invites, export full data
```
