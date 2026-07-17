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

> **Why exploitability, not likelihood?** Security risk can't be estimated as a probability the way ISO 14971 safety risk is — you can't put odds on an adversary. The FDA expects security risk to be judged on **exploitability**: how feasible the attack is. Exploitability × severity of patient harm is also the FDA's controlled/uncontrolled risk matrix.

### Exploitability — how feasible is the attack?

| Score | Meaning |
|-------|---------|
| 1 — Low | Needs rare access or high skill: physical access, a privileged insider, or a zero-day |
| 2 — Moderate | Remotely exploitable with moderate skill, or a known/published weakness |
| 3 — High | Trivial: default or no credentials, a public exploit, reachable from the network |

### Severity of patient harm

| Score | Meaning |
|-------|---------|
| 1 — Minor | No patient harm; minor inconvenience; quickly fixed |
| 2 — Significant | Care delayed or degraded, or a data breach |
| 3 — Serious | Direct patient harm plausible; serious breach; device down for hours or days |

### Risk score = Exploitability × Severity

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
- **Q2.2** — score each story for exploitability and severity

---

## Discussion questions

1. Which story surprised you most? Why?
2. Which story would be hardest to defend against — and why?
3. If you could only fix one thing on this device today, what would it be?
