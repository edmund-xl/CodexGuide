# Contributing

## 中文

感谢你改进 Codex Everyday Guide。

### 内容标准

所有内容贡献都必须保持双语文档标准。

- 先维护完整中文内容，再维护完整英文内容。
- 包含适用范围、前置条件、流程、交付物、风险控制和验收标准。
- 使用自有或中性的演示示例和真实可用的场景。
- 涉及产品行为、限制、安全和价格时使用 OpenAI 官方文档。
- 对动态事实标注核对日期。

### 隐私与安全

贡献内容必须让用户数据和高风险动作处于清晰的人工控制之下。

- 不要包含密钥、客户资料、私人证件、完整合同或内部账号信息。
- 发布、删除、覆盖、发送或账号操作必须人工确认。
- 示例应小规模、可回退，并适合本地复核。

### 质量检查

提交 PR 前请运行完整本地检查。

```bash
npm run build
npm run check
npm run verify
```

验证脚本会检查双语分区、本地链接、验收标准和禁用关键词。

## English

Thanks for improving Codex Everyday Guide.

### Content Standard

All content contributions must maintain the bilingual documentation standard.

- Maintain the complete Chinese content first, then the complete English content.
- Include scope, prerequisites, procedure, deliverables, risk controls, and acceptance criteria.
- Use owned or neutral demo examples and practical scenarios.
- Use official OpenAI documentation for product behavior, limits, security, and pricing.
- Mark dynamic facts with a verification date.

### Privacy and Safety

Contributions must keep user data and risky actions under clear human control.

- Do not include secrets, customer records, private IDs, full contracts, or internal account data.
- Require human confirmation for publishing, deleting, overwriting, sending, or account actions.
- Keep examples small, reversible, and suitable for local review.

### Quality Gates

Run the full local checks before opening a pull request.

```bash
npm run build
npm run check
npm run verify
```

The verification script checks separated bilingual sections, local links, acceptance criteria, and forbidden keywords.
