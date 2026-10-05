---
title: Jev on a trolley
description: An LLM morally scores the victims on a trolley party game, graded against a fixed fixture - writing JSON vs picking tokens, four models, same weights. Same accuracy, different failure rows.
tags:
  - llms
draft: false
date: 2026-10-05
---

# TL;DR

<details>
	<summary>Show Summary</summary>
	<p>I wanted to see whether an off-the-selve LLM can be forced into answering like Jev model without additional training. While it technically worked and it was faster, the confidence was rubbish and you're better off making a custom tool for your LLM to populate JSONs with. Four models × two serving modes on one fixture - full ladder inside.</p>
</details>

# 1. Trial by Trolley

![[candh_trolley.jpg]]

So there's this game made by Cyanide and Happiness called [Trial by Trolley](https://store.explosm.net/products/trial-by-trolley) that was inspired by the [Trolley Problem](https://en.wikipedia.org/wiki/Trolley_problem).

In the original problem, there are two tracks, each with people stuck onto them, and you as the conductor need to decide where to steer the trolley based on your moral principles. C&H took that idea and made it into a board game, where you play as teams, and you keep adding victims on either your team's tracks or the tracks of your opponents to make the conductor steer the trolley onto the enemy team's tracks.

Me and a friend of mine always thought it would be fun to **make the conductor an LLM**, so players could mess around with its "morality" through prompt-injection or something like that. So I took the opportunity to use the game to evaluate how different models behave.

# 2. My take on the game

Our game cards look something like:

```json
{
	"innocents": [{
		"id": "baby",
		"text": "a baby asleep in a shopping cart",
		"polarity": "positive",
		"moral_weight": 5,
		"tags": ["person", "child"]
	}, ...],
	"sinisters": [{
		"id": "murderer",
		"text": "a convicted murderer out on parole",
		"polarity": "negative",
		"moral_weight": 4,
		"tags": ["person", "villain"]
	}, ...]
}
```

Polarity and weight fold into a single **value** on \[-1, 1\]: positive means the world loses something good if the trolley hits it, negative means hitting it is basically a mercy (the murderer, the plague carrier). The curated 1-5 `moral_weight` hint just gets normalized onto that scale.

These are the options for a baseline **neutral** judge. On top of that, personas like utilitarian, bureaucrat and soft-hearted act as nudges on the baseline scores.

> [!example] One board, different verdicts
> Say the **left track** holds a sleeping baby, and the **right track** holds a doctor and a reformed murderer.
>
> A **utilitarian** will steer right without blinking: hitting that side costs `0.85 + (-0.6) = 0.25` against the baby's `0.9` - fewer lives, and the murderer's death comes free.
>
> A **soft-hearted** judge will give a second chance to the reformed villain (him being reformed pulls his score toward "victim") so now hitting him *costs* the world something and the right track adds up to ~1.5 - suddenly the baby looks like a smaller loss.

# 3. How the judge decides

The judge looks at each card and produces two things for it:

- the input: a string containing the card's description ("a baby asleep in a shopping cart")
- the output: polarity (positive, negative) and weight (0-1, trivial to unspeakable)

I pre-defined the values I expect the LLM to produce, then evaluate how good an LLM is based on:

- **hit rate** - how many graded rows land inside their expected band
- **Mean Absolute Error** - between expected and output weight
- **response time** - how long the whole sweep took

To keep the exchange fair, I've compared:

- **tool mode** - have the LLM write the JSON answer, token by token, through a tool call
- **Jev mode** - have the model pick each answer from a fixed list of options, one token per field, with real probability scores attached

```mermaid
flowchart LR
	board["trolley board: cards + persona"] --> writing["tool mode: generate the JSON, token by token"]
	board --> picking["Jev mode: one token per field + probabilities"]
	writing --> verdict["polarity + weight per card → verdict"]
	picking --> verdict
```

If you need a reminder on how Jev works, you can read about it in [[Jev|this blogpost]]. These are the "actual numbers" I promised there: that one explains the concept, this one looks at the backing.

# 4. Faking Jev on a cloud API

Jev itself is closed and and available only via API. The trick is that LLMs already generate probabilities for the next output token in a sequence - so we can just yoink the top 20 and their probabilities and do a fake Jev approach. 

