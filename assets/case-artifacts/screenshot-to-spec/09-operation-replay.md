# 07 设计截图转实现规格 - 操作回放

## 中文

### 实测快照
- 触发场景：只有目标截图和当前页面截图，需要转成开发可执行的组件规格。
- 工具链：截图标注、组件映射、状态表、验收截图。
- 第一信号：截图里按钮、筛选栏和表格密度没有文字规格。
- 完成信号：输出 8 个组件、5 个状态、3 个断点的实现清单。

| 阶段 | 命令/动作 | 观察输出 | 证据文件 |
| --- | --- | --- | --- |
| 截图读取 | 标注 target.png 与 current.png | regions=11, uncertain=2 | annotation-table.md |
| 规格生成 | 输出 implementation-spec.md | components=8, states=5, breakpoints=3 | implementation-spec.md |
| 验收 | 列出截图验收点 | acceptance_shots=desktop,mobile,dense-table | component-checklist.md |

## English

### Run Snapshot
- Trigger: Only target and current screenshots were available, requiring an implementable component specification.
- Toolchain: Screenshot annotation, component mapping, state table, and acceptance screenshots.
- First Signal: Buttons, filters, and table density were visible in screenshots but lacked written specs.
- Done Signal: The output included an implementation checklist for eight components, five states, and three breakpoints.

| Stage | Command / Action | Observed Output | Evidence File |
| --- | --- | --- | --- |
| Screenshot reading | Annotate target.png and current.png | regions=11, uncertain=2 | annotation-table.md |
| Spec generation | Write implementation-spec.md | components=8, states=5, breakpoints=3 | implementation-spec.md |
| Acceptance | List screenshot acceptance points | acceptance_shots=desktop,mobile,dense-table | component-checklist.md |
