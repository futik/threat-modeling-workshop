# Threat Model — NeuroScan 3000 (EXAMPLE / REFERENCE)

> **Team name:** Workshop Facilitators — Reference Example  
> **Date:** Workshop Day  
> **Note:** This is a partial worked example covering selected threats. It is not exhaustive — your group should find more.

---

## Section 1: Scope

### 1.1 System boundary

**In scope:**
- Imaging unit (MRI scanner hardware + embedded RTOS firmware)
- Acquisition workstation (Ubuntu 22.04 LTS + NeuroScan Acquire v4.2 + local admin console)
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
| Remote support | VPN + SSH | Shared credential | TLS (VPN) | Untrusted (internet) — HIGH RISK |
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

## Section 2: Threat Identification (Attacker Stories)

This workshop uses **attacker stories** as the primary way to identify threats.
Each story follows the format the worksheet asks participants to use:

> **As a** [bad actor], **I want to** [do something bad] **via** [method or entry point], **so that** [I achieve my goal].

The **Story ID**, **Bad actor**, **Attacker story**, **Part of system affected**,
and **Impact type (S/P/A)** columns are the ones participants fill in. The two
right-hand columns (STRIDE, ATT&CK) are *optional supporting information* — a way
to sanity-check coverage after the stories are written, not a required input. Fill
in the stories first; the STRIDE/ATT&CK tags come second.

**Impact type:** **S** = patient safety (physical harm) · **P** = privacy / PHI · **A** = availability.

| Story ID | Bad actor | Attacker story | Part of system affected | Impact type (S/P/A) | STRIDE (optional) | ATT&CK (optional) |
|----------|-----------|----------------|-------------------------|---------------------|-------------------|-------------------|
| S-01 | External attacker | As an attacker with access to the update delivery service, I want to push a malicious firmware update to the imaging unit, so that I persistently compromise the device and can manipulate sensor/scan data | Update delivery → imaging unit firmware | S | Tampering | T0839 Module Firmware |
| S-02 | External attacker | As an attacker, I want to spear-phish a MediScanTech engineer and hijack their cloud credentials, so that I can impersonate MediScanTech services and send falsified AI annotations to the workstation | Cloud AI inference service | S | Spoofing | T0865 Spearphishing |
| S-03 | Opportunistic attacker | As an attacker with a hospital-LAN foothold, I want to intercept and modify unencrypted DICOM traffic between the workstation and the local DICOM server, so that the AI and radiologist diagnose from corrupted images | Workstation ↔ DICOM server (TB-3) | S | Tampering | T0831 Manipulation of Control |
| S-04 | External attacker | As an attacker on the hospital LAN, I want to brute-force the local admin console (no MFA, no rate limiting), so that I gain administrator access to the acquisition workstation and can pivot across the system | Local admin console (:8443) | S | Elevation of privilege | T0859 Valid Accounts |
| S-05 | Malicious insider (MediScanTech) | As a MediScanTech insider, I want to access anonymized images in cloud storage and re-identify them using external demographic data, so that I breach patient privacy at scale | Cloud storage | P | Information disclosure | T0830 Man in the Middle |
| S-06 | External attacker | As an attacker, I want to flood the cloud AI inference service with requests, so that it cannot return annotations during active scans and clinical workflow is disrupted | Cloud AI inference service | A | Denial of service | T0814 Denial of Service |
| S-07 | Rogue vendor technician | As a support technician, I want to use the shared remote-support credential to open an SSH session to the workstation, so that I gain full control without detection | Remote support interface | S | Spoofing | — |
| S-08 | Malicious insider | As an attacker who has gained admin access, I want to clear the audit logs on the workstation and DICOM server, so that my actions cannot be attributed | Local DICOM server + workstation logs | P | Repudiation | — |
| S-09 | Rogue MediScanTech engineer | As a cloud engineer, I want to modify the AI model weights, so that the inference service systematically misclassifies specific lesion types across all hospitals | Cloud AI inference service (model) | S | Tampering | T0836 Modify Parameter |
| S-10 | Opportunistic attacker | As an attacker, I want to exploit weak anonymization (burned-in PHI in DICOM pixel data), so that PHI is transmitted to the cloud in the clear | Workstation → cloud (anonymization boundary) | P | Information disclosure | — |

---

## Section 3: Risk Assessment

