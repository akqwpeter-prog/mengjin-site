# mengjin-site

曹孟锦的个人网站 — AI 产品总监 / 15 年互联网产品 / 3 年 AIGC。

Ink & Jade 主题 v5（taste-skill / high-end-visual-design 审计）：冷调纸感底色 + 单一玉青强调色、Plus Jakarta Sans 圆角无衬线、Bento Grid 骨架、弹簧按压交互、悬浮胶囊导航，支持浅色 / 暗色双主题。

纯静态站点（HTML + CSS + JS），无构建依赖，字体全部自托管，可部署到任何静态托管平台。

## 本地预览

```bash
cd mengjin-site
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080

## 结构

```text
index.html           页面结构
assets/css/style.css 样式（Ink & Jade 主题）
tokens.css           设计令牌（OKLCH 色彩、字体、间距、动效、双主题）
assets/js/main.js    滚动动效、数字滚动、导航交互
assets/fonts/        自托管字体（Plus Jakarta Sans / JetBrains Mono）
assets/img/          照片
```

## 部署

可直接把整个目录拖入 Cloudflare Pages / Netlify / EdgeOne Pages，
或推送到 GitHub 仓库后接入平台自动构建。

Cloudflare Pages 配置：框架预设 None，构建命令 `exit 0`，输出目录填 `.`。
