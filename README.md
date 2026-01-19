# Follow Miaomiao - Personal Portfolio & Blog

这是我的个人站点源代码，基于 [Hugo](https://gohugo.io/) 构建，部署于 GitHub Pages。该项目展示了我在技术写作、文档工程以及多语言内容管理方面的实践。

[![Hugo-Build-Deploy](https://github.com/miumiu-op/miumiu-op.github.io/actions/workflows/deploy-hugo.yml/badge.svg)](https://github.com/miumiu-op/miumiu-op.github.io/actions)
[![Language: English/Chinese](https://img.shields.io/badge/Language-English%2FChinese-blue)](https://miumiu-op.github.io/zh/)

## 🚀 项目亮点

* **多语言管理 (i18n)**：基于 Hugo 实现中英文双语架构，采用独立的内容目录管理逻辑，支持无缝语言切换。
* **自动化部署 (CI/CD)**：配置 GitHub Actions 工作流实现自动化构建，确保源码提交后网站即时更新。
* **结构化配置**：通过 `config.yaml` 集中管理全局元数据、多语言菜单及个性化模块标题。

## 📂 核心结构说明

```text
.
├── .github/workflows/  # CI/CD 自动化部署脚本
├── content/            # 多语言 Markdown 内容 (en/zh)
├── i18n/               # 国际化翻译字符串定义
├── themes/             # Hugo 主题 (hugo-profile)
└── config.yaml         # 全局站点配置与多语言路由
```

## 🛠️ 本地预览

1. 克隆仓库 (含主题子模块):

```Bash
git clone --recursive [https://github.com/miumiu-op/miumiu-op.github.io.git](https://github.com/miumiu-op/miumiu-op.github.io.git)
```

2. 本地运行:

```Bash
hugo server -D
```

3. 预览: 访问 `http://localhost:1313/`

© 2026 Miaomiao Pan. Built with Hugo.