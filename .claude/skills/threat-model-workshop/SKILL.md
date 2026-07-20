---
name: threat-model-workshop
description: >
  Run the medical-device threat-modeling workshop's document workflow. Use when
  the user wants to (1) generate the participant threat-model worksheet as a
  Google-Docs-friendly .docx for teams to fill in, or (2) batch-evaluate completed
  participant threat models (submitted as .docx or Google Docs export) — iterating
  over every team in submissions/, scoring each against the rubric and FDA
  research, and producing per-team feedback plus a cross-team comparison report.
  Triggers: "generate the workshop template", "make the participant docx",
  "evaluate the threat models", "score the submissions", "give feedback on the
  team templates", "compare the teams".
---

# Threat Model Workshop — Template & Evaluation

This skill drives the document side of the workshop: it produces the fillable
participant worksheet as a `.docx` that imports cleanly into Google Docs, and it
evaluates the filled worksheets teams hand back.

Two modes. Pick based on what the user asks for.

---

## Mode A — Generate the participant document (.docx)

**Goal:** produce `templates/threat-model-template.docx`, a single
Google-Docs-friendly document that contains what a team needs during the
exercise, as two page-break-separated sections that read like tabs:

1. **Product & Architecture** — the NeuroScan 3000 scenario (mirrors
   `scenario/device-overview.md` and `scenario/system-architecture.md`, including
   the architecture diagram, trust boundaries, data flows, and interfaces).
2. **Threat Model Worksheet** — the fillable Q1–Q4 worksheet (mirrors
   `templates/threat-model-template.md`).

The workshop **introduction** (`workshop/00-introduction.md`) is intentionally
NOT in the generated `.docx`. It stays in the repo and the facilitator shares it
separately, so the participant document stays focused on the product and the
worksheet they fill in.

Steps:

1. Ensure dependencies are available:
   `pip install --break-system-packages python-docx matplotlib`
   (matplotlib is used to render the architecture diagram image).
2. Run the generator:
   `python scripts/generate_template_docx.py [optional_output_path]`
   Default output is `templates/threat-model-template.docx` in the repo.
3. Confirm the file opens and share it with the user.

**Architecture diagram:** the diagram is rendered as a **PNG image** (via
matplotlib, `render_architecture_png`) and embedded with `doc.add_picture`. It is
NOT drawn with ASCII box characters — ASCII art depends on a monospaced font and
exact column alignment, which breaks when Google Docs reflows the text on import.
An embedded image renders identically in Word and Google Docs. To change the
diagram, edit `render_architecture_png` (boxes, arrows, zones) and re-run.

**About "tabs":** a `.docx` cannot carry real Google Docs *document tabs* — that
feature is Google-Docs-native and is not created on `.docx` import. The portable
equivalent used here is two **Heading 1 sections separated by a page break**, so
the document has a clean outline (View → Show outline in Google Docs) and each
section starts on its own page. If a facilitator wants literal Google Docs tabs,
after uploading they can, in Google Docs: open the tabs/outline panel, add a tab
per section, and move each Heading 1 section into its own tab. This is a manual,
one-time step and is optional — the document is fully usable as-is.

**Why .docx (not a live Google Doc):** the round-trip is deliberate and needs no
connector. Participants do: **File → Open → Upload** in Google Docs, fill in as a
group, then **File → Download → Microsoft Word (.docx)** (or PDF) to submit. The
generator only uses built-in heading styles and simple tables so the outline and
tables survive the import/export both ways.

**If the user wants the document changed** (add a column, change scoring labels,
add a section, update the scenario): edit `scripts/generate_template_docx.py` and
re-run. The two sections are built by `add_product_section` (with the diagram from
`render_architecture_png`) and the worksheet code in `main`. If the source
markdown in `scenario/` changes, update `add_product_section` so the document
stays in sync. Keep it Google-Docs-safe — no content controls, form fields, text
boxes, or macros; only Heading 1/2/3 styles, Normal text, `Table Grid` tables, and
embedded images for diagrams.

**Facilitator distribution options:**
- One `.docx` per team (rename `threat-model-[team-name].docx`), OR
- One shared Google Drive folder where each team copies the uploaded doc.

---

## Mode B — Batch-evaluate submissions and compare teams

**Goal:** iterate over every team's filled worksheet in `submissions/`, produce
per-team feedback using the rubric in `prompts/evaluation-system-prompt.md`
(grounded in the FDA research), then a cross-team comparison. Teams drop their
files in `submissions/`; this workflow does the rest.

Two folders:
- `submissions/` — **real participant work**. Git-ignored by default (only its
  README is committed) so team submissions aren't published unless you choose to.
  The `prepare`/`aggregate` commands default here.
- `submissions-example/` — a **committed worked example** (three fictional teams,
  already evaluated). Pass it explicitly as the folder argument to work on it.

Inputs a team may hand back (all go in `submissions/`, named
`threat-model-<team>.docx` or `.md`):
- A `.docx` exported from Google Docs (most common), or
- A PDF export (convert to text first with the `pdf` skill, save as
  `threat-model-<team>.md`), or
- The markdown worksheet directly.

The split between deterministic plumbing (Python) and judgement (the LLM):
`evaluate_submissions.py` handles discovery, `.docx`→markdown extraction, prompt
assembly, and score maths so those are consistent and repeatable. The LLM does
the qualitative scoring and writes the prose.

### Step 1 — prepare the payloads

