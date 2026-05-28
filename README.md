# Codex Everyday Guide

一个面向普通用户、创作者、个人开发者和小团队的 Codex 实践指南。项目采用静态 HTML 生成方式，目录、导航和页面格式参考主流文档站组织方式，但正文、案例、图片、样式和代码均为原创。

## 本地使用

生成静态站点：

```bash
npm run build
```

直接打开：

```text
/Users/xinglei/Documents/New project 4/index.html
```

也可以用任意静态服务器预览：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

## 项目结构

- `scripts/generate-site.mjs`：站点内容、目录和页面生成器。
- `index.html`：首页。
- `guide/`：17 节系统教程。
- `platform/`：入口地图。
- `configuration/`：配置、安全和审批专题。
- `practice/`、`reference/`、`contribute/`：实践方法、官方资料和共建路线图。
- `recipes/`：13 个原创实战案例。
- `assets/`：原创 SVG 图、Logo 和示意图。

## 合规边界

本项目不复制 `codexguide.ai` 或其他第三方项目的正文、代码、图片、截图、提示词模板或案例设定。目标站仅作为布局和目录层级参考；外部群聊入口已移除；实战案例已改为不同场景。详情见 [CLEANROOM.md](CLEANROOM.md)。
