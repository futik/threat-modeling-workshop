# 02 — Step 2: Threat Identification

## Goal

Systematically enumerate what can go wrong. This step uses two complementary techniques: **STRIDE** (a threat category framework) and **MITRE ATT&CK for ICS/Healthcare** (an adversary behavior catalog).

Using both gives you broad coverage: STRIDE ensures you haven't missed a category; ATT&CK grounds your threats in observed real-world attacker behavior.

---

## Technique A: STRIDE

STRIDE is a mnemonic for six threat categories. Apply each category to every component and data flow you identified in Step 1.

| Letter | Threat | Violated property | Question to ask |
|--------|--------|-----------------|----------------|
| **S** | Spoofing | Authentication | Can an attacker impersonate a legitimate user or component? |
| **T** | Tampering | Integrity | Can an attacker modify data, firmware, or software? |
| **R** | Repudiation | Non-repudiation | Can a user deny having performed an action? |
| **I** | Information disclosure | Confidentiality | Can an attacker read data they shouldn't? |
| **D** | Denial of service | Availability | Can an attacker disrupt system operation? |
| **E** | Elevation of privilege | Authorization | Can an attacker gain capabilities beyond their role? |

### How to apply STRIDE

For each **data flow** and **component** in your architecture:
1. Ask each STRIDE question
2. If the answer is "yes" or "possibly", write it down as a candidate threat
3. Don't filter at this stage — capture everything

**Example (Acquisition Workstation → Cloud AI Service):**
- S: Can an attacker spoof the cloud AI endpoint (DNS hijack, MITM)?
- T: Can an attacker tamper with DICOM images in transit or at rest in the cloud?
- I: Does the cloud store images that could be re-identified despite anonymization?
- D: Can the cloud AI service be flooded, preventing diagnostic annotations from returning?
- E: Can a compromised workstation gain elevated access to the cloud backend?

---

## Technique B: MITRE ATT&CK for ICS

[MITRE ATT&CK for ICS](https://attack.mitre.org/matrices/ics/) catalogs adversary tactics and techniques observed in attacks on industrial and medical control systems.

Relevant tactic areas for NeuroScan 3000:

| Tactic | Relevant to NeuroScan 3000 |
|--------|---------------------------|
| **Initial Access** | Spear phishing hospital staff, exploiting remote access (VPN/RDP), supply chain compromise of firmware |
| **Execution** | Malicious firmware update, scripting via admin console |
| **Persistence** | Backdoor in firmware, scheduled task on acquisition workstation |
| **Lateral Movement** | Pivot from hospital LAN to DICOM server, to workstation |
| **Collection** | Exfiltrate DICOM images, intercept HL7 FHIR patient data |
| **Impact** | Inhibit response functions (prevent scanning), manipulate AI output (return falsified annotations), ransomware on workstation |

### How to use ATT&CK

1. Browse the [ICS matrix](https://attack.mitre.org/matrices/ics/) focusing on techniques relevant to the healthcare sector
2. For each technique, ask: "Could this be applied to NeuroScan 3000?"
3. Map identified ATT&CK techniques to the STRIDE threats you already found — or use them to find new threats you missed

---

## Threat statement format

For each threat you identify, write it as a structured statement:

> **[Threat actor]** can **[action]** the **[asset/component]** via **[entry point/interface]**, causing **[impact]**.

Example:
> An external attacker can tamper with anonymized DICOM images in the cloud AI service via a compromised MediScanTech engineer account, causing the AI to return falsified diagnostic annotations that mislead the radiologist.

---

## Template section to fill in

Open [`../templates/threat-model-template.md`](../templates/threat-model-template.md) and complete **Section 2: Threat Identification**.

Aim for at least **10 distinct threat statements** across different components and data flows. Quality over quantity — each threat should be specific and actionable.

---

## Discussion questions

1. Which STRIDE category feels hardest to address in a regulated medical device environment? Why?
2. The AI model's outputs are not explainable. What threats does this create that wouldn't exist in a rule-based system?
3. How does the "anonymization done in software" assumption affect your threat model?
