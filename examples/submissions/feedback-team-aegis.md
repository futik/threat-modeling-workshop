# Feedback — Team Aegis

### Overall score: 29/30

### Dimension scores

| Dimension | Score | Comments |
|-----------|-------|---------|
| Scope completeness | 5/5 | All on-premise and cloud components are in scope, and the out-of-scope calls (EMR/HIS as partially-trusted, hospital network hardware as the threat boundary) are justified rather than hand-waved. Assets carry stable IDs and the entry-point table matches the architecture, including the proprietary USB link, the update channel, and the EMR interface. Trust boundaries TB-1..TB-6 are referenced explicitly, and the partially-trusted EMR boundary (TB-6) is not just excluded but actively defended as untrusted input. |
| Threat coverage | 5/5 | Eleven distinct stories spanning tampering (S-02, S-05, S-06), spoofing/valid-accounts (S-03, S-04), information disclosure (S-07, S-09), denial of service (S-08), repudiation (S-10), and malformed input across the partially-trusted EMR boundary (S-11, TB-6). Coverage reaches every trust boundary and both the on-prem and cloud halves; no obvious threat class is missing. |
| Threat quality | 5/5 | Every story follows the actor→action→method→goal format and names an exact component or interface (e.g. "modify unencrypted DICOM traffic between the workstation and the local DICOM server"). Impact types (S/P/A) are tagged and consistent with the harm scored later. |
| Risk assessment accuracy | 5/5 | Scoring is exploitability-based, not probabilistic, and the rationales defend each number. The patient-safety override is applied correctly: S-05 and S-06 score only 3 numerically (low exploitability) but are escalated to High because they can cause direct patient harm — exactly the FDA controlled/uncontrolled logic. Confidentiality-only threats (S-07, S-09) are scored on privacy severity rather than "no harm". |
| Mitigation quality | 4/5 | Mitigations are specific and root-cause oriented (per-engineer PKI instead of the shared credential; DICOM-over-TLS on port 2762 with IP/MAC allowlisting; signed AI responses verified on the workstation). Residual risk is noted on every row and the regulatory column is used. Half-point rounding down: M-04 leans on backups for S-01 but does not pair a preventive control (e.g. phishing-resistant email/EDR hardening) to reduce the initial infection likelihood. |
| Regulatory & medical awareness | 5/5 | Strong. The team recognises that fixing S-05 properly needs secure boot with a hardware root of trust, which triggers a new 510(k), and chooses a documented interim control with explicit residual-risk acceptance — this mirrors the FDA lifecycle/TPLC expectation that risk decisions are maintained and justified. Availability is treated as safety-relevant (stroke timing), and the regulatory-impact column distinguishes config changes from design changes. |

### Strengths

- **Scope discipline.** Out-of-scope items are argued (EMR as partially-trusted, hospital network as the threat boundary) instead of simply dropped, which is what lets the rest of the model stay honest about attacker footholds.
- **Correct security-risk methodology.** Exploitability × severity with a patient-safety override, applied consistently. S-05/S-06 being escalated despite low exploitability shows the team understood *why* the FDA rejects probabilistic scoring for security risk.
- **Mitigations tied to root cause with regulatory framing.** Replacing the shared credential with per-engineer certificates (not just "add MFA") and flagging the secure-boot/510(k) trade-off are exactly the kind of specifics an assessor looks for.
- **Lifecycle thinking.** The secure-boot-vs-interim-control decision, with residual risk accepted explicitly, treats the threat model as a living artifact rather than a one-off.

### Gaps & missed threats

- **Update-integrity for the workstation, not just firmware.** S-05 covers malicious firmware to the imaging unit; the team could add the parallel threat of a tampered *software* update to the acquisition workstation via the same delivery service.
- **Supply-chain / third-party components (SBOM).** No story addresses a vulnerability inherited from a bundled COTS/open-source component. Under §524B this is a required dimension (SBOM), and it is a natural NeuroScan threat given the Windows workstation.
- **Preventive control for ransomware (S-01).** As noted above, the mitigation is recovery-only; a preventive layer would round it out.

### Improvement suggestions

1. Add a workstation software-update tampering story to complement S-05, and note that both should trace to the SBOM for §524B traceability.
2. Pair S-01 with a preventive control (phishing-resistant MFA on hospital SSO where in scope, application allowlisting/EDR) so mitigation isn't purely corrective.
3. Add one supply-chain threat (vulnerable third-party library in the workstation or cloud service) and a monitoring/patch-cadence mitigation, referencing the FDA "known unacceptable vulnerabilities on a regular cycle" duty.
4. For S-07 (re-identification), consider a preventive data-minimisation control (k-anonymity / removing quasi-identifiers pre-upload), not only the detective audit.
5. Record a review/refresh trigger (new CVE, control degradation) to make the lifecycle intent explicit in the document itself.

### Notable observations

The framing of S-06 (model-weight manipulation) as a novel threat class with no clean precedent in traditional device threat modelling is a genuinely sharp insight — a systematic AI bias affecting many patients before detection is precisely the kind of harm the availability/integrity-for-safety lens is meant to surface. This is workshop-leading work.

```scores
scope: 5
threat_coverage: 5
threat_quality: 5
risk_assessment: 5
mitigation_quality: 4
regulatory_awareness: 5
total: 29
```
