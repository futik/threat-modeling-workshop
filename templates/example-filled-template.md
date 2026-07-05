# Threat Model — NeuroScan 3000 (EXAMPLE / REFERENCE)

> **Team name:** Workshop Facilitators — Reference Example  
> **Date:** Workshop Day  
> **Note:** This is a partial worked example covering selected threats. It is not exhaustive — your group should find more.

---

## Section 1: Scope

### 1.1 System boundary

**In scope:**
- Imaging unit (MRI scanner hardware + embedded RTOS firmware)
- Acquisition workstation (Windows 11 + NeuroScan Acquire v4.2 + local admin console)
- Local DICOM server
- MediScanTech cloud AI inference service
- MediScanTech cloud storage (anonymized images)
- MediScanTech analytics dashboard
- MediScanTech update delivery service
- All network interfaces and data flows between the above

**Out of scope (with rationale):**
- Hospital EMR/HIS — owned by the hospital, separate procurement and security governance; treated as a partially-trusted external system
- Hospital network infrastructure (switches, firewalls) — out of manufacturer control; modeled as the threat boundary, not a controlled component

---

### 1.2 Assets

| Asset ID | Asset | Type | Most critical property | Notes |
|----------|-------|------|----------------------|-------|
| A-01 | Patient DICOM images (with PHI) | Data | Confidentiality + Integrity | Stored on local DICOM server; never sent to cloud with PHI |
| A-02 | Anonymized DICOM images | Data | Integrity | Re-identification risk if anonymization is incomplete |
| A-03 | AI diagnostic annotations | Data | Integrity | Clinical decision support — tampering could harm patients |
| A-04 | Imaging unit firmware | Software | Integrity | Compromise enables persistent access and sensor manipulation |
| A-05 | Admin credentials (local console + cloud) | Credential | Confidentiality | Full control of device if compromised |
| A-06 | Firmware update packages | Software | Integrity | Malicious update could compromise entire device |
| A-07 | Device availability (scan capability) | Function | Availability | Unavailability can delay diagnosis in time-sensitive cases |

---

### 1.3 Entry points & interfaces

| Entry point | Protocol / interface | Authentication | Encryption | Trust level |
|-------------|---------------------|---------------|-----------|-------------|
| Imaging unit ↔ Workstation | Proprietary USB | None | None | Trusted (physical) |
| Workstation ↔ Local DICOM server | DICOM TCP/104 | None (default) | None (default) | Semi-trusted (hospital LAN) |
| Workstation ↔ Cloud AI service | HTTPS REST | Mutual TLS + API key | TLS 1.3 | Untrusted (internet) |
| Workstation ↔ EMR | HTTPS HL7 FHIR | OAuth 2.0 | TLS 1.3 | Untrusted (external system) |
| Local admin console (:8443) | HTTPS | Username/password (no MFA) | TLS | Semi-trusted (hospital LAN) |
| Cloud analytics dashboard | HTTPS | SSO (SAML) | TLS 1.3 | Untrusted (internet) |
| Remote support | VPN + RDP | Shared credential | TLS (VPN) | Untrusted (internet) — HIGH RISK |
| Update delivery | HTTPS | Package signing (RSA-2048) | TLS 1.3 | Untrusted (internet) |

---

### 1.4 Threat actors

| Actor | Motivation | Likely access vector | Assumed capability |
|-------|-----------|---------------------|-------------------|
| External cybercriminal | Ransomware, data sale | Phishing hospital staff, exploit internet-facing services | Moderate — uses off-the-shelf tooling |
| Malicious insider (hospital) | Sabotage, data theft, bribery | Direct LAN access, legitimate workstation credentials | Low–High depending on role |
| Nation-state actor | Healthcare disruption, espionage | Supply chain, spear phishing, zero-days | High — well-resourced, patient |
| MediScanTech rogue employee | Financial, espionage | Cloud backend access, update delivery system | High — privileged access to all systems |

---

## Section 2: Threat Identification

| Threat ID | STRIDE category | ATT&CK technique | Threat statement | Component / data flow affected |
|-----------|----------------|-----------------|-----------------|-------------------------------|
| T-01 | Tampering | T0839 Module Firmware | An attacker with access to the update delivery service can push a malicious firmware update to the imaging unit, causing persistent compromise of the device including sensor data manipulation | Update delivery → Imaging unit firmware |
| T-02 | Spoofing | T0865 Spearphishing | An external attacker can spear-phish a MediScanTech engineer, hijack their cloud credentials, and impersonate MediScanTech services, causing falsified AI annotations to be sent to the workstation | Cloud AI inference service |
| T-03 | Tampering | T0831 Manipulation of Control | An attacker on the hospital LAN can intercept unencrypted DICOM traffic between the workstation and local DICOM server and modify image data, causing the AI and radiologist to diagnose from corrupted images | Workstation ↔ DICOM server (TB-3) |
| T-04 | Elevation of privilege | T0859 Valid Accounts | An attacker can brute-force the local admin console (no MFA, no rate limiting) and gain administrator access to the acquisition workstation, enabling further compromise of the entire system | Local admin console (:8443) |
| T-05 | Information disclosure | T0830 Man in the Middle | A MediScanTech insider can access anonymized images in cloud storage and perform re-identification using external demographic data, causing a patient privacy breach | Cloud storage |
| T-06 | Denial of service | T0814 Denial of Service | An external attacker can flood the cloud AI inference service with requests, preventing it from returning annotations during active scans, causing clinical workflow disruption | Cloud AI inference service |
| T-07 | Spoofing | — | An attacker with network access can use the shared remote support credential to open an RDP session to the acquisition workstation, gaining full control without detection | Remote support interface |
| T-08 | Repudiation | — | An attacker who gains access to the local admin console can clear audit logs, preventing forensic attribution of their actions | Local DICOM server + workstation logs |
| T-09 | Tampering | T0836 Modify Parameter | A rogue MediScanTech engineer can modify the AI model weights in the cloud, causing the inference service to systematically misclassify specific lesion types | Cloud AI inference service (model) |
| T-10 | Information disclosure | — | The acquisition workstation's anonymization software may fail to scrub PHI embedded in DICOM pixel data (burned-in annotations), resulting in PHI being transmitted to the cloud | Workstation → Cloud (anonymization boundary) |

