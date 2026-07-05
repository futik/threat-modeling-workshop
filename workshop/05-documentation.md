# 05 — Step 5: Documentation & Review

## Goal

A threat model only has value if it is communicated clearly and kept up to date. This step covers finalizing your template, reviewing as a group, and understanding how threat models are maintained in practice.

---

## What a complete threat model document contains

| Section | What it answers |
|---------|----------------|
| **System overview** | What is the device? What does it do? Who uses it? |
| **Scope** | What's in and out? What are the trust boundaries? |
| **Assets** | What are we protecting and why? |
| **Threat actors** | Who might attack this and with what motivation? |
| **Threats** | What can go wrong? (structured threat statements) |
| **Risk assessment** | How likely and how bad is each threat? |
| **Mitigations** | What are we doing about each threat? |
| **Residual risk** | What risk remains after mitigations? |
| **Review history** | When was this reviewed and what changed? |

---

## Finalize your template

Before submitting, review your completed template against this checklist:

- [ ] Every threat has a unique ID (T-01, T-02, ...)
- [ ] Every threat has a structured threat statement (actor → action → asset → impact)
- [ ] Every threat has a likelihood, impact, and risk score
- [ ] Patient safety overrides are noted with rationale
- [ ] Every High-risk threat has at least one mitigation
- [ ] Every Medium-risk threat has a mitigation or acceptance rationale
- [ ] Every mitigation references at least one threat ID
- [ ] Residual risk is noted for each mitigation

---

## Group review

Each group will briefly present their threat model. Focus on:
1. The **three highest-risk threats** you identified and why
2. The **most interesting or surprising** threat you found
3. The **hardest mitigation decision** you faced

Other groups should ask: "Did you consider X?" — the goal is to find gaps, not to compete.

---

## How threat models are maintained in practice

A threat model is a **living document**. In a real product lifecycle:

- **Re-trigger threat modeling** when: new features added, new interfaces introduced, new deployment environment, a related vulnerability is disclosed, or after a security incident
- **Link to the SBOM**: track third-party components and their CVEs
- **Store in version control** (like this repo!) — diff-based review makes changes visible
- **FDA expectation**: the threat model should be updated with each design change and submitted with premarket notifications

---

## AI-assisted evaluation

After the workshop, your completed template will be evaluated by an AI model using the system prompt in [`../prompts/evaluation-system-prompt.md`](../prompts/evaluation-system-prompt.md).

The AI evaluator will assess:
- Completeness of threat coverage
- Quality of risk scoring
- Appropriateness of mitigations
- Regulatory awareness

You will receive written feedback. Use it to improve your threat model — or as a discussion point for what AI-assisted threat modeling can and cannot do.

---

## Submission

Submit your completed `threat-model-template.md` as instructed by the facilitator (e.g., email, shared folder, or pull request to this repo).

Name your file: `threat-model-[team-name].md`
