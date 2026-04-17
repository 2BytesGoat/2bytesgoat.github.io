---
tags:
  - classical-ml
draft: false
date: 2026-04-17
---
# What are Decision Trees

It's basically an algorithm that generates nested `if-else` statements based on the data you give it. So instead of you hand-writing rules, the algorithm learns them from examples.

> *How hard can Machine Learning be ... you're basically making just some if-else statements* 

They're also the thing your friends will use to make fun of you when you tell them you're doing Machine Learning. 
## Why you should care

Well... if you want to make an AI using `if-else` statements (say for [DragonJump](https://github.com/2BytesGoat/PLaiGROUND/blob/main/scripts/01_if_else_agent.py)), getting the desired behavior means tweaking conditions manually. And that takes time and effort. 

Instead, you could capture a few examples of the behavior you want and feed them to a Decision Tree. Its goal is to do the mapping for you.
# How they work

Imagine you want to build an AI that helps you decide whether you should take an umbrella. 

The action (sometimes called prediction **target** or simply **y**) is: 
- take 
- don't take

And your features (things that help you take the decision) can be:
- humidity 
- chance of rain
- wind

You'll then keep a journal of weather conditions and whether you took or left your umbrella.

Then the Decision Tree will:
1. build multiple conditions for each feature
2. evaluate how well each condition splits your data
3. choose the condition that produces the best separation
4. repeat steps 1-3 until you're happy with the results

When you run the model, you just walk the if/else chain from the top until you hit a leaf. Whatever that leaf says is your answer.

# Classification vs Regression Trees

## Classification Tree
Use this when your output is a category:
- spam / not spam
- fraud / not fraud
- cat / dog

## Regression Tree
Use this when your output is a number:
- house price
- energy consumption
- delivery time

> [!warning] Important
> For regression, a leaf’s prediction is usually the average of the **example numbers** it saw during training.
> 
> **For example:** Say in your training data, three houses that landed on the same leaf sold for 200k, 220k, and 240k. A new house that lands there gets a guess around **220k** — the average of those sale prices.

# What makes a "good split"

At each step, the algorithm tries a bunch of possible splits and picks the one that separates outcomes best.

For classification, you'll usually hear terms like:
- Gini impurity
- entropy / information gain

For regression, you'll usually hear:
- mean squared error reduction

I'm not going to throw in any complicated formulas here. Buuut ... if you want to dive deeper, I can't recommend enough [StatQuest](https://www.youtube.com/@statquest):
- The series on Decision and Classification Trees - [YouTube - Part 1](https://www.youtube.com/watch?v=_L39rN6gz7Y) and [YouTube - Part 2](https://www.youtube.com/watch?v=wpNl-JwwplA)
- Regression Trees, Clearly Explained - [YouTube](https://www.youtube.com/watch?v=g9c66TUylZ4)

# Why trees are awesome

- **Interpretability**: you can inspect the actual logic.
- **Low prep overhead**: often works without heavy feature scaling.
- **Non-linear behavior**: can model decision boundaries that linear models miss.
- **Fast baseline**: gives you a quality reference quickly.

# Where they struggle

- They can overfit if you let them grow too deep.
- Small data changes can produce a different tree (they're kinda unstable).
- A single tree can get outperformed by stronger ensemble methods.
- Trees care about order on numbers. If you slap `0, 1, 2` on categories that aren't really ordered, it might still act like there's a trend. One-hot (or whatever your stack likes for real categoricals) saves you the headache.

That's why people often move to Random Forests or Gradient Boosted Trees later - same idea, just many trees working together.

# Anti-overfitting knobs (the important ones)

When a tree memorizes training data, it looks smart in training and goofy in production.

Common control knobs:
- `max_depth` - limits the number of branches a tree can have
- `min_samples_split` - minimum samples to create a new split
- `min_samples_leaf` - minimum samples in each final leaf
- `max_leaf_nodes` - limits total number of leaves

If training performance is great but validation drops, your tree is probably overfitting.

# Quick starter code (scikit-learn)

If one label shows up way more than the others, `class_weight="balanced"` is worth a shot — otherwise the tree can get away with always voting the common one.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

# X = your feature matrix, y = labels
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = DecisionTreeClassifier(
    max_depth=4,
    min_samples_leaf=10,
    # class_weight="balanced",  # uncomment if classes are imbalanced
)

model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2f}")
```

# Tiny example

In your [[How to DragonJump|Dragon Jump]] setup, each frame you feed the tree a **`state`** vector and it guesses an **`action`**. 

That state vector is **57 inputs** total: 
- **7×7** game grid flattened (49 numbers) 
- plus **8** small extras (direction, velocity, floor/wall flags, progress to peak, power-up) 

Below is an example of an AI using decision trees: each box is a question, **True** / **False** is left / right, and the `[a, b]` counts are how many training samples landed there for each action.

```mermaid
flowchart TD
    R{"perc_to_peak <= 0.162<br/>gini 0.487 · samples 240 · [139, 101]<br/>class action_0"}
    L1L{"grid[3][0] <= 0.5<br/>gini 0.402 · samples 183 · [132, 51]<br/>class action_0"}
    L1R{"dir_y <= -0.923<br/>gini 0.215 · samples 57 · [7, 50]<br/>class action_1"}
    L2LL{"grid[3][6] <= 0.5<br/>gini 0.358 · samples 167 · [128, 39]<br/>class action_0"}
    L2LR{"dir_y <= -0.85<br/>gini 0.375 · samples 16 · [4, 12]<br/>class action_1"}
    L2RL{"grid[6][0] <= 0.5<br/>gini 0.5 · samples 12 · [6, 6]<br/>class action_0"}
    L2RR{"grid[5][4] <= 0.5<br/>gini 0.043 · samples 45 · [1, 44]<br/>class action_1"}

    F1["Leaf · gini 0.275 · n=140<br/>[117, 23] → action_0"]
    F2["Leaf · gini 0.483 · n=27<br/>[11, 16] → action_1"]
    F3["Leaf · gini 0.0 · n=3<br/>[3, 0] → action_0"]
    F4["Leaf · gini 0.142 · n=13<br/>[1, 12] → action_1"]
    F5["Leaf · gini 0.49 · n=7<br/>[4, 3] → action_0"]
    F6["Leaf · gini 0.48 · n=5<br/>[2, 3] → action_1"]
    F7["Leaf · gini 0.0 · n=41<br/>[0, 41] → action_1"]
    F8["Leaf · gini 0.375 · n=4<br/>[1, 3] → action_1"]

    R -->|True| L1L
    R -->|False| L1R
    L1L -->|True| L2LL
    L1L -->|False| L2LR
    L1R -->|True| L2RL
    L1R -->|False| L2RR
    L2LL -->|True| F1
    L2LL -->|False| F2
    L2LR -->|True| F3
    L2LR -->|False| F4
    L2RL -->|True| F5
    L2RL -->|False| F6
    L2RR -->|True| F7
    L2RR -->|False| F8
```

Not perfect. Still super useful, and you can inspect exactly why it picked each action.


# TL;DR

Decision Trees are:
- the easiest bridge from rules to machine learning
- interpretable and practical for tabular problems
- excellent first models, especially for debugging your data and assumptions

Use them early. Learn from them. Then decide if you need something fancier.
