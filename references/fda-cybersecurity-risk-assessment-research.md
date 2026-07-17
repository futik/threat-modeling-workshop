# FDA Cybersecurity Risk Assessment — Research Notes

Research compiled for the Medical Software Summit 2026 presentation.
Covers how the FDA premarket guidance positions threat modeling relative
to security risk assessment, lifecycle requirements, and the distinction
from product safety risk.

---

## Source Documents

| Document | Edition | Reference |
| --- | --- | --- |
| Cybersecurity in Medical Devices: Quality Management System Considerations and Content of Premarket Submissions | Final, February 2026 (supersedes June 2025 and September 2023 editions) | [FDA Guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-management-system-considerations-and-content-premarket) |
| Postmarket Management of Cybersecurity in Medical Devices | Final, December 2016 | [FDA Guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/postmarket-management-cybersecurity-medical-devices) |
| Section 524B of the FD&C Act (21 U.S.C. §360n-2) | Added by Consolidated Appropriations Act 2023, §3305; effective March 29, 2023 | [Congress.gov](https://www.congress.gov/117/bills/hr2617/BILLS-117hr2617enr.pdf) |
| Playbook for Threat Modeling Medical Devices | MITRE | [MITRE](https://www.mitre.org/publications/technical-papers/playbook-threat-modeling-medical-devices) |
| Cybersecurity Risk Analysis for Medical Devices in the Era of Evolving Technologies | MITRE, April 2026 | [MITRE](https://www.mitre.org/news-insights/publication/cybersecurity-risk-analysis-medical-devices-era-evolving-technologies) |

### Referenced Standards

- **ISO 14971** — Application of risk management to medical devices (safety risk, probabilistic)
- **AAMI TIR57** — Principles for medical device security — Risk management
- **ANSI/AAMI SW96** — Standard for medical device security — Security risk management for device manufacturers
- **IEC 81001-5-1** — Health software and health IT systems safety, effectiveness and security
- **ANSI/ISA 62443-4-1** — Security for industrial automation and control systems — Secure product development lifecycle requirements
- **ISO 27001** — Information security management systems

---

## 1. Threat Modeling → Risk Assessment: the Dependency

The FDA premarket guidance (§V.A) establishes a clear hierarchy within
Security Risk Management:

```
Section V.A — Security Risk Management
  ├── V.A.1 — Threat Modeling              ← foundational input
  ├── V.A.2 — Cybersecurity Risk Assessment ← consumes threat model outputs
  ├── V.A.3 — Interoperability Considerations
  ├── V.A.4 — Third-Party Software Components
  ├── V.A.5 — Security Assessment of Unresolved Anomalies
  └── V.A.6 — TPLC Security Risk Management
```

**Key language from the guidance:**

> "FDA recommends that threat modeling be performed to inform and support
> the risk analysis activities."

> "FDA recommends that the cybersecurity risk assessment provided in
> premarket submissions capture the risks and controls identified from
> the threat model."

> Threat modeling should "identify medical device system risks and
> mitigations as well as inform the pre- and post-mitigation risks
> considered as part of the cybersecurity risk assessment."

Threat modeling is described as **"foundational"** — it is "foundational
for optimizing system, product, network, application, and connection
security when applied appropriately and comprehensively."

The guidance requires **traceability** between them: manufacturers must
"provide traceability between the threat model, cybersecurity risk
assessment, SBOM, and testing documentation."

**Summary:** Threat modeling identifies threats. The cybersecurity risk
assessment evaluates controls against those threats, calculates residual
risk, and records acceptability decisions. The risk assessment depends on
the threat model for its inputs.

---

## 2. Lifecycle Requirement: Risk Assessment as a Living Activity

The guidance is emphatic that risk assessment is ongoing — not a one-time
premarket exercise.

### §V.A.6 — TPLC Security Risk Management

> "Cybersecurity risks may continue to be identified throughout the
> device's TPLC. Manufacturers should ensure they have appropriate
> resources to identify, assess, and mitigate cybersecurity
> vulnerabilities as they are identified throughout the supported device
> lifecycle."

> "As part of using an SPDF, manufacturers should update their security
> risk management documentation as new information becomes available,
> such as when new threats, vulnerabilities, assets, or adverse impacts
> are discovered during development and after the device is released."

### Living document language

> "When maintained throughout the device lifecycle, this documentation
> (e.g., threat modeling, cybersecurity risk assessment) can be used to
> quickly identify vulnerability impacts once a device is released and,
> when appropriate, to support timely improvement, through corrective
> actions and preventive actions."

### §VII.C.1 — Cyber devices specifically

> "Manufacturers of cyber devices anticipate and make appropriate updates
> to these plans... as new information becomes available, such as when
> new risks, threats, vulnerabilities, assets, or adverse impacts are
> discovered throughout the total product lifecycle. To support such
> efforts, manufacturers should also create or update appropriate
> documentation (e.g., threat modeling, cybersecurity risk assessment)
> and maintain it throughout the device lifecycle."

### Exploitability evolves

> "Acceptance criteria for cybersecurity risks should carefully consider
> the TPLC of the medical device system, as it might be more difficult
> to mitigate cybersecurity issues once the device is marketed."

> "The exploitability of the vulnerability is likely to increase over the
> device lifecycle."

### Fielded device versioning

> "If an update is not applied automatically for all fielded devices,
> then there will likely be different risk profiles for differing
> software configurations of the device. FDA recommends that
> vulnerabilities be assessed for any differing impacts for all fielded
> versions to ensure patient risks are being accurately assessed."

### Recommended metrics (§V.A.6)

- Percentage of identified vulnerabilities that are updated or patched
  (defect density)
- Duration from vulnerability identification to when it is updated or
  patched
- Duration from when an update or patch is available to complete
  implementation in deployed devices

### 2016 Postmarket Guidance reinforcement

> "A manufacturer should establish, document, and maintain throughout the
> medical device lifecycle an ongoing process for identifying hazards
> associated with the cybersecurity of a medical device, estimating and
> evaluating the associated risks, controlling these risks, and
> monitoring the effectiveness of the controls."

---

## 3. Section 524B — Statutory Requirements

Section 524B of the FD&C Act (21 U.S.C. §360n-2) establishes **statutory
requirements** (not just guidance recommendations) for "cyber devices."

### Definition of a cyber device (§524B(c))

A device that:
1. Includes software validated, installed, or authorized by the sponsor
2. Has the ability to connect to the internet (interpreted broadly:
   USB, Ethernet, serial, Bluetooth, Wi-Fi, cellular, magnetic
   inductive)
3. Contains technological characteristics that could be vulnerable to
   cybersecurity threats

### Four requirements under §524B(b)

1. **§524B(b)(1)** — Submit a plan to monitor, identify, and address
   postmarket cybersecurity vulnerabilities and exploits, including
   coordinated vulnerability disclosure
2. **§524B(b)(2)** — Design, develop, and **maintain** processes and
   procedures to provide reasonable assurance that the device and
   related systems are cybersecure, and make available postmarket
   updates and patches:
   - **(A)** On a reasonably justified regular cycle for known
     unacceptable vulnerabilities
   - **(B)** As soon as possible out of cycle for critical
     vulnerabilities that could cause uncontrolled risks
3. **§524B(b)(3)** — Provide a software bill of materials (SBOM)
4. **§524B(b)(4)** — Comply with such other requirements as the
   Secretary may require through regulation

### Risk assessment connection

The guidance states that the documentation recommendations throughout
Sections V and VI "should be considered and used to demonstrate
reasonable assurance that the device and related systems are cybersecure
as required by section 524B(b)(2)."

The word **"maintain"** in §524B(b)(2) is the statutory hook for ongoing
risk management — this is not a one-time premarket exercise.

### Enforcement

> "For cyber devices, failure to comply with any requirement under
> section 524B(b)(2) of the FD&C Act (relating to ensuring device
> cybersecurity) is considered a prohibited act under section 301(q) of
> the FD&C Act."

This makes inadequate cybersecurity risk management a **legal
violation**, not just a guidance deviation.

---

## 4. SPDF and Risk Assessment

The Secure Product Development Framework (SPDF) is the overarching
process framework within which security risk management operates.

> "An SPDF is a set of processes that help identify and reduce the
> number and severity of vulnerabilities in products. An SPDF
> encompasses all aspects of a product's lifecycle, including design,
> development, release, support, and decommission."

- SPDF is **recommended but not required**: "FDA encourages
  manufacturers to use an SPDF, but other approaches might also satisfy
  the QMSR."
- Section V is titled "Using an SPDF to Manage Cybersecurity Risks" —
  the entire security risk management section is framed as an SPDF
  process.
- SPDF connects to 524B: SPDF processes "may be helpful for
  manufacturers of cyber devices that must 'design, develop, and
  maintain processes and procedures to provide a reasonable assurance
  that the device and related systems are cybersecure' pursuant to
  section 524B(b)(2)."
- SPDF integrates with existing QMS: "An SPDF can be integrated with
  existing processes for product and software development, risk
  management, and the quality management system at large."

### Referenced SPDF frameworks

- Medical Device and Health IT Joint Security Plan version 2 (JSP2)
- IEC 81001-5-1
- ANSI/ISA 62443-4-1
- NIST Cybersecurity Framework (for healthcare facilities)

---

## 5. Cybersecurity Risk vs. Product Safety Risk

The FDA draws a clear distinction between safety risk management and
security risk management while requiring them to be connected.

### They are distinct (§V.A)

> "Performing security risk management is distinct from performing
> safety risk management as described in ISO 14971."

Three reasons given:

1. "The scope of possible harm and the risk assessment factors may be
   different"
2. "Safety risk management focuses on physical injury, damage to
   property or the environment, or delay and/or denial of care due to
   device or system unavailability" while "security risk management may
   include risks that can result in indirect or direct patient harm"
3. "Risks that are outside of FDA's assessment of safety and
   effectiveness, such as those related to business or reputational
   risks, may also exist"

### The fundamental methodological difference

**Safety risk** = probabilistic (ISO 14971)
**Security risk** = exploitability-based (non-probabilistic)

> "Cybersecurity risks are difficult to predict, meaning that it is not
> possible to assess and quantify the likelihood of an incident
> occurring based on historical data or modeling (also known as a
> 'probabilistic manner'). This non-probabilistic approach is not the
> fundamental approach performed in safety risk management under ISO
> 14971."

> "Instead, security risk assessment processes focus on exploitability,
> or the ability to exploit vulnerabilities present within a device
> and/or system."

### But they must interface

> "These processes should also ensure that risk control measures for one
> type of risk assessment do not inadvertently introduce new risks in
> the other."

> "FDA recommends that device manufacturers conduct both a safety risk
> assessment and a separate, accompanying security risk assessment to
> ensure a more comprehensive identification and management of patient
> safety risks."

The method for transferring security risks into the safety risk
assessment should be documented:

> "The methods used for scoring the risk pre- and post-mitigation and
> the associated acceptance criteria as well as the method for
> transferring security risks into the safety risk assessment process
> should also be provided."

### The 2016 Postmarket Guidance risk matrix

Uses a two-dimensional matrix:
- **Exploitability** on one axis
- **Severity of patient harm** on the other
- Yields a **controlled / uncontrolled risk** determination

### Cybersecurity risk scales independently from software risk

> "A device that is determined to have a greater software risk may only
> have a small cybersecurity risk due to how the device is designed.
> Likewise, a device with a smaller software risk may have a significant
> cybersecurity risk."

---

## Summary Table

| Topic | Key FDA Position | Reference |
| --- | --- | --- |
| Threat Modeling → Risk Assessment | Threat modeling is **foundational** and **informs** the cybersecurity risk assessment; distinct but tightly coupled with required traceability | Guidance §V.A.1, §V.A.2 |
| Living/Ongoing Assessment | Risk management documentation must be **maintained and updated throughout the TPLC** as new information emerges | Guidance §V.A.6, §VII.C.1 |
| Section 524B | Statutory requirement to **"design, develop, and maintain"** processes for cybersecurity; failure is a **prohibited act** | 21 U.S.C. §360n-2(b)(2), Guidance §VII |
| SPDF ↔ Risk Assessment | SPDF is the **lifecycle framework** containing risk assessment; recommended way to satisfy QMSR | Guidance §IV.A.1, §V |
| Safety vs. Security Risk | **Separate but connected** processes; safety uses probabilistic approach (ISO 14971), security uses **exploitability-based** approach; must have defined interface | Guidance §V.A, §V.A.2; AAMI TIR57; ANSI/AAMI SW96 |

---

## Relevance to This Presentation

This talk focuses on **cybersecurity risk** — exploitability-based,
threat-model-driven, continuously maintained. SaMD product risk under
ISO 14971 is a separate process and out of scope.

The living model operationalizes the FDA's lifecycle requirements:

- The threat model identifies threats (§V.A.1 — foundational)
- The risk assessment evaluates controls against those threats, using
  exploitability rather than probability (§V.A.2)
- Both are maintained as structured data in the repository, updated
  when inputs change (§V.A.6, §VII.C.1)
- The Security Architect Agent orchestrates updates and flags
  invalidated risk acceptances
- The VM Agent provides the operational trigger — new CVEs, degraded
  controls, incident findings
- Compliance evidence is generated from the same data that drives
  daily operations (§524B(b)(2) "maintain" requirement)

### Guidance version history

| Date | Edition | Notes |
| --- | --- | --- |
| April 2022 | Draft | Initial draft |
| September 2023 | Final | First final edition |
| June 2025 | Updated final | Added Section VII on cyber devices / 524B |
| February 2026 | Current final | QMSR alignment (ISO 13485 references replacing QS regulation) |

The core risk assessment framework has been consistent across the 2023,
2025, and 2026 editions.
