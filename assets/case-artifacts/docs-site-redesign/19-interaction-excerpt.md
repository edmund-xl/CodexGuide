# 04 本地文档站批量改版 - 关键交互片段

## 中文

### 任务交代

```text
改版约束
底色 #141414，面板 #1e1e1e / #242424，边框 #333，强调色 #ff922c
页面数量保持 44
README 需要展示新版截图
本地路径和线上路径都要可访问
```

### 助手首轮回报
- 先判断：第一次改版后案例详情信息密度不足，案例总览缺少任务矩阵。
- 已执行：`npm run build`
- 证据落点：npm run check
- 暂不交付：改 URL 后旧 HTML 仍留在目录中

### 修正回报
- 最小修正：删除旧文件并让校验禁止旧路径
- 复测动作：`npm run check`
- 复测证据：verify-site.mjs

### 人工确认
- README 截图必须和当前构建一致。

## English

### Task Handoff

```text
Redesign constraints
Background #141414, panels #1e1e1e / #242424, border #333, accent #ff922c
Keep 44 pages
README must show updated screenshots
Local and live paths must be accessible
```

### First Assistant Report
- First judgment: After the first redesign, recipe details lacked enough density and the index lacked a task matrix.
- Action run: `npm run build`
- Evidence location: npm run check
- Not ready yet: Old HTML files remained after URL changes

### Correction Report
- Minimal correction: Delete old files and make verification block old paths
- Retest action: `npm run check`
- Retest evidence: verify-site.mjs

### Human Confirmation
- README screenshots must match the current build.
