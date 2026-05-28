# 02 浏览器页面巡检与截图证据 - 关键交互片段

## 中文

### 任务交代

```text
巡检任务
URL: http://127.0.0.1:4173/recipes/pages-deploy-diagnosis.html
主路径: 打开页面、切换手机视口、展开导航、检查证据表
禁止动作: 不提交表单、不修改数据、不触发账号动作
```

### 助手首轮回报
- 先判断：手机截图里表格可滚动，但缺少明显滚动提示。
- 已执行：`curl -I -L --max-time 15 http://127.0.0.1:4173/`
- 证据落点：home-desktop-1440.png
- 暂不交付：DOM 文本正常但手机截图里按钮换行拥挤

### 修正回报
- 最小修正：截图成为必检证据
- 复测动作：`浏览器桌面视口：1440x1000，截图 home-desktop-1440.png。`
- 复测证据：case-mobile-390.png

### 人工确认
- 页面可交付，但手机端表格滚动提示建议补强。

## English

### Task Handoff

```text
Review task
URL: http://127.0.0.1:4173/recipes/pages-deploy-diagnosis.html
Primary path: open page, switch to mobile viewport, expand navigation, inspect evidence table
Prohibited actions: do not submit forms, change data, or trigger account actions
```

### First Assistant Report
- First judgment: The mobile screenshot showed the table could scroll, but the scroll cue was weak.
- Action run: `curl -I -L --max-time 15 http://127.0.0.1:4173/`
- Evidence location: home-desktop-1440.png
- Not ready yet: DOM text was fine but mobile screenshot showed cramped button wrapping

### Correction Report
- Minimal correction: Make screenshots mandatory evidence
- Retest action: `Browser desktop viewport: 1440x1000, capture home-desktop-1440.png.`
- Retest evidence: case-mobile-390.png

### Human Confirmation
- The page is deliverable, but the mobile table scroll cue should be improved.
