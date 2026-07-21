# Cross-Team Comparison — NeuroScan 3000 Threat Models

Three teams threat-modelled the same NeuroScan 3000 system. This report compares
them across the six rubric dimensions and draws out what most teams got right,
what most teams missed, and what separated the strongest from the weakest.

## Score matrix

<!-- SCORE-MATRIX:START -->

| Team | Scope | Threat coverage | Threat quality | Risk assessment | Mitigation quality | Regulatory awareness | Total /30 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Team Aegis | 5 | 5 | 5 | 5 | 4 | 5 | 29 |
| Team Meridian | 3 | 4 | 3 | 3 | 3 | 3 | 19 |
| Team Northwind | 2 | 2 | 1 | 1 | 2 | 1 | 9 |
| **Average** | 3.3 | 3.7 | 3.0 | 3.0 | 3.0 | 3.0 | 19.0 |

<!-- SCORE-MATRIX:END -->

## Comparative summary

**What most teams got right.** Every team correctly identified the headline risks
that the scenario telegraphs: ransomware/availability loss on the internet-connected
workstation, credential compromise of the no-MFA admin console, and theft of patient
data. All three also produced a prioritised top-3, showing the instinct to rank rather
than just enumerate. The two stronger teams (Aegis, Meridian) both scored on
exploitability rather than probability and recognised that tampering with a diagnosis
is a worse outcome than merely stealing data — the core medical-device insight the
workshop is built around.

**What most teams missed.** Coverage of the highest-consequence, less-obvious threats
thinned out quickly below the top team. Two of three teams left the **imaging unit
firmware and the malicious-update path** out of scope or absent entirely, despite it
being the most severe threat on the system (persistent control, scan manipulation).
**Supply-chain / SBOM** threats were missing from every submission, even though §524B
makes the SBOM a statutory requirement. **Anonymisation failure** (burned-in PHI in
DICOM pixel data) and **repudiation / audit-log tampering** were each caught only by
the strongest team. The clearest cross-cutting weakness is in the lower band:
mitigations default to category labels ("add encryption", "install antivirus") instead
of naming the mechanism, location, and residual risk.

**Biggest gap — highest vs. lowest.** The 20-point spread between Team Aegis (29/30)
and Team Northwind (9/30) comes down to *method*, and it shows up most sharply in
**risk-assessment accuracy (5 vs. 1)** and **threat quality (5 vs. 1)**. Aegis scored
security risk the way the FDA requires — exploitability × severity with an explicit
patient-safety override, so low-exploitability but high-harm threats (malicious
firmware, AI model poisoning) were still escalated to High. Northwind scored
probabilistically ("hackers are common", "viruses are everywhere"), which the FDA
premarket guidance explicitly rejects for security risk, and left the patient-safety
column blank throughout — so the model never surfaced patient harm as the dominant
lens. Team Meridian sits in between: sound exploitability-based scoring and good
breadth, held back by an inconsistently applied safety override (integrity-of-image
and AI-availability threats under-rated) and category-level mitigations. The
progression across the three teams is essentially the workshop's own learning curve:
from a generic IT checklist, to a competent threat model, to one that treats security
risk as an exploitability-driven, patient-safety-first, lifecycle-maintained artifact
in line with the FDA guidance.

## Facilitator debrief prompts

- Show the S-05/S-06 handling from Team Aegis as the worked example of the
  patient-safety override: low exploitability, still High. Contrast with Meridian's
  under-rated S-02/S-07.
- Use Northwind's risk column to teach the probability-vs-exploitability distinction
  directly — rewrite one of their rationales live.
- Note the shared blind spot (SBOM / supply chain) to every team, and tie it to the
  §524B statutory requirement.

