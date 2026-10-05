AI learns by interacting with the environment and optimizes for the actions that give it the maximum score given by a reward function

> [!warning] Important
> In supervised learning we're optimizing for how similar we are to the target behavior. In reinforcement learning we don't have an optimal behavior we want to copy, but we know what makes a behavior good or bad
> 
> That's why in supervised learning we minimize the error of a loss function - and in reinforcement learning we maximize the score of a reward function

## Model-based vs Model-free

A model is a representation of the environment the agent learns in. Some AI algorithms create models, while others don't. 

A model is particularly useful when the environment is deterministic (predictable) - because the AI will map what are the next best moves it can do in the environment and optimize for the path that will give it the highest reward (think chess or go). 

But there are also some downsides like not not properly modeling complex environments which can lead to your AI not generalizing or falling into biases (think that old hag that keeps nagging you with what she thinks it's the right way to do stuff - not that I'd know anything about that).

Model-free algorithms:
- ppo
- dqn
- RLHF
Model-based algorithms:
* alpha-go
* Dyna-Q
* [dreamer v3](https://danijar.com/project/dreamerv3/) - I should really look into this one

## Funky algorithms to tackle

Policy Optimization - idk what all those fancy words mean - so maybe learn 
- A2C and A3C - uses gradient ascent
- PPO - uses something fancier
and then I'll probably come back to update this description

Q-learning - this I know - you optimize for what's the best action to take given the current state you're in - and require your actions to be discrete (categories).

## Learning on-policy vs off-policy

On-policy means you're optimizing based on what's the current internal wiring of your AI

Off-policy means that you grab random experiences from the current AI version or its predecessor acted and then learn based on that 

It's like that saying with: a smart man learns from its mistakes, a wise man learns from the mistakes of others. Meaning that:
- on-policy AIs are smart - they use the action they just did to update their wirings
- and off-policy AIs are wise - they use actions from a replay buffer to update their wirings
## References
- OpenAI - [Spinning Up](https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html#a-taxonomy-of-rl-algorithms)