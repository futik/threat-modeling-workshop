# 03 — Step 3: Risk Assessment

## Goal

Not all threats are equal. Risk assessment helps you prioritize which threats to mitigate first by estimating **likelihood** and **impact**.

In a medical device context, impact has an extra dimension: **patient safety**. A threat that is technically low-severity but could harm a patient must be weighted accordingly.

---

## Risk scoring model

Use a simple 3×3 risk matrix. Score each threat on two axes:

### Likelihood

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Low | Requires significant skill, rare opportunity, or physical access |
| 2 | Medium | Exploitable remotely with moderate skill; known vulnerability class |
| 3 | High | Easy to exploit, widely known technique, or already exploited in the wild |

### Impact

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Low | Minor inconvenience; no patient harm; quickly recoverable |
| 2 | Medium | Significant disruption; possible data breach; delayed care |
| 3 | High | Direct patient harm possible; serious data breach; device unavailable for hours+ |

### Risk score = Likelihood × Impact

| Score | Risk level | Priority |
|-------|-----------|---------|
| 1–2 | Low | Accept or monitor |
| 3–4 | Medium | Mitigate in next release |
| 6–9 | High | Mitigate immediately / must-fix |

---

## Patient safety adjustment

After scoring, apply a **safety override**: if a threat can plausibly lead to direct patient harm (wrong diagnosis acted upon, device delivers incorrect therapy, scan unavailable during emergency), **escalate the risk level to High** regardless of the matrix score.

Document your reasoning when you apply a safety override.

---

## How to do the assessment

For each threat in your list from Step 2:

1. Score likelihood (1–3) with a brief rationale
2. Score impact (1–3) with a brief rationale
3. Calculate risk score (L × I)
4. Apply patient safety adjustment if applicable
5. Assign priority (Low / Medium / High)

---

## Example

| # | Threat | Likelihood | Impact | Score | Safety override | Priority |
|---|--------|-----------|--------|-------|----------------|---------|
| T-04 | Attacker modifies AI annotations via compromised cloud account | 2 | 3 | 6 | Yes — misdiagnosis could harm patient | **High** |
| T-07 | DoS on cloud AI service via API flooding | 2 | 2 | 4 | No — fallback to radiologist unaided review | **Medium** |
| T-11 | Re-identification of "anonymized" images in cloud storage | 1 | 3 | 3 | No | **Medium** |

---

## Template section to fill in

Open [`../templates/threat-model-template.md`](../templates/threat-model-template.md) and complete **Section 3: Risk Assessment**.

Score all threats from Step 2. You do not need to mitigate Low-priority threats in this workshop, but document them.

---

## Discussion questions

1. Two threats have the same score. One affects patient safety, the other affects data privacy. How do you prioritize between them?
2. The imaging unit firmware hasn't been patched in 18 months. How does this affect your likelihood scores?
3. Are there threats that are High impact but you'd accept rather than mitigate? Why?
