# 13 日志报错定位与修复建议 - 结果片段

## 中文

```text
diagnosis.md
症状：链接检查失败，目标 recipes/old-page.html 不存在
根因：案例 URL 改名后，搜索索引仍使用旧路径
最小修复：更新 caseRecipes path 和首页入口链接
回退方式：恢复上一提交或改回旧 path
验收：npm run build && npm run check
```

## English

```text
diagnosis.md
Symptom: link check failed because recipes/old-page.html does not exist
Root cause: after recipe URL rename, search index still used the old path
Minimal fix: update caseRecipes path and home entry link
Rollback: restore previous commit or switch back to old path
Acceptance: npm run build && npm run check
```
