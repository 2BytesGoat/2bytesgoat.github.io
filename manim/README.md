# manim — course animations

> Scenes live here (never built by Quartz). Rendered GIFs go straight into
> `content/Assets/LLMs/` and get embedded in posts via Obsidian syntax: `![[Scene-Name.gif]]`.
> Scene design comes from Giani's captured explanations (`meta/captures/`) — the animation
> shows *his* mental model of the concept, not 3b1b's.

## Setup (already done)

- venv: `manim/.venv` with Manim Community v0.21.0 (gitignored)
- ffmpeg: required by manim, installed via Homebrew
- `manim/media/` is render cache, gitignored

## Render recipe

```sh
# one scene → GIF into content/Assets/LLMs/
./render.sh scenes/NextTokenPrediction.py

# higher quality preview before committing to a render
manim/.venv/bin/manim -pqh scenes/NextTokenPrediction.py NextTokenPrediction
```

## Conventions

- Scene file name = scene class name = GIF name, Title Case: `Tokenization.py` → `Tokenization.gif`
- GIF settings: 15fps, ~960px wide, clips stay short (loops welcome) — GIFs get heavy fast
- Quality flag in `render.sh` is `-qm`; bump to `-qh` only if a scene really needs it
- `content/Assets/` files are **never moved or deleted** (Obsidian embeds resolve against it)