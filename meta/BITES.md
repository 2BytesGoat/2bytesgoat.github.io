# BITES — reusable answers to questions people actually ask

> When someone asks Giani ML/game stuff IRL (meetups, work, Discord), the answer gets captured
> here as a paste-able **bite**: short, in his voice, tag-ready. Every `[post]` bite is also a
> seed — if a question keeps coming back, it deserves a full Goat-Standard post.
> Log the raw question in `../thoughts/INBOX.md` under `Asked:`.

## Format

```markdown
### "…question verbatim…"

audience: students | api-colleagues | execs
seed: [post] → {works as a post about X} | [note]
—
{≤150 words, Giani's voice, paste-able in a DM or said out loud}
```

---

### "How do I start ML in 2026? Everything is just AI slop everywhere."

audience: students
seed: [post] → anti-slop on-ramp (pair with Linear Regression as first step)
—
Do the boring thing: one course, done slowly, with code you type yourself. Python, then
scikit-learn, then PyTorch. Ignore every "AIRoadmap2026" infographic and any tool that promises
to skip the learning part — the learning part _is_ the product. Pick a tiny game or dataset you
actually care about and predict something dumb with it. That's it. Not because resources don't
exist, but because vibecoding past the fundamentals builds projects you can't debug. When you
can train a small model and explain _why_ it works, you're already ahead of most "agents" out there.

### "Is ChatGPT actually intelligent / sentient?"

audience: execs
seed: [post] → LLM taxonomy post lives in IDEAS.md already
—
It's a very fancy pattern-completer: it predicts what text plausibly comes next. The wild part
is how much _acts_ like intelligence emerges from that. But no memory between chats (unless
you give it one), no ground-truth model of the world, and it will say wrong things with total
confidence. Treat it like a brilliant intern who sometimes makes stuff up, never lies on
purpose, and read the important stuff twice.

### "Do I need math for ML?"

audience: students
seed: [post] → could be the "math you actually need" — good StatQuest pairing
—
Less than you fear, more than Carl wants you to believe. You need: functions, derivatives
("which way is downhill" hand-wavy is fine), vectors/matrices at reading level, and averages
with attitude (mean squared error). You do _not_ need to derive backprop on paper before
training something. Learn the math right after you feel the pain of not having it — it sticks
better when a real problem made you curious first.

---

_(empty slots below — new bites get appended above this line)_
