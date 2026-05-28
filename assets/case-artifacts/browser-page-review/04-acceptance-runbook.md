# 02 浏览器页面巡检与截图证据 - 验收 Runbook

## 中文

### 命令与人工步骤
- `curl -I -L --max-time 15 http://127.0.0.1:4173/`
- `浏览器桌面视口：1440x1000，截图 home-desktop-1440.png。`
- `浏览器手机视口：390x900，检查 document.documentElement.scrollWidth 是否大于 window.innerWidth。`

### 验收标准
- 目标 URL 返回 200，关键资源未缺失。
- 桌面和手机截图都能证明页面主要内容可见。
- 问题表包含位置、现象、截图名、建议和优先级。
- 未触发任何会改变数据或账号状态的动作。

### 失败与修正
- 只看 DOM：DOM 文本正常但手机截图里按钮换行拥挤；截图成为必检证据
- 截图命名混乱：第一次截图无法判断视口；统一使用页面加视口命名
- 表格撑宽：证据表在 390px 下撑出页面；为表格容器启用横向滚动

## English

### Commands and Manual Steps
- `curl -I -L --max-time 15 http://127.0.0.1:4173/`
- `Browser desktop viewport: 1440x1000, capture home-desktop-1440.png.`
- `Browser mobile viewport: 390x900, check whether document.documentElement.scrollWidth is greater than window.innerWidth.`

### Acceptance Criteria
- Target URL returns 200 and key assets are not missing.
- Desktop and mobile screenshots prove primary content is visible.
- Issue table includes location, symptom, screenshot name, recommendation, and priority.
- No action that changes data or account state is triggered.

### Failures and Corrections
- DOM-only review: DOM text was fine but mobile screenshot showed cramped button wrapping; Make screenshots mandatory evidence
- Screenshot naming drift: First screenshot names did not show viewport; Use page plus viewport in filenames
- Table width issue: Evidence table stretched beyond 390px; Enable horizontal scrolling on table containers
