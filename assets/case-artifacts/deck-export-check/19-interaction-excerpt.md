# 01 演示稿生成与导出核查 - 关键交互片段

## 中文

### 任务交代

```text
产品：Team Notes
目标读者：小团队负责人
核心主张：把会议纪要、待办、文件链接整理成一个可追踪工作台
必须出现：7 天试用、三步上手、数据不对外发送
限制：不要写客户名，不要写价格，不要承诺自动决策
```

### 助手首轮回报
- 先判断：第一轮生成 10 页，数据页正文在 1440px 预览里溢出。
- 已执行：`ls out/deck-draft.pptx out/slide-checklist.md out/export-notes.md`
- 证据落点：slide-outline.md
- 暂不交付：第一轮草稿生成 10 页，超出限制

### 修正回报
- 最小修正：先锁 7 页结构，再生成文件
- 复测动作：`人工打开 deck-draft.pptx，确认 7 页均可显示且备注不为空。`
- 复测证据：deck-draft.pptx

### 人工确认
- 演示稿可用于内部评审，不能直接对外发布。

## English

### Task Handoff

```text
Product: Team Notes
Audience: small-team leads
Core claim: organize meeting notes, tasks, and file links into a trackable workspace
Must include: seven-day trial, three-step onboarding, no external data sending
Constraints: no customer names, no pricing, no autonomous decision claims
```

### First Assistant Report
- First judgment: The first pass produced ten slides and the data slide overflowed in a 1440px preview.
- Action run: `ls out/deck-draft.pptx out/slide-checklist.md out/export-notes.md`
- Evidence location: slide-outline.md
- Not ready yet: First draft produced ten slides, beyond the limit

### Correction Report
- Minimal correction: Lock the seven-slide structure before file generation
- Retest action: `Open deck-draft.pptx manually and confirm all seven slides display and notes are not empty.`
- Retest evidence: deck-draft.pptx

### Human Confirmation
- The deck is ready for internal review, not direct external publication.
