## Linear Equations

The most basic mathematical formula used in Machine Learning is the good old linear equation

$$
y = a * x + b
$$

It's a generic equation used in [[Machine Learning Algorithms]] such as [[Linear Regression]] and is the basis for [[Neural Networks]].

What this formula says is that there is a relationship between my input `x` and output `y`, and I just need to find `a` and `b` that transforms `x` into `y`.

Let's put it this way: say if a type of food has sugar in it, you say it's tasty. Meaning that based on **how much you like sugar** and **how much sugar there is** in the food we can calculate how **tasty** a recipe is.

- x = amount of sugar in food
- a = how much I like sugar
- y = how tasty the food is
  However, if mom makes the food, it's going to be tasty anyways. That means that we have a bias for mom's food that makes any food good no matter if it has sugar or not. So we can say:
- b = bias for mom's cooking
  And so, the formula becomes:
  $$
  tasty = preference * sugar + bias
  $$

But sugar is not enough to tell us if food was good or not. Maybe we also care if it's spicy or sour or it's texture. In that case we're gonna need a more complicated formula.

$$
y = a_1 * x_1 + a_2 * x_2 + \dots + a_n * x_n + b
$$

Where `n` represents the number of the last thing we could think that makes the food tastes good.
