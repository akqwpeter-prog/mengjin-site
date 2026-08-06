# mengjin-site

曹孟锦的个人网站 — AI 产品总监 / 15 年互联网产品 / 3 年 AIGC。

纸面杂志风 v3：浅色暖纸底、墨黑 + 单一朱红强调色、衬线大标题、超大章节数字。

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
assets/css/style.css 样式（纸面杂志主题）
assets/js/main.js    滚动动效、数字滚动、导航交互
assets/fonts/        自托管字体（Unbounded / JetBrains Mono）
assets/img/          照片
```

## 部署

可直接把整个目录拖入 Cloudflare Pages / Netlify / EdgeOne Pages，
或推送到 GitHub 仓库后接入平台自动构建。
