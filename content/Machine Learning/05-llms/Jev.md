---
tags:
  - llms
draft: true
date: 2026-10-03
---

# TL;DR

<details>
	<summary>Show Summary</summary>
	<p>{≤3 sentences: JEV-style picking = ask the model to choose from YOUR options and return the probability per option, in one forward pass, no generated text. You get structured output AND per-field confidence from any OpenAI-compatible API that returns logprobs. This post is the concept + the recipe; [[TrolleyProblem-Jev]] runs it on a real game judge with measured results.}</p>
</details>

![[my-name-is-jev.jpg]]

# What's a Jev

To the surprise of many, Jev is NOT an acronym. It's just a random name [TypeSafe AI](https://typesafe.ai/blog/introducing-system-one-models-and-jev) gave to their **attention-based, zero-shot, system 1** AI. But that's a mouth-full, so let's break it down.

## It's attention-based

Online speculation is that Jev has a backbone similar to current LLM architectures, based on a mix of self-attention layers, with the goal of predicting the token that fits best the input sequence.

## It's zero-shot

Because it was trained on general knowledge, it managed to distill enough information to make able to have "educated guesses" on a plethora of topics without necessarily needing an example of how to do it.

## It should be used for System 1 tasks

Daniel Kahneman defines two ways of thinking in his book Thinking, Fast and Slow  (here's [the wiki](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow)):
- System 1 - **Reflexes & Instincts
- System 2- **Deliberate Thinking is System 2** 
Jev was developed for cases where you don't think, don't talk, just act - based on the current state (context) and your prior experience.

# How it works under the hood

Since there was no paper published, weights uploaded and the only way to interact with it was via API, people started reverse engineering it, and the conclusion they came up with was:
- you train an LLM the ol' fashion way for next token prediction

# Why the hype isn't just hype

There's a lot of hype cuz the CEO of TypeSafe AI (the company that made Jev) is ex-OpenAI | co-inventor of ChatGPT and wanted his company to be highly valued when going public.

But hate aside, Jev promises a few things that the market was missing:
- **fast inference time** - they claim 70 to 500 milliseconds end-to-end 
- **the model not hallucinating responses** - by predicting a single token instead of a sequence (this way error from the first token doesn't propagate)
- **it has explainability** - in the sense that each answer comes with an attached confidence score
- **parallel processing** - compared to a LLM that produces tokens in sequence, Jev can populate multiple fields in parallel
- **typed outputs** - by focusing only on the value of the outputs, all responses are correct JSONs and correctly typed
- **"free" outputs** - TypeSafe only charges your $0.042 per million input tokens, while **output tokens are completely free**

# Gotcha: the confidence is manufactured

> [!warning] Manufactured confidence
> {Masked-logits renormalization: a confused model + your candidate mask = confident-looking posterior. p ≠ truth. Gate on p AND quality; treat invalid as an error.}

{LLM-type notes folded here (one short paragraph each, no sub-headers):}
{— thinking models poison the window ('The', 'Let') → reasoning_effort: "none" / /no_think;}
{— MoE with CPU experts / hybrid-attention: parallel advantage gone (4B hybrid ≈ 12B dense speed); plain attention = free parallelism;}
{— ~19 options max per field (top_logprobs cap); multi-token options must go through letter proxies;}

# Summary

- {≤5 bullets, no new info}

# Homework

> [!todo] Try it yourself
>
> - [ ] {Run the snippet against any logprobs-serving endpoint; ask a real classification question you have}
> - [ ] {Deliberately break the frame (thinking model / >19 options / multi-token labels) and watch the quality flag}
> - [ ] **Stretch:** {wire the quality flag + margin into a real gate in your stack}
>
> Stuck? → [[Prompt-it!]]

# Where next

- Forward: [[TrolleyProblem-Jev]] — the same trick running as a real game judge, with the full measured ladder
- Deeper: [{Latent Space episode with Diogo Almeida}](https://www.latent.space/p/jev) · [{InsiderLLM's measured local write-up}](https://insiderllm.com/guides/what-is-jev-typesafe-explained-local/)
