# 02 浏览器页面巡检与截图证据

## 中文

### 任务摘要
用本地页面做一次只读巡检，记录桌面与手机视口、控制台状态、截图证据和问题优先级。

### 可读取材料
- 目标页面为本地预览地址，不输入账号密码，不提交表单。
- 视口固定为桌面 1440x1000、手机 390x900。
- 主路径只点击导航和展开控件，不触发写入、购买、删除或授权。

### 输入样例

```text
巡检任务
URL: http://127.0.0.1:4173/recipes/pages-deploy-diagnosis.html
主路径: 打开页面、切换手机视口、展开导航、检查证据表
禁止动作: 不提交表单、不修改数据、不触发账号动作
```

## English

### Task Summary
Run a read-only review of a local page, recording desktop and mobile viewports, console state, screenshot evidence, and issue priority.

### Readable Materials
- The target page is a local preview URL; no credentials are entered and no forms are submitted.
- Viewports are fixed at desktop 1440x1000 and mobile 390x900.
- The primary path clicks only navigation and expand controls, without write, purchase, delete, or authorization actions.

### Input Sample

```text
Review task
URL: http://127.0.0.1:4173/recipes/pages-deploy-diagnosis.html
Primary path: open page, switch to mobile viewport, expand navigation, inspect evidence table
Prohibited actions: do not submit forms, change data, or trigger account actions
```
