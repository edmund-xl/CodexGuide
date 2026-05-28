# 04 本地文档站批量改版 - 验收 Runbook

## 中文

### 命令与人工步骤
- `npm run build`
- `npm run check`
- `curl -I -L --max-time 15 http://127.0.0.1:4173/CodexGuide/`

### 验收标准
- 44 个 HTML 页面全部生成并通过链接检查。
- 旧案例路径不再出现在仓库内容或生成页面中。
- 桌面和手机截图无文字重叠、无页面级横向溢出。
- README 截图与当前站点界面一致。

### 失败与修正
- 旧文件残留：改 URL 后旧 HTML 仍留在目录中；删除旧文件并让校验禁止旧路径
- 搜索索引旧文案：搜索结果仍显示旧摘要；统一从新 page 数据生成搜索文本
- 表格移动端溢出：证据表撑破 390px 页面；给表格容器设置滚动和最小列宽

## English

### Commands and Manual Steps
- `npm run build`
- `npm run check`
- `curl -I -L --max-time 15 http://127.0.0.1:4173/CodexGuide/`

### Acceptance Criteria
- All 44 HTML pages are generated and pass link checks.
- Old recipe paths no longer appear in repository content or generated pages.
- Desktop and mobile screenshots show no text overlap and no page-level horizontal overflow.
- README screenshots match the current site interface.

### Failures and Corrections
- Stale files: Old HTML files remained after URL changes; Delete old files and make verification block old paths
- Stale search text: Search results still showed old summaries; Generate search text from new page data
- Mobile table overflow: Evidence table broke the 390px page; Add scroll containers and minimum column widths
