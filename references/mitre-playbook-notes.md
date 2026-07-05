# Key Notes from the MITRE Playbook for Threat Modeling Medical Devices (2021)

Source: [MITRE Playbook for Threat Modeling Medical Devices](https://www.mitre.org/sites/default/files/2021-11/Playbook-for-Threat-Modeling-Medical-Devices.pdf)

> These are summary notes for workshop use. Always refer to the original document for authoritative guidance.

---

## Why the playbook exists

The FDA's 2018 medical device cybersecurity guidance encouraged manufacturers to conduct threat modeling but gave little methodological guidance. MITRE developed this playbook to fill that gap, providing a structured, repeatable process aligned with FDA expectations and industry best practices.

---

## The 5-step process

### Step 1: Define the scope
- Identify the system and all its components (hardware, software, interfaces)
- Define system boundaries and trust boundaries
- Enumerate data flows and users
- Output: system model / data flow diagram

### Step 2: Identify threats
MITRE recommends using multiple complementary techniques:
- **STRIDE** — systematic coverage of threat categories
- **Attack trees** — model how an attacker achieves a goal step by step
- **MITRE ATT&CK for ICS** — ground threats in real adversary behavior
- **Abuse cases** — think from the attacker's perspective on specific use cases

### Step 3: Analyze vulnerabilities
Map identified threats to specific vulnerabilities in the system. This goes one level deeper than threat identification — it asks "why is this threat possible?"

### Step 4: Assess risk
The playbook recommends a risk = likelihood × impact model, with an explicit consideration of **patient safety** as a separate weighting factor beyond data protection.

### Step 5: Develop and validate countermeasures
Define mitigations, validate that they address the root vulnerability, and document residual risk. The playbook emphasizes that not all risks need to be mitigated — risk acceptance is legitimate if documented and justified.

---

## Key concepts from the playbook

### Medical device-specific threat actors
The playbook categorizes attackers along two axes:
- **Sophistication**: script kiddie → advanced persistent threat
- **Access**: external → adjacent network → local → physical

Medical devices face a unique combination: some threats (ransomware) come from low-sophistication external actors; others (implant firmware manipulation) require physical access but low sophistication; nation-state actors combine high sophistication with remote access.

### The "security vs. safety" axis
In general IT, security is primarily about confidentiality. In medical devices, the highest-severity risks are to **safety** (patient harm) and **integrity** (wrong clinical decisions). Availability is also safety-critical in life-sustaining devices.

The playbook introduces the concept of "safety-critical threats" — threats where exploitation directly endangers patients — which should be treated as the highest priority regardless of likelihood.

### Hybrid devices and cloud
The playbook explicitly addresses connected and hybrid devices. Key guidance:
- Cloud components must be included in scope
- The manufacturer is responsible for the security of cloud services they operate
- Hospital network assumptions should be explicitly stated (do not assume a trusted network)

### Regulatory linkage
The playbook is designed to produce documentation suitable for FDA premarket submissions. Key outputs:
- System model (data flow diagram)
- Threat list with risk scores
- Mitigation descriptions with residual risk
- Acceptance rationale for unmitigated risks

---

## Techniques the playbook recommends

| Technique | Use for |
|-----------|---------|
| STRIDE | Systematic coverage of all threat categories |
| Attack trees | Modeling multi-step attack paths |
| PASTA (Process for Attack Simulation and Threat Analysis) | Risk-centric approach for complex systems |
| MITRE ATT&CK for ICS | Grounding threats in real adversary behavior |
| Misuse/abuse cases | User story-style attacker perspective |

The playbook does not mandate a single technique — it recommends combining at least two for better coverage.

---

## Common gaps in medical device threat models (per MITRE)

1. **Scoping too narrowly** — excluding cloud components or hospital infrastructure from scope
2. **Focusing only on confidentiality** — missing integrity and availability threats with safety implications
3. **No threat actor modeling** — threats without actors are harder to prioritize
4. **Generic mitigations** — "implement encryption" without specifying where, how, and to what standard
5. **No residual risk documentation** — declaring a mitigation without acknowledging remaining exposure
6. **No review trigger** — a threat model without a defined re-review cadence becomes stale

---

## Relevant standards referenced in the playbook

| Standard | Relevance |
|----------|----------|
| IEC 62443 | Industrial cybersecurity — applicable to OT/embedded components |
| IEC 81001-5-1 | Health software cybersecurity lifecycle |
| AAMI TIR57 | Principles for medical device security risk management |
| NIST SP 800-30 | Risk assessment guide |
| NIST SP 800-160 | Systems security engineering |
