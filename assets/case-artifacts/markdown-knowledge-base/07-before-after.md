# 05 Markdown 知识库重整 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 文件名年份被误当成完整日期 | 只保留可证明日期，其他标待补 | missing-fields.md |
| 过程修正 | 初版只列文件名，无法行动 | 改为 topic、status、next_action 三列 | sample-diff.patch |
| 交付后 | index.md<br>## 产品想法<br>- Team Notes / active / 下一步：补充使用场景<br>- Launch Draft / pending / 下一步：确认发布日期<br><br>pending-review.md<br>- meeting-ai.md: date 缺失<br>- draft-launch.md: status 需要确认 | 每篇笔记都有统一字段或明确待补标记。 | 重整后的 Markdown 副本、index.md、pending-review.md |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | Filename year was treated as full date | Keep only provable dates and mark others pending | missing-fields.md |
| Correction | First version listed only filenames and was not actionable | Switch to topic, status, and next_action columns | sample-diff.patch |
| After | index.md<br>## Product ideas<br>- Team Notes / active / Next: add use case<br>- Launch Draft / pending / Next: confirm launch date<br><br>pending-review.md<br>- meeting-ai.md: missing date<br>- draft-launch.md: status needs confirmation | Every note has consistent fields or explicit pending markers. | Restructured Markdown copy, index.md, and pending-review.md |
