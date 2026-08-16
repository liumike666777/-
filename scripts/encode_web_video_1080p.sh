#!/bin/sh
# ─────────────────────────────────────────────────────────────
# 1080P 升级拼接脚本
# 将 5 个 1080p 场景片段拼接为最终 web 视频 (scroll-scrubbing 用)
#
# 前置：需要 ffmpeg（本沙箱未安装，请在本机或 CI 有 ffmpeg 的环境运行）
# 输入：assets/video/scenes/scene-01.mp4 ... scene-05.mp4 (1080p)
# 输出：public/media/scroll-story.mp4
#
# ⚠️ 关键：scroll-scrubbing 要求全 I 帧 (GOP=1)，否则 seek 卡顿。
#    不要使用 encode_web_video.sh 默认的 GOP=8。
# ─────────────────────────────────────────────────────────────
set -eu

project="$(cd "$(dirname "$0")/.." && pwd)"
scenes_dir="$project/assets/video/scenes"
out="$project/public/media/scroll-story.mp4"

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found" >&2; exit 1; }

# 校验 5 个片段存在
for i in 01 02 03 04 05; do
  [ -f "$scenes_dir/scene-$i.mp4" ] || { echo "missing $scenes_dir/scene-$i.mp4" >&2; exit 1; }
done

mkdir -p "$(dirname "$out")"

# 1) 生成 concat 清单
list="$project/scripts/.concat_1080p.txt"
: > "$list"
for i in 01 02 03 04 05; do
  printf "file '%s/scene-%s.mp4'\n" "$scenes_dir" "$i" >> "$list"
done

# 2) concat 无重编码（片段参数一致时安全）
tmp="$project/scripts/.scroll-story-1080p-concat.mp4"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$list" -c copy "$tmp"

# 3) 重编码为全 I 帧 web 视频（1920x1080, 24fps, faststart, 无音频）
ffmpeg -loglevel error -y -i "$tmp" -an \
  -vf "scale=1920:1080,fps=24" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 -movflags +faststart "$out"

rm -f "$tmp" "$list"
echo "Wrote $out (1920x1080, all-I-frames, faststart)"
