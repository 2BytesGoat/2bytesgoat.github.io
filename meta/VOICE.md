# The Goat Standard — how 2BytesGoat posts are written

> This folder (`meta/`) is **never built** by Quartz; it's not part of the site.
> It exists so future-us writes posts that feel like one continuous course, not a pile of notes.
> Companion files: `PERSONA.md` (who's writing + for whom), `POST-TEMPLATE.md` (copy-paste
> skeleton), `IDEAS.md` (pipeline), `BITES.md` (reusable answers), `RESTRUCTURE.md` (cleanup log).
> Raw voice reference: `../thoughts/interview-2026-08-29.md` (private — never quote directly).

## The deal

Readers come here for two reasons: they're **studying** and want the full path, or they want the
**fast answer** without ads or fluff. Every post serves both, which is why every post has a
30-second exit ramp (TL;DR) _and_ a walkable path forward (Where next).

Structure makes heavy information predictable. Predictable structure is the feature —
the reader always knows where the next concept, the joke, and the exit are.

## Page anatomy (fixed order, every course post)

```md
# TL;DR ← <details><summary> block, ≤3 sentences. The 30-second version.

# {Hook} ← one physical-world analogy + the ONE running example. 0–2 jokes.

# {Concept 1..n} ← 2–4 H1 sections. Rhythm per concept:

# story → diagram → math → code / project tie-in

# {Gotcha} ← [!warning] callout: the #1 mistake readers will make

# Summary ← 3–5 bullets, no new information

# Homework ← [!todo] callout with checkboxes (see below)

# Going deeper ← OPTIONAL, only if needed. External links, side-quests, math rabbit holes.

# Where next ← [[prev]] · [[next]] + one external deep-dive link
```

## Hard rules

1. **TL;DR and Summary both exist, always.** TL;DR is for speed, Summary is for consolidation.
2. **One analogy, one running example, one gotcha per post.** The analogy is the motif: pick a
   physical thing (lego brick, walking to a café, checking weather) and ride it through every
   concept in the post instead of introducing new metaphors.
3. **Practical posts require runnable code.** If the topic is an algorithm/tool ("Decision Tree"),
   include a small scikit-learn/Python block that actually runs. If the topic is conceptual
   ("Train vs Test"), include a _grounding artifact_ instead: a diagram, a DragonJump tie-in, or
   pseudo-code. A practical post with no code and no artifact is unfinished.
4. **Escalate the same example.** Don't switch domains mid-post. One input → n inputs →
   categorical inputs; simple → spicy. (See Linear Regression: weather stays weather in every
   section.)
5. **Jokes live outside math, code, and diagrams.** Humor budget: 0–2 per post, aimed at
   setup/punchlines around concepts — never inside a formula block, a code block, or a chart.
6. **Quests evolved into Homework.** No narrative quest needed. A `[!todo]` callout with 2–3
   checkboxes: one concrete 15–30 min task, optional _Stretch_, one escape-hatch backlink.
   The analogy _is_ the quest.
7. **Deep dives go last.** Optional material lives in `# Going deeper` at the bottom, never
   interrupting the main flow mid-post.
8. **Path integrity.** Every course post links backward and forward (`Where next` prev/next).
   A reader must never dead-end.
9. **Canonical naming.** One term per concept, used everywhere. Algorithm = learning procedure,
   model = trained artifact. Wiki-links point at one canonical page title. Title Case page names.
10. **Word budget.** 800–1200 words for core content. `Going deeper` doesn't count.

## Voice

Canonical voice is **goofy-first**: 2024 energy (memes, kaomoji, goat herd) riding on 2026
structure (TL;DR → anatomy → Homework). The structure is the discipline; the goofiness is the
brand. See `PERSONA.md` for the person and audiences behind this.

- Second person ("you"), contractions, part of the joke without trying too hard.
- "But why tho?" is a legitimate section-opening move. Curiosity-first ordering: show _why you
  care_ before _how it works_.
- Callouts are pressure valves: `[!warning]` for the one real gotcha, `[!info]` for asides and
  self-aware flexes, `[!todo]` for homework.