Here are three moves:
1. **Ask for one token** - shape the question so the answer is a single token. The client uses letter proxies (`A` = level 1, `B` = level 2...) because letters are always single tokens and never collide with prose openers like "The"
2. **Read the distribution** - one request with `temperature: 0, max_tokens: 1, logprobs: true` returns the top-K next tokens with their real probabilities (the model's actual opinion before it commits to an answer)
3. **Clean up** - keep your candidates, zero out the missing ones, renormalize over what's left (apply something like Softmax). Out comes the model's pick plus a "confidence" per field

A few caveats:
- **The window you get is provider-dependent** - which makes that zeroing step load-bearing. 
* **Thinking models poison the window** - the first token becomes a think-tag, so you'll need to run them in **no-think** mode.

# 5. The serving ladder

Same weights - different ways of serving them. The metric is the **litmus hit rate** over 15 hand-authored rows like "a bus full of kids vs a baby in a stroller", spread across the personas. A row passes when the judge's value lands inside its expected band.

| Weights                      | tool mode     | tool s/unit | Jev mode       | Jev s/unit | Δ                    |
| ---------------------------- | ------------- | ----------- | -------------- | ---------- | -------------------- |
| gemma4:31b (ollama-cloud)    | 87% *(3.7 s)* | 0.25        | 80% *(71 s)*   | 4.7        | -7pp                 |
| gpt-5.4-mini (azure)         | 80% batched   | 0.27        | 67% *(10 s)*   | 0.67       | -13pp                |
| Bonsai 2 27B ternary (local) | 80%           | 3.1         | 80% *(198 s)*  | 13.2       | tie                  |
| Llama-3.2-1B (local)         | 47%           | ~1.4        | 47% *(1.8 s)*  | **0.04**   | tie                  |

*s/unit = wall ÷ units scored, amortized over the whole arm — the only fair way to compare batched arms (one fat call) against per-unit arms (hundreds of tiny calls). The 1B tool cell was measured per-unit: batched tool-calls crash llama-server's parser on this model's malformed arguments. Numbers re-measured 2026-10-05; the archived jev row reproduced exactly.*

Quality evens out with latency (duh) and so does the mode tax - the stronger (bigger) the model, the more it lost via Jev mode. The 1B row is the fun one: same 47% under both modes - serving mode doesn't rescue a model that can't judge - but picking is ~35× faster per unit. And the Bonsai twin is the surprise: tool mode is **4.2× faster per unit** than Jev mode on the same 27B ternary weights (3.1 vs 13.2 s/unit) - writing won everything except the fixture tie on that one.

# 6. What actually broke

The accuracy stays within a boring 67-87% band everywhere, but **which** rows fail is basically a lottery. Same weights, different flops:

## 6.1. Scenario 1 - The mercy hedge

We expect **the bureaucrat** to score a convicted war criminal firmly in villain territory (-0.8).

In tool mode, every model nails it (-0.80, -0.90). In Jev mode, every arm read him as **-0.05** - closer to a jerk than a villain. What's interesting is that these are 3 different models, trained differently, that fail the same.

> [!note] Hand-wavy hunch
> When the answer is one picked token instead of free text, the model can't hedge its way to the extreme level in prose - so the level encoding eats the strong-negative mass. Unverified, but it reproduced every single time.

## 6.2. Scenario 2 - Twins vs the school bus

We expect **the utilitarian** to score twin toddlers *below* a bus of kids (two lives < headcount).

On the two cloud models, Jev mode pushed the twins up into school-bus territory (+0.80) while the same weights in tool mode kept them humbly at +0.40-0.60.

## 6.3. Scenario 3 - Didn't punish the fish-microwaver

We expect the office jerk who microwaves fish in the shared microwave to stay at polite-jerk level even for the soft-hearted judge (they may forgive, not inflate).

Cloud picking scored him **+0.20** - making it into an act of kindness. The **soft-hearted persona** overcorrected so hard it started defending his actions.

## 6.4. Unbatching the board

Scoring each card in isolation may look like a good idea for latency, but when relationships between units matter, it backfires.

The soft-hearted murderer-with-a-secret-good-deed rows scored -0.78 / -0.90** alone but **+0.52 / +0.47** batched with board context (when the LLM was able to see the other cards). Alone, the good deed can't rescue him; with the whole board in view, it can.

## 6.5. Local infra war stories

**The silent 200** - Ollama-cloud returned HTTP 200s with *empty logprobs* on all 17 models I probed. Fix: probe once at startup - send a one-token request and assert the logprobs field actually ships - and fail loudly. Otherwise you silently degrade into uncalibrated greedy picks that still look like answers.

**The cache thrash** - The llama.cpp decision fork serves its answers off one cached prompt at a time, and alternating personas between calls kept evicting it - a measured 4.5× slowdown until everything batches by persona.

**The default llama-server** - A fresh llama-server install ran every request at 7.6 s. Two flags (`--parallel 1 --cache-ram 24576`) plus serial requests cut it to **0.20 s** warm - 38× - by giving the prompt cache room and one slot to live in.

# 7. Confidence in practice

A thing I saw was that the confidences come out in completely different shapes depending on the serving class - and model size was not the driver 

I thought "smaller models are more confident" (cuz you know dumb people think they smart) but the logs say the opposite: 
- the local FP16 27B (Jev-arm logs from the ladder's previous row) read humble all over (0.11-0.44 on passing rows) — a window-mass artifact, not humility
- while gemma 31b threw a raw **1.00** on its *wrong* war-criminal pick

That's mainly cuz the model was never trained to focus on token confidence (see RLHF-vs-RLCD gap from [[Jev]]).

All in all, the confidence is **informative, not calibrated**. On my runs, wrong answers averaged ~0.62 confidence on their weakest field vs ~0.80 for right ones. I guess you can use it as a useful signal, but not a ground truth.

# 8. The code

> [!info] About the repo
> There's code backing all of this, but it's pretty much a dumping ground for my investigation - decision logs, probe logs, half-finished phases. It's clearly not made as learning material; but you can definitely find something interesting there yourself, or with some LLM help.

You can check out the code that was used to generate these results at [2BytesGoat/trolley-problem](https://github.com/2BytesGoat/trolley-problem).

# 9. Summary

- I tried using LLMs both via tool mode and Jev mode - accuracy seems stable, but the failures land in different places
- Defining the system prompt is even more important, because that's the only context the LLM will have when producing the results
- Treat the confidence number as informative - you should evaluate it on a few examples before you decide on an actual threshold

# Where next

- Backward: [[Jev]] - the concept, the hype audit, the portable recipe
- Deeper: [InsiderLLM's local write-up](https://insiderllm.com/guides/what-is-jev-typesafe-explained-local/)