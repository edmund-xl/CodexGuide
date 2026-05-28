# 01 演示稿生成与导出核查 - 验收 Runbook

## 中文

### 命令与人工步骤
- `ls out/deck-draft.pptx out/slide-checklist.md out/export-notes.md`
- `人工打开 deck-draft.pptx，确认 7 页均可显示且备注不为空。`
- `人工检查 screenshots/cover.png、agenda.png、data.png、closing.png 是否无文字溢出。`

### 验收标准
- 交付物齐全，文件名不覆盖原始材料。
- 逐页验收表包含状态、风险和待确认项。
- 截图覆盖封面、目录、正文密集页和结尾页。
- 所有金额、日期、隐私和承诺语已标为人工确认。

### 失败与修正
- 页数失控：第一轮草稿生成 10 页，超出限制；先锁 7 页结构，再生成文件
- 正文溢出：数据页说明超过卡片高度；改为两条短句并重新截图
- 承诺语过强：出现自动决策表述；替换为辅助整理，并列入人工确认

## English

### Commands and Manual Steps
- `ls out/deck-draft.pptx out/slide-checklist.md out/export-notes.md`
- `Open deck-draft.pptx manually and confirm all seven slides display and notes are not empty.`
- `Manually check screenshots/cover.png, agenda.png, data.png, and closing.png for no text overflow.`

### Acceptance Criteria
- Deliverables are complete and do not overwrite source material.
- The slide checklist includes status, risk, and confirmation items.
- Screenshots cover the cover, agenda, dense body slide, and closing slide.
- All amounts, dates, privacy wording, and claims are marked for human confirmation.

### Failures and Corrections
- Slide count drift: First draft produced ten slides, beyond the limit; Lock the seven-slide structure before file generation
- Body overflow: Data slide body exceeded card height; Rewrite as two short bullets and capture again
- Over-strong claim: Autonomous decision wording appeared; Replace with assistive wording and add human confirmation
