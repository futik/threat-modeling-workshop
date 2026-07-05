# Q1 — What are we working on?

## Goal

Define the boundaries of your threat model. A threat model is only as good as the system it describes. Scope too narrowly and you'll miss attack vectors. Scope too broadly and you'll never finish.

---

## What to do in this step

Work through the following four activities and fill in **Q1** of your template.

---

### 1.1 Define the system boundary

Decide what is **in scope** and what is **out of scope**.

Guiding questions:
- What components does your team (or the manufacturer) actually control?
- What are the physical and logical entry points into the system?
- Where does patient data flow and who can access it?
- What third-party or hospital-owned components interact with the device?

> **For NeuroScan 3000:** The imaging unit, acquisition workstation, local DICOM server, and cloud AI service are all in scope. The hospital EMR is a dependency but owned by the hospital — consider it a partially-trusted external system.

---

### 1.2 Identify assets

Assets are what you're trying to protect. In medical devices, assets include:

| Asset type | Examples |
|------------|---------|
| **Patient data** | DICOM images with PHI, diagnostic reports |
| **Device integrity** | Firmware, acquisition software, AI model |
| **System availability** | Ability to perform scans, deliver diagnoses |
| **Clinical integrity** | Accuracy of AI output, unaltered images |
| **Credentials / keys** | Admin passwords, TLS certificates, API keys |

List the assets specific to NeuroScan 3000 in your template. For each asset, note its **most critical security property** (Confidentiality, Integrity, or Availability).

---

### 1.3 Identify entry points and trust boundaries

Entry points are interfaces where data or commands enter the system. Trust boundaries are lines where the trust level changes.

Use the architecture diagram in [`../scenario/system-architecture.md`](../scenario/system-architecture.md) to identify:
- Network interfaces (ports, protocols)
- Physical interfaces (USB, serial)
- Human interfaces (admin console, web portal)
- Update channels

For each entry point, note: Who can reach it? Is authentication required? Is traffic encrypted?

---

### 1.4 Identify actors (users and adversaries)

**Legitimate users** (from [`../scenario/device-overview.md`](../scenario/device-overview.md)):
- Radiologist, neurologist, biomedical engineer, hospital IT admin, MediScanTech support, MediScanTech engineer

**Threat actors** to consider:

| Actor | Motivation | Access vector |
|-------|-----------|--------------|
| External attacker | Financial (ransomware), espionage | Internet, phishing |
| Malicious insider | Disgruntled employee, bribed | Direct LAN access, remote support |
| Nation-state | Healthcare disruption, data theft | Supply chain, internet |
| Researcher / curious user | Vulnerability discovery | Local network |

---

## Template section to fill in

Open [`../templates/threat-model-template.md`](../templates/threat-model-template.md) and complete **Q1: What are we working on?**

---

## Discussion questions

1. Which components would you consider most critical to availability? Why?
2. Is the hospital network a trusted boundary? What would change your answer?
3. Should the EMR be in scope? What are the arguments for and against?
