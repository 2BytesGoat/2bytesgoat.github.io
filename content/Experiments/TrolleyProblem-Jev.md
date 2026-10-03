---
tags:
  - llms
draft: true
date: 2026-10-03
---

# TL;DR

<details>
	<summary>Show Summary</summary>
	<p>{≤3 sentences: I ran JEV-style picking as the judge of a trolley party game across {N} model/serving setups on one fixed litmus fixture. Same weights, different serving mode = same accuracy, different failure rows. Picking won on local small models (writing mode died at ~10 min/persona) and lost a few points to writing on strong cloud models — full ladder inside.}</p>
</details>

# The Trolley Problem game

{Hook: 1 paragraph — party game where two teams stuff a runaway trolley fork with innocents/villains/modifiers and an AI Conductor picks which track gets hit. The Conductor = the running example from [[Jev]], now with real scores.}

> [!info] About the repo
> {Repo disclaimer, Giani's words: it's a dumping ground for my investigation — decision logs, probe logs, half-finished phases. Not made as learning material; this post is the cleaned-up extract. The full paper trail is the decision log #28–44.}

{The judge contract in 2–4 lines: score each card {polarity, weight} per unit; engine owns the arithmetic (ledger pattern); personas shift appraisal only. Position bias structurally impossible.}

{The fixture in 2 lines: 15 hand-authored litmus rows × 4 personas + 74 direction checks + invariants; gate ≥ 60%.}

# The serving ladder

{What "same weights, different serving mode" means (2 lines) + the main results table:}

| Weights                      | writing (tool-call)    | picking (jev)  | Δ                  | note                                     |
| ---------------------------- | ---------------------- | -------------- | ------------------ | ---------------------------------------- |
| gemma4:31b (cloud)           | {87%}                  | {80%}          | {−7pp}             | {posterior stays spread; sampling noise} |
| gpt-5.4-mini (gateway)       | {80% batched}          | {67%}          | {−13pp}            | {batching is a quality lever}            |
| Bonsai 2 27B ternary (local) | {80%}                  | {80%}          | {tie}              | {chat 4.2× faster per unit}              |
| qwen3.8:27b FP16 (local)     | {~10 min/persona, cut} | {87% in 118 s} | {writing unusable} |                                          |

{Latency paradox in one line: quality tracks model size, latency inverts (118 s → 71 s → 10 s).}

# Judgment needs scale

{Size ladder table (zero-shot jev exact): 1B/1.5B/1.7B/8B/27B rows — accuracy + one failure-mode phrase per row (polarity inversions, flat confidence, "0.8 on everything").}

{The takeaway in 2 sentences: no zero-shot shortcut below ~8B; fine-tuning + calibration is a different regime (the repo distills its own student — phase C2, future post).}

# What actually broke

{Error-profile section:}
{— non-overlapping misses per serving mode on identical weights (war_criminal mercy-hedge vs twins vs soggy_cereal) — serving mode changes WHICH rows fail, rarely the rate;}
{— unbatching the board: soft_hearted murderer rows −0.78/−0.90 alone vs +0.52/+0.47 batched — board context improves judgment;}
{— shared under-punishment signature: villains compress toward −0.05 in both modes on some weight families;}
{— infra war stories (1–2 max): silent 200-with-empty-logprobs on ollama-cloud (17/17 models); cache thrash 4.5× slowdown; 7.6 s → 0.20 s per request after the quick-wins fix;}

> [!info] Reading the table right
> {MAE 0.75 on the jev arms is a weight-granularity artifact (19 lettered levels), not misjudgment — polarity/litmus hits are unaffected. And sampled-draw cloud numbers vs exact-window local numbers are different quantities; don't cross-compare raw.}

# Confidence in practice

{Reliability buckets per arm (jev_cloud ≥0.8 → 82%; azure_jev flat 80% both buckets; local FP16 <0.5 bucket 93% with raw-mass artifact).}

{Raw mass vs margin as confidence currencies (3–4 sentences).}

{Gate math in 2 sentences: the external 0.8-gate story (caught 21/26 errors, bounced 8/21 correct = 62% escalated) — thresholds come from calibration curves on YOUR data, never vibes. Where the honest answer sits: informative, not calibrated.}

# The code

{2–3 sentences pointing at:}
{— repo: https://github.com/2BytesGoat/trolley-problem (dumping-ground disclaimer applies);}
{— the portable recipe: docs/CLOUD-JEV.md (~100-line reference client — source of [[Jev]]'s code block);}
{— the harness + fixture: python/persona_eval.py, python/data/persona_expectations.json;}
{— the judge client + backends: python/judge.py; raw run logs: python/data/compare/*.log}

# Summary

- {≤5 bullets, no new info}

# Where next

- Backward: [[Jev]] — the concept + the portable recipe
- Deeper: [{InsiderLLM's local write-up}](https://insiderllm.com/guides/what-is-jev-typesafe-explained-local/)