| Story ID | Exploitability | Exploitability rationale | Severity | Severity rationale | Score | Safety override? | Priority |
|----------|-----------|---------------------|--------|-----------------|-------|----------------|---------|
| S-01 | 2 | Requires compromising the update delivery pipeline — non-trivial but supply chain attacks are well-documented | 3 | Persistent firmware compromise gives attacker full control; could alter scan behavior | 6 | Yes — manipulated scans directly endanger patients | **High** |
| S-02 | 2 | Spear phishing is common; cloud credential compromise is high-value target | 3 | AI annotation tampering could lead radiologist to misdiagnosis | 6 | Yes | **High** |
| S-03 | 2 | Hospital LAN foothold is achievable via phishing; DICOM is often unencrypted | 3 | Corrupted images used for diagnosis | 6 | Yes | **High** |
| S-04 | 3 | No MFA, no rate limiting, accessible from entire hospital LAN — easy to brute-force | 3 | Full workstation control, pivot to all connected systems | 9 | Yes | **High** |
| S-05 | 1 | Requires sophisticated insider with access + external data for re-identification | 2 | Serious privacy breach; regulatory consequences | 2 | No | **Medium** |
| S-06 | 2 | Cloud DoS is easy to attempt; API endpoint may not be rate-limited | 2 | Clinical disruption but radiologist can still work without AI (compensating) | 4 | No | **Medium** |
| S-07 | 2 | Shared credential may be known to multiple people; no MFA | 3 | Full workstation access, undetectable without logging | 6 | Yes — could be used to alter device behavior during scan | **High** |
| S-08 | 2 | Attacker already needs admin access; log clearing is easy once inside | 1 | Forensics impacted, but no direct harm | 2 | No | **Low** |
| S-09 | 1 | Requires privileged insider with model deployment access; difficult to conceal | 3 | Systematic misclassification across all hospitals — severe patient harm | 3 | Yes — escalate | **High** |
| S-10 | 2 | Known issue class; anonymization bugs are frequently discovered in DICOM software | 2 | Privacy breach; potential GDPR fine; reputational damage | 4 | No | **Medium** |

---

## Section 4: Mitigations

| Mitigation ID | Addresses | Type | Description | Residual risk | Regulatory note |
|--------------|-----------|------|-------------|--------------|----------------|
| M-01 | S-04, S-07 | Preventive | Enforce TOTP-based MFA on local admin console and remote support accounts; replace shared remote support credential with per-engineer PKI certificates; rate-limit login attempts (5/min, 30-min lockout) | Credential theft still possible if device is compromised; MFA bypass via SIM swap | Software change only — likely no new clearance required |
| M-02 | S-03 | Preventive | Enable DICOM TLS (DICOM over TLS, port 2762) on all local DICOM connections; restrict DICOM connections to allowlisted workstation IP/MAC | Compromised workstation can still send malicious data once on the allowlist | Configuration change — document in security documentation |
| M-03 | S-01, S-09 | Detective + Preventive | Implement cryptographic signing of AI inference responses (vendor-signed JWS); workstation verifies signature before displaying annotations; log all model version transitions in cloud | Compromised signing key still allows tampering | May require design change — evaluate FDA impact |
| M-04 | S-02 | Preventive | Enforce hardware MFA (FIDO2) for all MediScanTech engineer cloud accounts; implement just-in-time access for production cloud systems | Phishing of backup codes possible | Internal process change |
| M-05 | S-10 | Detective | Integrate a third-party DICOM anonymization audit tool that checks for burned-in PHI in pixel data before upload; log any detected and blocked uploads | Zero-day anonymization failures not caught until tool is updated | Software change — add to design verification |
| M-06 | S-06 | Corrective | Implement graceful degradation mode: if cloud AI is unavailable for >60s, display clear warning to radiologist and allow scan to proceed with manual-only review; alert on-call engineer | Radiologist workflow affected; no AI assistance during degradation | Software change |

---

## Section 5: Summary & Open Questions

### Top 3 highest-risk threats

1. **S-04**: No MFA on admin console with hospital-wide LAN access — trivial to exploit, full system compromise
2. **S-07**: Shared remote support credential — persistent, undetectable access possible
3. **S-03**: Unencrypted DICOM traffic on hospital LAN — image manipulation can directly cause misdiagnosis

### Most surprising or unexpected threat

> **S-09** — Model weight manipulation by a rogue insider. The AI model is a black box to the hospital, runs on infrastructure the hospital doesn't control, and a systematic bias in its output might go undetected for months across thousands of patients. This is a novel threat class that doesn't have a clear precedent in traditional medical device threat modeling.

### Hardest mitigation trade-off

> Fixing **S-01** (malicious firmware update) properly requires secure boot with a hardware root of trust. This would require a hardware revision to the imaging unit — triggering a new FDA 510(k) submission. The alternative (software-only integrity checks) is weaker. We opted for a detective compensating control (signed update packages + post-update integrity hash verification) as an interim measure while planning the hardware revision.

### Open questions

- What is MediScanTech's SLA for rotating the shared remote support credential (S-07)?
- Has the anonymization software (S-10) ever been independently audited?
- Does the cloud AI service have its own threat model? Is it shared with hospitals?
