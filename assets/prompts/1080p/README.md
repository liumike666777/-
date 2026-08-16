# 1080P 升级任务 Prompt（用于替换原 720p 视频源）

本目录下的 `scene-0x-video-1080p.txt` 是 1080P 重新生成任务清单，
**仅将分辨率从 720p 改为 1080p**，其余画面描述、镜头运动、风格锚点
（参考各自 `scene-0x-key.jpg`、锚定 `scene-01-key` 的明亮天空蓝风格）
**完全沿用原 `../scene-0x-video.txt`**，以保证拼接后不跳切。

## 提交到 Seedance 2.0 时务必锁定的参数
- 分辨率：1920×1080（16:9）
- 时长：10 秒
- 音频：无（silent）
- 镜头：单镜头连续运动（single-continuous-shot）
- 首帧参考图：对应 `assets/design/scene-0x-key.jpg`
- 风格锚点：scene-01（明亮通透、天空蓝、现代建筑、左 40% 文字安全区）

## 生成后放回路径
`assets/video/scenes/scene-0x.mp4`（覆盖原 720p 文件，文件名保持不变）

## 后续拼接（需 ffmpeg 环境）
见项目根 `scripts/` 及 PROJECT_HANDOFF.md Section 14.1。
拼接目标：`public/media/scroll-story.mp4`
关键编码参数：H.264, 1920×1080, 24fps, 全 I 帧 (GOP=1), faststart, 无音频。
注意：`encode_web_video.sh` 默认 GOP=8，高清拼接请手动用 `-g 1 -keyint_min 1`。
