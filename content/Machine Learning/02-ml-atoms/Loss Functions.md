---
tags:
  - ai-practice
draft: false
date: 2024-09-03
---
# TL;DR

<details>
	<summary>Show Summary</summary>
	<p>Loss functions (same idea as error functions) measure how far off the AI's guesses are from what you wanted. Two usual picks when the answer you're predicting is a number are <strong>MSE</strong> (mean squared error) and <strong>MAE</strong> (mean absolute error). Training then tweaks weights and bias so that score goes down.</p>
</details>

# Your Quest

Quests are here to provide some purpose for having to read through the theory. Read the quest and figure out how the information below can help you complete it.

> [!warning] The Quest for the Wakewine
>Read the post to figure out what Error Functions are. You'll use error functions to find your way to the nearest _café_.
> 
> - Understand Mean Squared Error
> - Understand Mean Absolute Error 
> 
> <big>**Description**</big>
> 
> **The Day of Conquest has arrived!** The long-awaited moment to master the arcane arts of machine learning is upon you. Yet, one important matter must be addressed.
>
>With unwavering determination, you rush towards the kitchen. However, the sight that greets you is beyond belief. “Unacceptable!” you shout. “One does not simply acquire knowledge without caffeine!”
>
>You take a deep breath to steady yourself. "Luckily, there are two coffee shops nearby", you say to yourself. But now, you must decide: **Which one will you choose?**
> 
> <big>**Rewards**</big>
> 
> You will receive: 
> 
> - 📜 **The Scroll of Loss Functions**

# What are Loss Functions

Let’s simplify things by imagining this scenario: Your friend Roger wants to take you to a coffee shop you’ve never been to before. However, Roger doesn’t give you the exact distance, just clues like "hot" if you're getting closer and "cold" if you're moving further away.

You start walking and, step by step, ask Roger how close you are. Eventually, when Roger says "boiling hot," you know you’ve reached the café.

In machine learning, a similar process happens. The AI is trying to learn, and **A** represents the AI's current behaviour (how it predicts something), while **B** is the behaviour you want it to have (the correct answer from your data). A **loss function** is one number that says how wrong you are—small is good, and training tries to push it down.

Same picture as in [[The Perceptron]]: the model spits out a guess (often written \(\hat{y}\)), the data says the real answer \(y\), and you compare them. In the café story, **Xo** is your guess and **X** is the truth. Squaring or using `abs` is just so "how far off" is never negative.

# How to Calculate Squared Distance

In the coffee shop example, let’s say you’re standing at point **Xo** (your current position), and you want to know how far you are from point **X** (the coffee shop). You wouldn’t say the distance is **-2 meters**, right? Even if you’re facing the wrong way, distance is always positive.

To make sure the distance is always positive, we square the difference between your position (**Xo**) and the coffee shop (**X**).
## Formula

$$ 
distance = (X_O - X)^2
$$
This formula simply means: take the difference between where you are and where you want to be, and square it to get rid of any negative values.
## Visualisation

```mermaid
xychart-beta
x-axis "Your Location" [cafe_1, home, neighbour_house, cafe_2]
y-axis "Squared Distance" 0.1 --> 5
bar [1, 0, 1, 4]
line [1, 0, 1, 4]
```
## Python Code

Here, the code calculates how far you are from the coffee shop, even if you’re going in the wrong direction.

```python
Xo = 0 # your starting position
X  = 2 # the place you want to get to

distance_squared = (Xo - X) ** 2
```

## Mean Squared Error (MSE)

You rarely have one guess—you have a pile of examples. For each one, square the gap between guess and answer, then take the **average**. That's **mean squared error (MSE)**:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (\hat{y}_i - y_i)^2
$$

Because of the square, **big** misses hurt the score more than small ones. Handy for learning; annoying if one broken datapoint screams louder than everything else.

# Absolute Distance

Previously, when discussing squared distance, we said that we need to square the difference such that the resulting number is always positive. However, a side effect is that now we're claiming we are **4 meters** away from our destination, when in fact we're just **2 meters** away. 

A simpler way to calculate the actual distance without making it larger is by using **absolute distance**. This just means taking the difference between two points and ignoring the negative sign.

## Formula

$$ 
distance = |X_O - X|
$$
This formula means we take the absolute value of the difference between your current position (**Xo**) and your destination (**X**), which gives us the actual distance.
## Visualisation

```mermaid
xychart-beta
x-axis "Your Location" [cafe_1, home, neighbour_house, cafe_2]
y-axis "Absolute Distance" 0.1 --> 5
bar [1, 0, 1, 2]
line [1, 0, 1, 2]
```
## Python Code

```python
Xo = 0 # your starting position
X  = 2 # the place you want to get to

distance_absolute = abs(Xo - X)
```

Here, the code calculates the real distance without exaggerating it.

## Mean Absolute Error (MAE)

Same idea, but with `abs` instead of squaring, then average. **Mean absolute error (MAE)**:

$$
\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |\hat{y}_i - y_i|
$$

No squaring means one wild outlier doesn't blow up the whole number the way MSE can. Downside: the model isn't as "ouch" about huge mistakes, so fixing them can feel slower.

# When to Use the Mean

Now imagine you ask Roger for feedback on every step you take. Each time, he says whether you're "hotter" or "colder." You could adjust your direction based on every individual piece of feedback, but this might make you [zigzag all over the place](https://www.tiktok.com/@igreenscreenthings/video/7398558205430877482?is_from_webapp=1).

Instead, you could take several steps, gather all the feedback, and **average** (or take the **mean**) of what Roger told you. This helps you get a clearer idea of the general direction to take.

In machine learning, **MSE** and **MAE** are that averaging trick on a chunk of data—one score for "how wrong are we right now," instead of zigzagging after every single row. Same spirit as [[The Perceptron]]: nudge **W** and **B** so guesses line up with the training answers overall.

How do those nudges get picked? Same world as [[Train vs Test vs Validation]] when it mentions gradients—you're basically sliding weights downhill on the loss. You don't need the full math class here; just know the loss is the score you're trying to shrink.

For how this fits the bigger picture (supervision, data, when to use classic ML vs deep learning), skim [[Learning Paradigms]] and [[AI vs ML vs DL]].