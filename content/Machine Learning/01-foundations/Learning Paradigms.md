---
tags:
  - ai-foundations
draft: false
date: 2026-04-16
---

## 1. Supervised Learning

You gather examples of the desired behaviour and design an AI to model a function around it. You are the teacher, and you have the **Answer Key**.

> [!example]
> You know the flashcards we use on babies to learn words. You show the AI a card with a picture of a "Dog" and the word "Dog" written on the back. You do this thousands of times with different dog pictures. Eventually, you show it a picture of a dog it’s never seen before, and it should correctly guesses "Dog."

## 2. Unsupervised Learning

You give your AI and a pile of data and say: "I don't know what's in there, but tell me when you find some patterns". You don't expect an answer - you just want to see how the data clusters together.

> [!example]
> You give the AI the books in your library. Then you tell it to sort them, doesn't matter how. Maybe it will use the colours of the cover, or the length of the titles or size of the book. The goal is that the AI will find patterns you might never have noticed, giving you a totally new way to look at your collection.

## 3. Reinforcement Learning

You have access to a simulator and know exactly when your model does "good" or "bad." The AI plays in the simulator, gathers experience, and does its best to accumulate favour points (rewards).

> [!example]
> Your AI is trapped in the movie [**Groundhog Day**](<https://en.wikipedia.org/wiki/Groundhog_Day_(film)>). It keeps repeating the same day over and over until it gets the correct sequence of events. In the mean time the AI learns the environment so well that it starts speed running certain interactions.

This sits next to questions about data and problem type — see [[Picking the Right AI]] and [[Data Types for AI]] when you’re picking an approach.
