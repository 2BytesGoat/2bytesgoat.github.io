---
tags:
  - godot-envs
draft: false
date: 2024-10-14
---

![img ><](env-dj-demo.gif)

**Dragon Jump** is a 2D one-button precision platformer, inspired by games like _Super Meat Boy_ and _Geometry Dash_. But this isn't just a game—it's an educational playground where you can learn how to build an AI from scratch.
<br>
<center>Download Dragon Jump for Free <a href="https://store.steampowered.com/app/2471710/Dragon_Jump/">on Steam </a> </center>
<br>
In this blog post, I'll show you how to connect a basic AI "brain" that takes random actions to the game, and begin to explore how the AI looks at the game world. Later on, we'll move from simple techniques like if-else logic and decision trees to more advanced approaches like genetic algorithms, neural networks, and reinforcement learning.

## Enabling the AI Mode in the Game

First things first: you’ll need access to the _Dragon Jump_ open playtest. Just head to the [Steam page](https://store.steampowered.com/app/2471710/Dragon_Jump/), click **Request Access**, and you’ll be granted immediate entry to the game.

Once installed, feel free to explore—hover over the levels, try a few runs, and get a feel for the gameplay. When you're ready to start experimenting with AI, it's time to turn the game into a training **environment** for your AI **brain**.

To do this, press the `~` (tilde) key on your keyboard to open the Developer Console, then type:
```bash
learning on
```

You can close the console by pressing either `Escape` or `~` again.

![img ><](env-dj-aisettings.png)
Now, when you select a level, you’ll notice a new tab in the menu labeled **AI Settings**. This is where you can connect your AI brain and configure how many Dragons it should control simultaneously.

## Setting Up the AI Brain
I’ve put together a short guide [on GitHub](https://github.com/2BytesGoat/PLaiGROUND) that walks you through setting up the Python project where your AI logic will live. You can either set it up to run directly on your PC or use a Docker container for a more consistent environment (I recommend the Docker one, especially helpful if you want to avoid hardware-related issues).

The guide might look a bit daunting, but once you’ve gone through it, you’ll should find it pretty straightforward. Some of the information in the guide overlaps what's written in this blog post, but that's just to make sure nothing gets missed.

## How the Game Communicates with Your AI
The game and your AI brain talk to each other using [TCP sockets](https://en.wikipedia.org/wiki/Network_socket). Here's how it works: 
* every frame, the game (which acts as the **client**) sends the current state of the Dragon (we’ll call him the **agent**) to the AI brain (which acts as the **server**)
* the AI brain then decides what the agent should do (jump or don't jump) and sends that action back to the game
* this back-and-forth keeps going until the agent reaches the exit gate

Think of it like a walkie-talkie: the game says, “Here’s what’s happening!” and the AI brain replies, “Here’s what to do!”

## What the AI "Sees" Each Frame
When building your AI, you’ll be making decisions based on what the game sends it every frame. That data is split into three main parts: **State**, **Info**, and **Reward**.
### The State
This is the core data your AI will use to decide what to do next.

The game sends over a chunk of data called `"obs"` (short for _observation_), which includes:
- **32 directional RayCasts** (the green lines you’ll see in the game). Each one tells you:
    - If it hit something
    - How far away that thing is
    - What type of object it hit (wall, platform, spike, etc.)
    
- **Other helpful values:**
    - Distance to the exit (normalized X and Y)
    - Direction to the exit (also normalized X and Y)
    - The Dragon’s current velocity (normalized X and Y)

There’s also a compressed version of the game screen called `"obs_2d"`—useful if you want to build a computer vision-based AI.

![drawing](env-dj-sensors.png)
### The Info
This is extra data mainly for **debugging** and testing your AI. Don’t rely on this for actual training or competition—it might not always be available.

Here’s what you’ll find:
- `global_position` – the Dragon’s location in the game world
- `facing_direction` – whether the Dragon is looking left or right
- `state_name` – tells you what the Dragon is doing: Idle, Running, Jumping, Falling, Walled, etc.
- `game_time` – how much in-game time has passed since the level started
### The Reward
This is only used when training AIs that learn over time (like ones using **genetic algorithms** or **reinforcement learning**). The reward helps the AI figure out whether it made a good move or not.

Here’s how it works:
- **-0.01** points for every frame spent in the level (to encourage faster completion)
- **-10** points if the Dragon hits an obstacle and resets
- **+100** points for reaching the exit gate

Keep in mind: **rewards are only available during training**—they won’t be there when your AI is competing against others.

## About Actions

In Dragon Jump you control the Dragon by pressing the **SPACE BAR**. That means that the action space is a Discrete Action Space where the action is either **Jump** (1) or **Don't Jump** (0).

You can decide whether to jump or not based on a lot of factors, such as: 
* how close a object is to the dragon based on the sensors
* how close the dragon is to the door
* whether the color of the next 20 pixels from the dragon are green or gray

## Deeper Dive into the Python Code

### The wrapper
First a wrapper over the game is created. This is done to ensure everything is streamlined. 

```python
env = StableBaselinesGodotEnv()
```

### Reset the environment
To make sure the environment and the code is synchronized, you'll need to reset it before doing anything else. 

```python
obs = env.reset()
```

The reset will also return the first set of observations that you'll use to take your first action.

### Take action
Once you decided on what action you want to take, your agent needs to take a step in the environment.

```python
obs, reward, done, info = env.step(actions)
```

The step will return some valuable information regarding what happened after your agent acted, that will be useful when deciding on what's the next action it may take.

> [!info] What do those values mean?
> * **obs**: *dict* - the observation of the current state of the game (contains obs and obs_2d)
> * **reward**: *float* - the thing your agent will optimise towards maximising 
> * **done**: *bool* - whether the game is playing or it ended
> * **info**: *dict* - additional information regarding the game

### Repeat
The **done** flag will be set to true once the agent either completes the map or a certain number of in-game steps have passed. 

**Disclaimer**: I don't remember what's the number of steps I chose for this environment, so you can figure out the reason it ended by what was **the last reward** it received. If the reward is higher than usual and you have a seemingly random number of steps: Congrats! You did it! 🍻
