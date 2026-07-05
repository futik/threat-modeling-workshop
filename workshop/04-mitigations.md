# 04 — Step 4: Mitigations & Controls

## Goal

For each High and Medium priority threat, define one or more mitigations. Mitigations reduce either likelihood (make it harder to exploit) or impact (limit damage if exploited).

---

## Types of mitigations

| Type | Description | Examples |
|------|-------------|---------|
| **Preventive** | Stop the threat from being realized | MFA, input validation, network segmentation |
| **Detective** | Identify when a threat is being exploited | Anomaly detection, audit logging, integrity checks |
| **Corrective** | Limit impact or restore state after exploitation | Backup/restore, incident response plan, rollback capability |
| **Compensating** | Alternative control when primary is not feasible | Manual review of AI output, air-gap fallback |

In medical devices, **compensating controls** are common because you cannot simply patch firmware every week.

---

## Medical device constraints

When proposing mitigations, consider:

- **Regulatory impact**: Does the mitigation change device behavior in a way that requires a new FDA submission or EU MDR amendment?
- **Availability vs. security trade-offs**: Locking down the admin console might also lock out the biomedical engineer during an emergency
- **Usability**: A mitigation that clinicians work around is worse than no mitigation
- **Supply chain**: Can you actually enforce a mitigation on a third-party component (e.g., the hospital EMR)?

---

## Mitigation format

For each threat, document:

> **Mitigation ID:** M-XX  
> **Addresses threat(s):** T-XX, T-XX  
> **Type:** Preventive / Detective / Corrective / Compensating  
> **Description:** What exactly is done  
> **Residual risk:** What risk remains after the mitigation  
> **Regulatory note:** Does this require a design change / new clearance?

---

## Starter examples

| Threat | Mitigation idea |
|--------|---------------|
| Shared remote support credential | Replace with per-engineer certificates + privileged access workstation; log all sessions |
| No MFA on admin console | Enforce TOTP-based MFA; rate-limit login attempts |
| AI output manipulation | Implement cryptographic signing of AI inference results; display provenance to radiologist |
| Firmware integrity | Enforce secure boot with hardware root of trust; verify update package signatures before apply |
| DICOM server unauthenticated | Enable DICOM TLS; restrict DICOM connections to allowlisted workstation IPs |
| Anonymization bypass | Third-party audit of anonymization logic; pixel-level PHI scrubbing (not just metadata) |

---

## Template section to fill in

Open [`../templates/threat-model-template.md`](../templates/threat-model-template.md) and complete **Section 4: Mitigations**.

For every **High** threat, define at least one mitigation. For **Medium** threats, define at least one mitigation or a documented rationale for acceptance.

---

## Discussion questions

1. MFA on the admin console adds friction for the biomedical engineer during an emergency. How do you balance this?
2. Secure boot requires hardware changes to the imaging unit. That likely means a new FDA submission. Is it worth it?
3. If you can't fix the shared remote support credential before the next release, what compensating controls would you put in place?
