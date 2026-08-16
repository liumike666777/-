# Product promo site requirements

## Goals and success criteria

- 建立中海物业增值服务的专业品牌形象，突出央企背景与"第一管家"口碑
- 清晰展示全业态（住宅/商业/城服/公建）、全周期、全场景服务能力
- 吸引B端/G端/A端潜在客户与战略合作伙伴
- 实现scroll-scrubbing沉浸式浏览体验，桌面端滚动即播放连续视频
- 移动端保持可读性和信息完整性，不依赖视频播放

## Information architecture

- **固定导航栏**：品牌名 + 5场景快捷导航 + CTA按钮
- **右侧进度轨**：场景编号 + 进度条 + 场景锚点
- **左侧文案区**：场景编号/眉标/标题/正文/标签/CTA（仅最终场景）
- **5个核心场景**：对应品牌故事的五幕叙事
- **移动端**：垂直堆叠的静态场景卡片，每卡一张场景图+文案

## Scene journey

5幕叙事结构：

1. **启幕·万家灯火** — 品牌开篇，展示中海物业的城市版图与服务初心
2. **全景·全态覆盖** — 展示四大业态（住宅/商业/城服/公建）的服务空间
3. **深耕·八大服务** — 展示八大增值服务赛道的具体场景与价值
4. **智慧·数字赋能** — 展示数字化智慧社区与平台能力
5. **共赢·携手未来** — 展示合作共赢模式与最终CTA

## Desktop scroll behavior

- 总滚动高度：850vh
- 视频总时长：约50秒
- 滚动位置线性映射到视频当前时间
- 向上滚动时视频反向播放
- 场景切换时文案平滑过渡（opacity + translateY）
- 导航和进度轨实时同步当前场景
- 点击导航/进度轨按钮平滑滚动到对应场景

## Mobile behavior

- 隐藏scroll-scrubbing视频区域
- 显示静态多场景布局（mobileStory）
- 每场景一张高质量场景图 + 文案
- 保留CTA按钮
- 导航栏简化为品牌+CTA

## Model provenance

- 关键视觉图：image2.0（直接调用）
- 场景视频：Seedance 2.0（直接调用，图生视频模式）
- 连接片段：Seedance 2.0（首尾帧模式）
- 所有生成资产保存至项目目录，附prompt记录

## Media and performance budget

- 5个场景关键视觉图（16:9，约1920×1080）
- 5个场景视频片段（16:9，720p，无声，每个约8-12秒）
- 4个连接片段（首尾帧过渡，每个约2-4秒）
- 1个最终web视频（H.264编码，scroll-seek-friendly）
- 5张场景静帧海报（用于poster和mobile fallback）
- 总视频预算约50-60秒

## Accessibility

- `prefers-reduced-motion: reduce` 时自动切换为静态布局
- 视频加载失败时保持poster图可见
- 所有交互元素有明确的焦点状态
- 语义化HTML结构，ARIA标签

## SEO and social preview

- 页面标题：中海物业增值服务 — 全业态·全周期·全场景
- Meta description：中海物业增值服务，40余年央企物业经验，覆盖住宅、商业、城服、公建全业态，提供资产运营、租售、美居、运维、能源等八大增值服务，诚邀合作共赢。
- Open Graph / Twitter Card 支持

## Local handoff

- 完整源码文件夹
- 本地预览压缩包
- 启动说明文档（npm install + npm run dev）
- 资产清单manifest.json
