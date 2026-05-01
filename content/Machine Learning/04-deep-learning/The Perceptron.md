---
tags:
  - deep-learning
draft: false
date: 2026-05-01
---
Perceptrons are the equivalent of a 1x1 lego block when it comes to Deep Learning. It's the equivalent of a single neuron that can then be used to make a neural network

```mermaid
flowchart LR
  x1(("humidity"))
  x2(("wind"))
  x3(("cloud_type"))
  x1 --> perc(("perceptron"))
  x2 --> perc
  x3 --> perc
  perc --> out(("rain_chance"))
```

# One continuous input
Let's actually look inside a perceptron to understand how it works 

$$
y = W \cdot x + B
$$

If you remember from other blogposts we called x our input and y our output. In this blogpost, we'll use case of a weather prediction AI, where x is humidity (0..1) and y is chance of rain (0..1)

> [!warning] Important
> You'll want to **rescale your inputs** between **0 and 1** before you train
>
> If you skip this step and feed in very large or wildly different numbers - learning gets fussy. The perceptron will spend effort fighting the **size** of the numbers instead of learning the **relationship** between them.

We call the other two arguments are W which we call weights and B which we call bias

The weights tell you how much humidity contributes to it raining, while bias is the baseline chance of it raining in general

These two parameters are not "known", rather they are what we call tunable parameters. These parameters get changed during the "training" phase of our AI. The perceptron will be exposed to a series of examples, and its role is to change W and B such that we have an overlap that's as close as possible to our training data

Now, in our initial example we discussed only one input: **humidity**. But what happens when we have more than one input? 

# Multiple continuous inputs
Say we want to also consider **wind**. Then, instead of one x, we'll need to have x1 - humidity and x2 - wind. Thus, our function will become

$$
y = W_1 \cdot x_1 + W_2 \cdot x_2 + B
$$

Where $W_1$, $W_2$ are the weights that show how much each input variable contributes, and are both tunable parameters

# When inputs are categorical
A thing to keep in mind when building a perceptron is the type of your inputs. For example say you want to give as input the **type of clouds** you see on the sky:
1. **No cloud** — clear sky
2. **Nimbus**   — dark gray clouds
3. **Cumulus**  — white clouds

That's a categorical value, and you shouldn't use 1, 2, 3 as raw numeric inputs. Doing so will make the perceptron think that cloud 2 is less important than cloud 3, because it has a higher value.

Instead, you should apply one-hot encoding on your categorical values:
1. no cloud -> \[1, 0, 0]
2. nimbus   -> \[0, 1, 0]
3. cumulus -> \[0, 0, 1]

This way you tell the perceptron that they are 3 independent values that need to be considered separately. 

More concretely, a perceptron that takes in the two continuous values (humidity and wind) and our 3 categorical values (type of clouds) would look something like this

$$
y = (W_1 \cdot x_1 + W_2 \cdot x_2) + (W_3 \cdot x_3 + W_4 \cdot x_4 + W_5 \cdot x_5) + B
$$

# Summary 
- perceptrons are the building blocks for deep neural networks
- perceptrons have tunable parameters that we call **weights** and **bias**
- perceptrons need all input variables to be numbers - meaning categorical inputs need to be one-hot encoded

If you're curious about how a perceptron changes its tunable parameters, see the blogpost on [[Loss Functions]].
