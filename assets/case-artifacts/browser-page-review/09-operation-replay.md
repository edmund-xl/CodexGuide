# 02 浏览器页面巡检与截图证据 - 操作回放

## 中文

### 实测快照
- 触发场景：本地页面即将交付，需要确认桌面、手机、控制台和表格区域没有阻断问题。
- 工具链：本地服务、浏览器视口、控制台摘要、截图清单。
- 第一信号：手机截图里表格可滚动，但缺少明显滚动提示。
- 完成信号：页面级横向溢出为 false，控制台错误为 0，P0 问题为 0。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 服务确认 | curl -I -L --max-time 15 http://127.0.0.1:4173/ | HTTP/1.1 200 OK | console-summary.txt |
| 手机视口 | 390x900 检查 scrollWidth 与 innerWidth | page_overflow=false, table_scroll=true | case-mobile-390.png |
| 问题归档 | 按 P0/P1/P2 写入 page-review.md | P0=0, P1=1, P2=2 | page-review.md |

## English

### Run Snapshot
- Trigger: A local page was close to delivery and needed desktop, mobile, console, and table checks.
- Toolchain: Local server, browser viewports, console summary, and screenshot inventory.
- First Signal: The mobile screenshot showed the table could scroll, but the scroll cue was weak.
- Done Signal: Page-level horizontal overflow was false, console errors were 0, and P0 issues were 0.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Service check | curl -I -L --max-time 15 http://127.0.0.1:4173/ | HTTP/1.1 200 OK | console-summary.txt |
| Mobile viewport | Check scrollWidth and innerWidth at 390x900 | page_overflow=false, table_scroll=true | case-mobile-390.png |
| Issue filing | Write P0/P1/P2 issues to page-review.md | P0=0, P1=1, P2=2 | page-review.md |
