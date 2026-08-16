# Development plan

## Technical conclusion

Vite + React 19 + TypeScript + 原生CSS。使用Skill提供的site-template作为基础，替换所有占位符内容。

## Project structure

```
zhonghai-scroll-site/
├── public/
│   ├── media/
│   │   └── scroll-story.mp4          # 最终编码的web视频
│   └── stills/
│       ├── scene-01.jpg              # 场景1海报
│       ├── scene-02.jpg              # 场景2海报
│       ├── scene-03.jpg              # 场景3海报
│       ├── scene-04.jpg              # 场景4海报
│       └── scene-05.jpg              # 场景5海报
├── src/
│   ├── main.tsx                      # React入口
│   ├── App.tsx                       # 主组件（scroll-scrubbing逻辑）
│   ├── scenes.ts                     # 场景数据与视频时长
│   └── styles.css                    # 全局样式
├── assets/
│   ├── brand/                        # 品牌资产
│   ├── design/                       # 设计稿
│   ├── prompts/                      # 生成prompt记录
│   └── video/                        # 生成视频资产
│       ├── scenes/                   # 场景视频片段
│       ├── connectors/               # 连接片段
│       ├── scene-frames/             # 场景边界帧
│       ├── connector-frames/         # 连接片段边界帧
│       └── review/                   # 审查序列
├── scripts/                          # Skill提供的脚本
│   ├── probe_videos.py
│   ├── extract_boundary_frames.sh
│   ├── make_contact_sheet.sh
│   ├── build_review_sequence.py
│   ├── encode_web_video.sh
│   └── package_local_preview.sh
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsconfig.app.json
```

## Scene timeline data model

```typescript
export const VIDEO_DURATION = 50; // 总秒数

export const scenes: Scene[] = [
  { id: "open",     number: "01", nav: "启幕",  start: 0,  accent: "#D4A574" },
  { id: "panorama", number: "02", nav: "全景",  start: 10, accent: "#4A90A4" },
  { id: "deep",     number: "03", nav: "深耕",  start: 20, accent: "#5CCB8A" },
  { id: "smart",    number: "04", nav: "智慧",  start: 30, accent: "#7F75E8" },
  { id: "winwin",   number: "05", nav: "共赢",  start: 40, accent: "#E85D4E" },
];
```

## Scroll-to-video mapping

- 世界容器高度：`850vh`
- 粘性舞台高度：`100svh`
- 滚动进度：`progress = clamp(scrollTop / (worldHeight - viewportHeight), 0, 1)`
- 视频时间：`time = progress * VIDEO_DURATION`
- 场景索引：找到 `time >= scene.start` 的最大索引
- 视频同步：`requestAnimationFrame` 内检查并seek到targetTime
- seek阈值：`0.035s`，避免过度seek

## Media generation and review

### 阶段1：image2.0 关键视觉
1. 先生成场景1关键视觉（锚点图）
2. 基于锚点图风格一致性，生成其余场景关键视觉
3. 每张图保存prompt到 `assets/prompts/`

### 阶段2：Seedance 2.0 场景视频
1. 使用场景关键视觉作为首帧参考
2. 生成每个场景的视频片段（16:9, 720p, 无声）
3. 保存视频到 `assets/video/scenes/`

### 阶段3：连续性审查与连接片段
1. 提取所有片段的边界帧
2. 制作contact sheet审查
3. 对不连续的边界生成Seedance连接片段
4. 构建review序列

## Video encoding

- 使用 `scripts/encode_web_video.sh`
- 输出：H.264, 适合scroll-seek的编码参数
- 目标文件：`public/media/scroll-story.mp4`

## Fallback behavior

- **视频未加载**：显示当前场景的poster图
- **视频加载失败**：保持poster图，隐藏video元素
- **减少动画偏好**：自动切换到mobileStory静态布局
- **移动端**：直接显示静态场景卡片

## Validation

- [ ] `npm run build` 成功
- [ ] 最终视频可解码、时长正确
- [ ] 桌面端scroll-scrubbing流畅
- [ ] 场景文案同步准确
- [ ] 移动端布局正确
- [ ] 减少动画fallback工作正常

## Packaging

- [ ] 运行 `scripts/package_local_preview.sh`
- [ ] 输出包含：源码 + 预览包 + 启动说明
- [ ] 用户可通过 `npm install && npm run dev` 本地启动
