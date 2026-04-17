---
tags:
  - ai-foundations
draft: false
date: 2026-04-16
---
# What AI is right for you?

There are multiple ways to design AI systems. But usually, if someone asks you to make them an AI, your mind should go through a series of questions, that when asked will narrow down the possible algorithms you may use:
- **[[#Problem Complexity]]**
	- Can I use simple logic? Do I even need to train an AI for this?
- **[[Data Types for AI]]** 
	- How will my AI see the world? Is it through sensors, cameras, text?
- **[[Learning Paradigms]]**
	- Do we have a behaviour we want to imitate? Or do we just want to look for patters?

The last question should be about available **resources** - cuz you won't be able to run a custom Large Language Model on a Raspberry Pi.

# Problem Complexity

> [!tip] Hot Take 
> I'm going to call AI any piece of code that behaves intelligently, even if it's simple. For example, if there's an "if" statement with a number you got through trial and error, I'll consider that a basic form of AI.
## 1.  Hand-Coded Logic (Static)
These are:
- **If-else statements** - if this, then that kind of scenarios
- **Linear functions** - simple `output = input * w + b`
- **Utility functions** - the rules-based logic that was used to make the Sims's AI
You are the brain, and the computer follows your lead. It's great for simple tasks but brittle when complexity grows or things keep changing.
## 2. Search & Optimisation (Heuristics)
These are:
- A-Star - a pathfinding algorithm 
- Genetic algorithms - a family cool semi-random search algorithms
These are good for when you want your computer to **explore** a map of possibilities.
## 3. Pattern-Finders (ML and Deep Learning)
These are:
- [[Decision Tree|Decision Trees]] - if-else statements that you don't design by hand
- Support Vector Machines
- Neural Networks
These are good when you have access to data and you want the algorithm to build the logic around it.
