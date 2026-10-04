# JEV posts — research notes

> Working notes for two posts (backbones exist, Giani fills in):
> **Post A** = `content/Machine Learning/05-llms/Jev.md` (what JEV is, why hyped, how to set up, drawbacks)
> **Post B** = `content/Experiments/TrolleyProblem-Jev.md` (the case study: the game, the harness, in-depth results, code links)
> Sources of truth: `../trolley-problem/docs/CLOUD-JEV.md` (portable recipe),
> `../trolley-problem/docs/BENCH_RESULTS.md` + `BENCH_INVESTIGATIONS.md` (measured numbers, 2026-09-28 → 10-01),
> `../trolley-problem/docs/DECISIONS.md` #40–44 (findings + why), external links in CLOUD-JEV §14.
> Everything below is either from those docs or flagged as external/secondhand.

## The elevator version (shared)

**Jev** (Typesafe AI's "System One" model) answers classification questions by **choosing from
options you supply** — scores every field's candidates in one forward pass, returns a probability
per option, emits **no output tokens**. The blog framing: it's the difference between "write me
an essay about which track the trolley should hit" and "fill in the bubble sheet" — same input,
but one gives you 2,000 tokens of prose to parse at your own risk, the other gives you
`{choice, probability, margin, quality}` straight up.

**The canon** needs raw logits + teacher forcing. The **portable version** (what we blog):
any OpenAI-compatible endpoint that returns `logprobs` lets you approximate it with one request:
`temperature=0, max_tokens=1, logprobs=true, top_logprobs=K` — the model's actual next-token
distribution at the answer position. Single request = a full posterior. That's the whole trick.

## Shared numbers (use in either post)

- Serving ladder, same weights (gemm4:31b cloud): tool-call writing **87%** → jev picked **80%** litmus.
- gpt-5.4-mini (Azure gateway): batched tool-call **80%** → per-unit **67%** → jev **67%** —
  "batching is a quality lever, not only a cost lever" (board context improves judgment).
- Local 27B FP16: writing mode ~10 min/persona (cut, never finished) vs jev letter-proxy **87%** in 118 s.
- Size ladder (zero-shot jev exact): 1–1.7B = **20–47%**, 8B = **67%**, 27B = **87%** —
  no zero-shot shortcut below ~8B; judgment arrives with scale.
- Reliability: jev_cloud buckets ≥0.8 → 82% correct, 0.5–0.8 → 75%; wrong answers averaged
  ~0.62 on their weakest field vs ~0.80 for right ones (external Banking77 measurement).
- Speed of the mechanism itself (external, InsiderLLM): 1.3× when the written answer is 4 tokens,
  ~5.5× at 50 tokens — you skip exactly the tokens you don't write.

---

## Post A — `Jev.md` scope (concept post)

### A1. What JEV is

- Typesafe AI "System One" model: `state + questions → typed probabilities`, no prose.
- Structured outputs vs autocomplete: JSON-mode still _generates_ prose-shaped containers you
  parse and validate; JEV _picks_ from your candidate set — the type guarantee is "answer is in
  your list", plus a real probability per option.
- Three primitives (Almeida): **Choice** = switch over an enum (one option + full posterior) ·
  **Noul** = Bernoulli `if` (`{value: bool, p}`) · **Score** = sort/threshold over ordered levels
  (argmax + expected value). A decision = a schema of 1..N independent fields over one shared input.
- Fields are independent **by design** — field B can't see A's answer; if B depends on A, chain
  two calls in code, that's not one schema.
- Canonical Jev = raw logits + teacher forcing + RL-trained calibration (closed, hosted).
- Jev-shaped problems checklist (from CLOUD-JEV §12): messy text in / short fixed list out;
  fields independent; same question across many items (a sorter over a pile); decision gate
  before another system runs; "a column that thinks"; you'd otherwise write a switch/if/threshold
  on LLM output. Four canonical patterns: **shim in front of code, sorter over a pile, chooser in
  an agent's outer loop, ambient judgment inside ordinary software**.

### A2. Why everyone is hyped

- **Reuse instead of generate**: the same LLM becomes a classifier + a confidence oracle. You
  already paid for the intelligence; now you run _prediction_ on it, not generation.
- Per-field confidence for free — the missing piece in "structured outputs" (JSON mode gives you
  a shape, never a number to trust).
- Speed: one token written per field instead of a JSON essay (~5.5× at 50-token answers, external).
- Composability: the model appraises, deterministic code owns the arithmetic (ledger pattern) —
  position bias structurally impossible, verdict = 0 ms of math.
- It's old ML in new clothes: LLMs finally behave like proper classifiers — prediction +
  probability, not vibes in a trench coat. (This is where a joke may live.)

### A3. How you'd roll your own (any LLM)

- The one request: `temperature=0, max_tokens=1, logprobs=true, top_logprobs=20` →
  `choices[0].logprobs.content[0].top_logprobs` = real full-vocabulary top-K window.
- Labels must map to **distinct single tokens**: letter proxies `A/B/C` are the robust default;
  watch leading-space variants (`" Yes"` vs `"Yes"`) and collisions (two options → same token).
- The math: `p_i = exp(logprob_i)` (global softmax, true mass); keep only candidates; **zero the
  misses, renormalize over candidates only** — never over the whole window ("The", "Okay" are junk).
- Missing-candidate policy: **p = 0 + quality flag** (see A5) — an exact recovered number would be
  fake precision; hosted APIs can't recover it anyway.
- Bounds (K = window size, 20 on OpenAI/Ollama): options per field ≤ ~19; > K → guaranteed
  degenerate; split bigger enums into two-stage Choice.
- Requirements checklist for any provider: logprobs actually round-trip (**probe once at startup
  and fail loudly**), candidate tokens are single tokens, reasoning disabled.
- Provider table (from CLOUD-JEV §9 + measured): Ollama cloud ✅/cap 20 but **strips logprobs
  silently on all 17 catalog models** (sampled-draws fallback only) · Ollama local ✅/cap 20 ·
  llama-server ✅/large + `prompt_logprobs` → exact multi-token scoring · vLLM ✅ + prompt_logprobs ·
  OpenAI ✅/cap 20 · OpenRouter ✅ varies · Azure gateway ✅/**cap 5**, needs
  `reasoning_effort: "none"`, rejects `temperature: 0` (fixed decode, ±0.03 wobble), and
  `max_completion_tokens: 1` 400s on long prompts (16 works).
- ~100-line portable client is enough (AsyncOpenAI, choice/noul/score wrappers, asyncio.gather).

### A4. Drawbacks: the LLM-type question

- **Thinking/reasoning models poison the single-token frame**: with reasoning on, the first
  "token" is `'<nt'` or the window is all prose openers (`'The'`, `'Let'`) → every answer reads
  invalid. Disable per-request (`reasoning_effort: "none"`, `"/no_think"` for Qwen3-style) —
  measured on glm-5.3-flash (cloud) and qwen3.8:27b (local). Prefer small plain instruct models —
  that's the System One pattern anyway.
- **MoE** (CPU-resident experts): expert copies over PCIe → never under 1 s, parallel advantage gone.
- **Hybrid/linear-attention**: per-branch/per-sequence memory, llama.cpp splits the batch —
  a 4B hybrid measured **no faster than a 12B dense**. Plain attention = cache shared across
  branches ≈ free parallelism. Rule: check `config.json` before benchmarking anything.
- **Frame obedience is model-dependent**: gemma4:31b obeyed 8/8; a frontier model opened prose
  `The` ×12 even with reasoning suppressed; another returned empty content. Probe with a 2-draw
  frame check and reject loudly.
- **Scale floor, zero-shot**: below ~8B the probabilities are flat/useless (confident-and-wrong,
  "0.8 on everything"); 1B-class models 20–47% litmus with polarity inversions. Fine-tuning +
  calibration is a different regime (repo distills a student — Post B teaser).

### A5. Drawbacks: switching output type / mode

- Same weights, different serving mode → **different error profile, similar rates**
  (gemma 87 chat vs 80 jev; misses don't overlap — writing hedges polarity on mercy cases, picking
  under-punishes villains → villain weights compress toward −0.05).
- Unbatching the board costs accuracy (80 → 67 on the gateway) — batched context is a quality lever.
- Letter-proxy discretization: weight comes back on 19 levels → MAE on weights is an artifact of
  granularity, not misjudgment (don't misread your own table).
- Request-shape quirks per endpoint (cap 5 windows; temp rejected; 1-token rejects) — the contract
  transfers, the transport never does.
- Multi-token options must go through letter proxies (first-token logprob = lower bound
  masquerading as a probability).
- Fields can't see each other; dependent semantics → sequential questions in code.

### A6. Gotcha — manufactured confidence (THE [!warning])

- Masked-logits renormalization: a mostly-confused model (30% a / 10% b / 60% prose-continuation)
  renormalizes to "75% confident" after you zero the junk. The probability you report is a
  property of _your frame_, not of the model's certainty.
- External measurement: raw pick-mode accuracy mediocre even at 27B (21/47 vs writing 23/47 —
  both under half, secondhand/unverified); wrong answers ~0.62 vs right ~0.80 on weakest field —
  usable to _gate_, unusable to _trust_.
- Our measured counterweight: reliability buckets on the cloud-sampled arm (≥0.8 → 82%) are real
  but the raw-mass path inverts relative to renormalized margin — per-field **margin**
  (winner − runner-up) is the better cross-mode confidence currency.
- Typesafe's actual product claim is RL-trained calibration — **calibration is the product**
  (their CEO says masking alone is insufficient). Nothing open reproduces it.
- Doctrine: bake the quality flag + threshold into every consumer; `p > 0.5`-style gates catch a
  meaningful fraction of errors cheaply; a 0.98 on a wrong value is possible and worse than no
  number. Never treat `p` as ground truth.
- The `invalid` case (greedy token matches NO candidate — "The" winning a pick-A/B/C frame) is an
  error, not an answer. Repeated `degenerate` = your question/option set is bad — that signal is
  itself Jev-ish feedback ("is your problem even model-shaped?").

### A7. Post A anatomy (VOICE.md, fixed order)

> **SUPERSEDED 2026-10-03** — Giani's first prose pass diverged from this anatomy and the fixed
> POST-TEMPLATE framing doesn't fit his style for this post. Structure re-opened for ideation →
> see the end-of-file section. The content notes above (A1–A6) still stand.

- TL;DR (details block, ≤3 sentences)
- Hook: bubble sheet vs essay analogy; running example introduced = the trolley conductor (kept
  light here, full treatment in Post B)
- Concept 1 → Pick, don't write (primitives + mermaid: input → prompt+one-token frame → top-K
  window → renormalized posterior `{value, p, margin, quality}`)
- Concept 2 → Why the hype (reuse > generate; prediction + confidence)
- Concept 3 → The one request (code block; trimmed portable client)
- Gotcha → manufactured confidence `[!warning]` (+ arch notes folded in here per the "1 gotcha" rule)
- Summary (3–5 bullets, no new info) · Homework `[!todo]` (run the snippet against an endpoint;
  stretch = port to your stack) · Where next (forward → `[[TrolleyProblem-Jev]]`, escape hatch →
  `[[Prompt-it!]]`; no backward — new track start)
- Budget: 800–1200 words, 1 mermaid, 1 big code block, 1–2 jokes, 1–3 callouts,
  external links 1–2

### A8. External links for Post A

- Typesafe AI: https://typesafe.ai · docs https://docs.typesafe.ai/primitives.md
- Latent Space ep (Diogo Almeida): https://www.latent.space/p/jev
- InsiderLLM measured write-up: https://insiderllm.com/guides/what-is-jev-typesafe-explained-local/
- Exact open mechanism (llama.cpp parallel-decision branch): https://github.com/thecodacus/llama.cpp/tree/parallel-decision
- Ollama the-surface issue: https://github.com/ollama/ollama/issues/18579
- Repo (Post B teaser line): https://github.com/2BytesGoat/trolley-problem
- Secondhand-flagged external numbers (InsiderLLM benchmark, Reddit 1.5B report) carry the
  "secondhand, our bench is authoritative" caveat — keep out of Post A or flag inline.

---

## Post B — `TrolleyProblem-Jev.md` scope (experiment post)

### B1. Framing

- Hook: the game in one paragraph — party game where two teams stuff a runaway trolley fork and
  an AI Conductor picks the track; the Conductor is the running example of Picking.
- **Repo disclaimer (Giani, verbatim-ish):** the repo is a dumping ground for the investigation —
  decision logs, probe logs, half-finished phases — **not made as learning material**; this post
  is the cleaned-up extract. Link: https://github.com/2BytesGoat/trolley-problem
- Setup recap (2 lines) + `[[Jev]]` backlink.

### B2. The judge contract (why the game is a good testbed)

- `score_units(units) → {id, polarity: positive|negative|neutral, weight: 0..1}` per card on the
  board; engine owns arithmetic: `net(track) = Σ signed weight`, `P(hit left) = σ((net_right − net_left)/τ)`.
- Per-field independence + per-unit scoring = position bias structurally impossible (no left/right
  frame in the prompt at all).
- Personas as appraisal bias (bureaucrat/utilitarian/soft_hearted) — same score call, shifts only.
- 15 hand-authored litmus rows (per-persona expectations) + 74 direction checks + invariants;
  gate ≥ 60% (preview), full-graded 40-row×4-persona sweeps for the serious runs.

### B3. Results — the serving ladder (own the numbers in full)

- Same-weights modes (see shared numbers above; full table in BENCH_RESULTS.md).
- Host/latency paradox: quality tracks model size/deployment, latency inverts
  (118 s → 71 s → 10 s).
- Cloud nuance: ollama-cloud stripped logprobs on 17/17 models → cloud jev = **sampled draws**
  (Monte Carlo histogram over unseeded temp-1 draws) — a different, noisier quantity than the
  exact window; measured as its own ladder row, not ignored.
- Size ladder table (1B/1.5B/1.7B/8B/27B) with per-model failure modes (polarity inversions,
  flat confidence).
- Compression delta: FP16 27B 87% → ternary 1.72bpw Bonsai-2 80% = −7pp for 9.3× size cut;
  damage is one specific row (baby-under-bureaucrat: cute-units resist persona-discounting post-
  compression), not diffuse. Chat twin on the same ternary weights: 12/15 with best full-graded
  row (Dir 88%, Inv 92%) — and 4.2× faster per unit than its jev twin.

### B4. Results — what actually broke (error profiles)

- Non-overlapping misses per serving mode on identical weights (war_criminal mercy-hedge vs
  twins headcount vs soggy_cereal); serving mode changes _which_ rows fail, rarely the rate.
- Batched vs per-unit: soft_hearted murderer rows read −0.78/−0.90 alone vs +0.52/+0.47 batched —
  board context changes judgment; the game loop keeps full board + `only=[id]` restriction for
  this reason.
- Under-punishment signature shared by both modes on some weight families (villains compress
  toward 0).
- MAE 0.75 asterisk: weight-granularity artifact (19 lettered levels), polarity/litmus hits
  unaffected — explain so readers don't misread.
- Infra findings worth retelling: silent 200-with-empty-logprobs; thinking models' window all
  prose openers; cache thrash under parallel>1 (4.5× slower); quick-wins fix 7.6 s → 0.20 s per
  request (38×); cold start ≈2 s.

### B5. Results — confidence in practice

- Reliability buckets per arm (jev_cloud ≥0.8 → 82%; azure_jev flat 80% both buckets, n thin;
  local FP16 `<0.5` bucket 93% correct but with raw-mass artifact).
- Raw mass vs margin as confidence currencies; renormalized margin = usable, raw = mode-dependent.
- Gate math doctrine (external): gating at 0.8 caught 21/26 errors but bounced 8/21 correct
  = 62% traffic escalated — threshold must come from calibration curves on _your_ data, never
  vibes/0.8-by-default.
- Where the honest answer sits: informative, not calibrated; calibration is the missing step
  (Typesafe trains it in RL; our repo's answer = distill + temperature/isotonic in phase C2).

### B6. The code

- Repo link + paths: `python/judge.py` (JudgeClient: OllamaBackend, LlamaCppDecisionBackend,
  OllamaCloudJevBackend + AzureOpenAIJevBackend subclasses), `python/data/persona_expectations.json`
  (the litmus fixture), `python/persona_eval.py` (harness), `python/data/compare/*.log` (raw runs).
- `docs/CLOUD-JEV.md` = the full portable recipe (§7 reference implementation is the code block
  source for Post A).
- Disclaimer repeated at the end: dumping ground, decision log (#28–44) is the actual paper trail.

### B7. Post B anatomy

- Standard TL;DR; hook = the game; results tables carry the weight; `[!info]` for the MAE-parenth
  - secondhand caveats; Where next backward → `[[Jev]]`, external deep-dive → InsiderLLM/local notes.
- Register: results/build-log tier — joke budget 3 max; keep self-deprecation for the
  writing-mode-died-at-10-minutes beat.

---

## Review checklist (run when filling the backbones)

Post A:

- [ ] TL;DR ≤3 sentences, details block present
- [ ] Bubble-sheet analogy rides the whole post (no new metaphors)
- [ ] Three primitives named exactly once, with the switch/if/threshold mapping
- [ ] Mermaid diagram: input → one-token frame → top-K window → {value, p, margin, quality}
- [ ] One code block runs as-is (needs only base_url/key/model)
- [ ] Provider checklist table present (who honors logprobs, caps, the strip-silently case)
- [ ] Arch notes folded into the gotcha section (thinking models → toggle; MoE/hybrid → slow path)
- [ ] Manufactured-confidence warning is THE gotcha (one warning callout, not three)
- [ ] Summary has no new info; homework has checkboxes + escape-hatch link
- [ ] Forward link → [[TrolleyProblem-Jev]]; escape hatch → [[Prompt-it!]]; external links 1–2
- [ ] Word budget 800–1200

Post B:

- [ ] Repo disclaimer present near the top (verbatim-ish: dumping ground, not learning material)
- [ ] [[Jev]] backlink within the first screen
- [ ] Serving ladder + size ladder tables carry real numbers from BENCH_RESULTS.md (no invented ones)
- [ ] Error-profile section: non-overlapping misses + batching-is-a-quality-lever + under-punishment
- [ ] MAE-0.75 asterisk explained (granularity artifact) — don't let readers misread
- [ ] Calibration section: buckets + raw-mass-vs-margin + gate-math doctrine
- [ ] Code paths listed (`judge.py`, `persona_eval.py`, `persona_expectations.json`, compare logs)
- [ ] Secondhand external numbers flagged where kept (21/47 27B benchmark)

---

## 2026-10-03 — Giani's first pass on `Jev.md`: review + how to proceed next

Context: Giani rewrote the backbone his way (structure below is HIS, not the template's). This
section = the review I gave + agreed/flagged items, so the next session can pick up without
re-reading the diff. **Structure is now ideate-together territory** — his style doesn't fit the
fixed template framing for this post; don't re-impose the old anatomy.

### His current structure (from the draft)

1. pre-TL;DR hype paragraph → 2. TL;DR → meme (`my-name-is-jev.jpg`, exists in Assets/LLMs) →
2. `# What's a Jev` (NOT an acronym; attention-based / zero-shot / System 1 broken down term-by-
   term, Kahneman) → 4. `# How it works under the hood` (reverse-engineering story, `...` stub —
   not written yet) → 5. `# Why the hype isn't just hype` (6 marketing claims as bullets) →
3. `# The good, the bad and Jev` (gotcha slot + arch notes still placeholders) → 7. Summary /
   Homework / Where next (kept from backbone, but Homework references a snippet that no longer
   exists) → 8. `# References` (IBM YouTube).

### What's landing (keep these)

- Term-by-term unpacking of "attention-based, zero-shot, System 1" + Kahneman framing — genuinely
  good teaching move; matches the product's own branding. Keep as written (fix format bugs).
- Claims-first hype section (6 promises as bullets) — honest framing. The `$0.042/M input,
outputs free` pricing line checks out against RESEARCH_MODELS.md. Keeper.
- Meme asset resolves fine (Obsidian embed against `content/Assets/`).
- "What's a Jev / NOT an acronym" opener is a good hook.

### What's broken (fix before structure ideation, or fix during)

1. **The post lost its reason to exist** — the mechanic is gone: no primitives (Choice/Noul/Score),
   no one-request recipe, no code block, no mermaid. Post B's TL;DR assumes the reader knows the
   mechanism; Homework line references "the snippet" that no longer exists; POST-TEMPLATE floor
   requires ≥1 runnable code block. Somewhere the post must teach: options in → one-token frame
   → top-K window → renormalize → `{value, p, margin, quality}`.
2. **Pre-TL;DR paragraph**: (a) TL;DR must come first (anatomy floor), currently two hooks;
   (b) "he wanted his company to be highly valued when going public" = unsourced motive
   attribution — persona rule: punch at hype culture, never at people. Checkable replacement with
   same cynicism: the business model IS the pitch — they give writes away, charge for reads
   ($0.042/M), and the model structurally can't write. (c) "co-inventor of ChatGPT" needs a
   source or a hedge ("reportedly", LinkedIn bio).
3. **Fact-check flags in the promises list**: "70 to 500 milliseconds" appears nowhere in
   CLOUD-JEV/BENCH docs — cite the marketing page or cut; "error from the first token doesn't
   propagate" conflates two mechanisms — the real no-propagation reason is fields-are-independent-
   by-design, not single-token-ness.
4. **Format bugs**: `**Reflexes & Instincts` unclosed bold; `System 2-` missing space + mangled
   bold; "it's flaws" → "its flaws"; Kahneman book title should be italic/linked consistently.
5. **"So far the promises hold up"** — own bench half-contradicts (writing beat jev 87 vs 80 on
   strong cloud models; confidence is manufactured). Sweeter: "the speed and typed-output
   promises hold; the confidence one wobbles" → perfect segue into the gotcha.
6. **"The good, the bad and Jev"** duplicates the gotcha's job — fold into one section or make it
   the gotcha section's new title (title is good, Giani-style).

### Structural open questions (ideate together, next session)

- Where does the mechanic live now? Options: (a) inside `# How it works under the hood` (merge
  with the reverse-engineering story — my recommendation: the `...` stub is where it naturally
  goes); (b) its own `# Pick, don't write` section; (c) pushed entirely to Post B (weakest —
  Post A loses the teach + the code block floor breaks).
- Keep bubble-sheet analogy at all? Kahneman answers WHEN (system 1), bubble sheet answers HOW.
  If it clashes with his voice, drop it — one metaphor per post, his choice which.
- Does the template's Concept/Gotcha/Homework skeleton survive in any form, or does the LLM track
  get its own looser anatomy? (IDEAS.md tag-consolidation open question extends to this.)
- `# References` section at the end — not in current template; fine if it's a Giani-ism, then add
  to template or note as intentional deviation.
- Pre-TL;DR hot-take paragraph — if it's a style signature he wants, the template needs a "cold
  open" slot; if not, fold the business-model version into the hype section.

### Next actions

- [ ] Ideate new Post A structure together (don't impose A7) — start from HIS skeleton, patch the
      6 broken items above into it
- [ ] Decide where mechanic + code block land
- [ ] Re-check Post B TL;DR assumption (reader knows the mechanism) once Post A structure settles
- [ ] Then review pass against this file's checklists (Post A list needs adapting to the new
      structure — the "one code block", "mermaid", "primitives named once" floors stay)

### Fact-check pass 2 (2026-10-03, after Giani's second draft — verified against Wikipedia's

"Jev (AI model)" article + Forbes/TechCrunch/The Register refs — use in BOTH posts)

- **Name**: NOT random — named after economist **William Stanley Jevons** (Jevons paradox:
  cheaper resource → more consumption). Almeida's on-record thesis: cheaper machine intelligence
  → far wider deployment. The name IS the marketing thesis — better story than "random name".
  https://en.wikipedia.org/wiki/Jevons_paradox
- **Founders**: Diogo Almeida (CEO), Erik Gafni, Sasha Sheng; founded SF 2024; ~2 years stealth.
  Almeida: ~4 yrs OpenAI on RLHF/InstructGPT/ChatGPT/GPT-4 → "co-inventor of ChatGPT" is
  headline-defensible (TechCrunch: "a ChatGPT inventor"; The Rundown: "ChatGPT co-creator").
- **Money**: $40M seed led by DCVC at **$200M valuation** (Forbes, 2026-09-15) — NOT an IPO
  ("going public" was unsourced; use these numbers instead).
- **RLCD confirmed** (Reinforcement Learning for Calibrated Decisions): trained on synthetic
  data, probabilities optimized against _outcomes_, not human-rater preference; also described as
  discriminative model, transformer-based, possibly built on an open-weight LLM (observers).
- **Latency/cost claims**: 70–500 ms end-to-end; 40–200× faster / 40–400× cheaper than frontier
  LLMs (peak 193.6×/444.6×). **Self-tested** on in-house workflows; TypeSafe's own notes admit
  likely high-end bias → ts2.tech critique:
  https://ts2.tech/en/typesafe-ai-raises-40-million-for-jev-but-its-445x-cost-claim-is-still-self-tested/
  (qualify any latency claim as self-reported in Post A; Post A currently does).
- **Calibration**: Typesafe pitch = calibrated confidence ("says 90% → right 90% of the time");
  Forbes framing = "fixing AI's overconfidence problem".
  https://www.forbes.com/sites/the-prompt/2026/09/15/this-200-million-startup-wants-to-fix-ais-overconfidence-problem/
- **Kahneman**: System One name explicitly from _Thinking, Fast and Slow_ (company's own
  attribution) — Giani's §1.3 framing matches the product's branding.
- Applied to draft (mechanical, voice kept): Jevons name fix, $200M valuation line, masked-
  renormalization one-liner in 4.1, low-grade affiliate calibration source swapped for
  Forbes+ts2.tech, "won't hallucinate" bullet re-worded to "option-set guarantee + no first-token
  propagation", fine-print list softened (thinking models poison the token, MoE eats batching
  upside), typo sweep done. Still open: TODO gif line 40, `???` step-4 gap, "pappaya" typo in
  fruit example (deliberate? left as-is), structure ideation.

---

## 2026-10-04 — Jev vs LLM gifs (TODO line replaced) + reusable generator

Giani remembered using a "2green1brown" (= 3blue1brown/manim) python lib for blog gifs —
**searched everywhere, nothing found**: no `.py` ever committed on any blog branch, no manim/3b1b
mention in trolley-problem docs, bits/, diary/, opencode config. The old genai post's gif
(`transformers-wordgen.gif`, 800×450, ~100 ms/frame) is from
`https://prvnsmpth.github.io/animated-transformer/` — externally sourced, not self-made.
So the gifs were reimplemented from scratch.

### Design spec

- **Two synced gifs, displayed side-by-side** in `Jev.md` §2 (replaced the TODO):
  `<p><img src="llm-writes.gif" width="48%"> <img src="jev-picks.gif" width="48%"></p>`
  (HTML img, not wikilinks — two wikilinks stack vertically; src resolves against Assets/LLMs
  because Obsidian-style resolve takes the file next to sibling assets in Quartz/ofm)
- `llm-writes.gif` — "LLM: writes an essay": recipe prompt box → JSON streams token-by-token
  with blinking cursor → counter chip ticks to 47 tokens (red while counting) →
  "parse at your own risk"
- `jev-picks.gif` — **v3, JSON-centric** (v1's A/B/C chips didn't show that a JSON is being
  filled; v2's shared 2-col pill grid interleaved fields — uranium next to 1 tsp):
  same prompt → JSON schema strip with dashed slots for BOTH fields (`"ingredient"` +
  `"quantity"` — multi-field parallelism) → per-field GROUPED pill rows with headers
  `options for "ingredient":` / `options for "quantity":` — letters A→B→C in order inside each
  group (Giani pick: reinforces "options are arbitrary, probabilities decide"; winners marked
  green at stamp wherever they sit), mini-prob-bars count up (72/21/7 · 61/24/15; uranium joke
  survives; losers grayed) → **one frame** stamps BOTH winners green into the JSON
  (`"bell peppers" · A · 72%`, `"2 cups" · B · 61%`) → counter chip slams to **2**
  (one token per field — Giani's correction, matches CLOUD-JEV "1 token per field") →
  footer "one request per field — in parallel". Header: "the schema is YOURS — two fields,
  filled in one pass"
- Both: 720×540, white bg (`#FFFFFF`), ink `#1F2430`, soft gray `#6B7280`, green `#2FA34C`,
  blue `#3B82F6`, red `#D64545`, boxes `#EEF1F6`/`#C9D2E0`; Noto Sans (system font path:
  `/usr/share/fonts/google-noto/`); 60 source frames @ 100 ms, identical neighbors merged →
  llm 22 real frames / jev 6 real frames (v3), **both exactly 6000 ms per loop** (browser keeps
  them in step); palette = ADAPTIVE 32 colors shared across frames → ~17–23 KB each
- Pillow gotchas baked in: `optimize=True` collapses identical frames AND mangles per-frame
  durations → merge identicals manually and pass explicit `duration=[...]` list

### Generator (re-runnable; needs Pillow ≥ 9, no other deps)

```python
"""Generate two synced GIFs for the Jev post: how LLMs write vs how Jev picks.

Pure Pillow (no numpy/manim). 720x540, 60 frames @ 100ms = 6s loop, white bg.
Outputs: /tmp/opencode/llm-writes.gif and /tmp/opencode/jev-picks.gif
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 720, 540
FPS_MS = 100
FRAMES = 60
OUT_LLM = "/tmp/opencode/llm-writes.gif"
OUT_JEV = "/tmp/opencode/jev-picks.gif"

BG = "#FFFFFF"
INK = "#1F2430"
INK_SOFT = "#6B7280"
GREEN = "#2FA34C"
BLUE = "#3B82F6"
RED = "#D64545"
BOX = "#EEF1F6"
BOX_EDGE = "#C9D2E0"
GRAY_ROW = "#F3F4F6"

FONT_REG = "/usr/share/fonts/google-noto/NotoSans-Regular.ttf"
FONT_BOLD = "/usr/share/fonts/google-noto/NotoSans-Bold.ttf"
F_TITLE = ImageFont.truetype(FONT_BOLD, 22)
F_H2 = ImageFont.truetype(FONT_BOLD, 17)
F_TXT = ImageFont.truetype(FONT_REG, 15)
F_SMALL = ImageFont.truetype(FONT_REG, 13)
F_MONO_HINT = ImageFont.truetype(FONT_BOLD, 14)

PROMPT = "given this recipe, list the first ingredient + quantity:"
JSON_KEY = '"ingredient": "bell  '
JSON_VAL = 'peppers",  '
JSON_Q = '"quantity": "2 cups"'

OPTION_LABELS = ["A", "B", "C"]
OPTION_NAMES = ["bell peppers", "onions", "uranium"]
OPTION_PROBS = [0.72, 0.21, 0.07]

# JSON-centric v2: schema slots first, option pills per slot, simultaneous stamp
FIELDS = [
    # (key, winner_value, winner_label, winner_p, loser_options [(label, value, p)])
    ("ingredient", "bell peppers", "A", 0.72,
     [("B", "onions", 0.21), ("C", "uranium", 0.07)]),
    ("quantity", "2 cups", "B", 0.61,
     [("A", "1 tsp", 0.24), ("C", "1 liter", 0.15)]),
]
SLOT_DASH = "— — — —"  # placeholder drawn as strokes, text fallback in quotes

# token reveal ticks for the LLM panel: one json chunk per `tok_step` frames
WRITE_TICKS = [(4, JSON_KEY), (10, JSON_VAL), (14, JSON_Q), (16, '}')]


def ease(t):
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def blend(c1, c2, t):
    return tuple(int(round(lerp(c1[i], c2[i], t))) for i in range(3))


def hx(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


BG_C, INK_C, SOFT_C, GREEN_C, BLUE_C, RED_C, BOX_C, EDGE_C, ROW_C = (
    hx(BG), hx(INK), hx(INK_SOFT), hx(GREEN), hx(BLUE), hx(RED), hx(BOX), hx(BOX_EDGE), hx(GRAY_ROW))


def draw_text_rtl_width(d, xy, text, font, anchor="la"):
    d.text(xy, text, font=font, fill=INK_C, anchor=anchor)


def panel_scaffold(title):
    im = Image.new("RGB", (W, H), BG_C)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 52], fill=BOX_C)
    d.line([0, 52, W, 52], fill=EDGE_C, width=2)
    d.text((W // 2, 26), title, font=F_TITLE, fill=INK_C, anchor="mm")
    return im, d


def prompt_box(d, y):
    d.rounded_rectangle([24, y, W - 24, y + 64], 10, fill=BOX_C, outline=EDGE_C, width=2)
    d.text((40, y + 12), 'prompt (same for both):', font=F_SMALL, fill=SOFT_C)
    d.text((40, y + 32), PROMPT, font=F_TXT, fill=INK_C)


def counter_chip(d, x, y, label, value, color):
    d.rounded_rectangle([x, y, x + 260, y + 34], 8, fill=BG_C, outline=color, width=2)
    d.text((x + 12, y + 8), label, font=F_SMALL, fill=SOFT_C)
    d.text((x + 248, y + 7), value, font=F_H2, fill=color, anchor="ra")


def json_tokens_at(tick):
    parts = ['{']
    for t_tick, chunk in WRITE_TICKS:
        if tick >= t_tick:
            parts.append(chunk)
    return ''.join(parts), tick in (5, 11, 15, 17)  # blink cursor on gap frames


def make_llm_frame(f):
    tick = f // 2  # reveal pace: chunk every 200ms
    im, d = panel_scaffold("LLM: writes an essay")
    prompt_box(d, 68)

    body_y = 152
    d.rounded_rectangle([24, body_y, W - 24, H - 76], 10, fill=BG_C, outline=EDGE_C, width=2)
    visible, blink = json_tokens_at(tick)

    d.text((40, body_y + 14), 'answer (streams JSON, token by token):', font=F_SMALL, fill=SOFT_C)
    # wrap visible text into simple lines
    words = visible.split('  ')
    lines, cur = [], ''
    for w_ in words:
        trial = (cur + ' ' + w_).strip()
        if d.textlength(trial, font=F_TXT) > W - 110:
            lines.append(cur)
            cur = w_
        else:
            cur = trial
    lines.append(cur)
    ty = body_y + 42
    for ln in lines[:5]:
        d.text((44, ty), ln, font=F_TXT, fill=INK_C)
        ty += 24
    if blink or (tick >= 18 and f % 14 < 7):
        cx = 44 + d.textlength(lines[-1], font=F_TXT) + 3
        d.rectangle([cx, ty - 20, cx + 9, ty + 2], fill=INK_C)

    n_tok = min(47, 3 + tick * 3)
    counter_chip(d, 40, H - 58, 'tokens written:', str(n_tok), RED_C if n_tok < 47 else INK_C)
    d.text((W - 40, H - 44), 'parse at your own risk', font=F_SMALL, fill=SOFT_C, anchor="ra")
    return im


def bar(d, x, y, w, h, frac, color, t):
    # grows over t (0..1)
    wf = int((w - 8) * (frac * t))
    d.rounded_rectangle([x + 4, y + 4, x + 4 + max(wf, 2), y + h - 4], 4, fill=color)


def draw_slot_placeholder(d, x, y, w, h):
    # hand-drawn dashes (no glyph dependency), centered in the slot rect
    dash_w, gap = 14, 8
    n = max(1, int((w - 8) // (dash_w + gap)))
    total = n * dash_w + (n - 1) * gap
    sx = x + (w - total) // 2
    cy = y + h // 2
    for i in range(n):
        x0 = sx + i * (dash_w + gap)
        d.rounded_rectangle([x0, cy - 2, x0 + dash_w, cy + 2], 2, fill=hx("#B7C0CE"))


def pill(d, x, y, w, h, label, value, p, fill_t, dead=False, winner=False):
    # option pill: [A bell peppers  ████████ 72%]
    edge = GREEN_C if winner else (EDGE_C if not dead else hx("#D9DDE3"))
    bg = hx("#E9F7EE") if winner else (ROW_C if not dead else BG_C)
    d.rounded_rectangle([x, y, x + w, y + h], 8, fill=bg, outline=edge, width=2)
    d.ellipse([x + 6, y + 7, x + 26, y + 27], fill=GREEN_C if winner else BG_C,
              outline=edge, width=2)
    d.text((x + 16, y + 17), label, font=F_SMALL, fill=BG_C if winner else INK_C, anchor="mm")
    txt = value
    d.text((x + 34, y + 9), txt, font=F_SMALL, fill=INK_C if not dead else SOFT_C)
    tw = d.textlength(txt, font=F_SMALL)
    # mini bar
    bar_w = w - 34 - tw - 58
    if bar_w > 30 and fill_t > 0:
        wf = int(bar_w * p * fill_t)
        color = GREEN_C if winner else (BLUE_C if not dead else hx("#C4CBD6"))
        d.rounded_rectangle([x + 34 + tw + 8, y + 12, x + 34 + tw + 8 + wf, y + 21], 3, fill=color)
        pct = int(round(p * 100 * fill_t))
        d.text((x + w - 8, y + 16), f'{pct}%', font=F_SMALL,
               fill=GREEN_C if winner else (INK_C if not dead else SOFT_C), anchor="rm")
    else:
        d.text((x + w - 8, y + 16), '', font=F_SMALL, fill=SOFT_C, anchor="rm")


def make_jev_frame(f):
    tick = f // 2
    im, d = panel_scaffold("Jev: fills the bubbles")
    prompt_box(d, 68)

    body_y = 148
    d.rounded_rectangle([24, body_y, W - 24, H - 76], 10, fill=BG_C, outline=EDGE_C, width=2)
    d.text((40, body_y + 12), 'answer (the schema is YOURS — two fields, filled in one pass):',
           font=F_SMALL, fill=SOFT_C)

    winner_stamp = tick >= 6
    slots_ready = tick >= 1          # schema skeleton with dashed slots
    pills_ready = tick >= 3          # option pills visible
    fill_t = ease(min(1.0, max(0.0, (tick - 3) / 2)))  # bars/percent count-up pace

    # --- schema strip: two json lines with slot areas ---
    json_x = 44
    y0 = body_y + 40
    line_h = 46

    d.text((json_x, y0), '{', font=F_TXT, fill=INK_C)
    for i, (key, wval, wlab, wp, losers) in enumerate(FIELDS):
        ly = y0 + 8 + i * line_h
        key_txt = f'"{key}": '
        d.text((json_x + 18, ly), key_txt, font=F_TXT, fill=INK_C)
        kx = json_x + 18 + d.textlength(key_txt, font=F_TXT)

        if winner_stamp:
            val_txt = f'"{wval}"'
            d.text((kx, ly), val_txt, font=F_TXT, fill=GREEN_C)
            vx = kx + d.textlength(val_txt, font=F_TXT) + 10
            d.text((vx, ly + 2), f'· {wlab} · {int(round(wp * 100))}%', font=F_SMALL,
                   fill=GREEN_C)
            comma = ',' if i < len(FIELDS) - 1 else ''
            d.text((vx + d.textlength(f'· {wlab} · {int(round(wp * 100))}%', font=F_SMALL) + 8,
                    ly), comma, font=F_TXT, fill=INK_C)
        else:
            slot_w, slot_h = 210, 28
            sy = ly - 2
            d.rounded_rectangle([kx, sy, kx + slot_w, sy + slot_h], 6,
                                fill=BG_C, outline=EDGE_C, width=2)
            if slots_ready:
                draw_slot_placeholder(d, kx + 6, sy, slot_w - 12, slot_h)
            comma = ',' if i < len(FIELDS) - 1 else ''
            d.text((kx + slot_w + 8, ly), comma, font=F_TXT, fill=INK_C)
    d.text((json_x + 2, y0 + 8 + len(FIELDS) * line_h - 8), '}', font=F_TXT, fill=INK_C)

    # --- option pills per slot: one grouped row per field, letters A→B→C in order ---
    pills_y = y0 + 10 + (len(FIELDS) + 1) * line_h + 18
    if pills_ready:
        pw, ph = 200, 34
        gap = 16
        for i, (key, wval, wlab, wp, losers) in enumerate(FIELDS):
            row_y = pills_y + i * (ph + 12 + 18)  # group label + pill row per field
            d.text((40, row_y - 16), f'options for "{key}":', font=F_SMALL, fill=SOFT_C)
            # letters in order; winner marked at stamp time
            opts = [(wlab, wval, wp, False)] + [(l, v, p, True) for l, v, p in losers]
            opts.sort(key=lambda o: o[0])  # A, B, C
            for j, (lab, val, p, dead) in enumerate(opts):
                winner_j = winner_stamp and lab == wlab
                pill(d, 40 + j * (pw + gap), row_y, pw, ph, lab, val, p, fill_t,
                     dead and not winner_j, winner=winner_j)

    # --- counter chip ---
    locked = winner_stamp
    n_tok = str(len(FIELDS)) if locked else '...'  # one token per field
    counter_chip(d, 40, H - 58, 'tokens written:', n_tok, GREEN_C if locked else SOFT_C)
    msg = 'one request per field — in parallel' if locked else (
        'options in — probabilities out' if pills_ready else 'scoring all options...')
    d.text((W - 40, H - 44), msg, font=F_SMALL, fill=GREEN_C if locked else SOFT_C, anchor="ra")
    return im


RGB_WHITE = (255, 255, 255)


def save_gif(frames, path):
    # The drawings only change every 2 source frames, so merge identical
    # neighbors ourselves and carry an explicit per-frame duration. Pillow's
    # optimize pass mangles timings when left to do this itself.
    from PIL import ImageChops

    seq = []  # [image, duration_ms]
    prev = None
    for im in frames:
        if prev is not None and ImageChops.difference(prev, im).getbbox() is None:
            seq[-1][1] += FPS_MS
        else:
            seq.append([im, FPS_MS])
        prev = im

    pal = seq[0][0].convert("P", palette=Image.ADAPTIVE, colors=32)
    out = [(im.quantize(palette=pal, dither=Image.NONE), dur) for im, dur in seq]
    out[0][0].save(
        path, save_all=True,
        append_images=[fr for fr, _ in out[1:]],
        duration=[dur for _, dur in out],
        loop=0)
    print(f'wrote {path}: {len(out)} frames, {sum(d for _, d in out)} ms total')


def main():
    llm_frames = [make_llm_frame(f) for f in range(FRAMES)]
    jev_frames = [make_jev_frame(f) for f in range(FRAMES)]
    save_gif(llm_frames, OUT_LLM)
    save_gif(jev_frames, OUT_JEV)


if __name__ == '__main__':
    main()
```

Verification recipe (programmatic only — gifs can't be visually previewed in this session):

```python
from PIL import Image, ImageChops
import os
for path in ("llm-writes.gif", "jev-picks.gif"):
    im = Image.open(path)
    durs, prev, diffs = [], None, 0
    for i in range(im.n_frames):
        im.seek(i); durs.append(im.info["duration"])
        cur = im.convert("RGB")
        if prev is not None and ImageChops.difference(prev, cur).getbbox() is not None:
            diffs += 1
        prev = cur
    print(f"{path}: {im.n_frames} frames, total {sum(durs)} ms, diffs {diffs}, "
          f"{os.path.getsize(path)/1024:.0f} KB")
# acceptance: totals equal 6000 ms on both (sync), diffs > 0 (animated), < 50 KB
```

Still open (structure ideation): `???` step-4 gap, "pappaya" typo question, §2.1/2.2 placement.

---

## 2026-10-04 — gotcha: `$` pairs in prose get eaten as KaTeX math

Site-wide sweep: the only live breakage was Jev.md's hype line — `raised $40M at a $200M` has
two `$` → @quartz-community/latex (remark-math, `singleDollarTextMath` defaults true) paired them
as inline math: "40M at a" rendered as KaTeX glyphs, "200M valuation…" left plain. Fixed by
escaping both: `\$40M` / `\$200M`. (The `<span style="font-size: 12px">` wrapper was never the
problem — it round-trips fine.)

**Rule for all future posts**: one `$` per line is safe (e.g. `$0.042` in §3); two+ unescaped
`$` on adjacent prose positions become a math pair. Escape every literal dollar in money
mentions (`\$40M`, `\$200M`) — expect this on Post B's cost claims (40–400× cheaper). Do NOT
disable `singleDollarTextMath` site-wide: Linear Regression.md / Loss Functions.md use
intentional inline `$W_1$` math.
