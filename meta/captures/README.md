# captures — raw discussion transcripts (Giani + agent)

> Never built by Quartz (`meta/` is outside `content/`). This is where capture-driven
> posts are born: Giani talks, agent records. **The agent is an editor, not an author.**

## The deal

Giani's goal: an LLM course + conversation backbone, built from *his* way of explaining —
not from an agent's. So every post starts as a transcript of us talking.

## The show (how sessions run)

Sessions are podcast episodes (opencode commands: `/discuss` to start, `/capture` to dump):

- **Giani** — host, explains stuff his way
- **Billy** — the noob, played by the agent. A young goat who knows only what's in
  `content/` (the ML course posts are his whole world). Asks "but why tho?" constantly.
- **Goat** — the expert, also played by the agent. Silent by default; cuts in only when
  Giani spreads misinformation or is genuinely unclear, as a brief marked aside
  (`**Goat (aside):**`), then hands the mic back to Billy as if nothing happened.

Transcripts label every turn with the speaker, so it's always traceable who held the mic.

## Rules (the contract)

1. **Verbatim capture.** Giani's words stay his — analogies, jokes, ramble chains, everything.
   Quote, never paraphrase.
2. **Agent questions are Socratic only.** Billy asks "but why tho?", "what would you tell
   someone who just calls the API at work?" — never insert the agent's own explanations into
   the capture. Goat corrects; he doesn't teach.
3. **Gaps get marked, not filled.** Anything unclear or missing becomes `TODO: ask Giani`
   and lives in the transcript until the next session resolves it.
4. **Assembly = typos + arrangement only.** Per `../FINGERPRINT.md` conversion table:
   typos die, style survives. No sentence that isn't Giani's makes it into a post.
   Every edit visible in a diff; nothing ships without Giani's review.
5. **Giani's own rephrasings are gold.** They feed the FINGERPRINT calibration (Learnings).

## File format

Name: `YYYY-MM-DD-topic-slug.md` (e.g. `2026-09-18-what-are-llms.md`)

```markdown
# Capture: {topic} (YYYY-MM-DD)

> Status: raw | assembled → `content/.../{Post Name}.md`

## Transcript

**Billy:** {verbatim}
**Giani:** {verbatim}
**Goat (aside):** {correction, marked, at the exact point it happened}

## TODO: ask Giani

- {gap 1}
- {gap 2}

## Manim notes

- {how Giani wants the concept animated — his mental model, not 3b1b's}
```

## Pipeline

transcript here → assembled draft in `content/` (`draft: true`) → Giani reviews diff →
DoD checklist (`../VOICE.md`) → `draft: false`.