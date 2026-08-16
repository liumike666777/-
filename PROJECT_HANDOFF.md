# PROJECT_HANDOFF.md — 中海物业增值服务 Scroll Promo Site

> 版本：1.0.0  
> 日期：2026-08-15  
> 状态：核心网站已完成，可直接 `npm run dev` 预览  
> 接手前提：请完整阅读本文档后再修改任何文件。现有资产已确认，**不要重新设计或重复生成已有资产**。

---

## 1. 项目目标

为 **中海物业增值服务**（COHL Property Value-Added Services）构建一个企业官网，采用 **scroll-scrubbing** 动效技术：

- **桌面端**：页面滚动位置映射到视频时间轴，滚动即播放/倒放连续视频
- **移动端**：自动切换为静态多场景卡片布局
- **核心诉求**：建立专业央企品牌形象，展示全业态/全周期/全场景服务能力，吸引B端/G端/A端客户与合作伙伴

---

## 2. 已确定视觉方向（锁定，不可更改）

### 2.1 参考来源
用户上传了一张品牌设计稿图片（蓝色兔子吉祥物+现代城市+明亮天空蓝），视觉方向以此图为基准。

### 2.2 色彩体系
| 颜色 | 色值 | 用途 |
|------|------|------|
| 深海蓝 | `#0A2540` | 主文字、深色元素 |
| 天空蓝 | `#5BA3D0` | 主色调，参考图核心色 |
| 湖水蓝 | `#7EC8E3` | 辅助色，通透感 |
| 按钮蓝 | `#3B6FD4` | CTA按钮、交互强调 |
| 琥珀暖金 | `#D4A574` | 场景1强调色 |
| 浅灰蓝背景 | `#E8F4FC` | 页面背景 |
| 纯白 | `#FFFFFF` | 卡片、标签背景 |

### 2.3 风格关键词
- 高品质建筑可视化 + 写实光影
- 现代城市生态纪录片质感
- **明亮通透、清新开放**（不是黄昏/暗黑/赛博朋克）
- 黄金时段自然光线，蓝天白云
- 左侧约40%画面宽度为**安全文字区域**

### 2.4 明确禁止
- 宇宙/星空/粒子特效
- 赛博朋克或过度科技感
- 暗黑科技风或霓虹渐变
- 黄昏/夜晚暗沉色调
- 人物肖像或面部特写
- 卡通/插画/低多边形风格
- 场景中生成中文字体（所有文案通过HTML覆盖）
- 过于抽象的概念图形

---

## 3. 已使用的 Skill 与工具

| 工具/Skill | 用途 | 备注 |
|-----------|------|------|
| `scroll-promo-site-builder` | 整体工作流程驱动 | 核心Skill，定义了7个Phase |
| `image2.0` (gpt-image-2-medium fallback) | 5张关键视觉图生成 | 实际使用 gem-3.1 作为 fallback |
| `Seedance 2.0` (model-sd-fast) | 5个场景视频片段生成 | 720p, 16:9, 10秒, 无声 |
| `ffmpeg` | 视频拼接、编码、边界帧提取 | 6.1.1 |
| Vite + React 19 + TypeScript | 网站构建 | 基于 Skill site-template |

---

## 4. 页面结构

### 4.1 单页应用结构
```
<main>
  ├── <header>          固定导航栏（品牌名 + 5场景导航 + CTA）
  ├── <section.world>   850vh 滚动容器
  │     └── <div.stage> 100svh 粘性舞台
  │           ├── <div.media>      视频层 + poster图 + 渐变遮罩
  │           ├── <div.copyStack>  左侧文案区（5场景文案堆叠）
  │           └── <aside.rail>     右侧进度轨（编号+进度条+锚点）
  └── <section.mobileStory> 移动端静态场景卡片（仅移动端/reduce-motion可见）
```

### 4.2 交互元素
- **导航栏按钮**：点击平滑滚动到对应场景
- **进度轨按钮**：点击跳转到对应场景
- **进度条**：实时显示当前滚动进度
- **移动端**：垂直堆叠5张场景图+文案卡片