- **Self-deprecation is the signature move.** Praise lands, then gets undercut immediately
  (trophy → "it was jank", demo → "and I was left jobless"). Never brag straight; brag through a meme caption.
- Formal-comedic disclaimers and hot-take labels (`Disclaimer:`, `Hot Take:`, "Stupid question /
  Stupid answer") are on-brand — the scientist costume over the joke.
- Voice texture from the raw reference (interview file): rambling chains with `-` and `...`
  that snap into a short punch; "freaking"/caps for emphasis; "cuz"/"tho"; "yep yep";
  kaomoji sparingly (ᕕ( ᐛ )ᕗ tier, max 1 per post); sign-off "Peace 🐐" on story-style posts.
- Meme literacy is assumed (Skynet, "one does not simply", honest work farm). The meme must _name
  a real thing in the example_, never decorate a formula.
- Humor budget: 0–2 per course post; build-log/personal posts can be looser (3 max) —
  quests/scrolls stay retired: the analogy _is_ the quest, rewards are implicit.
- GenAI jokes: punch at the hype culture ("AI in their freaking coffee", hive-mind CEOs),
  never at people exploring tools or at artists hurt by it. Skeptic with taste, not a cynic.
- Honesty contract ("may not be the best, but it should get you started"): first person,
  real trade-offs, admit jank. Preached lessons are banned — end stories and let the reader do the math.

## Counts per post (targets, not law)

| Thing                  | Target                                                    |
| ---------------------- | --------------------------------------------------------- |
| Core words             | 800–1200                                                  |
| Diagrams (mermaid/img) | ≥1                                                        |
| Code blocks            | 1+ if practical, 0 if conceptual (then artifact required) |
| Wiki-backlinks         | 2–4                                                       |
| Jokes                  | 0–2, never in math/code                                   |
| Callouts               | 1–3                                                       |
| External links         | 1–2 (StatQuest / Wikipedia / docs tier)                   |

## Per-post definition of done (gate before flipping `draft: false`)

- [ ] Frontmatter: one canonical tag, `draft` set deliberately, `date: YYYY-MM-DD`
- [ ] TL;DR details/summary block present at top
- [ ] One analogy + one running example carried through
- [ ] Runnable code (practical) or grounding artifact (conceptual)
- [ ] `[!warning]` gotcha present if the topic has a classic beginner mistake
- [ ] Summary bullets, no new info in them
- [ ] Homework `[!todo]` with checkboxes + escape-hatch link
- [ ] Where next: backward link + forward link
- [ ] All `[[wikilinks]]` resolve (no broken pages)
- [ ] `npx quartz build` clean, no broken image/link warnings

## Ideas pipeline (low stakes by design)

0. **Dump** — one line into `../thoughts/INBOX.md` while living your life
   (`Idea: / Read: / Built: / Asked: / Cool:`). Done. Zero formatting. `Asked:` entries are
   pre-validated post material — people asked you for real.
1. **Compost** — periodically (weekly-ish), review the inbox: tag `[post]` / `[note]`, promote
   `[post]` ones into `IDEAS.md` here. If it keeps getting asked IRL, it goes to `BITES.md` too.
2. **Seed** — when an idea earns a file, create it in `content/` with `draft: true`
   and whatever garbage belongs in it. Invisible to readers; safe to abandon.
3. **Grow** — make it pass the anatomy above at whatever pace studying allows.
4. **Ship** — run the definition-of-done checklist, flip `draft: false`. It's alive.

Rule of thumb: `publish smallest useful page, then iterate.`

## Audiences (from PERSONA.md — pick one per post/bite)

| Tag              | Who                                             | Posts that serve them                       |
| ---------------- | ----------------------------------------------- | ------------------------------------------- |
| `students`       | meetup kids, curious, drowning in vibecode slop | the ML course, on-ramps, anti-slop guidance |
| `api-colleagues` | devs who call LLM APIs at work                  | the why under the API, costs, failure modes |
| `execs`          | non-tech, high-level                            | jargon-free, stakes and limits              |

Course content (`Machine Learning/**`) defaults to `students`. Everything else: pick deliberately.
