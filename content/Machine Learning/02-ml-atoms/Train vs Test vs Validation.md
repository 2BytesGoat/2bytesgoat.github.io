---
tags:
  - ml-atoms
draft: false
date: 2026-04-17
---
# Train vs Test vs Validation

You just spent a few hours, days, months collecting your data. So you feed your data into your AI algorithm, look at the numbers and see 100% accuracy. You just made the best AI the world has ever seen - the next [Skynet](https://en.wikipedia.org/wiki/Skynet_(Terminator)).

So naturally you put it out in the open to wreak havoc and make you millions, only to see that it was an impostor. It was the nerd from [[Overfitting and Underfitting]] that made a fool out of you.

You learn from your mistakes, and decide that next time you'll chop your data into chunks so the model **isn't graded on the same sheet it studied from**.

## Training set

This is the **homework** - the examples the algorithm actually learns from (`fit`, gradients, all that). Bigger is usually better, as long as it's not garbage.

## Validation set

This is the **practice exam** you use **while you're still building**.

You peek at it to pick hyperparameters (learning rate, `max_depth` on a [[Decision Tree]], how long to train, which architecture wins). You also use it to notice [[Overfitting and Underfitting]] early - train great, validation meh is a classic smell.

**Rule of thumb:** anything you change *because* you looked at validation counts as "using" it. If you loop on that feedback forever, you can still **overfit the validation set** in spirit - it stops being a fresh perspective.

## Test set

This is the **final exam** you lock in a drawer.

You touch it **rarely** - ideally once at the end, or only when you're done tweaking and want an honest number. It should mimic data the model never saw during any decision you made while building.

If you keep "fixing" the model until the test score looks good, the test set is just another training crutch. Then nobody knows how it'll behave in the wild.

## TL;DR

- **Train** → learn  
- **Validation** → tune and sanity-check while you work  
- **Split a test set and leave it alone** → one clean score when you're ready to be honest  

> [!info] Tip
> Use tiny split ratios - like 70% train / 15% val / 15% test, or 80/10/10
>
> Depends how much data you have and how noisy your metric is. With almost no data, you lean on cross-validation instead of pretending a tiny test slice is sacred.

If you only remember one thing: **training is for learning, validation is for choosing, test is for reporting** - don't let those roles blur.
