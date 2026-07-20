# Submissions

Where participant threat-model worksheets are collected and evaluated after the
workshop. The files here are a **worked sample set** (three fictional teams of
varying quality) that demonstrate the batch-evaluation workflow end to end.

## What's here

| File pattern | What it is | Produced by |
|---|---|---|
| `threat-model-<team>.docx` | A team's filled worksheet (what a team uploads) | teams — or `generate_sample_submissions.py` for the samples |
| `threat-model-<team>.md` | Markdown extraction of the `.docx` (for evaluation) | `extract_submission.py` (called by `evaluate_submissions.py prepare`) |
| `feedback-<team>.md` | Per-team rubric feedback + machine-readable `scores` block | the LLM applying `prompts/evaluation-system-prompt.md` |
| `comparison-summary.md` | Cross-team score matrix + narrative comparison | `evaluate_submissions.py aggregate` (matrix) + LLM (narrative) |
| `_eval-input-<team>.md` | Assembled prompt payload (system prompt + scenario + submission) | `evaluate_submissions.py prepare` — git-ignored, regenerable |

## Workflow (see the `threat-model-workshop` skill, Mode B)

1. Teams drop their exported `threat-model-<team>.docx` files in this folder.
2. `python scripts/evaluate_submissions.py prepare` — extracts each `.docx` to
   markdown and writes an `_eval-input-<team>.md` payload per team.
3. The LLM reads each payload, applies the rubric (grounded in the FDA research),
   and writes `feedback-<team>.md` including a ```scores``` block.
4. `python scripts/evaluate_submissions.py aggregate` — parses the score blocks
   and writes the cross-team matrix into `comparison-summary.md`; the LLM adds the
   narrative comparison around it.

## Regenerating the sample set

```
python scripts/generate_sample_submissions.py   # rewrites the three sample .docx files
python scripts/evaluate_submissions.py prepare
# (LLM writes feedback-*.md)
python scripts/evaluate_submissions.py aggregate
```

Scripts live in `.claude/skills/threat-model-workshop/scripts/`.
