# Submissions

Drop **real participant submissions** here after the workshop, then run the
batch-evaluation workflow over them.

Looking for a worked example? See [`../submissions-example/`](../submissions-example/),
which contains three fictional teams already evaluated end to end.

## How teams submit

Each team exports their filled worksheet from Google Docs and drops it here as:

```
submissions/threat-model-<team>.docx
```

(A `.md` export or a PDF converted to `threat-model-<team>.md` also works.)

## Evaluating (see the `threat-model-workshop` skill, Mode B)

```
# 1. Extract each .docx and assemble per-team evaluation payloads
python .claude/skills/threat-model-workshop/scripts/evaluate_submissions.py prepare

# 2. The LLM reads each submissions/_eval-input-<team>.md, applies the rubric,
#    and writes submissions/feedback-<team>.md (with a machine-readable scores block)

# 3. Aggregate the scores into the cross-team comparison
python .claude/skills/threat-model-workshop/scripts/evaluate_submissions.py aggregate
```

`prepare` and `aggregate` default to this `submissions/` folder. To evaluate a
different folder (e.g. the example set), pass it as an argument:

```
python .claude/skills/threat-model-workshop/scripts/evaluate_submissions.py prepare submissions-example
python .claude/skills/threat-model-workshop/scripts/evaluate_submissions.py aggregate submissions-example
```

## What ends up here

| File pattern | What it is |
|---|---|
| `threat-model-<team>.docx` | A team's uploaded worksheet |
| `threat-model-<team>.md` | Markdown extraction (produced by `prepare`) |
| `feedback-<team>.md` | Per-team rubric feedback + `scores` block (written by the LLM) |
| `comparison-summary.md` | Cross-team score matrix + narrative (matrix by `aggregate`, narrative by the LLM) |
| `_eval-input-<team>.md` | Assembled prompt payload — git-ignored, regenerable |

Real team files other than this README are git-ignored by default so participant
work isn't committed unless you choose to. Adjust `.gitignore` if you want to keep
them.
