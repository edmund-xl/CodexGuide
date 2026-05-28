# Codex Everyday Guide

## 中文

Codex Everyday Guide 是一个面向真实工作流的专业 Codex 双语文档站。

### 项目定位

本项目面向普通用户、创作者、个人开发者和小团队，目标是用清晰的任务边界、可复查的交付物和可重复的安全实践来使用 Codex。

### 文档标准

每个生成页面都遵循同一套专业结构：

- 适用范围与读者
- 前置条件
- 标准流程
- 交付物
- 风险控制
- 验收标准
- 先中文、后英文的完整分区内容

### 本地构建

```bash
npm run build
npm run check
npm run verify
```

启动本地页面服务：

```bash
npm run serve
```

然后打开任一地址：

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/CodexGuide/
```

### 页面服务

仓库使用 GitHub Pages 发布静态站点。每次推送 `main` 后，GitHub Actions 会重新构建、检查并发布页面。

发布地址：

```text
https://edmund-xl.github.io/CodexGuide/
```

### 项目结构

- `scripts/generate-site.mjs`: 双语静态站点生成器
- `scripts/verify-site.mjs`: 双语分区、链接、验收标准和禁用关键词质量检查
- `guide/`: 17 节结构化教程
- `configuration/`: 配置与安全专题
- `recipes/`: 13 个实战案例
- `platform/`, `practice/`, `reference/`, `contribute/`: 入口地图、实践方法、官方文档和共建路线图
- `assets/`: SVG 图示

### 使用规范

使用本项目时，请控制输入材料、保留复核步骤，并对高风险动作进行明确人工确认。

- 不要把密钥、客户资料、私人证件、完整合同或内部账号信息放入示例任务。
- 动态产品信息在发布前应回到 OpenAI 官方文档核对。
- 发布、删除、覆盖、发送和账号操作必须人工确认。

## English

Codex Everyday Guide is a professional, bilingual documentation site for practical Codex workflows.

### Positioning

This project is designed for everyday users, creators, individual developers, and small teams who want to use Codex with clear task boundaries, reviewable outputs, and repeatable safety practices.

### Documentation Standard

Every generated page follows the same professional structure:

- Scope and audience
- Prerequisites
- Standard procedure
- Deliverables
- Risk controls
- Acceptance criteria
- Complete Chinese-first and English-second content sections

### Local Build

```bash
npm run build
npm run check
npm run verify
```

Start the local page service:

```bash
npm run serve
```

Then open either URL:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/CodexGuide/
```

### Page Service

The repository publishes the static site with GitHub Pages. Every push to `main` triggers GitHub Actions to rebuild, check, and deploy the pages.

Published URL:

```text
https://edmund-xl.github.io/CodexGuide/
```

### Project Structure

- `scripts/generate-site.mjs`: bilingual static site generator
- `scripts/verify-site.mjs`: quality gate for separated bilingual sections, links, acceptance criteria, and forbidden keywords
- `guide/`: 17 structured guide chapters
- `configuration/`: configuration and security topics
- `recipes/`: 13 practical recipes
- `platform/`, `practice/`, `reference/`, `contribute/`: entry map, operating model, official documentation, and contribution roadmap
- `assets/`: SVG diagrams

### Usage Policy

Use this project with controlled materials, clear review steps, and explicit user approval for risky actions.

- Do not place secrets, customer records, private IDs, full contracts, or internal account data into example tasks.
- Dynamic product details should be checked against official OpenAI documentation before publication.
- Publishing, deleting, overwriting, sending, and account actions require human confirmation.
