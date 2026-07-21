# Submissions — Worked Example

A **worked sample set** that demonstrates the batch-evaluation workflow end to
end: three fictional teams of varying quality, already scored and compared. Use it
to see what good/medium/weak submissions look like and what the feedback and
comparison outputs should contain.

Real participant work goes in [`../../submissions/`](../../submissions/), not here.

## What's here

| File pattern | What it is | Produced by |
|---|---|---|
| `threat-model-<team>.docx` | A team's filled worksheet | `generate_sample_submissions.py` |
| `threat-model-<team>.md` | Markdown extraction of the `.docx` | `evaluate_submissions.py prepare` |
| `feedback-<team>.md` | Per-team rubric feedback + machine-readable `scores` block | the LLM applying `prompts/evaluation-system-prompt.md` |
| `comparison-summary.md` | Cross-team score matrix + narrative comparison | `evaluate_submissions.py aggregate` (matrix) + LLM (narrative) |
| `_eval-input-<team>.md` | Assembled prompt payload | `evaluate_submissions.py prepare` — git-ignored, regenerable |

The three teams: **team-aegis** (strong), **team-meridian** (medium),
**team-northwind** (weak). Sample results — Aegis 29/30, Meridian 19/30,
Northwind 9/30.

## Regenerating this example

```
# 1. Rewrite the three sample .docx files into this folder
python .claude/skills/threat-model-workshop/scripts/generate_sample_submissions.py

# 2. Extract + assemble evaluation payloads for this folder
python .claude/skills/threat-model-workshop/scripts/evaluate_submissions.py prepare examples/submissions

# 3. (LLM writes feedback-<team>.md for each payload)

# 4. Aggregate the scores into comparison-summary.md
python .claude/skills/threat-model-workshop/scripts/evaluate_submissions.py aggregate examples/submissions
```

`generate_sample_submissions.py` defaults to this folder. The `prepare`/`aggregate`
commands default to `submissions/`, so pass `examples/submissions` explicitly when
regenerating the example.

Scripts live in `.claude/skills/threat-model-workshop/scripts/`.
