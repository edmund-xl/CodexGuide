# Contributing / 贡献指南

Thanks for improving Codex Everyday Guide.

感谢你改进 Codex Everyday Guide。

## Content Standard / 内容标准

All content contributions must maintain the bilingual documentation standard.

所有内容贡献都必须保持双语文档标准。

- Write Chinese and English together. / 同时维护中文和英文。
- Include scope, prerequisites, procedure, deliverables, risk controls, and acceptance criteria. / 包含适用范围、前置条件、流程、交付物、风险控制和验收标准。
- Use original examples and practical scenarios. / 使用原创示例和真实可用的场景。
- Link to official OpenAI documentation for product behavior, limits, security, and pricing. / 涉及产品行为、限制、安全和价格时引用 OpenAI 官方资料。
- Mark dynamic facts with a verification date. / 对动态事实标注核对日期。

## Quality Gates / 质量检查

Run the full local checks before opening a pull request.

提交 PR 前请运行完整本地检查。

```bash
npm run build
npm run check
npm run verify
```

The verification script checks bilingual coverage, local links, acceptance criteria, and forbidden legacy/reference keywords.

验证脚本会检查双语覆盖、本地链接、验收标准和禁用的旧内容关键词。
