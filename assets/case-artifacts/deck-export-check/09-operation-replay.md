# 01 演示稿生成与导出核查 - 操作回放

## 中文

### 实测快照
- 触发场景：一份 800 字产品说明需要在当天交给团队做内部评审，要求 7 页以内且能导出。
- 工具链：桌面任务、演示稿导出器、四张截图、逐页验收表。
- 第一信号：第一轮生成 10 页，数据页正文在 1440px 预览里溢出。
- 完成信号：最终 7 页均可打开，四张预览截图无溢出，1 项对外表述保留人工确认。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 结构锁定 | 人工确认 7 页大纲后再生成文件 | outline=7 slides, pending_confirmations=3 | slide-outline.md |
| 导出复核 | 打开 deck-draft.pptx 并抽查 4 张 PNG | slides=7, screenshots=4, overflow=0 | screenshots/cover.png |
| 人工交接 | 检查试用期、隐私表述和版权素材 | needs_human_review=1 | export-notes.md |

## English

### Run Snapshot
- Trigger: An 800-word product brief needed an internal review deck the same day, capped at seven slides and exportable.
- Toolchain: Desktop task, deck exporter, four screenshots, and slide-by-slide acceptance table.
- First Signal: The first pass produced ten slides and the data slide overflowed in a 1440px preview.
- Done Signal: The final seven slides opened correctly, four preview screenshots had no overflow, and one external-facing claim stayed under human confirmation.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Structure lock | Generate the file only after the seven-slide outline is approved | outline=7 slides, pending_confirmations=3 | slide-outline.md |
| Export review | Open deck-draft.pptx and inspect four PNG previews | slides=7, screenshots=4, overflow=0 | screenshots/cover.png |
| Human handoff | Check trial wording, privacy wording, and licensed assets | needs_human_review=1 | export-notes.md |
