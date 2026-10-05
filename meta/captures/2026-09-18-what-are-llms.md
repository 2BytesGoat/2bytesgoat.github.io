# Capture: What are LLMs (2026-09-18)

> Status: assembled → `content/LLMs/What Are LLMs.md` (draft: false, pending Giani review)
> Episode of the Billy & Goat podcast. Verbatim transcript — assembled posts come later.
> See README.md in this folder for the contract.

## Transcript

**Billy:** yo yo, welcome back to the goat podcast thingy. so today i wanna talk about LLMs — like ChatGPT stuff. i actually know a tiny bit already cuz i read the [[Prompt-it!]] post where you trick one into leaking a password (that game was fun). but like... nobody ever told me what an LLM actually _is_. is it one of those deep learning black boxes from the [[AI vs ML vs DL]] post? or something else?

**Giani:** cool, so let's talk LLMs you ready for the intro?

**Billy:** born ready. hit me with the intro, Giani 🐐 — i got my notebook out and everything (it's the same notebook i used for the [[Linear Regression]] post, the W and B stuff finally made sense to me)

**Giani:** cool, so think of it like this: LLMs are just some fancy auto-complete engines. Think google search's autocomplete, where you start typing out things into the seach bar and then new words appear on the screen as suggestions. LLMs function in a similar fashion. They're complex mathematical formulas that can predict which word comes next in a sequence, so for instance if I were to ask you: what word comes after "Ana are ..." you would say:

**Billy:** MERE. apples. obviously. ...wait. did you just make ME the autocomplete engine?? 😅 i hate how smooth that was.

okay but hold on, that actually raises a thing: if it's really just predicting ONE next word... how does it end up writing whole paragraphs that sound like a person? like does it take its own word, shove it back in, predict the next one, and keep looping? or am i missing a step?

**Giani:** good question, but before we tackle that, let's clarify one thing before. The LLM doesn't only predict one word in a sequence. What it does is that it has this dictionary of words and it gives a probability for each word to follow that sequence. Which means that "mere" is just the word with the highest probability to follow that sequence. does that make sense?

**Billy:** ohhh wait, okay — so it's not just "the answer", it's more like a leaderboard? the formula spits out a score for every word in the dictionary and "mere" just wins the race?

kinda like the [[Linear Regression]] post where the model outputs a _chance of rain_ — except here it outputs a chance for... every single word at once?? that's a lot of rain chances 😅 does it keep the runner-ups around or does it just yeet them?

**Giani:** something like that. Now here's the ticky part: the LLM was trained on a lot of text from the internet. And scientists just fed it text without actually checking if it's good or not. Meaning that if there's a meme trend or enough trolls on the internet, and we're not careful with what data we feed into the LLM while training it, we may end up with other words with higher probabilities - and the LLM may end up saying stuff like "Ana are diabet" (Ana has diabetus). Just because there were more occurances of "diabetus" than "mere" in the data the LLM saw. Does that make sense?

**Billy:** WAIT. okay so the LLM isn't "smart", it's basically a mirror of whatever text you shovefed it?? like the [[AI vs ML vs DL]] post said — data has to be diverse and clean, no examples contradicting each other — except here the "data" is the entire internet, trolls included 😭

so follow-up: if enough people meme hard enough, the leaderboard just... flips? and nobody at the company notices until the model starts saying "diabet"? is there no filter between the internet and the training?

**Giani:** some scientists put fileters, some don't depends a lot on how fast they need to release new LLMs in the wild. I think one approch some may use is that they use other LLMs to check the data and hopefully either flag bad entries (so humans will check and either remove or update them) or they just remove that data completly. But that's a topic for another time

now that we have a grasp of how an LLM predicts one word - let's cotinue on to how it generates text.

so say you want to have the LLM generate the lyrics to the Pokemon intro, you'd do something like "Continue the intro for the pokemon theme song: I wanna be ..."

and the LLM will generate "the" as the next word in the sequence. What happens next is that we add that word to the initial ask we made so it looks something like "Continue the intro for the pokemon theme song: I wanna be the ..." and feed it back into the LLM. Then it will generate "very". And so on so forth until it decides it had enough and generates a special stop word called "<end>". That end word will make it stop generating text and will let you ask questions again

does that make sense?

**Billy:** okay wait, that's actually kinda wild — so the LLM is basically a goldfish?? it doesn't "remember" that it said "the" — YOU have to tape its own word back onto the prompt and shove the whole thing in again, like feeding it its own homework?? 😂

and one more thing about the `<end>` word: is that just... another entry in the leaderboard? like it sat in the dictionary this whole time, competing against "mere" and "the" and "diabetus", and it "wins" whenever the formula decides the text should be over?? cuz that feels both genius and extremely stupid

**Giani:** yep. that's right. <end> is just another word in it's dictionary and has it's own probability of showing. and as I said at the start. The LLM is just an autocomplete engine, it fills in the next word until it decides it's enough

but there's a more interesting side to this. This way for an LLM to work is the old way, the scientists used to do this back in the GPT2 era - before chatbots and ChatGPT were a thing

the LLMs today are practically trained in phases. First phase is learning how to autocomplete (which inately makes them also remember information - cuz if you know what word comes next, a side-effect is that you remember facts from the internet)
Second phase is making them talk like humans.

There's a fancy way of training AIs via reinforcement learning, where you let the LLM generate text, a human looks at the answers, it decides wheter they like the answer or not, and then train the LLM to produce more answers that the human likes. So like / don't like becomes the reward function that the AI tries to optimise for

**Billy:** ohh so it's a two-stage goat: phase 1 = read the whole internet by accident (and remember stuff as a side effect), phase 2 = finishing school where humans grade its homework with thumbs 👍👎

but wait — i haven't read anything about reinforcement learning on the blog yet (the [[Linear Regression]] and [[Loss Functions]] stuff was all about nudging W and B against a _right answer_). here there's no right answer, just vibes?? like... the reward function is literally "the human liked it"? what happens when two humans disagree on what a good answer is — does the model just learn whoever yelled loudest in the data?

**Giani:** well ... you rarely have the same answer showed to multiple users, and if you do - it's usually the average of the answers that's taken into account. so say you and 2 of your friends get the same answer for the same question, you can either:

- do voting and if 2 said ok and one said bad - we say the LLM did good
- or we use points like 2 said ok one said bad - so we get 2/3 of the maximum reward for this answer

but that's a topic for another time. Does it make sense so far? did you get the gist of how LLMs work - like a high level overview?

**Billy:** yeah no, the gist landed. 🧠

recap so i know i got it: the LLM is a giant next-word-guessing formula, it picks "mere" because it won the probability race, it loops by taping its own word back into the prompt until it wins with `<end>`, phase 1 = autocomplete the internet (accidentally memorizing facts), phase 2 = humans vote with thumbs and the model learns to chase the good vibes. that's... that's just fancy autocomplete with a finishing school. okay. i can live with that.

but one dumb follow-up before the segment ends, since we're in "high level overview" land: you said the phase 1 formula spits out probabilities for every word in the dictionary — is that dictionary literally every word it saw on the internet?? like does "diabetus" sit in there because trolls typed it, and does the LLM ever just... make up a brand new word that was never in the training text? or is it stuck choosing from the menu it was handed?

**Giani:** that's a very good question. It may seem complicated at first but bare with me. You can't capture all possible words from the internet, say at some point a new trend begins and people start spamming skibbidy on forums. We don't want to re-train the AI every time a new word appears, so we use sylables or letters. So in case we don't have "skibbidy" in the dictionary, we can use "ski" + "b" + "bi" + "dy" for instance. We call these combination of words, sylables and letters "tokens"

**Billy:** ohhh so the leaderboard was never a _word_ leaderboard — it's a token leaderboard! it's not picking "skibbidy" from a menu, it's gluing ski + b + bi + dy together like lego bricks (the [[Linear Regression]] post called itself the 1x1 lego brick but i think tokens deserve that title more tbh 😄)

okay dumb follow-up then: so when the blog-brain in me says "it predicts the next _word_" — it's really predicting the next _token_, right? and the chopping-up of text into tokens, is that decided ahead of time like a fixed dictionary, or does the model learn where to cut words as part of training?

**Giani:** yep - we'll go later over all the steps that go into how a LLM actually processes your input - but let me know if you understood so far

**Billy:** yeah i think i got it, let me run the tape back:

1. LLM = big math formula that plays "guess the next token" over a dictionary of word-pieces
2. it generates text by taping its own word back onto the prompt and looping until `<end>` wins the race
3. phase 1: autocomplete the internet → accidentally memorizes facts
4. phase 2: humans 👍👎 the answers, and it learns to chase the average thumbs-up

so like... the whole "AI" thing is a goldfish playing lego with syllables and chasing good vibes. i understood it, i'm just gonna take a second to grieve how un-magical it is 😅

what's next on the episode, boss?

## TODO: ask Giani

- ~~GPT2-era → "trained in phases" transition~~ ✅ answered in Answers section
- ~~"Autocomplete makes them remember facts as a side-effect"~~ ✅ answered in Answers section
- ~~Reward aggregation: "usually the average" vs the voting/points options~~ ✅ answered in Answers section
- ~~Tokenization: fixed dictionary decided ahead of time vs learned during training~~ ✅ answered in Answers section — deferred to phase two (LLM architecture episode: tokenizer, encoder, self-attention). tl;dr given: the chopping is the tokenizer step and it's not learned by the LLM

## Manim notes

- (none surfaced this episode)

## Answers (follow-up session, same day)

### TODO 1 — phases vs GPT2: what changed technically

**Giani:** ok good. So the old way was to simply train an LLM to "remember" as much as it could - being able to autocomplete as best as it could by scaling it. But that was it, no fancy way of making it conversational, just autocomplete

then the "new" way is to also make it respond like a human, making it more convesational.

### TODO 2 — "memorize facts as a side-effect" mechanism

**Giani:** think of it like learning the alphabet (or poem for school) by heart - that's basically what the LLM is doing. By learning what letter or word comes in a sequence, you're plactically memorizing the content. You can then use that memorisation of sequence for your task at hand

### TODO 3 — reward aggregation: voting vs points

**Giani:** yeah - we went a bit too in the weeds and outside the scop with this topic. Short answer is that there's no one fits all and it depends on what's more available to you. You can either do voting or points - but I think points fits PPO better - right?

### TODO 4 — tokenization dictionary: fixed or learned?

**Giani:** yes, I want to tackle it in phase two - where we discuss the LLM architecture and how everything works inside (tokenizer, encoder, self-attention etc) - tl;dr the copping is the tokenizer step and it's not learned by the LLM