---

## Section 3: Risk Assessment

| Threat ID | Likelihood | Likelihood rationale | Impact | Impact rationale | Score | Safety override? | Priority |
|-----------|-----------|---------------------|--------|-----------------|-------|----------------|---------|
| T-01 | 2 | Requires compromising the update delivery pipeline — non-trivial but supply chain attacks are well-documented | 3 | Persistent firmware compromise gives attacker full control; could alter scan behavior | 6 | Yes — manipulated scans directly endanger patients | **High** |
| T-02 | 2 | Spear phishing is common; cloud credential compromise is high-value target | 3 | AI annotation tampering could lead radiologist to misdiagnosis | 6 | Yes | **High** |
| T-03 | 2 | Hospital LAN foothold is achievable via phishing; DICOM is often unencrypted | 3 | Corrupted images used for diagnosis | 6 | Yes | **High** |
| T-04 | 3 | No MFA, no rate limiting, accessible from entire hospital LAN — easy to brute-force | 3 | Full workstation control, pivot to all connected systems | 9 | Yes | **High** |
| T-05 | 1 | Requires sophisticated insider with access + external data for re-identification | 2 | Serious privacy breach; regulatory consequences | 2 | No | **Medium** |
| T-06 | 2 | Cloud DoS is easy to attempt; API endpoint may not be rate-limited | 2 | Clinical disruption but radiologist can still work without AI (compensating) | 4 | No | **Medium** |
| T-07 | 2 | Shared credential may be known to multiple people; no MFA | 3 | Full workstation access, undetectable without logging | 6 | Yes — could be used to alter device behavior during scan | **High** |
| T-08 | 2 | Attacker already needs admin access; log clearing is easy once inside | 1 | Forensics impacted, but no direct harm | 2 | No | **Low** |
| T-09 | 1 | Requires privileged insider with model deployment access; difficult to conceal | 3 | Systematic misclassification across all hospitals — severe patient harm | 3 | Yes — escalate | **High** |
| T-10 | 2 | Known issue class; anonymization bugs are frequently discovered in DICOM software | 2 | Privacy breach; potential GDPR fine; reputational damage | 4 | No | **Medium** |

---

## Section 4: Mitigations

| Mitigation ID | Addresses | Type | Description | Residual risk | Regulatory note |
|--------------|-----------|------|-------------|--------------|----------------|
| M-01 | T-04, T-07 | Preventive | Enforce TOTP-based MFA on local admin console and remote support accounts; replace shared remote support credential with per-engineer PKI certificates; rate-limit login attempts (5/min, 30-min lockout) | Credential theft still possible if device is compromised; MFA bypass via SIM swap | Software change only — likely no new clearance required |
| M-02 | T-03 | Preventive | Enable DICOM TLS (DICOM over TLS, port 2762) on all local DICOM connections; restrict DICOM connections to allowlisted workstation IP/MAC | Compromised workstation can still send malicious data once on the allowlist | Configuration change — document in security documentation |
| M-03 | T-01, T-09 | Detective + Preventive | Implement cryptographic signing of AI inference responses (vendor-signed JWS); workstation verifies signature before displaying annotations; log all model version transitions in cloud | Compromised signing key still allows tampering | May require design change — evaluate FDA impact |
| M-04 | T-02 | Preventive | Enforce hardware MFA (FIDO2) for all MediScanTech engineer cloud accounts; implement just-in-time access for production cloud systems | Phishing of backup codes possible | Internal process change |
| M-05 | T-10 | Detective | Integrate a third-party DICOM anonymization audit tool that checks for burned-in PHI in pixel data before upload; log any detected and blocked uploads | Zero-day anonymization failures not caught until tool is updated | Software change — add to design verification |
| M-06 | T-06 | Corrective | Implement graceful degradation mode: if cloud AI is unavailable for >60s, display clear warning to radiologist and allow scan to proceed with manual-only review; alert on-call engineer | Radiologist workflow affected; no AI assistance during degradation | Software change |

---

## Section 5: Summary & Open Questions

### Top 3 highest-risk threats

1. **T-04**: No MFA on admin console with hospital-wide LAN access — trivial to exploit, full system compromise
2. **T-07**: Shared remote support credential — persistent, undetectable access possible
3. **T-03**: Unencrypted DICOM traffic on hospital LAN — image manipulation can directly cause misdiagnosis

### Most surprising or unexpected threat

> **T-09** — Model weight manipulation by a rogue insider. The AI model is a black box to the hospital, runs on infrastructure the hospital doesn't control, and a systematic bias in its output might go undetected for months across thousands of patients. This is a novel threat class that doesn't have a clear precedent in traditional medical device threat modeling.

### Hardest mitigation trade-off

> Fixing **T-01** (malicious firmware update) properly requires secure boot with a hardware root of trust. This would require a hardware revision to the imaging unit — triggering a new FDA 510(k) submission. The alternative (software-only integrity checks) is weaker. We opted for a detective compensating control (signed update packages + post-update integrity hash verification) as an interim measure while planning the hardware revision.

### Open questions

- What is MediScanTech's SLA for rotating the shared remote support credential (T-07)?
- Has the anonymization software (T-10) ever been independently audited?
- Does the cloud AI service have its own threat model? Is it shared with hospitals?