---

## 5. 滚动叙事逻辑

### 5.1 核心映射公式
```
worldHeight = 850vh
progress = clamp(scrollTop / (worldHeight - viewportHeight), 0, 1)
videoTime = progress * VIDEO_DURATION   // VIDEO_DURATION = 50
activeScene = max{i | videoTime >= scenes[i].start}
```

### 5.2 视频同步机制
- 使用 `requestAnimationFrame` 节流滚动事件
- 视频 seek 阈值：`0.035s`，超过才触发 `currentTime = targetTime`
- 视频加载完成后立即 seek 到第一帧（`0.001s` 避免 poster 死锁）
- 向上滚动时视频自然反向播放

### 5.3 场景切换触发点
| 场景 | start时间 | 对应滚动进度 |
|------|----------|------------|
| 01 启幕 | 0s | 0% |
| 02 全景 | 10s | 20% |
| 03 深耕 | 20s | 40% |
| 04 智慧 | 30s | 60% |
| 05 共赢 | 40s | 80% |

### 5.4 文案切换
- 通过 `active` 状态控制 CSS opacity + translateY 过渡
- 过渡时长：`0.5s ease`

---

## 6. 各场景设计（已锁定）

### Scene 01 — 启幕·万家灯火
- **时间**：0–10s
- **画面**：远景城市全景+湖水，镜头缓慢推进
- **文案标题**：从社区到城区，让空间持续创造价值
- **文案正文**：40余年央企物业经验，首家在港上市。覆盖160+城市、2300+项目...
- **标签**：全业态, 全周期, 全场景
- **强调色**：`#D4A574`（琥珀暖金）
- **相机**：平滑向前推进（dolly in），极低高度

### Scene 02 — 全景·全态覆盖
- **时间**：10–20s
- **画面**：鸟瞰混合城区（住宅/商业/产业/公建），镜头下降
- **文案标题**：全业态·全周期·全场景
- **文案正文**：覆盖住宅、商业、城服、公建四大业态...
- **标签**：住宅, 商业, 城服, 公建
- **强调色**：`#4A90A4`
- **相机**：平滑下降+轻微俯视旋转

### Scene 03 — 深耕·八大服务
- **时间**：20–30s
- **画面**：明亮室内服务大堂，镜头向右平移
- **文案标题**：深耕服务，赋能每一处空间
- **文案正文**：资产运营、租售服务、美居装修、生活服务...
- **标签**：资产运营, 租售, 美居
- **强调色**：`#5CCB8A`
- **相机**：水平右向平移

### Scene 04 — 智慧·数字赋能
- **时间**：30–40s
- **画面**：智慧建筑外观，金色光线条，镜头环绕
- **文案标题**：智慧科技，驱动服务升级
- **文案正文**：依托智慧社区平台，打通优你家Plus App...
- **标签**：智慧社区, 数字孪生, AI安防
- **强调色**：`#7F75E8`
- **相机**：弧线环绕（左→右）

### Scene 05 — 共赢·携手未来
- **时间**：40–50s
- **画面**：城市壮丽日落，与场景01首尾呼应
- **文案标题**：携手共建，城市美好未来
- **文案正文**：从社区到城区，从万家灯火到企业生态...
- **标签**：合作共赢, 城市生态
- **强调色**：`#E85D4E`
- **相机**：向前推进（dolly in）
- **CTA**："联系我们，开启合作"（mailto:ynhl@cohl.com）

---

## 7. 已生成资产清单及路径

### 7.1 关键视觉图（5张）
| 文件 | 路径 | 用途 | 锚点关系 |
|------|------|------|---------|
| scene-01-key.jpg | `assets/design/scene-01-key.jpg` | 场景1首帧+海报 | 锚点图，无参考 |
| scene-02-key.jpg | `assets/design/scene-02-key.jpg` | 场景2首帧+海报 | 参考 scene-01 |
| scene-03-key.jpg | `assets/design/scene-03-key.jpg` | 场景3首帧+海报 | 参考 scene-01 |
| scene-04-key.jpg | `assets/design/scene-04-key.jpg` | 场景4首帧+海报 | 参考 scene-01 |
| scene-05-key.jpg | `assets/design/scene-05-key.jpg` | 场景5首帧+海报 | 参考 scene-01 |

