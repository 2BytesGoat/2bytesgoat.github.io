#### **2025-04-13 - Final refactor starts here**

I wanted to make sure that the codebase is well structured, so when people start playtesting it and discovering all the bugs that I tried to hide, it won't suck the soul out of me to fix them.
Anyways, today I had a bit more time to focus on coding, so here's what I worked on.

* **fixed player jump** - I saw this video some time ago about [How to build a better jump](https://www.youtube.com/watch?v=hG9SzQxaCm8) but never got the time to fix my hacky jump logic. So there's that, finally have it
* **refactored level editor** - in DragonJump there's this thing that all maps are stored as a single character string. The logic became a bit messy so I needed to tie some loose ends and make sure it still works
* **fix character reset** - in DragonJump you can reset the map by pressing R. It's an important feature, cuz it also helps with training the AI. Cuz, the AI needs to reset the level if it gets stuck 
* **fixing connection to localhost** - for some reason I always had issues with connecting to localhost while on my Mac. The fix was to change from `localhost` to `127.0.0.1`

I'll try to keep updates on a weekly basis so I'll give me more chances to be consistent. 