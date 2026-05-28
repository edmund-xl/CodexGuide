# 03 GitHub Pages 部署失败诊断 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 邮件没有第一个失败步骤 | 必须打开 job steps | npm run build |
| 过程修正 | 修复后旧 run 仍显示失败 | 以新提交触发的新 run 为准 | npm run check |
| 交付后 | deploy-incident.md<br>现象：Deploy Pages 的 build 失败，deploy 跳过<br>根因：workflow 的 Pages 配置步骤未满足当前发布方式<br>修复：更新 Pages Actions 配置并保留 build/check 步骤<br>验证：新 run build=success, deploy=success; live URL=200 OK | 本地 build 和 check 均通过。 | deploy-incident.md、修复提交、验证命令记录 |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | Email did not show the first failed step | Open job steps | npm run build |
| Correction | Old run still showed failure after fix | Use the new run from the new commit | npm run check |
| After | deploy-incident.md<br>Symptom: Deploy Pages build failed and deploy was skipped<br>Root cause: workflow Pages configuration did not match the current publish mode<br>Fix: update Pages Actions configuration while keeping build/check steps<br>Verification: new run build=success, deploy=success; live URL=200 OK | Local build and check both pass. | deploy-incident.md, fix commit, and validation command record |
