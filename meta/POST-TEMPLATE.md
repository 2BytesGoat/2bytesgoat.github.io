# Post template

Copy everything below the line into a new file, then fill the brackets.
Name the file in Title Case (`Linear Regression.md`, not `linear-regression.md`).
When done, run the definition-of-done checklist at the bottom of `meta/VOICE.md`.

---

````markdown
---
tags:
  - { one-canonical-tag }
draft: true
date: { YYYY-MM-DD }
---

# TL;DR

<details>
	<summary>Show Summary</summary>
	<p>{≤3 sentences. If the reader stops here, they still learned the core idea.}</p>
</details>

# {Hook — name it after the analogy}

{One physical-world analogy, 2–4 lines.}
{Introduce the ONE running example that will carry the whole post.}
{0–2 jokes, aimed here and at concept transitions only.}

# {Concept 1}

{Story: why should the reader care, in terms of the running example?}
{Diagram/practical element:}
{For practical posts:}
{For conceptual posts:}

```mermaid
flowchart LR
  A[{input}] --> B[{process}] --> C[{output}]
```
````

# {Concept 2 — escalate the SAME example}

{Add exactly one twist: more inputs, a harder case, a failure mode.}
{Rhythm: story → diagram → math → code.}

# Gotcha: {the #1 beginner mistake}

> [!warning] {Short name of the mistake}
> {What goes wrong and why, in terms of the running example.}
> {How to avoid it.}

# Summary

- {3–5 bullets, no new information}
- {Each bullet ≤1 line}
- {}

# Homework

> [!todo] Try it yourself
>
> - [ ] {One concrete 15–30 min task}
> - [ ] {Second task / variant — optional}
> - [ ] **Stretch:** {a harder open-ended one}
>
> Stuck? → {[[escape-hatch post]]}

# Where next

- Backward: [[{previous post in path}]]
- Forward: [[{next post in path}]]
- Deeper: [{external deep-dive}](https://)

````

---

## Filled-in mini example (weather → rain, from Linear Regression)

```markdown
# TL;DR
<details>
	<summary>Show Summary</summary>
	<p>Linear regression fits a line (hyperplane) through data using weights and bias.
	Categorical inputs must be one-hot encoded first.</p>
</details>

# The weather machine
{Humidity → rain chance as the running example.}

# Gotcha: feeding it raw categories
> [!warning] Important
> Don't feed 1/2/3 for cloud types — the model reads that as an ordering. One-hot encode.
````

## Anti-pattern reminders

- Don't switch the running example mid-post (weather must stay weather).
- Don't put jokes inside `$$…$$`, `code`, or mermaid blocks.
- Don't bury the gotcha in the middle — it gets its own late section.
- Don't create a post without a link backward and forward somewhere in it.
- Don't add a concept section that doesn't serve the running example.
