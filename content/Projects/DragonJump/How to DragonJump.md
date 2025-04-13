---
tags:
  - godot-envs
draft: false
date: 2024-10-14
---

![img >](env-dj-demo.gif)

In Dragon Jump you play as a orange dragon who's job is search for the secret door that takes him to the next level. 

While playing you only need to **PRESS SPACE** (or ENTER), to make the Dragon Jump. The more you press the space bar, the higher it jumps. However, the dragon gets tired after jumping for too long and will fall after a while.

The dragon can also roll over ledges and walls, and hang onto walls to jump some more.

<br>
<center>You can download the game environment from: <a href="https://github.com/2BytesGoat/ENV-DragonJump/releases">GitHub </a> </center>

## How the environment works

### 1. Build the wrapper
First you'll need to create a wrapper over the Godot environment in order to get access to the game state and act. 

Here's a short Python snippet on how to do this:

```python
env = StableBaselinesGodotEnv(
	env_path = PATH_TO_GODOT_ENV,
	show_window = True, # will enable/disable rendering - helps with performance
	seed = 42,          # sets the random seed and helps with reproducibility 
	n_parallel = 1,     # will launch multiple instances of the environment
	speedup = 1,        # the playback rate for the environment
)
```

### 2. Reset the environment
To make sure the environment and the code is synchronised, you'll need to reset it before doing anything else. 

```python
obs = env.reset()
```

The reset will also return the first set of observations that you'll use to take your first action.

### 3. Take action
Once you decided on what action you want to take, your agent needs to take a step in the environment.

```python
obs, reward, done, info = env.step(actions)
```

The step will return some valuable information regarding what happened after your agent acted, that will be useful when deciding on what's the next action it may take.

> [!info] What do those values mean?
> * **obs**: *dict* - the observation of the current state of the game
> * **reward**: *float* - the thing your agent will optimise towards maximising 
> * **done**: *bool* - whether the game is playing or it ended
> * **info**: *dict* - additional information regarding the game

### 4. Repeat
The **done** flag will be set to true once the agent either completes the map or a certain number of in-game steps have passed. 

**Disclaimer**: I don't remember what's the number of steps I chose for this environment, so you can figure out the reason it ended by what was **the last reward** it received. If the reward is higher than usual and you have a seemingly random number of steps: Congrats! You did it! 🍻

<center>You can download the starter code from here: <a href="https://github.com/2BytesGoat/PLaiGROUND">GitHub </a> </center>


## About Observations

For each game tick / action you take you get the following information from Godot 

```python
{
	# This is like sensor data
	"obs": {
		# This is how far you are to the gate
		"goal_distance": Float = Field(0.0, ge=0.0, le=1.0), 
		
		# This is the direction of the gate relative to the player
		"goal_vector": List = [ 
			Field(0.0, ge=0.0, le=1.0), # the x component
			Field(0.0, ge=0.0, le=1.0)  # the y component
		],

		# This is the normalized velocity of the player
		"player_velocity": List = [
			Field(0.0, ge=0.0, le=1.0), # the x component
			Field(0.0, ge=0.0, le=1.0)  # the y component
		]
		
		# This is a list of sensors that tell you how close you are
		# to something you can collide with (walls)
		"sensors": List = [
			Field(0.0, ge=0.0, le=1.0), # 0 is far 1 is close
			...
		]
	}, 
	# This is a frame for the current game timestamp
	# The shape of the image is taken from the env "observation_space"
	# The shape of the image is [240, 320, 3] -> [height, width, channels]
	"obs_2d": : List[List[List]] = [
		Field(0.0, ge=0.0, le=1.0), # 0 is a black pixel and 1 is a white pixel
	]
}
```

You can also checkout how sensors are indexed in the image bellow.

![drawing](env-dj-sensors.png)

## About Actions

In Dragon Jump you control the Dragon by pressing the **SPACE BAR**. That means that the action space is a Discrete Action Space where the action is either **Jump** (1) or **Don't Jump** (0).

You can decide whether to jump or not based on a lot of factors, such as: 
* how close a object is to the dragon based on the sensors
* how close the dragon is to the door
* whether the color of the next 20 pixels from the dragon are green or gray

<center>You can download the starter code from here: <a href="https://github.com/2BytesGoat/PLaiGROUND">GitHub </a> </center>