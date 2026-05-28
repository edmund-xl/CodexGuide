# Contributing / 贡献指南

Thanks for improving Codex Everyday Guide.

感谢你改进 Codex Everyday Guide。

## Content Standard / 内容标准

All content contributions must maintain the bilingual documentation standard.

所有内容贡献都必须保持双语文档标准。

- Write Chinese and English together. / 同时维护中文和英文。
- Include scope, prerequisites, procedure, deliverables, risk controls, and acceptance criteria. / 包含适用范围、前置条件、流程、交付物、风险控制和验收标准。
- Use owned or neutral demo examples and practical scenarios. / 使用自有或中性的演示示例和真实可用的场景。
- Link to official OpenAI documentation for product behavior, limits, security, and pricing. / 涉及产品行为、限制、安全和价格时使用 OpenAI 官方文档。
- Mark dynamic facts with a verification date. / 对动态事实标注核对日期。

## Privacy and Safety / 隐私与安全

Contributions must keep user data and risky actions under clear human control.

贡献内容必须让用户数据和高风险动作处于清晰的人工控制之下。

- Do not include secrets, customer records, private IDs, full contracts, or internal account data. / 不要包含密钥、客户资料、私人证件、完整合同或内部账号信息。
- Require human confirmation for publishing, deleting, overwriting, sending, or account actions. / 发布、删除、覆盖、发送或账号操作必须人工确认。
- Keep examples small, reversible, and suitable for local review. / 示例应小规模、可回退，并适合本地复核。

## Quality Gates / 质量检查

Run the full local checks before opening a pull request.

提交 PR 前请运行完整本地检查。

```bash
npm run build
npm run check
npm run verify
```

The verification script checks bilingual coverage, local links, acceptance criteria, and forbidden keywords.

验证脚本会检查双语覆盖、本地链接、验收标准和禁用关键词。
