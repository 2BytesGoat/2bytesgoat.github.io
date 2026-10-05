#!/usr/bin/env bash
# Render a manim scene to a GIF in content/Assets/LLMs/
# Usage: ./render.sh scenes/NextTokenPrediction.py
set -euo pipefail

cd "$(dirname "$0")"

if [ $# -ne 1 ]; then
  echo "Usage: ./render.sh scenes/<SceneName>.py" >&2
  exit 1
fi

scene_file="$1"
scene_name="$(basename "$scene_file" .py)"

# -qm quality flag; 960x540 @ 15fps keeps GIFs light (output lands in 540p15/)
.venv/bin/manim -qm --fps 15 -r 960,540 "$scene_file" "$scene_name"

mp4="media/videos/${scene_name}/540p15/${scene_name}.mp4"
if [ ! -f "$mp4" ]; then
  echo "Render output not found: $mp4" >&2
  exit 1
fi

mkdir -p ../content/Assets/LLMs
ffmpeg -y -i "$mp4" -vf "fps=15,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4" \
  "../content/Assets/LLMs/${scene_name}.gif" -loglevel error

echo "Done: content/Assets/LLMs/${scene_name}.gif"