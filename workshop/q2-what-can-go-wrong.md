# Q2 — What can go wrong?

## Part A: Attacker Stories

### Who are your bad actors?

Pick from this list — or invent your own:

| Bad actor | Motivation | Likely access |
|-----------|-----------|--------------|
| **Ransomware group** | Financial — encrypt systems, demand payment | Internet, hospital phishing |
| **Disgruntled employee** | Sabotage or revenge | Direct LAN access, insider knowledge |
| **Nation-state actor** | Healthcare disruption, intelligence gathering | Supply chain, internet |
| **Opportunistic hacker** | Curiosity, reputation, opportunistic data theft | Internet, hospital Wi-Fi |
| **Rogue vendor technician** | Access beyond their role, financial gain | Remote support channel |

---

### Prompts to get started

Use these to spark ideas. Apply each prompt to the NeuroScan 3000:

- "What if someone intercepted the scan images in transit?"
- "What if someone changed the AI diagnostic results before the radiologist saw them?"
- "What if someone locked the device so it couldn't perform scans?"
- "What if someone used the remote support channel to get into the system?"
- "What if someone pushed a malicious software update?"
- "What if someone got into the admin console?"
- "What if the anonymisation of images didn't actually work?"
- "What if someone on the hospital network could read images they shouldn't?"

---

### Attacker story format

Write each story as:

> **As a** [bad actor], **I want to** [do something bad] **via** [method or entry point], **so that** [I achieve my goal].

**Example:**
> As a ransomware group, I want to encrypt the acquisition workstation via a phishing email to a hospital employee, so that the hospital cannot perform scans and is forced to pay a ransom.

**Another example:**
> As a rogue vendor technician, I want to modify the AI diagnostic model via the remote support channel, so that the system returns false negatives and patients are misdiagnosed.

Aim for at least **8 stories** across different parts of the system. Fill them into the template.

---

## Part B: Risk Assessment

Once you have your stories, score each one. You don't need to be precise — use your best judgement as a group.

### Likelihood

| Score | Meaning |
|-------|---------|
| 1 — Low | Hard to pull off: needs special skill, rare opportunity, or physical access |
| 2 — Medium | Realistic: exploitable remotely with moderate skill or a known weakness |
| 3 — High | Easy: simple technique, widely known, or already happening in the wild |

### Impact

| Score | Meaning |
|-------|---------|
| 1 — Low | Minor inconvenience; no patient harm; quickly fixed |
| 2 — Medium | Significant disruption or a data breach; care could be delayed |
| 3 — High | Direct patient harm possible; serious breach; device down for hours or days |

### Risk score = Likelihood × Impact

| Score | Priority |
|-------|---------|
| 1–2 | Low — monitor |
| 3–4 | Medium — plan a fix |
| 6–9 | High — fix urgently |

### Patient safety rule

After scoring, ask: *"Could this threat directly harm a patient?"* — wrong diagnosis acted on, scan unavailable during an emergency, incorrect therapy delivered. If yes, **mark it High priority regardless of the score** and note your reasoning.

---

## Template section to fill in

Complete **Q2** in your template:
- **Q2.1** — write your attacker stories (aim for at least 8)
- **Q2.2** — score each story for likelihood and impact

---

## Discussion questions

1. Which story surprised you most? Why?
2. Which story would be hardest to defend against — and why?
3. If you could only fix one thing on this device today, what would it be?
