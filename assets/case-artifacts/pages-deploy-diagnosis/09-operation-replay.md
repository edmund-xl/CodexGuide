# 03 GitHub Pages 部署失败诊断 - 操作回放

## 中文

### 实测快照
- 触发场景：收到部署失败通知，build 红色、deploy 跳过，需要判断是内容、workflow 还是发布配置问题。
- 工具链：本地构建、本地检查、Actions job、线上响应头。
- 第一信号：邮件只说明失败，无法证明第一个红色步骤在哪里。
- 完成信号：新提交触发的 build 与 deploy 均成功，线上案例总览返回 200。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 本地复现 | npm run build && npm run check | Generated 44 bilingual pages; verify passed | deploy-incident.md |
| 远端确认 | 读取最新 Actions run 的 jobs | build=success, deploy=success | new-run.txt |
| 线上验收 | curl -I -L --max-time 20 /recipes/index.html | HTTP/2 200, content-type=text/html | live-headers.txt |

## English

### Run Snapshot
- Trigger: A deploy failure notification showed build red and deploy skipped, requiring separation of content, workflow, and publish configuration issues.
- Toolchain: Local build, local check, Actions job, and live response headers.
- First Signal: The email only said the run failed and did not prove the first red step.
- Done Signal: The new commit produced successful build and deploy jobs, and the live recipe index returned 200.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Local reproduction | npm run build && npm run check | Generated 44 bilingual pages; verify passed | deploy-incident.md |
| Remote confirmation | Read the jobs for the latest Actions run | build=success, deploy=success | new-run.txt |
| Live acceptance | curl -I -L --max-time 20 /recipes/index.html | HTTP/2 200, content-type=text/html | live-headers.txt |
