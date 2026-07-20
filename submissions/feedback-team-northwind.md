# Feedback — Team Northwind

### Overall score: 9/30

### Dimension scores

| Dimension | Score | Comments |
|-----------|-------|---------|
| Scope completeness | 2/5 | Scope is "the workstation" and "the cloud", with everything else out. The imaging unit, local DICOM server, update delivery, and every trust boundary are missing. Assets are generic ("Patient data", "The system", "Passwords") and entry points collapse the whole architecture into "Website / console" and "Internet". |
| Threat coverage | 2/5 | Five stories, and they overlap (S-01 data theft and S-05 network sniffing are essentially the same threat). Whole classes are absent: integrity/tampering of images or AI results, firmware/update compromise, the shared remote-support credential, anonymisation failure, repudiation. |
| Threat quality | 1/5 | Threats are generic and don't reference the NeuroScan architecture — "A hacker could steal patient data", "A virus could infect the workstation". None use the actor→action→method→goal format with a real method, and "Viruses" is listed as a threat actor. |
| Risk assessment accuracy | 1/5 | Scoring is **probabilistic**, not exploitability-based — rationales are "Hackers are common", "Viruses are everywhere". This is exactly the approach the FDA does *not* permit for security risk. The Risk column uses High/Medium/Low words instead of Exploitability × Severity, and the patient-safety column is left blank on every row, so no override is applied even though S-03 (device broken) clearly affects availability/care. |
| Mitigation quality | 2/5 | Every mitigation is a category with no specifics: "Add encryption", "Use strong passwords", "Install antivirus", "Use a firewall". None say what exactly would be done, where, residual risk is never noted, and the regulatory column is empty. S-05 has no mitigation at all. |
| Regulatory & medical awareness | 1/5 | None. This reads as a generic IT checklist; there is no notion of patient harm as the dominant severity lens, no FDA/EU MDR context, no patching-constraint awareness, and availability isn't treated as safety-relevant. |

### Strengths

- **Correct top-level instinct.** The team did identify the three big buckets — data theft, malware/availability, and credential compromise — so the raw intuition is there.
- **Willingness to prioritise.** They picked a top-3, which is the right habit even though the ranking isn't backed by defensible scoring yet.

### Gaps & missed threats

- **Integrity of diagnosis** — nothing about tampering with DICOM images or AI annotations, the highest patient-harm class on this device.
- **Firmware / malicious update** — the update delivery service and imaging unit firmware are entirely absent.
- **Shared remote-support credential** — the scenario's flagged known gap is not modelled.
- **Anonymisation failure** — PHI leaking to the cloud is not considered.
- **Repudiation** — no audit-log/attribution threat.
- **Every trust boundary** — TB-1..TB-5 are not identified, so LAN-foothold and cloud-boundary attacks are invisible to the model.

### Improvement suggestions

1. Re-scope from the architecture diagram: list the imaging unit, workstation, DICOM server, cloud AI/storage, and update delivery, and enumerate trust boundaries TB-1..TB-5. Give assets stable IDs and a specific C/I/A property.
2. Rewrite threats in the actor→action→method→goal format, each naming a real interface (e.g. "via the unauthenticated DICOM connection on TCP/104"), and drop "viruses" as an actor.
3. Replace the High/Med/Low guesses with **Exploitability (1–3) × Severity (1–3)** and write the rationale in terms of *how feasible the attack is*, not how common hackers are. Mark any patient-harming story High regardless of score.
4. Make every mitigation specific: not "add encryption" but "enable DICOM-over-TLS on port 2762 between the workstation and DICOM server"; not "strong passwords" but "TOTP MFA on the :8443 admin console with lockout". Note residual risk on each.
5. Add the missing high-severity threats: image/AI tampering, malicious firmware update, and misuse of the shared support credential.

### Notable observations

The gap here is method, not effort: the intuitions are sound but the model is a generic IT security list rather than a medical-device threat model. The fastest improvement is the risk-scoring switch — moving from "hackers are common" (probability) to "reachable from the whole LAN with no MFA" (exploitability) — because that single change forces the specificity the rest of the rubric rewards.

```scores
scope: 2
threat_coverage: 2
threat_quality: 1
risk_assessment: 1
mitigation_quality: 2
regulatory_awareness: 1
total: 9
```
