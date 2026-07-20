#!/usr/bin/env python3
"""
Batch-evaluation driver for participant threat-model submissions.

This script does the deterministic plumbing around evaluation; the scoring
judgement itself is done by an LLM applying the rubric in
prompts/evaluation-system-prompt.md (grounded in
references/fda-cybersecurity-risk-assessment-research.md). See SKILL.md, Mode B.

Two subcommands:

  prepare
    Discover every submission in submissions/ (.docx or .md), convert any .docx
    to markdown via extract_submission.py, and for each team write an assembled
    prompt payload to submissions/_eval-input-<slug>.md. Each payload contains,
    in order: the evaluation system prompt, the scenario (device overview +
    architecture), and the team's submission. The LLM reads one payload, applies
    the rubric, and writes submissions/feedback-<slug>.md — including a machine
    readable scores block (see FEEDBACK TEMPLATE below).

  aggregate
    Parse the scores block from every submissions/feedback-<slug>.md, build the
    cross-team score matrix, and write it into submissions/comparison-summary.md
    (between the SCORE-MATRIX markers). The LLM then writes the narrative summary
    around that matrix.

The split is deliberate: Python guarantees the payloads and the score maths are
consistent and repeatable; the LLM does the qualitative assessment.

Usage:
    python evaluate_submissions.py prepare   [submissions_dir] [repo_root]
    python evaluate_submissions.py aggregate [submissions_dir]

FEEDBACK TEMPLATE (what the LLM writes per team, so aggregate can parse it):

    # Feedback — <Team name>
    ... narrative sections from the rubric output format ...

    ```scores
    scope: 5
    threat_coverage: 5
    threat_quality: 5
    risk_assessment: 5
    mitigation_quality: 4
    regulatory_awareness: 5
    total: 29
    ```

The six keys map to the six rubric dimensions (each 1-5); total is out of 30.
"""

import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT_DEFAULT = SCRIPT_DIR.parents[3]  # .../threat-modeling-workshop

DIMENSIONS = [
    ("scope", "Scope"),
    ("threat_coverage", "Threat coverage"),
    ("threat_quality", "Threat quality"),
    ("risk_assessment", "Risk assessment"),
    ("mitigation_quality", "Mitigation quality"),
    ("regulatory_awareness", "Regulatory awareness"),
]

MATRIX_START = "<!-- SCORE-MATRIX:START -->"
MATRIX_END = "<!-- SCORE-MATRIX:END -->"


def slug_from_submission(path):
    """threat-model-team-aegis.docx -> team-aegis ; also handles plain names."""
    stem = path.stem
    return stem[len("threat-model-"):] if stem.startswith("threat-model-") else stem


def team_name_from_md(md_path):
    """Pull the 'Team name: X' line if present, else derive from the slug."""
    try:
        text = md_path.read_text(encoding="utf-8")
    except OSError:
        text = ""
    m = re.search(r"Team name:\s*(.+?)(?:\s{2,}|Date:|\n)", text)
    if m:
        return m.group(1).strip()
    return slug_from_submission(md_path).replace("-", " ").title()


def extract_system_prompt(eval_prompt_md):
    """Return the fenced system prompt block from evaluation-system-prompt.md."""
    text = eval_prompt_md.read_text(encoding="utf-8")
    blocks = re.findall(r"```(.*?)```", text, flags=re.DOTALL)
    for b in blocks:
        if "evaluation rubric" in b.lower() or "cybersecurity assessor" in b.lower():
            return b.strip("\n")
    # Fallback: first fenced block.
    return blocks[0].strip("\n") if blocks else text


def cmd_prepare(submissions_dir, repo_root):
    submissions_dir.mkdir(parents=True, exist_ok=True)
    system_prompt = extract_system_prompt(
        repo_root / "prompts" / "evaluation-system-prompt.md")
    overview = (repo_root / "scenario" / "device-overview.md").read_text(encoding="utf-8")
    architecture = (repo_root / "scenario" / "system-architecture.md").read_text(encoding="utf-8")

    # Discover submissions: prefer .docx, fall back to .md that aren't ours.
    docx_files = sorted(submissions_dir.glob("threat-model-*.docx"))
    md_files = sorted(
        p for p in submissions_dir.glob("threat-model-*.md")
        if not p.name.startswith("_")
    )

    prepared = []
    seen = set()

    for docx in docx_files:
        slug = slug_from_submission(docx)
        md_path = submissions_dir / f"threat-model-{slug}.md"
        subprocess.run(
            [sys.executable, str(SCRIPT_DIR / "extract_submission.py"),
             str(docx), str(md_path)],
            check=True, capture_output=True)
        prepared.append((slug, md_path))
        seen.add(slug)

    for md in md_files:
        slug = slug_from_submission(md)
        if slug not in seen:
            prepared.append((slug, md))
            seen.add(slug)

    if not prepared:
        print(f"No submissions found in {submissions_dir} "
              f"(expected threat-model-*.docx or threat-model-*.md).")
        return

    for slug, md_path in prepared:
        submission = md_path.read_text(encoding="utf-8")
        payload = (
            f"{system_prompt}\n\n"
            f"====================================================================\n"
            f"USER MESSAGE — evaluate the following submission.\n"
            f"====================================================================\n\n"
            f"# SYSTEM DESCRIPTION\n\n"
            f"## Device overview\n\n{overview}\n\n"
            f"## System architecture\n\n{architecture}\n\n"
            f"====================================================================\n"
            f"# PARTICIPANT SUBMISSION\n\n{submission}\n"
        )
        out = submissions_dir / f"_eval-input-{slug}.md"
        out.write_text(payload, encoding="utf-8")
        print(f"Prepared {out}  (team: {team_name_from_md(md_path)})")

    print(f"\n{len(prepared)} submission(s) prepared. Next: the LLM evaluates each "
          f"_eval-input-*.md and writes submissions/feedback-<slug>.md, then run "
          f"`evaluate_submissions.py aggregate`.")


