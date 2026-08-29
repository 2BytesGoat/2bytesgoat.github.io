# Restructure proposals & backlog

> Proposals only — nothing in `content/` or `archive/` has been changed yet.
> Successor to `../archive/Rewrite Blueprint.md` (the 2026 ML-rewrite plan); its ideas live on here or in `VOICE.md`.

## Proposed changes (awaiting go-ahead)

- Create `meta/` (this folder — done, it's the only thing that exists so far)
- Guides.md: fix broken link `[[Understanding Loss Functions]]` → `[[Loss Functions]]`; add missing `[[Random Forest]]` link (Session 3)
- Guides.md: trim Sessions 5+ placeholders — move topics to `meta/IDEAS.md` (posts don't exist yet)
- Rename `Picking the right AI.md` → `Picking the Right AI.md` (Title Case, matches inbound wikilinks)
- Delete empty `content/.gif.md` (it builds a junk page)
- Rewrite `content/index.md` around three doors (ML crash course / CV series / Projects)
- archive/: group by era (`2024-ml/`, `2024-llms/`); mark Rewrite Blueprint superseded by this folder
- Demo retrofit of the standard on ONE post (suggested: Loss Functions) once the standard is approved

## Backlog (not done — pull from here when bored)

### From the persona work (2026-08-29)

- [ ] **Switch-as-arcade-brain post** — already has a Reddit write-up; port to the blog:
      https://www.reddit.com/r/godot/comments/1vsnjp0/this_is_the_most_overengineered_way_to_port_your/
- [ ] Arcade v2 build-log (hardware in the room right now — photo-dump it when finished)
- [ ] Rebuild the About page (`content/Goat Gang/Giani Statie.md`) from `PERSONA.md` — add the
      mission ("hard shouldn't be this hard" + "be the friend I needed"), ADHD solidarity line,
      deep-end pattern; keep mentor names out
- [ ] Book-notes lane: AI for Games / Hitchhiker's Guide to ML / Deep Learning / gamedev TBD —
      each read-through becomes a `Read:` dump then maybe a post
- [ ] Interview-sourced post ideas (see `thoughts/INBOX.md`): genAI middle-stance essay,
      "the deep end" career story (anonymized), sentdex-revival aspirations
- [ ] `[!todo]` Bites → posts: "How do I start ML in 2026", "is ChatGPT sentient", "do I need math"

### Original content cleanup (proposals — nothing in `content/` touched yet)

- [ ] Retrofit remaining ML posts to the standard:
  - [ ] Overfitting and Underfitting — needs TL;DR (top), Summary audit
  - [ ] Train vs Test vs Validation — needs TL;DR, Homework
  - [ ] Decision Tree — great code; needs TL;DR, Homework, trim mid-post deep dives into `# Going deeper`
  - [ ] Random Forest — needs TL;DR, Homework
  - [ ] Linear Regression — needs its first code block (currently zero code despite being practical)
  - [ ] AI vs ML vs DL — top table already does TL;DR work; add Homework
  - [ ] Learning Paradigms, Data Types for AI — check against anatomy
- [ ] Prev/next footer sweep across `Machine Learning/**` posts (Where next everywhere)
- [ ] Tags: consolidate to one canonical scheme (see IDEAS.md)
- [ ] `Computer Tricks/`: unify naming ("MacOS - Open Folder in VSCode.md" vs "Generic - Multiple Git Accounts on Same PC.md") — pick `Platform - Task` or plain Title Case
- [ ] `Projects/` pages: check frontmatter dates exist (they rely on filesystem fallback now)
- [ ] `content/Assets/`: heavy (gifs/PNGs at repo root of Assets). Consider compressing largest gifs — DO NOT move/delete paths, embeds resolve against them
- [ ] Consider adding `Going deeper` sections for the StatQuest links currently scattered inline (Decision Tree)
