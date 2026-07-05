# 00 — Introduction: Why Threat Model Medical Devices?

## What is threat modeling?

Threat modeling is a structured process for identifying security and safety threats to a system, assessing their risk, and designing countermeasures — before an attacker does it for you.

At its core it answers four questions:
1. **What are we building?** — system decomposition
2. **What can go wrong?** — threat identification
3. **What are we going to do about it?** — mitigations
4. **Did we do a good enough job?** — validation

---

## Why does it matter for medical devices?

Medical devices are increasingly software-defined and network-connected. This creates new attack surfaces that didn't exist a decade ago.

**The stakes are uniquely high:**
- A compromised device can directly harm patients (wrong diagnosis, wrong therapy)
- Medical records are among the most valuable data on the black market
- Ransomware attacks on hospitals have demonstrably delayed care and caused patient harm
- Regulatory bodies (FDA, EU MDR) now *require* cybersecurity documentation as part of premarket submissions

**Real-world context:**
- The FDA's 2023 guidance on cybersecurity in medical devices requires manufacturers to submit a threat model as part of the 510(k) / PMA process
- MITRE's Playbook (2021) provides a structured framework specifically for medical devices
- ICS-CERT and CISA regularly publish advisories on vulnerabilities in medical device software

---

## The MITRE Medical Device Threat Modeling Playbook

This workshop is based on the [MITRE Playbook for Threat Modeling Medical Devices](https://www.mitre.org/sites/default/files/2021-11/Playbook-for-Threat-Modeling-Medical-Devices.pdf).

The playbook defines a 5-step process:

| Step | Activity |
|------|----------|
| 1 | **Scope** the system — define what's in and out |
| 2 | **Identify threats** — using structured techniques |
| 3 | **Assess risk** — likelihood × impact |
| 4 | **Define mitigations** — controls and countermeasures |
| 5 | **Document** — produce a threat model report |

---

## What makes medical device threat modeling different?

| Aspect | General IT | Medical Devices |
|--------|-----------|----------------|
| Primary risk | Data breach, service disruption | Patient harm, misdiagnosis |
| Availability | Important | Often life-critical |
| Patching cadence | Weekly/monthly | 12–18 months (FDA clearance required) |
| Regulatory context | GDPR, CCPA | FDA, EU MDR, IEC 62443, IEC 81001-5-1 |
| Threat actors | Opportunistic attackers | Includes nation-states targeting healthcare |
| Supply chain | Standard IT | Proprietary protocols, COTS components in regulated systems |

---

## Today's scenario

You will threat model the **NeuroScan 3000** — a hybrid MRI-based neurological imaging system. Read the scenario documents before proceeding:

- [`../scenario/device-overview.md`](../scenario/device-overview.md)
- [`../scenario/system-architecture.md`](../scenario/system-architecture.md)

Then open your worksheet:
- [`../templates/threat-model-template.md`](../templates/threat-model-template.md)

You'll fill in the template section by section as you work through steps 01–05.
