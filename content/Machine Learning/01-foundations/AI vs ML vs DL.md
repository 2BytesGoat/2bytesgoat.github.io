---
tags:
  - intro-to-ai
draft: false
date: 2026-03-15
---
# Summary

|**Term**|**Input Required**|**Human Effort**| **Data Needed** |
|---|---|---|---|
|**AI (Heuristic)**|Logic/Rules|Very High (Manual)| None            |
|**ML (Classic)**|Features (Distance, Speed)|Medium| Moderate        |
|**DL (Neural)**|Raw Data (Pixels/Coords)|Low (Architecture)| Very High       

**A**rtificial **I**ntelligence (**AI**) is an umbrella term, which refers to the ability of a program to simulate intelligence.  Depending on the application, AI logic can vary from simple if-else statements to more complex algorithms like [utility functions](https://en.wikipedia.org/wiki/Utility_system) or [[neural networks]].

**M**achine **L**earning (**ML**) is a subset of AI, which refers to algorithms that are able to "learn" from data and build functions that simulate intelligence. The more "good" examples you give to ML algorithms, the better they should behave.

**D**eep **L**earning (**DL**) is a subset of ML, that focuses more on multi-layer neural networks. This type of ML is able to build very complex functions and require larger amounts of data.
![image ><](AI_machine_learning_deep_learning.png)
source: [The Blog of Daniel J Hand](https://danieljhand.com/the-relationship-between-artificial-intelligence-ai-machine-learning-ml-and-deep-learning-dl.html)
# About AI
People have been using the term AI since the '40s ([Nim](https://en.wikipedia.org/wiki/Nim) - the first game AI), with maybe the most known old-school game AI being [Pong](https://en.wikipedia.org/wiki/Pong), which came out in the '70s. 

However, AI algorithms are used in many other ways:
- **automating workflows** - [MPCs](https://en.wikipedia.org/wiki/Model_predictive_control) in the automation industry or industrial [PID controllers](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) 
- **discovering patterns** - [recommender systems](https://en.wikipedia.org/wiki/Recommender_system) that find you new products you may like
- **security** - old school facial recognition using [Haar Cascades](https://en.wikipedia.org/wiki/Haar-like_feature)

> [!info] Tip 
> You **don't need** to learn or remember these examples
> 
> I just wanted to show you that there are more AI algorithms out there and to flex my useless knowledge.

In the past, primarily due to hardware constraints, developers needed to use simpler AI algorithms and had to **manually extract and build features** from their data. In Pong, for example, if you wanted the paddle to follow the ball, you’d have to mathematically compute the ball's trajectory yourself and program the AI to move toward the ball's destination. You provided the "intelligence" via math - the computer just executed the instructions.

# About ML
As time passed, humans developed better hardware, which enabled us to build algorithms that **gobble more compute power** and resources, but reduced the overall time we spend tweaking the systems.

Now, instead of us manually hardcoding every rule, we:
1. collect data
2. select the examples that we like and 
3. shove it in an algorithm 
**The algorithm** will then design the optimal function for us.

For instance, in the game Pong, instead of us needing to know what's the formula for acceleration and how to compute the trajectory of the ball, we just:
1. play the game and record information (the paddle positions, ball positions and key inputs) 
2. keep the recordings where we actually intercept the ball and
3. build a [[Decision Tree]] to "learn" from these examples
Given enough examples, the ML algorithm will build a function that "knows": _When the paddle is here and the ball is there, I should press down._

# About DL
Now this is where things become spicy and where we delve into the **black box magic**. 

Machine Learning offers us algorithms that are fairly straight forward to interpret. You have a **Decision Tree**, you know it's branches are if-else statements and you can follow the information flow and even adjust it's parameters manually. 

But these algorithms cannot capture complex relationships and non-linear relationships out of the box. In other words: you cannot do autonomous driving or build Google Translate simply through decision trees. I mean you could, but maybe not in a lifetime. 

**Deep Learning is ML on steroids**. In standard ML, you needed to act as a translator - explaining how the world works in a language the computer would understand (features). You define a neural network, shove in your data and let it train.

And there you go. Your very own blackbox math function that models your data.

The main advantage is that you don't have to manually create **features** to describe your data. The disadvantage: you'll need more data, that needs to be both diverse and clean. Meaning that if you want your AI to generalise, you'll need to expose it to various examples of what it means to "do good", while also not including examples that "contradict each other".