---
tags:
  - llms
draft: true
date: 2026-10-03
---
# TL;DR

<details>
	<summary>Show Summary</summary>
	<p>TypeSafe AI figured: instead of hoping an LLM will generate a parsable JSON, you can just define typed decision questions upfront and let the model output probabilities for them. And to nobody's surprise that makes it cheaper, faster, and structurally impossible to hit JSON parsing errors. Oh, and they called it Jev.</p>
</details>

![[my-name-is-jev.jpg]]

There's a lot of hype cuz the [CEO of TypeSafe AI](https://www.linkedin.com/in/diogomda/?isSelfProfile=false) (the company that made Jev) is ex-OpenAI | co-inventor of ChatGPT, so they tried focusing on a way to do cheap, type-safe explainable AI. 

<span style="font-size: 12px">He also wanted his company to be highly valued when going public, so he put a lot of money into marketing.</span>
# 1. What's a Jev

To the surprise of many, Jev is NOT an acronym. It's just a random name [TypeSafe AI](https://typesafe.ai/blog/introducing-system-one-models-and-jev) gave to their **attention-based, zero-shot, system 1** AI. But that's a mouth-full, so let's break it down.

## 1.1. It's attention-based

Online speculation is that Jev has a backbone similar to current LLM architectures, based on a mix of self-attention layers, with the goal of predicting the token that fits best the input sequence.

## 1.2. It's zero-shot

Because it was trained on general knowledge, it managed to distill enough information to make able to have "educated guesses" on a plethora of topics without necessarily needing an example of how to do it.

## 1.3. It should be used for System 1 tasks

