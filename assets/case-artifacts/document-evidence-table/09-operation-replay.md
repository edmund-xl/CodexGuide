# 09 文档与 PDF 摘要到证据表 - 操作回放

## 中文

### 实测快照
- 触发场景：多份文档摘要需要转成证据表，要求能追溯到页码和原句位置。
- 工具链：PDF/文档摘要、证据行、页码、置信度标签。
- 第一信号：初稿把事实和推断混在同一列，无法复核。
- 完成信号：每行证据都有页码、摘录、判断和人工复核状态。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 材料盘点 | 列出 docs/ 中可读文件 | files=5, scanned_pdf=1 needs manual OCR | document-inventory.md |
| 证据抽取 | 生成 evidence-table.md | rows=18, missing_page=0 | evidence-table.md |
| 推断隔离 | 把建议移入 summary-notes.md | fact_rows=18, inference_rows=5 | summary-notes.md |

## English

### Run Snapshot
- Trigger: Several document summaries needed an evidence table traceable to page numbers and original wording.
- Toolchain: PDF/document summaries, evidence rows, page numbers, and confidence labels.
- First Signal: The first draft mixed facts and inference in one column, making review difficult.
- Done Signal: Every evidence row had a page, excerpt, judgment, and human review status.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Material inventory | List readable files under docs/ | files=5, scanned_pdf=1 needs manual OCR | document-inventory.md |
| Evidence extraction | Generate evidence-table.md | rows=18, missing_page=0 | evidence-table.md |
| Inference separation | Move suggestions into summary-notes.md | fact_rows=18, inference_rows=5 | summary-notes.md |
