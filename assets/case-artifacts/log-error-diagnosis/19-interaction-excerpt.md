# 13 日志报错定位与修复建议 - 关键交互片段

## 中文

### 任务交代

```text
失败命令：npm run check
错误片段：Error: missing local target recipes/old-page.html
最近改动：案例 URL 改名
限制：先定位断链，不要回滚全部改动
```

### 助手首轮回报
- 先判断：错误信息指向旧路径，但搜索结果显示还有多个入口残留。
- 已执行：`npm run check`
- 证据落点：npm run check
- 暂不交付：最后一行是连锁失败，不是根因

### 修正回报
- 最小修正：读取错误前后上下文
- 复测动作：`rg -n "old-page|missing local target|recipes/" scripts recipes README.md`
- 复测证据：rg old-page

### 人工确认
- 不要顺手重构无关代码。

## English

### Task Handoff

```text
Failing command: npm run check
Error snippet: Error: missing local target recipes/old-page.html
Recent change: recipe URL rename
Constraint: locate broken link first; do not roll back all changes
```

### First Assistant Report
- First judgment: The error pointed to an old path, and search results showed several stale entries.
- Action run: `npm run check`
- Evidence location: npm run check
- Not ready yet: The last line was a cascading failure, not root cause

### Correction Report
- Minimal correction: Read context around the error
- Retest action: `rg -n "old-page|missing local target|recipes/" scripts recipes README.md`
- Retest evidence: rg old-page

### Human Confirmation
- Do not opportunistically refactor unrelated code.