**海报副本**：`public/stills/scene-01.jpg` ~ `scene-05.jpg`

### 7.2 场景视频片段（5个）
| 文件 | 路径 | 时长 | 格式 |
|------|------|------|------|
| scene-01.mp4 | `assets/video/scenes/scene-01.mp4` | 10.04s | H.264, 1280×720, 24fps, 无音频 |
| scene-02.mp4 | `assets/video/scenes/scene-02.mp4` | 10.04s | H.264, 1280×720, 24fps, 无音频 |
| scene-03.mp4 | `assets/video/scenes/scene-03.mp4` | 10.04s | H.264, 1280×720, 24fps, 无音频 |
| scene-04.mp4 | `assets/video/scenes/scene-04.mp4` | 10.04s | H.264, 1280×720, 24fps, 无音频 |
| scene-05.mp4 | `assets/video/scenes/scene-05.mp4` | 10.04s | H.264, 1280×720, 24fps, 无音频 |

### 7.3 最终Web视频（1个）
| 文件 | 路径 | 时长 | 编码参数 |
|------|------|------|---------|
| scroll-story.mp4 | `public/media/scroll-story.mp4` | 50.21s | H.264, 1280×720, 24fps, **全I帧(GOP=1)**, seek优化, faststart, 无音频 |

> ⚠️ 全I帧编码意味着文件较大（约52MB），但scroll-seek性能最优。用户计划后续手动替换为高清版本。

### 7.4 边界帧（10张）
路径：`assets/video/scene-frames/`
- `scene-01-start.png`, `scene-01-end.png`
- `scene-02-start.png`, `scene-02-end.png`
- `scene-03-start.png`, `scene-03-end.png`
- `scene-04-start.png`, `scene-04-end.png`
- `scene-05-start.png`, `scene-05-end.png`

提取参数：距离首尾各 0.15 秒

### 7.5 Prompt记录
路径：`assets/prompts/`
- `scene-01-key.txt` ~ `scene-05-key.txt`（图生成prompt）
- `scene-01-video.txt` ~ `scene-05-video.txt`（视频生成prompt）

### 7.6 资产清单JSON
`assets/manifest.json` — 包含所有资产的元数据、状态、task_id

---

## 8. 关键首尾帧关系与连续性

### 8.1 当前拼接策略
**直接拼接（concat）**，未生成独立的 connector 过渡片段。

原因：5个场景视频的色调、风格高度一致（均为明亮天空蓝+现代建筑），直接拼接后的跳切在scroll-scrubbing快速滚动场景下感知不明显。

### 8.2 边界帧对应关系
```
scene-01-end (中景城市建筑群) → scene-02-start (鸟瞰混合城区)
scene-02-end (中鸟瞰城区)     → scene-03-start (室内大堂)
scene-03-end (室内服务空间)   → scene-04-start (智慧建筑左侧)
scene-04-end (智慧建筑右侧)   → scene-05-start (城市日落远景)
```

### 8.3 如果后续需要优化连续性
在 `assets/video/scene-frames/` 中可取相邻场景的 end/start 帧，用 Seedance 2.0 的**首尾帧模式**生成 2-4 秒的 connector 片段，插入到对应位置后重新拼接。

---

## 9. 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 构建工具 | Vite | 7.3.6 |
| 框架 | React | 19.0.0 |
| 语言 | TypeScript | 5.8.0 |
| 样式 | 原生 CSS | — |
| 字体 | PingFang SC, Microsoft YaHei, Arial | 系统字体 |
| 视频处理 | FFmpeg | 6.1.1 |
| Node.js | — | 22.13.1 |
| npm | — | 11.9.0 |

---

## 10. 已完成内容

