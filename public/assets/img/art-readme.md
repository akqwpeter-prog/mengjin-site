# 钴蓝墨流 · Cobalt Inkstream

网站插画由 algorithmic-art 生成：数千个粒子沿分层 Perlin 流场游走，
留下半透明的墨线轨迹，累积成有机的密度图。速度与噪声决定色相：
钴蓝承担主流，珊瑚色标记罕见的湍流。每次运行使用固定种子，可完全复现。

| 文件 | 尺寸 | 种子 | 用途 |
| --- | --- | --- | --- |
| ink-flow-1.webp | 760x760 | 2026 | 旗舰作品卡（彩云小梦） |
| ink-flow-2.webp | 1150x720 | 2027 | 联系区背景 |
| ink-flow-3.webp | 600x840 | 2028 | 首屏肖像背后层次 |

深色版已将透明底合成到页面纸色上，体积从 ~1MB 压至 44-74KB。

avatar.webp 由 Seedream 5.0-lite 以真人照片为参考生成（日本动漫电影级作画风格），
原始真人照片已移出公开仓库，仅保留在本地。

生成脚本（临时）：`/tmp/inkgen/index.html` + `/tmp/inkgen/export_inks.py`。
