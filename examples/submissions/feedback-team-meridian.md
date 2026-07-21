# Feedback — Team Meridian

### Overall score: 19/30

### Dimension scores

| Dimension | Score | Comments |
|-----------|-------|---------|
| Scope completeness | 3/5 | The workstation, DICOM server, cloud AI, and update delivery are in scope, but the **imaging unit and its firmware were excluded** ("assumed it was trusted") — that removes a whole trust boundary (TB-1) and the firmware asset, which is one of the highest-consequence targets. The asset and entry-point tables are otherwise reasonable and use IDs. |
| Threat coverage | 4/5 | Eight stories covering availability, privacy, and one integrity/safety case (S-05). Good spread across STRIDE-equivalents, but nothing on firmware/update tampering to the imaging unit (a consequence of the scope gap) and no supply-chain/SBOM angle. |
| Threat quality | 3/5 | Most stories follow the format and name a component, but several are thin ("As an attacker on the LAN, I want to read DICOM traffic, so that I can steal patient images") without the method detail that makes a threat testable. S-03's "because there is no MFA" mixes the vulnerability into the story rather than the method. |
| Risk assessment accuracy | 3/5 | Scoring is exploitability-based (good) and mostly reasonable, but the **patient-safety override is applied inconsistently**. S-06 (fake update → malware on device) is correctly High, yet S-02 (image/PHI integrity on the LAN) is scored purely as a privacy breach and left Medium — if images can be *modified*, that's an integrity/safety issue that should trigger the override. S-07 (AI DoS during a scan) is marked Low; availability loss during active imaging can delay care and deserves at least Medium with a safety note. |
| Mitigation quality | 3/5 | Direction is right but several entries are category-level, not specific: "Add MFA to the admin console", "Encrypt DICOM traffic", "Sign AI results and updates and check the signatures" — none name the mechanism, port, or where verification happens. Residual risk is filled in only sporadically and the regulatory column is mostly blank. M-03 (per-engineer logins) is the strongest, specific entry. |
| Regulatory & medical awareness | 3/5 | Some awareness — the team recognises misdiagnosis as worse than data theft and worries about emergency-access friction from MFA (a real availability/safety trade-off). But there is no FDA/EU MDR framing, no mention of submission impact for design changes, and no lifecycle/patch-cadence consideration. |

### Strengths

- **Reasonable breadth for the time.** Eight stories touching availability, privacy, and integrity, each tied to a named component.
- **Good instinct on the shared credential.** M-03 replaces the shared remote-support login with per-engineer accounts — specific and root-cause.
- **Honest trade-off.** Flagging that strict MFA could slow emergency access shows real medical-context thinking, even if unresolved.

### Gaps & missed threats

- **Imaging unit firmware / malicious firmware update to the device** — excluded by scope. This is arguably the highest-severity threat on the system (persistent control, scan manipulation) and should be in, not assumed trusted.
- **Anonymisation failure (burned-in PHI in pixel data)** — not considered; a known DICOM issue class directly relevant to the cloud upload boundary.
- **Repudiation / audit-log tampering** — no story about an attacker covering their tracks.
- **Supply-chain / third-party component vulnerability (SBOM)** — absent; required under §524B.
- **Hospital EMR interface (TB-6)** — the partially-trusted EMR boundary is neither listed nor defended; malformed HL7 FHIR input from a compromised EMR (parser exploit / corrupted order data) is an unmodelled entry point into the workstation.

### Improvement suggestions

1. Bring the imaging unit and firmware back into scope and add at least one firmware/update-tampering story with a safety override.
2. Re-score S-02 and S-07: if DICOM data can be *modified*, treat it as integrity/safety (override), and treat AI unavailability during an active scan as at least Medium with a safety note.
3. Make mitigations specific: name the MFA type (TOTP/FIDO2), the DICOM-over-TLS port (2762) and allowlist, and *where* signatures are verified (on the workstation, before display).
4. Fill in residual risk and a regulatory note on every mitigation — even "config change, no new submission" is useful signal.
5. Add an anonymisation-audit control for the cloud-upload boundary and one supply-chain/patch-cadence mitigation.

### Notable observations

The team clearly grasped that integrity-of-diagnosis is the crown-jewel harm (their "most surprising finding"), which is the right medical-device instinct. Turning that instinct into consistent patient-safety overrides in the scoring is the single change that would move this model up a band.

```scores
scope: 3
threat_coverage: 4
threat_quality: 3
risk_assessment: 3
mitigation_quality: 3
regulatory_awareness: 3
total: 19
```
