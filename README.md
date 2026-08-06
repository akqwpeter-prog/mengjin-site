# mengjin-site

曹孟锦的个人网站 — AI 产品总监 / 15 年互联网产品 / 3 年 AIGC。

Cobalt Ink 主题 v7（默认深色版）：墨蓝底色 + 电光钴蓝主色 + 珊瑚状态色、Plus Jakarta Sans 可变字体（200-800 字重）排版升级、Bento Grid 骨架、字符级首屏入场、3D 肖像倾斜、聚光卡片、磁吸按钮、时间轴滚动生长、技能跑马灯。

页面插画由 algorithmic-art 技能生成（「钴蓝墨流」流场粒子算法，种子可复现），见 `assets/img/art-readme.md`。

纯静态站点（HTML + CSS + JS），无构建依赖，字体全部自托管，可部署到任何静态托管平台。

## 本地预览

```bash
cd mengjin-site
cd public
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080

## 结构

```text
public/              可发布目录（部署时输出此目录）
public/index.html    页面结构
public/assets/css/style.css 样式（Cobalt Ink 主题）
public/tokens.css    设计令牌（OKLCH 色彩、字体、间距、动效）
public/assets/js/main.js 滚动动效、数字滚动、导航交互
public/assets/fonts/ 自托管字体（Plus Jakarta Sans 可变字重 / JetBrains Mono）
public/assets/img/   照片 + 生成插画（钴蓝墨流）
```

## 部署

推送到 GitHub 仓库后接入 Cloudflare Pages：

- 框架预设：None
- 构建命令：`exit 0`
- 构建输出目录：`public`
- 生产分支：main
