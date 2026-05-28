# 03 GitHub Pages 部署失败诊断

## 中文

### 任务摘要
从失败通知、Actions job 和本地检查命令定位 Pages 发布问题，并用新的 run 与线上响应完成闭环。

### 可读取材料
- 失败页面截图只用于识别 job 名称和失败状态，不作为唯一判断。
- 本地工作区先确认干净，避免发布修复混入内容改动。
- 只改 workflow 或 Pages 配置相关文件，不碰业务页面。

### 输入样例

```text
失败摘要
Run: Deploy Pages #5
build: failed in 10 seconds
deploy: skipped
现象: 邮件显示 Some jobs were not successful
限制: 不改内容页面，先判断 workflow、artifact、Pages 设置哪一段失败
```

## English

### Task Summary
Diagnose a Pages deployment issue from failure notification, Actions jobs, and local checks, then close the loop with a new run and live response.

### Readable Materials
- The failure screenshot is used only to identify job name and status, not as the only judgment.
- Confirm a clean local worktree first so deploy fixes do not mix with content edits.
- Change only workflow or Pages configuration-related files, not content pages.

### Input Sample

```text
Failure summary
Run: Deploy Pages #5
build: failed in 10 seconds
deploy: skipped
Symptom: email says Some jobs were not successful
Constraint: do not edit content pages; first identify whether workflow, artifact, or Pages settings failed
```