```
python scripts/evaluate_submissions.py prepare
```

This discovers every `threat-model-*` submission, runs `extract_submission.py` on
each `.docx`, and writes one assembled payload per team to
`submissions/_eval-input-<team>.md`. Each payload contains, in order: the
evaluation system prompt, the scenario (device overview + architecture), and that
team's submission. (`_eval-input-*.md` files are git-ignored — they are
regenerable intermediates.)

### Step 2 — evaluate each team (LLM)

For each `submissions/_eval-input-<team>.md`, apply the rubric and write
`submissions/feedback-<team>.md`. Use the output format from
`prompts/evaluation-system-prompt.md` (overall score, dimension table, strengths,
gaps & missed threats, improvement suggestions, notable observations), and **end
the file with a machine-readable scores block** so Step 3 can aggregate it:

````
```scores
scope: 5
threat_coverage: 5
threat_quality: 5
risk_assessment: 5
mitigation_quality: 4
regulatory_awareness: 5
total: 29
```
````

The six keys are the six rubric dimensions (each 1–5); `total` is out of 30. Be
specific and reference the team's actual content; frame it to help them learn, not
to grade.

**FDA-awareness scoring note.** When scoring dimension 6 (regulatory & medical
awareness), reward teams that: treat security risk as exploitability-based rather
than probabilistic; apply the patient-safety override; note residual risk and
regulatory impact of mitigations; and show the model is meant to be maintained
across the lifecycle. These map to the FDA premarket guidance (see
`references/fda-cybersecurity-risk-assessment-research.md` and
`workshop/fda-supportive-notes.md`).

### Step 3 — aggregate and compare

```
python scripts/evaluate_submissions.py aggregate
```

This parses the `scores` block from every `feedback-<team>.md`, builds the
cross-team score matrix (ranked, with per-dimension averages), and writes it into
`submissions/comparison-summary.md` between the `SCORE-MATRIX` markers. Re-running
is idempotent — it updates the matrix in place without disturbing the narrative.

Then (LLM) write the narrative comparison around the matrix: what most teams got
right, what most teams missed, and the biggest gap between the highest and lowest
scoring teams. Use the batch prompt at the end of
`prompts/evaluation-system-prompt.md` as a guide.

### The worked example (`submissions-example/`)

`submissions-example/` holds a committed, fully-evaluated sample set — three
fictional teams (`team-aegis` strong, `team-meridian` medium, `team-northwind`
weak) with their feedback and comparison. Use it as a reference for what the
outputs should look like, or to exercise the pipeline without real data.

`scripts/generate_sample_submissions.py` (re)writes those three `.docx` files; it
defaults to `submissions-example/`. To evaluate that folder rather than the real
`submissions/`, pass it explicitly:

```
python scripts/generate_sample_submissions.py                       # -> submissions-example/
python scripts/evaluate_submissions.py prepare submissions-example
python scripts/evaluate_submissions.py aggregate submissions-example
```

See `submissions-example/README.md`. Real participant work goes in `submissions/`
and is git-ignored by default.

---

## Files in this skill

- `scripts/generate_template_docx.py` — builds the combined `.docx` (Product &
  Architecture + fillable worksheet) as page-break sections, with the architecture
  diagram rendered as an embedded PNG.
- `scripts/extract_submission.py` — converts a filled `.docx` back to markdown
  (headings + tables) for evaluation.
- `scripts/generate_sample_submissions.py` — writes sample filled worksheets for
  three teams of varying quality into `submissions-example/` (the worked example).
- `scripts/evaluate_submissions.py` — batch driver: `prepare` assembles per-team
  evaluation payloads; `aggregate` parses the `scores` blocks and builds the
  cross-team score matrix in `comparison-summary.md`.

## Related repo files (not part of this skill, but used by it)

- `templates/threat-model-template.md` — the canonical worksheet content (mirrored
  into the worksheet section of the generated `.docx`).
- `workshop/00-introduction.md` — the workshop introduction. Shared from the repo
  by the facilitator; intentionally NOT embedded in the generated `.docx`.
- `scenario/device-overview.md`, `scenario/system-architecture.md` — source for
  the Product & Architecture section.
- `prompts/evaluation-system-prompt.md` — the evaluation rubric and output format.
- `prompts/threat-model-system-prompt.md` — for generating a reference model.
- `references/fda-cybersecurity-risk-assessment-research.md` — FDA premarket
  guidance notes; grounds dimension-6 scoring.
- `submissions/` — real participant worksheets, feedback, and comparison (git-
  ignored by default); see `submissions/README.md`.
- `submissions-example/` — the committed worked example (three fictional teams,
  evaluated); see `submissions-example/README.md`.

## Notes

- The batch workflow keeps deterministic work in Python (`evaluate_submissions.py`)
  and judgement in the LLM, so payloads and score maths are repeatable while the
  assessment stays qualitative.
- The worked example in `submissions-example/` is committed; real participant
  work in `submissions/` is git-ignored by default (only its README is tracked)
  and can be committed per the facilitator's preference. `_eval-input-*.md`
  intermediates are git-ignored in both folders.
- Requirements: `python-docx` (all scripts) and `matplotlib`
  (`generate_template_docx.py` only, for the diagram).
- Nothing here requires a network connector. The Google Docs step is a manual
  upload/download by participants, which keeps the workshop robust to conference
  Wi-Fi and account restrictions.
