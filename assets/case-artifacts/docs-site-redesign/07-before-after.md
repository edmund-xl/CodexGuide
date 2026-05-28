# 04 本地文档站批量改版 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 改 URL 后旧 HTML 仍留在目录中 | 删除旧文件并让校验禁止旧路径 | npm run check |
| 过程修正 | 搜索结果仍显示旧摘要 | 统一从新 page 数据生成搜索文本 | verify-site.mjs |
| 交付后 | 改版结果<br>- 44 个页面重新生成<br>- 案例页新增任务状态面板、证据表、命令块和验收清单<br>- README 更新首页、案例总览、两个案例页、使用规范页截图<br>- 本地根路径和 /CodexGuide/ 均返回 200 | 44 个 HTML 页面全部生成并通过链接检查。 | 新版站点、README 截图、质量门禁结果 |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | Old HTML files remained after URL changes | Delete old files and make verification block old paths | npm run check |
| Correction | Search results still showed old summaries | Generate search text from new page data | verify-site.mjs |
| After | Redesign result<br>- 44 pages regenerated<br>- Recipe pages gain task status panels, evidence tables, command blocks, and acceptance checklists<br>- README updates home, recipe index, two recipe pages, and usage policy screenshots<br>- Local root and /CodexGuide/ both return 200 | All 44 HTML pages are generated and pass link checks. | Redesigned site, README screenshots, and quality-gate results |