def parse_scores(feedback_path):
    text = feedback_path.read_text(encoding="utf-8")
    m = re.search(r"```scores\s*(.*?)```", text, flags=re.DOTALL)
    if not m:
        return None
    scores = {}
    for line in m.group(1).strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip()
            try:
                scores[k] = int(v)
            except ValueError:
                pass
    return scores


def cmd_aggregate(submissions_dir):
    feedbacks = sorted(submissions_dir.glob("feedback-*.md"))
    if not feedbacks:
        print(f"No feedback-*.md files in {submissions_dir}. Run the per-team "
              f"evaluation first.")
        return

    rows = []
    for fb in feedbacks:
        slug = fb.stem[len("feedback-"):]
        scores = parse_scores(fb)
        if not scores:
            print(f"WARNING: no ```scores block in {fb.name}; skipping.")
            continue
        md_path = submissions_dir / f"threat-model-{slug}.md"
        name = team_name_from_md(md_path) if md_path.exists() else slug.replace("-", " ").title()
        total = scores.get("total") or sum(scores.get(k, 0) for k, _ in DIMENSIONS)
        rows.append((name, scores, total))

    if not rows:
        print("No parseable scores found; nothing to aggregate.")
        return

    rows.sort(key=lambda r: r[2], reverse=True)

    header = "| Team | " + " | ".join(label for _, label in DIMENSIONS) + " | Total /30 |"
    sep = "| --- | " + " | ".join("---" for _ in DIMENSIONS) + " | --- |"
    body = []
    for name, scores, total in rows:
        cells = " | ".join(str(scores.get(k, "-")) for k, _ in DIMENSIONS)
        body.append(f"| {name} | {cells} | {total} |")

    # Per-dimension averages help the narrative call out common weak spots.
    n = len(rows)
    avgs = []
    for k, _ in DIMENSIONS:
        vals = [s.get(k) for _, s, _ in rows if isinstance(s.get(k), int)]
        avgs.append(round(sum(vals) / len(vals), 1) if vals else "-")
    avg_total = round(sum(t for _, _, t in rows) / n, 1)
    avg_row = "| **Average** | " + " | ".join(str(a) for a in avgs) + f" | {avg_total} |"

    matrix = "\n".join([header, sep] + body + [avg_row])

    comparison = submissions_dir / "comparison-summary.md"
    existing = comparison.read_text(encoding="utf-8") if comparison.exists() else ""

    block = f"{MATRIX_START}\n\n{matrix}\n\n{MATRIX_END}"
    if MATRIX_START in existing and MATRIX_END in existing:
        new = re.sub(
            re.escape(MATRIX_START) + r".*?" + re.escape(MATRIX_END),
            block, existing, flags=re.DOTALL)
    else:
        new = (existing.rstrip() + "\n\n" if existing else
               "# Cross-Team Comparison — NeuroScan 3000 Threat Models\n\n"
               "## Score matrix\n\n") + block + "\n"
    comparison.write_text(new, encoding="utf-8")

    print(f"Wrote score matrix ({n} team(s)) into {comparison}")
    print("\n" + matrix)
    print(f"\nHighest: {rows[0][0]} ({rows[0][2]}/30) · "
          f"Lowest: {rows[-1][0]} ({rows[-1][2]}/30)")
    print("Next: the LLM writes the narrative comparison around the matrix.")


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in {"prepare", "aggregate"}:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    submissions_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else (
        REPO_ROOT_DEFAULT / "submissions")
    if cmd == "prepare":
        repo_root = Path(sys.argv[3]) if len(sys.argv) > 3 else REPO_ROOT_DEFAULT
        cmd_prepare(submissions_dir, repo_root)
    else:
        cmd_aggregate(submissions_dir)


if __name__ == "__main__":
    main()
