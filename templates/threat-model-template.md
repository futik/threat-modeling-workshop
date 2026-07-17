# Threat Model — NeuroScan 3000

> **Team name:** _________________________________  
> **Date:** _________________________________  
> **Workshop:** Medical Device Threat Modeling  

---

## Q1: What are we working on?

*Goal: build a shared map of the system before you look for threats. Agree on what's in scope, what's worth protecting, and who could cause harm.*

---

### 1.1 System boundary

What components are you including in your threat model? What are you leaving out?

**In scope** — components and interfaces your team will analyze:

- 
- 
- 

**Out of scope** — what you are explicitly excluding, and why:

> *Example: "The hospital Wi-Fi infrastructure — it's managed by the hospital IT team and outside MediScanTech's control."*

- 

---

### 1.2 Assets — what are we protecting?

List the things that have value and could be targeted. Think about: data, software, hardware, capabilities.

> *Hint: Ask "what would hurt if it was stolen, changed, or made unavailable?" — patient images, the AI model, the ability to perform scans, admin credentials...*

| Asset ID | Asset | Why it matters | Most critical property |
|----------|-------|----------------|----------------------|
| A-01 | *e.g. DICOM scan images with patient data* | *Contains PHI; misuse could harm patients or breach privacy* | *Confidentiality* |
| A-02 | | | |
| A-03 | | | |
| A-04 | | | |
| A-05 | | | |

*(add rows as needed — aim for at least 5)*

**Most critical property key:** C = Confidentiality (secrecy), I = Integrity (accuracy/tamper-proof), A = Availability (accessible when needed)

---

### 1.3 Entry points — how can someone get in?

List the interfaces and channels where data or commands enter the system. Use the architecture diagram.

> *Hint: Think about network ports, physical connections, web portals, update channels, remote access — any door into the system.*

| Entry point | How it works | Authentication? | Encrypted? | Who can reach it? |
|-------------|-------------|----------------|-----------|------------------|
| *e.g. Local admin console (:8443)* | *Web UI on the workstation* | *Username/password, no MFA* | *Yes (HTTPS)* | *Anyone on hospital LAN* |
| | | | | |
| | | | | |
| | | | | |

---

### 1.4 Threat actors — who might attack this?

Who could want to cause harm, and why?

> *Hint: Think beyond opportunistic hackers — consider insiders, nation-states, ransomware groups, and even vendor staff with too much access.*

| Actor | Motivation | How they might get in |
|-------|-----------|----------------------|
| *e.g. Ransomware group* | *Financial — encrypt systems, demand payment* | *Phishing hospital staff, exploiting internet-facing services* |
| | | |
| | | |
| | | |

---

## Q2: What can go wrong?

*Goal: think like an attacker. Write stories from the attacker's perspective, then assess how serious each one is.*

---

### 2.1 Attacker stories

Write each threat as an attacker story:

> **As a** [bad actor], **I want to** [do something bad] **via** [method or entry point], **so that** [I achieve my goal].

**Example stories to get you started — use these as inspiration, not answers:**

> *As a ransomware group, I want to encrypt the acquisition workstation via a phishing email sent to hospital staff, so that the hospital cannot perform scans and is forced to pay a ransom.*

> *As a rogue vendor technician, I want to access the system beyond my support role via the shared remote support credential, so that I can exfiltrate patient data or plant a backdoor.*

> *As an opportunistic hacker, I want to intercept anonymised scan images via a man-in-the-middle attack on the hospital network, so that I can attempt to re-identify patients and sell the data.*

**Prompts — if you're stuck, apply these to the NeuroScan 3000:**
- What if someone changed the AI diagnostic results before the radiologist saw them?
- What if someone pushed a malicious software update?
- What if the anonymisation didn't actually work?
- What if someone got admin access via the local console?
- What if the device was made unavailable during an emergency?

| Story ID | Bad actor | Attacker story | Part of system affected |
|----------|-----------|----------------|------------------------|
| S-01 | | *As a ..., I want to ... via ..., so that ...* | |
| S-02 | | | |
| S-03 | | | |
| S-04 | | | |
| S-05 | | | |
| S-06 | | | |
| S-07 | | | |
| S-08 | | | |

