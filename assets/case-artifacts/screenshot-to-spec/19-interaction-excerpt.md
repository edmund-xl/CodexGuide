# 07 设计截图转实现规格 - 关键交互片段

## 中文

### 任务交代

```text
截图任务
目标：提炼深色后台风的布局密度和组件状态
当前页面：首页、案例页、使用规范页
禁止：复用目标截图中的品牌、业务数字、图片、文案
输出：规格、组件表、桌面和手机验收截图
```

### 助手首轮回报
- 先判断：截图里按钮、筛选栏和表格密度没有文字规格。
- 已执行：`人工检查 1440x1000 截图：导航、主内容、证据表、按钮无重叠。`
- 证据落点：implementation-spec.md
- 暂不交付：只写深色后台风无法执行

### 修正回报
- 最小修正：拆成 token、组件和验收项
- 复测动作：`人工检查 390x900 截图：无页面级横向溢出，长命令可读。`
- 复测证据：component-checklist.md

### 人工确认
- 截图不能证明交互状态，缺失状态必须标为待确认。

## English

### Task Handoff

```text
Screenshot task
Goal: extract dark dashboard layout density and component states
Current pages: home, recipe page, usage policy
Prohibited: reuse target screenshot brand, business numbers, images, or copy
Output: spec, component table, desktop and mobile acceptance screenshots
```

### First Assistant Report
- First judgment: Buttons, filters, and table density were visible in screenshots but lacked written specs.
- Action run: `Manually inspect 1440x1000 screenshots: nav, content, evidence table, and buttons have no overlap.`
- Evidence location: implementation-spec.md
- Not ready yet: Saying dark dashboard was not actionable

### Correction Report
- Minimal correction: Split into tokens, components, and acceptance checks
- Retest action: `Manually inspect 390x900 screenshots: no page-level horizontal overflow and long commands remain readable.`
- Retest evidence: component-checklist.md

### Human Confirmation
- Screenshots cannot prove interaction states, so missing states must be marked for confirmation.