- [x] Phase 0：环境检查与项目摄入
- [x] Phase 1：产品故事定义（创意简报、需求文档、开发计划）
- [x] Phase 2：视觉系统构建（5张关键视觉图，锚点链风格一致）
- [x] Phase 3：故事板编写（5场景完整故事板，已通过确认门）
- [x] Phase 4：场景视频生成（5个10秒片段，Seedance 2.0）
- [x] Phase 5：连续性审查与视频编码（probe通过，边界帧提取，全I帧web视频）
- [x] Phase 6：网站实现（React scroll-scrubbing，文案、导航、进度轨、移动端fallback）
- [x] Phase 7：验证与打包（build通过，生产dist就绪，zip打包）

---

## 11. 未完成事项

| 事项 | 优先级 | 说明 |
|------|--------|------|
| Connector过渡片段 | 低 | 当前直接拼接，如需更丝滑过渡可补充4个connector |
| 高清视频替换 | 中 | **1080P 升级已启动**：`assets/prompts/1080p/` 已生成 5 份 1080p 专用 prompt（仅改分辨率，画面/风格锚点沿用原版）；`scripts/encode_web_video_1080p.sh` 为 1080P 拼接脚本。**生成与拼接需 ffmpeg 环境，本沙箱无 ffmpeg，须在本机/CI 完成**（详见 Section 12 已知问题） |
| 业务详情页/模态框 | 中 | 用户希望在"八大服务"标签上增加点击展开详情功能 |
| 下载服务手册CTA | 低 | 次要CTA，当前未实现实际下载链接 |
| SEO/Open Graph meta | 低 | 基础meta已设置，OG图片未单独生成 |
| 性能优化 | 低 | 视频52MB可考虑分片加载或自适应码率 |
| 多语言支持 | 低 | 当前仅中文 |

---

## 12. 已知问题

| 问题 | 影响 | 解决方案 |
|------|------|---------|
| 预览zip包在前端无下载按钮 | 用户无法直接下载源码 | 已提供文件路径，可在有文件管理器的环境中打开；或后续通过其他方式分发 |
| `encode_web_video.sh` 默认 GOP=8 | 如果直接运行脚本，不会生成全I帧 | 当前最终视频使用手动ffmpeg命令（GOP=1）拼接，未通过脚本。如需重新编码，请使用 `-g 1 -keyint_min 1` |
| `rsync` 不存在于沙箱 | `package_local_preview.sh` 无法运行 | 使用 `zip` 命令直接打包作为替代 |
| 视频文件较大（52MB） | 首次加载可能较慢 | 已设置 `preload="auto"` 和 `faststart`，高清替换后可显著改善 |
| **本沙箱无 ffmpeg / ffprobe** | `encode_web_video*.sh`、`extract_boundary_frames.sh`、`probe_videos.py` 均无法在当前环境运行 | 视频重新生成（Seedance 2.0）与拼接编码须在**本机或 CI（已装 ffmpeg）** 完成；AI 助手无 Seedance 调用权限，仅能准备 prompt 与脚本 |

---

## 13. 禁止修改项（除非用户明确要求）

1. **不要重新生成已有关键视觉图** — 5张 `scene-0x-key.jpg` 和对应的视频片段已确认风格一致，替换会破坏视觉统一性
2. **不要修改scroll-scrubbing核心逻辑** — `App.tsx` 中的 `update()`、`syncVideo()`、`jump()` 函数是Skill模板的稳定实现，修改可能导致seek死锁或性能问题
3. **不要修改场景数据模型** — `scenes.ts` 中的 `Scene` 类型和字段名与 `App.tsx` 深度绑定
4. **不要修改视频编码参数中的 GOP 策略** — 除非明确放弃 scroll-seek 流畅性
5. **不要改变已锁定的色彩体系** — 5个场景的 `accent` 色和全局CSS变量已协调
6. **不要在生成素材中引入人物面部或中文字体** — 这是已确认的生成约束

---

## 14. 下一步建议（按优先级排序）

### 14.1 高清视频替换（1080P 升级，已启动）
**前置约束**：本沙箱无 ffmpeg、AI 助手无 Seedance 调用权限。以下步骤需在本机/CI 完成。

