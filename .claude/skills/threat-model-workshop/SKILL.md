---
name: threat-model-workshop
description: >
  Run the medical-device threat-modeling workshop's document workflow. Use when
  the user wants to (1) generate the participant threat-model worksheet as a
  Google-Docs-friendly .docx for teams to fill in, or (2) evaluate completed
  participant threat models (submitted as .docx or Google Docs export) and
  produce structured AI feedback and a cross-team comparison. Triggers: "generate
  the workshop template", "make the participant docx", "evaluate the threat
  models", "score the submissions", "give feedback on the team templates".
---

# Threat Model Workshop — Template & Evaluation

This skill drives the document side of the workshop: it produces the fillable
participant worksheet as a `.docx` that imports cleanly into Google Docs, and it
evaluates the filled worksheets teams hand back.

Two modes. Pick based on what the user asks for.

---

## Mode A — Generate the participant document (.docx)

**Goal:** produce `templates/threat-model-template.docx`, a single
Google-Docs-friendly document that contains everything a team needs in one file,
as three page-break-separated sections that read like tabs:

1. **Introduction** — why threat model medical devices (mirrors
   `workshop/00-introduction.md`).
2. **Product & Architecture** — the NeuroScan 3000 scenario (mirrors
   `scenario/device-overview.md` and `scenario/system-architecture.md`, including
   the ASCII architecture diagram, trust boundaries, data flows, and interfaces).
3. **Threat Model Worksheet** — the fillable Q1–Q4 worksheet (mirrors
   `templates/threat-model-template.md`).

Steps:

1. Ensure `python-docx` is available:
   `pip install --break-system-packages python-docx` (or `pip install python-docx`).
2. Run the generator:
   `python scripts/generate_template_docx.py [optional_output_path]`
   Default output is `templates/threat-model-template.docx` in the repo.
3. Confirm the file opens and share it with the user.

**Why one combined document:** teams get context (why it matters), the product
they're analyzing, and the worksheet to fill in — all in one file, so there's
nothing to cross-reference during the exercise.

**About "tabs":** a `.docx` cannot carry real Google Docs *document tabs* — that
feature is Google-Docs-native and is not created on `.docx` import. The portable
equivalent used here is three **Heading 1 sections separated by page breaks**, so
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
re-run. The three sections are built by `add_intro_section`, `add_product_section`,
and the worksheet code in `main`. If the source markdown in `workshop/` or
`scenario/` changes, update the corresponding builder so the document stays in
sync. Keep it Google-Docs-safe — no content controls, form fields, text boxes, or
macros; only Heading 1/2/3 styles, Normal text, and `Table Grid` tables.

**Facilitator distribution options:**
- One `.docx` per team (rename `threat-model-[team-name].docx`), OR
- One shared Google Drive folder where each team copies the uploaded doc.

---

## Mode B — Evaluate completed submissions

**Goal:** for each team's filled worksheet, produce structured feedback using the
rubric in `prompts/evaluation-system-prompt.md`, then a cross-team comparison.

Inputs a team may hand back:
- A `.docx` exported from Google Docs, or
- A PDF export, or
- The markdown `threat-model-[team-name].md`.

Steps per submission:

1. **Get the text.** For `.docx`, run:
   `python scripts/extract_submission.py <submission.docx> submission-[team].md`
   This preserves headings and tables as markdown. For PDF, use the `pdf` skill to
   extract text; for `.md`, read it directly.
2. **Load the context.** Read `scenario/device-overview.md` and
   `scenario/system-architecture.md` so the evaluation is grounded in the actual
   system.
3. **Apply the rubric.** Use the system prompt in
   `prompts/evaluation-system-prompt.md` verbatim as the evaluation instruction.
   Evaluate the six dimensions (scope, threat coverage, threat quality, risk
   assessment, mitigation quality, regulatory & medical awareness), each 1–5.
4. **Write feedback** to `submissions/feedback-[team-name].md` in the output
   format the prompt defines (overall score, dimension table, strengths, gaps &
   missed threats, improvement suggestions, notable observations). Be specific and
   reference the team's actual content; frame it to help them learn, not to grade.

**FDA-awareness scoring note.** When scoring dimension 6 (regulatory & medical
awareness), reward teams that: treat security risk as exploitability-based rather
than probabilistic; apply the patient-safety override; note residual risk and
regulatory impact of mitigations; and show the model is meant to be maintained
across the lifecycle. These map to the FDA premarket guidance (see
`references/fda-cybersecurity-risk-assessment-research.md` and
`workshop/fda-supportive-notes.md`).

### Cross-team comparison

After evaluating all teams, produce a comparison:
1. Build a table of team names and their six dimension scores + total.
2. Use the batch prompt at the end of `prompts/evaluation-system-prompt.md` to
   write a 2–3 paragraph summary: what most teams got right, what most teams
   missed, and the biggest gap between the highest and lowest scoring teams.
3. Save as `submissions/comparison-summary.md`.

---

## Files in this skill

- `scripts/generate_template_docx.py` — builds the combined `.docx` (Introduction
  + Product & Architecture + fillable worksheet) as page-break sections.
- `scripts/extract_submission.py` — converts a filled `.docx` back to markdown
  (headings + tables) for evaluation.

## Related repo files (not part of this skill, but used by it)

- `templates/threat-model-template.md` — the canonical worksheet content (mirrored
  into section 3 of the generated `.docx`).
- `workshop/00-introduction.md` — source for section 1 (Introduction).
- `scenario/device-overview.md`, `scenario/system-architecture.md` — source for
  section 2 (Product & Architecture).
- `prompts/evaluation-system-prompt.md` — the evaluation rubric and output format.
- `prompts/threat-model-system-prompt.md` — for generating a reference model.
- `submissions/` — where filled worksheets and generated feedback live.

## Notes

- `submissions/` may be git-ignored or committed depending on how the facilitator
  wants to handle participant work; the skill does not assume either.
- Nothing here requires a network connector. The Google Docs step is a manual
  upload/download by participants, which keeps the workshop robust to conference
  Wi-Fi and account restrictions.
