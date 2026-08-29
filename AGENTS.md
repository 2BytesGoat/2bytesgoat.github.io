# AGENTS.md — 2bytesgoat.github.io

This repo is Giani's public blog (Quartz 4, deployed to 2bytesgoat.com via GitHub Actions on push to `v4`).
Agents (opencode, Cline, anything that reads this file): follow the rules below before touching anything.

## Repo map

| Path | What it is | Buildable? |
|---|---|---|
| `content/` | The actual site. Course posts, projects, CV series. | ✅ built by Quartz |
| `content/Assets/` | Images/gifs — **never move or delete**, Obsidian embeds (`![[file]]`) resolve against it | ✅ |
| `meta/` | Writing standard docs (for agents + Giani, never published) | ❌ not in `content/` |
| `thoughts/` | Brain dump: `INBOX.md`, interview transcripts. **Public on GitHub** (repo is public!), just not built into the site | ❌ in `ignorePatterns` |
| `archive/` | Old content kept for reference, never built | ❌ |
| `docs/`, `quartz/` | Upstream Quartz docs + engine | don't touch unless asked |

## Build & verify

- `npx quartz build` — must end clean: no broken wikilink/image warnings, correct file count
- `npm run check` — tsc + prettier (pre-existing `ExplorerBurger.tsx` TS errors are NOT yours to fix)
- `npm run format` — prettier sweep; **only stage files you intended to touch** (the sweep
  reformats unrelated files — revert those with `git checkout --`)
- `draft: true` posts are hidden from **all** builds including local `--serve` (RemoveDrafts filter)

## Content conventions

- Filenames: **Title Case** (`Linear Regression.md`, not `linear-regression.md`)
- One canonical wikilink target per concept, Title Case
- Frontmatter: one canonical tag, deliberate `draft` flag, `date: YYYY-MM-DD`
- Before writing any post: read `meta/VOICE.md` (how to write) and `meta/PERSONA.md` (who's writing, for whom)
- When ghostwriting in Giani's voice (posts, bites, replies): also read `meta/FINGERPRINT.md` (sentence-level style spec) — never fake typos, respect the register table
- Posts grow through the pipeline: `thoughts/INBOX.md` → `meta/IDEAS.md` → `draft: true` seed → definition-of-done → ship

## ⚠️ Personal-content routing rule (the important one)

This repo is **public on GitHub**. The `../diary/` vault (separate repo) is where genuinely
private material lives — but agents don't read or touch `../diary` unless explicitly asked
in that session.

**If something is too personal for a public post, do not leave it in this repo at all**
(not even in `thoughts/` — that's public-on-GitHub, only unlisted from the site).
Instead: **write it as a diary entry** — `../diary/thoughts/YYYY-MM-DD.md` — and keep only
the public-safe version here. When in doubt, draft in diary first, then redact outward.

### ✅ Blog-safe personal content

- Career lessons, jank-wins, "I built this" stories
- ADHD solidarity ("you're not alone, it's hard af, but I believe in you")
- Goofiness, memes, community/TAGAP stories
- Anonymized work lessons (no employer names, no politics)
- Founding story: audience-builder, "hard shouldn't be this hard", "be the friend I needed"

### 🔒 Diary-only (never migrates to this repo, not even `thoughts/`)

- Family/trauma/history, bullying, `#thorn`-tagged anything
- Medical (meds, burnout history), finances (mortgage etc.)
- Relationship details, workplace politics/credit wounds
- Mentor names (nenea Ionica / Vali / Paul — recorded verbatim only in blog `thoughts/interview-*.md`, never in `content/`)
- The diary exists entirely in its own repo; it is never a source for public posts unless Giani explicitly approves a sanitized extract

### Voice guardrails (from meta/PERSONA.md)

- GenAI: skeptic with taste — punch at hype culture, never at people exploring tools or artists hurt by it
- Self-deprecation is the signature; never brag straight
- "May not be the best, but it should get you started" — practitioner, not guru
- Sign-off "Peace 🐐"; humor budget 0–2 jokes per course post (3 max personal/build-logs)