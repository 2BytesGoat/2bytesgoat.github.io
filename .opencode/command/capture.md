---
description: Capture the Billy & Goat podcast session into a raw interview transcript in meta/captures/. Use when Giani says "capture" after a discussion session. Captures the conversation verbatim — it does not assemble, edit, or editorialize.
---

# Capture — dump the episode

Dump the discussion from this session into a raw transcript. This command **only captures** —
it never assembles posts, never rephrases, never adds content that wasn't said.

## Target file

`meta/captures/YYYY-MM-DD-<topic-slug>.md` (today's date, lowercase-hyphenated topic).
If a file for today + this topic already exists, append a `## Episode 2 (take N)` section
instead of overwriting — takes stack.

## Transcript format

Reconstruct the full episode in order, as an interview/podcast transcript, with speaker
labels from the session:

```markdown
# Capture: {topic} ({YYYY-MM-DD})

> Status: raw
> Episode of the Billy & Goat podcast. Verbatim transcript — assembled posts come later.
> See README.md in this folder for the contract.

## Transcript

**Billy:** {verbatim question, typos-as-spoken preserved in spirit}

**Giani:** {verbatim explanation — analogies, jokes, ramble chains all kept}

**Billy:** ...

**Giani:** ...

**Goat (aside):** {correction, if any — kept, marked}

{...rest of the episode...}

## TODO: ask Giani

- {gap 1 — anything unclear, contradicted, or left hanging}
- {gap 2}

## Manim notes

- {how Giani wants the concept animated — his mental model, from things like
  "imagine it as X" or "you'd draw it like Y". Only if animation ideas surfaced;
  omit the section entirely if none did.}
```

## Capture rules

1. **Verbatim means verbatim.** Giani's words stay his — analogies, jokes, tangents,
   self-corrections, everything. Quote, never paraphrase, never "clean up".
2. **Keep Goat asides in place**, marked, at the exact point they happened.
3. **TODO: ask Giani** collects real gaps: contradictions between two answers, terms
   used but never explained, threads dropped mid-thought. Never resolve them yourself.
4. **Manim notes** collect animation ideas *in Giani's words* — if he described how a
   concept looks in his head, that's the scene spec. Don't design scenes yourself.
5. **Out-of-character** chat (podcast logistics, "wait let me restart that thought") gets
   excluded, EXCEPT "restart" moments — a redone explanation replaces the old one in the
   transcript, and the replaced take can go under a small `## Cut takes` section if it
   contains good material.
6. If part of the episode is missing from context (very long session, compaction happened),
   capture what exists and mark missing spans as `TODO: ask Giani (transcript gap)`.
   Never fill gaps from your own knowledge.
7. After writing the file, confirm to Giani: file path, rough turn count, how many TODOs.
   Do not offer to assemble the post — the expert pass is a separate step Giani asks for.

## No topic known?

If the topic never got named in the session, ask Giani for the episode title before
writing the file. Slug comes from that.

$ARGUMENTS