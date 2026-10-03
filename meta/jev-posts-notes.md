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
3. `# What's a Jev` (NOT an acronym; attention-based / zero-shot / System 1 broken down term-by-
term, Kahneman) → 4. `# How it works under the hood` (reverse-engineering story, `...` stub —
not written yet) → 5. `# Why the hype isn't just hype` (6 marketing claims as bullets) →
6. `# The good, the bad and Jev` (gotcha slot + arch notes still placeholders) → 7. Summary /
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
