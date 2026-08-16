# 中海物业增值服务 — Scroll Promo Site

## 项目简介

中海物业增值服务官网，采用 scroll-scrubbing 滚动控制视频技术，桌面端滚动即播放连续视频，上下滚动可双向控制，移动端使用静态多场景布局。

## 技术栈

- Vite + React 19 + TypeScript
- 原生 CSS
- FFmpeg 视频处理

## 快速启动

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5173`

## 生产构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

## 项目结构

```
├── public/
│   ├── media/scroll-story.mp4    # 最终web视频（50秒，720p，全I帧）
│   └── stills/                   # 场景静帧海报
├── src/
│   ├── App.tsx                   # 主组件（scroll-scrubbing逻辑）
│   ├── scenes.ts                 # 场景数据
│   └── styles.css                # 全局样式
├── assets/
│   ├── design/                   # 关键视觉图
│   ├── prompts/                  # 生成prompt记录
│   └── video/                    # 视频资产
│       ├── scenes/               # 5个场景视频片段
│       └── scene-frames/         # 边界帧
└── scripts/                      # 视频处理脚本
```

## 五幕叙事

1. **启幕·万家灯火** — 品牌开篇，城市全景
2. **全景·全态覆盖** — 四大业态，混合城区
3. **深耕·八大服务** — 服务空间，室内场景
4. **智慧·数字赋能** — 智慧建筑，科技光效
5. **共赢·携手未来** — 城市日落，合作共赢

## 视觉风格

- 明亮通透的天空蓝色调
- 现代建筑可视化质感
- 黄金时段自然光线
- 左侧40%安全文字区域

## 资产来源

- 关键视觉图：image2.0 (gpt-image-2-medium / gem-3.1)
- 场景视频：Seedance 2.0 (model-sd-fast)
- 参考风格：用户上传的中海物业品牌设计稿

## 联系

- 企业邮箱：ynhl@cohl.com
- 公司地址：深圳市深圳湾创新科技中心T1栋15A