Daniel Kahneman defines two ways of thinking in his book Thinking, Fast and Slow  (here's [the wiki](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow)):
- System 1 - **Reflexes & Instincts
- System 2- **Deliberate Thinking is System 2** 
Jev was developed for cases where you don't think, don't talk, just act - based on the current state (context) and your prior experience.

# 2. How it works under the hood

TODO: add gif of how LLMs generate one word at a time vs Jev that populates fields

Jev is closed-source and only accessible via API, but people started digging and here's the homebrew recipe on how it works:
1. do basic LLM training
2. do a RLCD training step
3. shape your task into a decission-making task
4. ???
5. profit

## 2.1. Before we go into the steps

An important thing to know beforehand is that LLMs generate the next probable token in a sequence (like you playing Activity wiht the model and asking it what word comes after: Lord of the ...). 

When a LLM does a prediction for the next token, all tokens in the vocabulary come with their own probability distribution, given the input sequence. What we want is that instead of asking:
- given the following cooking recipe, generate a json with ingredients and quantities
we would actually ask it something like:
* given the following cooking recipe, choose from this list of ingredients the first one:
	* a. bell peppers
	* b. onions
	* c. uranium
## 2.2. Recap on what's basic LLM training

LLMs are trained in two steps: 
1. next token preditiction - predict the next token in a sequence
2. [RLHF](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback) (Reinforcement Learning with Human Feedback) - answer me like a human would, not like google search's autocomplete

> [!warning] Disclaimer
> I think you can even skip RLHF since we're doing RLCD in the next step.  Though if you're using an off the shelve LLM, those probably went through RLHF.

## 2.3. What's RLCD

With [RLCD](https://en.wikipedia.org/wiki/Jev_(AI_model)#Background) (Reinforcement Learning for Calibrated Decisions) we're still forcing an autocomplete to answer the way we want, but now we want it to: 
- **prioritise the correct output token** (make it good at saying "it's answer C" on a multiple choice quiz) 
- and actually output **higher confidence** for the tokens corresponding **to viable choices** 

## 2.4. How to shape your prompt

Now you'll need to think in JSONs. Instead of letting the AI do the heavy lifting, you'll need to define:
- what are the fields you want populated
- what is the type for each field (bool, category, number)
- what are the options / value interval

So now instead of letting your LLM do free writing for your task, you give it a multiple-choice quiz. 

## 2.5. The speed of Jev

Here are a few ways Jev achieves it's speeds:
* **single token prediction** - one answer, one token - your GPU is the limit
- **batching** - AIs can look at multiple questions in parallel in order to produce answers
- **kv-caching** - if most of the prompt stays the same for all questions (a transcription of a reicpe you want the ingredients for) - you can cache those tokens and re-use them across all json fields

# 3. Why the hype isn't just hype

Jev promises a few things that the market was missing:
- **fast inference time** - they claim [70 to 500 milliseconds end-to-end](https://typesafe.ai/blog/introducing-system-one-models-and-jev) 
- **the model won't hallucinate** - by predicting a single token instead of a sequence (this way error from the first token doesn't propagate)
- **it has explainability** - in the sense that each answer comes with an attached confidence score
- **it cand do parallel processing** - compared to a LLM that produces tokens in sequence, Jev can populate multiple fields in parallel
- **has typed outputs** - by focusing only on the value of the outputs, all responses are correct JSONs and correctly typed
- **has "free" output tokens** - TypeSafe only charges your $0.042 per million input tokens, while **output tokens are completely free**

So far the promises hold up, with a bunch of tech YouTubers stapling Jev on all kind of wacky projects just to limit test it ([YouTube link](https://www.youtube.com/watch?v=X4Lqj54sw4I)). But it ain't no Swiss army knife, and it has it's flaws.

# 4. The good, the bad and Jev

Here's what the fine-print was saying when they released it:
- the confidence value is made up
- can't use thinking models or MOE (Mixture of Experts) models
- similar fields may not be consistent

## 4.1. Why is the confidence clickbait

Since we're doing pretty much next token prediction and doing Softmax over the top token logits, this may result in the model seeming way too confident. 

While I could not find a direct statement of how they do post-training calibration, there are snippets where people say that TypeSafe wants that if the model says 90% confidence, it should actually mean that the model is right in 90% of those cases ([source](https://aisuccesslabjuliangoldie.com/blog/jev-ai-model/#:~:text=Every%20output%20from%20the%20Jev%20model%20carries,the%20middle%2C%20route%20to%20a%20bigger%20model%3B)).

## 4.2. Why use raw LLMs as backbone

Let's start with **thinking models**. The thinking tokens are generative and each generated token will hinder the upsides of Jev:
- it will take longer to produce outputs
- and each newly generated thinking token wil alter the prediction for Jev - since thinking tokens will serve as "context" for the decision. Screw up one thinking process and you may end up with a completly different answer for the same question

Then there's **MOE models**. Since MOE is made so you don't have to load the entire LLM in memory to produce an answer, if you don't mindfully group the fields you want to populate, you'll end up losing the whole benefit of doing batch predictions or MOE all together. Because maybe one field requires one part of the model, while another field may require another part, making your LLM framework keep loading and unloading parts of the LLM for each field.

## 4.3. Lack of consistency 

Each field if filled-in independent of eachother. There is no shared context, meaning that if you have outputs that depend on eachother, the LLM may make stuff up.

Here's a dumb example, say you want to populate this JSON:
```json
{
	"fruit": {
		"type": "category",
		"options": ["strawberry", "pineapple", "pappaya"]
	},
	"number_of_ps": {
		"type": "number",
		"options": [0, 1, 2, 3, 4, 5]
	}
}
```

And you tell it to 

"Select a random fruit from this list: strawberry, pineapple, pappaya and count the number of occurances of the letter 'p' in the selected word"

The fields are dependent, and since populating the fields is done in parallel (so kinda like the LLM has split personalities), it will pretty much guess the number instead of actually counting it.
# Summary

- Jev is a cool new way TypeSafe AI created (or popularised?) for using LLMs as predictors
- Jev models only populate JSONs instead of building them piece-by-piece
- Jev models are type safe and produce cofidence scores for their predictions
- they're not perfect by any mean and won't replace current LLMs
- they're made to supliment the current LLM landscape and be used as quick decision makers 

# Where next

- If you wanna see some actual numbers on homebrew Jev approaches, checkout [[TrolleyProblem-Jev]]

# References
- What is Jev? - IBM Technology - [YouTube](https://www.youtube.com/watch?v=YGgNBcIgI4s) 