*(add rows as needed — aim for at least 8)*

---

### 2.2 Risk assessment

Score each story. Use your judgement as a group — you don't need to be precise.

**Exploitability:** 1 = Low (needs rare access or high skill — physical access, privileged insider, zero-day) · 2 = Moderate (remotely exploitable with moderate skill or a known weakness) · 3 = High (trivial — default/no credentials, public exploit, reachable from the network)  
**Severity of patient harm:** 1 = Minor (no patient harm, quickly fixed) · 2 = Significant (care delayed/degraded, or a data breach) · 3 = Serious (direct patient harm plausible — misdiagnosis acted on, device unavailable in an emergency)  
**Risk = Exploitability × Severity** → 1–2: Low · 3–4: Medium · 6–9: High

> **Why exploitability, not likelihood?** Security risk can't be estimated as a probability the way ISO 14971 safety risk is. The FDA expects security risk to be judged on *exploitability* — how feasible the attack is. Exploitability × severity is also the FDA's controlled/uncontrolled risk matrix.

> **Patient safety rule:** If a story could directly harm a patient (wrong diagnosis acted on, device unavailable in emergency), mark it **High** regardless of the score and add a note.

| Story ID | Exploitability (1–3) | Rationale | Severity (1–3) | Rationale | Risk score | Patient safety? | Priority |
|----------|-----------------|-----------|-------------|-----------|-----------|----------------|---------|
| S-01 | | | | | | | |
| S-02 | | | | | | | |
| S-03 | | | | | | | |
| S-04 | | | | | | | |
| S-05 | | | | | | | |
| S-06 | | | | | | | |
| S-07 | | | | | | | |
| S-08 | | | | | | | |

---

## Q3: What are we going to do about it?

*Goal: for each high-priority story, define at least one concrete mitigation. Be specific. Note any trade-offs.*

> **Mitigation types:**  
> **Preventive** — stops the attack (e.g. MFA, network segmentation)  
> **Detective** — spots it when it happens (e.g. audit logging, anomaly detection)  
> **Corrective** — limits damage after the fact (e.g. backup/restore, incident response)  
> **Compensating** — an alternative when the ideal fix isn't feasible (e.g. manual review of AI output)

> *Hint: "Add encryption" is not specific enough. "Enable TLS on the DICOM connection between the workstation and the local DICOM server" is.*

| Mitigation ID | Addresses story(ies) | Type | What exactly would be done | Residual risk | Regulatory note |
|--------------|---------------------|------|---------------------------|--------------|----------------|
| M-01 | *e.g. S-03, S-05* | *Preventive* | *e.g. Replace shared remote support credential with individual per-engineer certificates; log all sessions* | *Insider threat reduced but not eliminated* | *Config change only — no new submission required* |
| M-02 | | | | | |
| M-03 | | | | | |
| M-04 | | | | | |
| M-05 | | | | | |

*(add rows as needed)*

> **Regulatory note guidance:** Does the mitigation change device behaviour in a way that might require a new FDA submission or EU MDR amendment? If hardware changes are involved, almost certainly yes.

---

## Q4: Did we do a good job?

*Goal: step back and review your work critically before presenting.*

---

### Our top 3 threats

What are the three most serious threats you identified, and why?

1. **S-__**: 
2. **S-__**: 
3. **S-__**: 

### Most surprising finding

> What threat did your group find that you didn't expect at the start?

### Hardest trade-off

> Which mitigation decision was most difficult? Why?

### What we're still unsure about

> What questions does your threat model raise that you couldn't answer?

- 
- 

---

### Completeness checklist

Before submitting, confirm:

- [ ] At least 8 attacker stories, each covering a different part of the system
- [ ] Every story is written in the full format (actor → action → method → goal)
- [ ] Every story has an exploitability score, severity score, and risk score
- [ ] Any story that could harm a patient is marked High priority with a rationale
- [ ] Every High-priority story has at least one mitigation
- [ ] Every Medium-priority story has a mitigation or a documented reason for accepting the risk
- [ ] Every mitigation says specifically what would be done (not just the category)
- [ ] Residual risk is noted for each mitigation
