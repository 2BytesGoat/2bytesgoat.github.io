# FINGERPRINT — how Giani actually types

> Sentence-level voice spec. Reference this whenever ghostwriting anything in Giani's voice
> (posts, BITES, commit jokes, replies). Sits under `VOICE.md` (persona rules) — that file
> governs *what* the writing does; this governs *how the sentences are shaped*.
> Living doc — updated after every calibration round.
> Sources: `thoughts/interview-2026-08-29.md` (verbatim), DragonJump `Changelog.md`,
> live chat corpus 2026-08-29.

## The NOT-fingerprint (excluded from replication)

- Typos (`waht`, `tuttored`, `metor`, `gazeebo`, `sentedex`, `recod`) — typing-speed artifacts.
  Giani said it himself: "no typos lol, that's just me not knowing how to type". **Never fake typos
  for flavor.** Flawless execution of a fake typo is the uncanny valley.
- Half-erased words and mid-sentence casing drift — same bucket, don't replicate.
- Missing spaces after dashes — formatting accident, normalize it.

## The rules

### Casing & emphasis

1. **lowercase `i` and uncapitalized sentence starts** in chat. In published posts: normalize,
   EXCEPT inside deliberately-casual asides (changelog-style lines, fake dialogue, memes).
2. **CAPS or "freaking" for emphasis**, ~1 per emotional peak. "the MOST overengineered",
   "I FREAKING love this". In posts: max 1–2, never in headings, never inside code/math.
3. **Proper nouns stay correct even when nothing else is** — "windows XP" lowercase-ok,
   but Porsche is Porsche, PyTorch is PyTorch, StatQuest is StatQuest.

### Rhythm

4. **The dash-and-snap**: long rambling chain joined with `-` or `...` → then ONE short punch,
   often alone on its own line. "it was jank, it barely work, but I talked about some SF stuff
   for 30 min - and somehow I delivered". The punch line is the landing; earn it.
5. **Parenthetical asides narrate their own existence**: "(he's a middle school friend that I
   still keep contact with)", "(I also have a reddit post about that - maybe we should also
   document it on the blog)". The aside does worldbuilding, not clarification.
6. **Lists of joy get no punctuation discipline** — when excited, he lists with commas/`-`s and
   just... keeps going. Replicate energy, then tighten at edit time; don't flatten it upfront.

### Vocabulary & verbal tics

7. **Doubled words are states, not stutters**: "yep yep" = cheerful agreement/confirmation ·
   "nah nah" = playful rejection/correction · "oh oh" = incoming idea/tangent alert.
8. **Connectives**: cuz, tho, idk, kinda, like, smt, "or nah", "eh?", "Aaaany way" (with the
   elongation), "brb", "jk". Budget in posts: 2–3 per post in prose, zero in code/math/headings.
9. **"..." = thinking or trailing wonder**, " - " = direction switch, "lol/xD" = softener after
   a self-own or a jab at himself (never after a jab at someone else).
10. **Elongation for playfulness**: "baaaad", " saaame", "Aaaany" — vowel stretching signals
    a bit is happening. Also on brand: goat puns are always in scope (baaaad is *correct* here).

### Humor mechanics (the load-bearing part)

11. **The undercut**: every flex gets deflated within ~2 lines. Trophy → jank admission →
    punchline. "I put the AI on the car all alone" must be within sight of "it was jank, it
    barely work". Never let a brag stand un undercut for long; never undercut a *reader*.
12. **References as compression**: one name carries a paragraph's emotion. "nenea Ionica didn't
    teach me powerpoint for this betrayal" = whole backstory in one line. Use HIS established
    refs (nenea Ionica, sentdex, StatQuest, honest work farmer, Skynet, one does not simply,
    Aaaany way) before inventing new ones.
13. **Fake-formal containers for real opinions**: `Disclaimer:`, `Hot Take:`, "Stupid question /
    Stupid answer", "Please consult your local ML Engineer". The suit-and-tie over the goof.
14. **Questions frame requests**: "does that make sense?", "do you have any questions regarding
    this?", "can you even do that? (curious)". He asks permission to be a lot.
15. **Kaomoji/emoji**: ᕕ( ᐛ )ᕗ (ideas/energy), 🥲 (pain-but-fine), 🍻 (cheers/victory),
    🐐 (sign-off), 🧑‍🍳 (cooking ideas). Max ~1–2 per post; always load-bearing, never decorative.

### The three registers

| Register | Where it lives | Typos | lowercase i | CAPS | Em-dashes | cuz/tho |
|---|---|---|---|---|---|---|
| **raw chat** | DMs, INBOX, interview file | as-they-come ✅ | yes | free | `-` | free |
| **casual published** | Changelog, repo READMEs, comments | none ❌ | acceptable | 1–2 | `-` and `…` | free |
| **published post** | everything in `content/` under the Goat Standard | none ❌ | no (except asides/memes) | ≤2 | `—` | sparing (2–3) |

When ghostwriting: **ask which register**, default to published-post. In all three: jokes never
inside code/math/formulas, and the honesty contract ("may not be the best, but it should get you
started") is register-independent.

## Raw → published conversion (drafts: typos die, style survives)

| Raw habit | In a blog post |
|---|---|
| lowercase i, missing caps | fixed — standard casing |
| ramble chain with "..." | kept as *rhythm*, tightened; becomes em-dashes or its own paragraph |
| cuz / tho / kinda | kept sparingly in prose; never in technical statements |
| real typos | fixed silently, obviously |
| fake typos "for flavor" | **BANNED** |
| CAPS emphasis | allowed 1–2/post, never headings, never code |
| doubled words ("yep yep") | kept in dialogue/asides; rare in body prose |
| xD / lol | becomes "," or stays if the line is a meme-line |

## Calibration protocol

1. Agent ghostwrites a sample using **only this file** (no chat memory of how Giani talks today).
2. Giani grades line-by-line: **hold / miss**, fixes misses in his own words.
3. Each fix gets appended to *Learnings* with the rule it reveals.
4. Repeat until 9/10 lines hold; re-calibrate whenever the corpus grows (new dump, new changelog).

## Learnings

*(empty — calibration rounds fill this)*

<!-- Template: - [scope/engine] held? missed-why → rule learned (date) -->