1. **提交生成任务**：用 `assets/prompts/1080p/scene-0x-video-1080p.txt`（共 5 份）在 Seedance 2.0 提交，参数锁定 1920×1080 / 16:9 / 10s / 无音频 / 首帧参考 `assets/design/scene-0x-key.jpg`。
2. **覆盖源文件**：将生成的 5 个片段按原名放回 `assets/video/scenes/scene-0x.mp4`。
3. **拼接编码**：在本机运行 `bash scripts/encode_web_video_1080p.sh`（输出 `public/media/scroll-story.mp4`，1920×1080、全 I 帧 GOP=1、faststart、无音频）。
4. 校验：本机 `python3 scripts/probe_videos.py --project . --input assets/video --output scripts/probe-1080p.json`，确认 5 个片段均为 1920×1080。
5. 代码**无需修改**（`App.tsx` 用 `object-fit:cover` + `VIDEO_DURATION=50` 分辨率无关）。`npm run build` 重新打包即可。

> ⚠️ 不要使用 `encode_web_video.sh`（默认 GOP=8），1080P 必须用 `encode_web_video_1080p.sh`（GOP=1）。

### 14.2 业务详情模态框（用户已表达需求）
推荐在 Scene 03（深耕·八大服务）的标签上增加点击交互：
- 点击标签（如"租售"）→ 弹出全屏模态覆盖层
- 模态框内展示该业务的图文详情（可从PDF材料提取）
- 背景视频半透明播放，不中断scroll位置
- 关闭后回到原位置
- 纯前端实现，无需额外视频

### 14.3 独立子页面（如果业务详情很深）
对于内容量大的业务（如能源管理、商企服务），可考虑：
- 每个业务一个独立路由（如 `/energy`）
- 子页面有自己的scroll-scrubbing视频（再生成5-8秒片段）
- 或子页面使用静态高质量图片+CSS滚动动画

### 14.4 连接器优化（可选）
如果对直接拼接的跳切不满意：
1. 从 `assets/video/scene-frames/` 取相邻场景的 end/start 帧
2. 用 Seedance 2.0 首尾帧模式生成 2-4 秒 connector
3. 插入到原片段之间重新拼接
4. 更新 `VIDEO_DURATION` 和场景 `start` 时间

### 14.5 新增场景（如需要）
如果要扩展为6+场景：
1. 生成新的关键视觉图（参考 `scene-01-key` 保持风格一致）
2. 生成新的视频片段
3. 更新 `scenes.ts` 数组（保持 id/number/nav/eyebrow/title/body/tags/still/start/accent）
4. 更新 `VIDEO_DURATION`
5. 重新拼接视频
6. `npm run build`

---

## 15. 关键文件速查

| 文件 | 用途 |
|------|------|
| `src/scenes.ts` | 场景数据定义（文案、时间、颜色、海报路径） |
| `src/App.tsx` | 主组件（scroll-scrubbing逻辑、导航、文案切换） |
| `src/styles.css` | 全局样式（色彩变量、布局、响应式、动画） |
| `index.html` | HTML入口（meta、title、viewport） |
| `public/media/scroll-story.mp4` | 最终web视频 |
| `public/stills/scene-0x.jpg` | 场景海报（用于poster和移动端） |
| `assets/manifest.json` | 资产清单 |
| `05-storyboard.md` | 完整故事板文档 |
| `01-creative-brief.md` | 创意简报 |
| `scripts/encode_web_video.sh` | 视频编码脚本 |
| `scripts/probe_videos.py` | 视频属性探测 |
| `scripts/extract_boundary_frames.sh` | 边界帧提取 |

---

## 16. 启动命令

```bash
cd /workspace/output/zhonghai-scroll-site
npm install
npm run dev      # 开发预览 → http://localhost:5173
npm run build    # 生产构建 → dist/
```

---

*本文档确保任何新接手的开发者/设计师在读取后，能够准确理解当前项目状态，并从已有进度继续开发，无需重新生成或重新设计已确认的资产。*
