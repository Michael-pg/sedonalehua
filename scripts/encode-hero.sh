#!/usr/bin/env bash
# Encode the hero .mov into silent, web-sized H.264 MP4s + poster frames.
#
#   FFMPEG=/path/to/ffmpeg scripts/encode-hero.sh brief/assets/IMG_8479.mov brief/web
#
# Desktop: 16:9 center crop, 1280x720. Mobile: 9:16, 720x1280.
# The water footage is high-detail, so a bitrate cap keeps it ~3–4 MB instead of
# 15–20 MB. A light blur hides compression blocks from low-res sources; the site
# adds film grain on top. Use the original camera file (4K/1080p) when possible.
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
IN="$1"
OUT="${2:-brief/web}"
mkdir -p "$OUT"

X264=(-c:v libx264 -preset slower -profile:v high -pix_fmt yuv420p -movflags +faststart -an)

"$FFMPEG" -y -v error -i "$IN" \
  -vf "crop=iw:iw*9/16,scale=1280:720:flags=lanczos,gblur=sigma=0.9,fps=30" \
  "${X264[@]}" -crf 28 -maxrate 1400k -bufsize 2800k "$OUT/hero-desktop.mp4"

"$FFMPEG" -y -v error -i "$IN" \
  -vf "scale=720:1280:flags=lanczos,gblur=sigma=0.6,fps=30" \
  "${X264[@]}" -crf 28 -maxrate 1200k -bufsize 2400k "$OUT/hero-mobile.mp4"

for v in desktop mobile; do
  "$FFMPEG" -y -v error -ss 1 -i "$OUT/hero-$v.mp4" -frames:v 1 -q:v 3 "$OUT/hero-$v-poster.jpg"
done

ls -lh "$OUT"/hero-*
