# 02 浏览器页面巡检与截图证据 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | DOM 文本正常但手机截图里按钮换行拥挤 | 截图成为必检证据 | home-desktop-1440.png |
| 过程修正 | 第一次截图无法判断视口 | 统一使用页面加视口命名 | case-mobile-390.png |
| 交付后 | page-review.md<br>P0 阻断：0<br>P1 体验影响：1 - 手机端证据表需要明显滚动提示<br>P2 文字瑕疵：2 - 两处按钮文案可缩短<br>通过项：本地服务 200，桌面无重叠，手机无横向页面溢出 | 目标 URL 返回 200，关键资源未缺失。 | page-review.md、screenshots/、console-summary.txt |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | DOM text was fine but mobile screenshot showed cramped button wrapping | Make screenshots mandatory evidence | home-desktop-1440.png |
| Correction | First screenshot names did not show viewport | Use page plus viewport in filenames | case-mobile-390.png |
| After | page-review.md<br>P0 blocking: 0<br>P1 experience impact: 1 - mobile evidence table needs a clearer scroll cue<br>P2 copy polish: 2 - two button labels can be shortened<br>Passed checks: local service 200, no desktop overlap, no mobile page overflow | Target URL returns 200 and key assets are not missing. | page-review.md, screenshots/, and console-summary.txt |
