# 04 本地文档站批量改版 - 操作回放

## 中文

### 实测快照
- 触发场景：站点需要从浅色文档模板升级成深色产品工作台，同时不能破坏发布链路。
- 工具链：静态生成器、样式 tokens、页面数量检查、README 截图。
- 第一信号：第一次改版后案例详情信息密度不足，案例总览缺少任务矩阵。
- 完成信号：44 个页面生成通过，案例页有证据表、命令块、评分和材料包。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 构建 | npm run build | Generated 44 bilingual pages and SVG assets | build.log |
| 质量门禁 | npm run check | 44 HTML pages verified | verify.log |
| 视觉抽查 | 桌面与手机视口检查首页、案例总览和案例页 | overflow=false, broken_images=0 | README screenshots |

## English

### Run Snapshot
- Trigger: The site needed to move from a light documentation template to a dark product workbench without breaking publishing.
- Toolchain: Static generator, style tokens, page-count checks, and README screenshots.
- First Signal: After the first redesign, recipe details lacked enough density and the index lacked a task matrix.
- Done Signal: All 44 pages generated successfully, and recipe pages include evidence tables, command blocks, scorecards, and artifact packs.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Build | npm run build | Generated 44 bilingual pages and SVG assets | build.log |
| Quality gate | npm run check | 44 HTML pages verified | verify.log |
| Visual check | Check home, recipe index, and recipe detail on desktop and mobile | overflow=false, broken_images=0 | README screenshots |
