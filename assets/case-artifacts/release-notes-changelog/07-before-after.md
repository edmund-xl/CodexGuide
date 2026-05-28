# 11 发布说明与变更日志生成 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 技术提交对用户不可读 | 改写成用户影响 | git log |
| 过程修正 | 内部事故线索进入公开版 | 分公开版和内部版 | change-categories.md |
| 交付后 | release-notes.md<br>## 新增<br>- 案例页现在提供证据表和验收命令，便于按真实任务复盘。<br>## 修复<br>- 修复移动端长表格撑宽页面的问题。<br>## 发布前确认<br>- 是否公开提到自动化功能<br>- 版本日期是否为 2026-05-28 | 公开版和内部版分开，内容边界清楚。 | release-notes.md、internal-changelog.md、confirm-before-publish.md |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | Technical commits were unreadable to users | Rewrite as user impact | git log |
| Correction | Internal incident cues entered public notes | Separate public and internal versions | change-categories.md |
| After | release-notes.md<br>## Added<br>- Recipe pages now include evidence tables and acceptance commands for real task retrospectives.<br>## Fixed<br>- Fixed mobile long tables stretching page width.<br>## Confirm before publishing<br>- Whether automation features can be mentioned publicly<br>- Whether the release date is 2026-05-28 | Public and internal versions are separate with clear boundaries. | release-notes.md, internal-changelog.md, and confirm-before-publish.md |
