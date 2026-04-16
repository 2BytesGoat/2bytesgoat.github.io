# Machine Learning Rewrite Blueprint

This document is your practical guide for rebuilding the `Machine Learning` section without losing your previous work.

The goal is not to throw away content. The goal is to **archive old drafts**, define a clean structure, and republish stronger versions with consistent naming and clearer learning flow.

## 1) Rewrite goals (what "good" looks like)

- One obvious entry point for beginners.
- One consistent glossary (same names used everywhere).
- A clear path from fundamentals to practical LLM/product topics.
- Fewer dead links and fewer "missing concept" jumps.
- Existing good content reused, not rewritten from zero.

## 2) Archive-first strategy (do this before writing)

Create a frozen archive area and move old pages there first:

- `Machine Learning/_archive/2026-rewrite/`
- Keep original filenames so old references are easier to track.
- Add a one-line note at the top of archived files:
  - `> Archived during 2026 ML rewrite. May contain outdated naming/structure.`

This gives you psychological freedom to rewrite cleanly while keeping everything recoverable.

## 3) New proposed structure

Use this exact shape for the new `Machine Learning` section:

```text
Machine Learning/
├── Start Here.md
├── Learning Path.md
├── 01 Foundations/
│   ├── AI vs ML vs DL.md
│   ├── Picking the Right AI.md
│   ├── Data Types for AI.md
│   └── Learning Paradigms.md
├── 02 Core Concepts/
│   ├── Models vs Algorithms.md
│   ├── Loss Functions.md
│   ├── Optimisation Basics.md
│   └── Evaluation and Overfitting.md
├── 03 Practical ML/
│   ├── End-to-End ML Workflow.md
│   ├── Feature Engineering Basics.md
│   └── Training Checklist.md
├── 04 Language Models/
│   ├── Language Models Overview.md
│   ├── Generative Language Models.md
│   ├── Prompting Fundamentals.md
│   ├── Reliability (Hallucinations, Guardrails).md
│   └── Knowledge Graphs and RAG.md
├── 05 Projects/
│   ├── DragonJump Track.md
│   └── Prompt-it! Track.md
└── _archive/
    └── 2026-rewrite/
```

## 4) Naming rules (to stop drift)

Pick one canonical term per concept and stick to it:

- Use `Language Models (LMs)` as umbrella.
- Use `Large Language Models (LLMs)` for large-scale models.
- Use `Generative Language Models` only when specifically discussing generative behavior.
- Avoid using `GLMs` unless you define it once per page and keep it local.
- Use `Machine Learning Models` and `Machine Learning Algorithms` intentionally:
  - Algorithm = learning procedure.
  - Model = trained artifact.

Linking rules:

- Every important term links to one canonical page title.
- No "concept links" to missing pages.
- Use title case for canonical page names.

## 5) Content migration map (old -> new)

Suggested reuse map:

- `Intro/AI vs ML vs DL.md` -> `01 Foundations/AI vs ML vs DL.md` (revise, keep core).
- `Intro/Types of AI.md` -> split into:
  - `01 Foundations/Picking the Right AI.md`
  - `01 Foundations/Data Types for AI.md`
  - `01 Foundations/Learning Paradigms.md`
- `ML Molecules/Machine Learning Models.md` -> `02 Core Concepts/Models vs Algorithms.md`.
- `Examples/Understanding Loss Functions.md` -> `02 Core Concepts/Loss Functions.md`.
- `LLMs/Large Language Models.md` -> `04 Language Models/Language Models Overview.md`.
- `LLMs/Generative Language Models/Generative Language Models.md` -> `04 Language Models/Generative Language Models.md`.
- `LLMs/Generative Language Models/Prompting.md` -> `04 Language Models/Prompting Fundamentals.md` (expand from stub).
- `LLMs/Knowledge Graphs.md` -> `04 Language Models/Knowledge Graphs and RAG.md`.
- `Guides.md` -> `Learning Path.md`.

## 6) Standard page template (use for every new page)

```md
# Page Title

## Why this matters
(2-4 lines)

## Core idea
(plain-language explanation)

## Practical example
(real-world scenario, game/project tie-in if relevant)

## Common mistakes
- ...
- ...

## Quick checklist
- ...
- ...

## Next steps
- [[Next Canonical Page]]
```

If every page follows this structure, the section feels coherent even with your casual tone.

## 7) Rewrite in phases (recommended order)

### Phase A - Skeleton (1 session)
- Create all new folders/pages with empty scaffolds.
- Add `Start Here.md` and `Learning Path.md`.
- Add `_archive/2026-rewrite/`.

### Phase B - Foundations first (2-3 sessions)
- Rewrite `01 Foundations` pages first.
- Ensure terminology is stable before touching advanced pages.

### Phase C - Core concepts (2 sessions)
- Rewrite `Models vs Algorithms`, `Loss Functions`, and `Evaluation`.
- Keep examples concise and consistent in style.

### Phase D - Language models (2-3 sessions)
- Build `Language Models Overview` first.
- Then `Generative Language Models`.
- Then finish `Prompting Fundamentals` and reliability page.

### Phase E - Projects integration (1-2 sessions)
- Add project tracks showing "what to build after each section."
- Keep this practical, with links and small milestones.

## 8) Definition of done (quality gate)

A page is done only if:

- It uses canonical naming.
- It has no broken internal links.
- It follows the standard template.
- It links to at least one previous and one next page in the learning path.
- It has at least one practical example.

## 9) First 7 concrete actions

1. Create `_archive/2026-rewrite/`.
2. Move current ML pages into archive (keep folder history as reference).
3. Create new top-level pages: `Start Here.md`, `Learning Path.md`.
4. Create the `01` to `05` folders and scaffold files.
5. Rewrite `AI vs ML vs DL` into the new foundations style.
6. Split `Types of AI` into the three foundations pages.
7. Rewrite `Loss Functions` page using your strongest existing example flow.

---

If you feel stuck during rewrite, return to this rule:
**publish smallest useful page, then iterate**.  
Do not wait for perfect pages before rebuilding navigation.
