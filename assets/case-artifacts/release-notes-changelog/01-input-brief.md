# 11 发布说明与变更日志生成

## 中文

### 任务摘要
从提交范围生成公开发布说明、内部变更日志和待确认项，把技术提交翻译成可发布内容。

### 可读取材料
- 版本范围明确，例如 <code>v0.8.0..HEAD</code>。
- 公开版面向用户，内部版保留技术细节和排障说明。
- 敏感功能、客户名称、事故细节和路线图承诺必须人工确认。

### 输入样例

```text
版本范围：v0.8.0..HEAD
目标读者：普通用户和小团队管理员
语气：简洁、可行动，不写内部模块名
限制：未确认功能不要写成承诺
```

## English

### Task Summary
Generate public release notes, internal changelog, and confirmation items from a commit range, translating technical commits into publishable content.

### Readable Materials
- Version range is explicit, such as <code>v0.8.0..HEAD</code>.
- Public version targets users; internal version keeps technical detail and troubleshooting notes.
- Sensitive features, customer names, incident details, and roadmap promises require human confirmation.

### Input Sample

```text
Version range: v0.8.0..HEAD
Audience: everyday users and small-team admins
Tone: concise and actionable; avoid internal module names
Constraint: do not present unconfirmed features as promises
```
