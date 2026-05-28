# 12 自动化提醒与定期检查 - 关键交互片段

## 中文

### 任务交代

```text
重复任务
每周一检查文档站是否能访问
检查对象：首页、案例总览、使用规范页
输出：状态、异常、建议
限制：只检查和提醒，不自动修复、不自动提交
```

### 助手首轮回报
- 先判断：原始需求只有“每天看一下”，没有说什么时候停。
- 已执行：`curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/`
- 证据落点：automation-brief.md
- 暂不交付：检查网站是否正常无法判断

### 修正回报
- 最小修正：改为 URL、状态码和页面标记
- 复测动作：`curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/recipes/index.html`
- 复测证据：mock-result.md

### 人工确认
- 自动化不能替代需要人工判断的动作。

## English

### Task Handoff

```text
Recurring task
Every Monday, check whether the documentation site is reachable
Targets: home, recipe index, usage policy
Output: status, anomalies, suggestions
Constraint: check and remind only; do not auto-fix or auto-commit
```

### First Assistant Report
- First judgment: The original ask only said 'check daily' and did not define when to stop.
- Action run: `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/`
- Evidence location: automation-brief.md
- Not ready yet: Check whether site is OK was not measurable

### Correction Report
- Minimal correction: Use URL, status code, and page marker
- Retest action: `curl -I -L --max-time 20 https://edmund-xl.github.io/CodexGuide/recipes/index.html`
- Retest evidence: mock-result.md

### Human Confirmation
- Automation cannot replace actions requiring human judgment.
