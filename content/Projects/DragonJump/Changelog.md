~ There's also a [Discord channel](https://discord.gg/FsKQPupcVs) ~

#### 2025-06-09 - NEW UPDATES [🐛]

I fixed the bug that didn't let users boot the game directly from the python code. Unfortunately, it also required a PR on the public `godot_rl` library. That means that the patch won't be out for everyone until they make a new release 🥲

In the mean time, I made a script that patches your local python environment with the fix, such that you guys won't be blocked. Here are the steps:

- Make sure you have the latest version of Dragon Jump installed - close Steam and re-open it. That will trigger an update to Dragon Jump,
- Open Dragon Jump and type `path` inside the developer console (open pressing tilda button `~`). That will give you the path to your executable that you'll need later,
- Pull the latest version of the [PLaiGROUND repo](https://github.com/2BytesGoat/PLaiGROUND),
- Make sure you have a .venv created (if you use Docker you can skip the next step),
- (Optional) Change directory to be inside /patches and run the patch script located at `PLaiGROUND\patches\patch_libraries.py`
- Inside the `scripts\00_random_agent.py` set the `--env_path` value to be the path you copied instead of `None`

Hope that works for you. If you have questions, you can ping me on the [Discord channel](https://discord.gg/FsKQPupcVs)

#### **2025-06-02 - Making it easier to train AIs on the game**

Been focusing on code that nobody will see 😆 This week was all about **Demo Recording Enhancements** and **Developer Tools**.

Here's a summary:

- Added support to **save gameplay frames** alongside action/state logs (for better training visuals)
- Fixed bugs in **demo recording logic** and removed **unused variables** for cleaner, more stable logs
- Enabled **Python integration** to directly start the game via code
- Built a **Python processing script** to easily load and work with recorded gameplay data\*\*

#### **2025-05-26 - Recording data and setup guides**

Trying to focus a bit on the reason for which this game was made: a platform to train your AIs on. So for the following period I'll deprioritize development of levels and mechanics and make it easier for you to train AIs on the game.

Here's a summary:

- **Demo recordings**: Added support to capture states and actions from your gameplay, so you can train an agent using supervised learning
- **Recording frames**: It's boring to only look at numbers, so I also made it such that recordings also capture the frames from the game (downscaled ofc)
- **Writing some tutorials**: I've created a README for how to connect using a random agent and also added some explanations on [[How to DragonJump]]

#### **2025-05-19 - Progress on AI integration**

This week, I focused on streamlining the connection between the game and the AI brain running in Python. I also updated the Steam build, so players can now access a version of the game that fully supports AI training.

Here's a summary:

- **Improved audio system**: Fixed music looping, refined sound effects playback, added music volume controls, and moved SFX handling into the music manager.
- **Enhanced input features**: Fixed key remapping issues.
- **Progress on AI features**: Implemented and refined multi-agent training support, including server connection and dynamic step configuration.

#### **2025-05-12 - More game polish + AI integration**

It was a kinda hectic week. Got caught up with work, but fortunately had some time to add some more polish to the game. Also started working on the AI training integration.

Here's a summary:

- Early AI training interface added
- Basic multi-agent training (experimental)
- Improved level previews (zoomed out)
- More level balancing and polish
- Added “boing” text for bounce pads

#### **2025-05-05 - Polishing the game**

This week was all about polishing the game. I've flexed my "designer" brain trying to make the game feel better and look better.

Here's a list of the most interesting things I've added:

- 2 new levels + updated final level
- New bounce pad mechanic
- Improved leaderboard & ghost replays
- Music, sound effects & poof visuals added
- Editor and UI polish
- Minor bug fixes and performance tweaks

#### **2025-04-28 - Learderboard improvements and Steam update**

I crunched this release like hell, my brain still hurts. But it was totally worth it. Now the leaderboard is a bit more stable (though not perfect - yet). The UI is a bit more cohesive, the level editor works and now there's mention of the [Discord channel](https://discord.gg/FsKQPupcVs).

I can't wait to work on the next updates, cuz I have some funky ideas in the oven.

Here's a list of the most interesting things I've worked on, as per ChatGPT:

- **New Community Button:** Join our Discord easily from the main menu!
- **Level Reworks:** Early levels rebalanced (especially 1-11, 1-12) + a new tutorial level for the Spiderman move.
- **Leaderboard Improvements:** Added info about score syncing delays and clearer unsynced score warnings.
- **Level Editor Upgrades:** Create, edit, and manage custom levels with a new level editor scene and menu.
- **Better Stability:** Improved sync between local and server saves + bug fixes and security upgrades.

#### **2025-04-21 – We have working leaderboards babyyy**

So the bane of this project has always been: How to make leaderboards actually work. And mainly cuz I'm a choosing beggar, cuz I want to use Steam's free leaderboards, but like a lot and for everything. Aaaany way ... that's out of the way. I've also had a productive weekend and did a lot of updates on the rest of the game refactor. I think I'm past the half way point and after the map editor is ready (again) we'll have the game back on Steam.

Here's a list of the most interesting things I've worked on, as per ChatGPT:

- **Steam leaderboard integration** – you can now compete with other players; scores sync automatically, even handle weird cases like being offline or having local vs Steam mismatches. That's a big step for any game trying to support real competition.
- **Player ghost system** – super cool for speedrunners or anyone trying to improve. Replaying your last run as a ghost gives that “race against yourself” feeling, which is fun and useful.
- **Level select and UI polish** – the menus aren’t just there now, they actually _do things_. Level buttons, previews, functional pause and settings menus - all stuff that makes the game feel finished rather than in dev hell.
- **Level editor improvements** – UI updates and bookmarks mockups suggest players might be able to build their own levels down the line, which adds a whole layer of replayability and community stuff.
- **Dissolve blocks + game time + save system** – gameplay and progression systems are in place. It’s not just a tech demo anymore - it remembers what you did and throws in new challenges.

#### **2025-04-13 – Final refactor starts here**

I’m starting the big refactor! I want the codebase to be clean and easy to work with - especially when people start playtesting and uncovering all the bugs I’ve been pretending don’t exist. Fixing them shouldn't drain my soul, so I'm setting things up right.

I had a bit more time today, so here's what I tackled:

- **Improved jump logic** – I finally fixed the janky jump. I’d seen this [video on better jumps](https://www.youtube.com/watch?v=hG9SzQxaCm8) ages ago, and it stuck with me. Glad I finally got around to implementing it.
- **Refactored level editor** – In Dragon Jump, every map is stored as a single character string. The code was getting messy, so I cleaned things up and made sure it still behaves as expected.
- **Character reset** – Pressing `R` resets the level, which is super important both for players and for the AI when it gets stuck. This now works properly.
- **Fixed localhost connection** – On my Mac, **localhost** was giving me trouble. Swapping it with **127.0.0.1** did the trick. One of those annoying platform quirks.

I'll try to keep these updates going weekly - mostly for my own sanity and to stay consistent.
