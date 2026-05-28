# Codex Everyday Guide

Codex Everyday Guide is a professional, bilingual documentation site for practical Codex workflows.

Codex Everyday Guide 是一个面向真实工作流的专业 Codex 双语文档站。

## Positioning / 项目定位

This project is designed for everyday users, creators, individual developers, and small teams who want to use Codex with clear task boundaries, reviewable outputs, and repeatable safety practices.

本项目面向普通用户、创作者、个人开发者和小团队，目标是用清晰的任务边界、可复查的交付物和可重复的安全实践来使用 Codex。

## Documentation Standard / 文档标准

Every generated page follows the same professional structure:

每个生成页面都遵循同一套专业结构：

- Scope and audience / 适用范围与读者
- Prerequisites / 前置条件
- Standard procedure / 标准流程
- Deliverables / 交付物
- Risk controls / 风险控制
- Acceptance criteria / 验收标准
- Chinese-English parallel content / 中英文对照内容

## Local Build / 本地构建

```bash
npm run build
npm run check
npm run verify
```

Preview with any static server:

可用任意静态服务器预览：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

然后打开：

```text
http://127.0.0.1:4173/index.html
```

## Project Structure / 项目结构

- `scripts/generate-site.mjs`: bilingual static site generator / 双语静态站点生成器
- `scripts/verify-site.mjs`: quality gate for bilingual coverage, links, acceptance criteria, and forbidden legacy keywords / 双语覆盖、链接、验收标准和禁用关键词质量检查
- `guide/`: 17 structured guide chapters / 17 节结构化教程
- `configuration/`: configuration and security topics / 配置与安全专题
- `recipes/`: 13 original recipes / 13 个原创实战案例
- `platform/`, `practice/`, `reference/`, `contribute/`: entry map, operating model, official references, and contribution roadmap / 入口地图、实践方法、官方资料和共建路线图
- `assets/`: original SVG diagrams / 原创 SVG 图示

## Clean-Room Boundary / 原创边界

The project may use public sites as layout references, but the copy, examples, diagrams, CSS, JavaScript, and recipes in this repository are original.

本项目可以参考公开网站的布局组织方式，但仓库中的正文、案例、图示、CSS、JavaScript 和实战场景均为原创。

Dynamic product facts must be verified against official OpenAI sources before publication.

所有动态产品事实在发布前都必须回到 OpenAI 官方来源核对。
