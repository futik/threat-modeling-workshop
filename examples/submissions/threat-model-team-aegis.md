# Threat Model Worksheet — NeuroScan 3000
Team name: Team Aegis     Date: 2026-05-14
Workshop: Medical Device Threat Modeling

## Q1: What are we working on?

### 1.1 System boundary
In scope — components and interfaces your team will analyze:
Imaging unit (MRI hardware + embedded RTOS firmware)
Acquisition workstation (Windows 10, scanning software, admin console :8443)
Local DICOM server
Cloud AI inference service and cloud storage (anonymised images)
Update delivery service and manufacturer backend
All data flows and interfaces between the above (TB-1 through TB-5)
Out of scope — what you exclude, and why:
Hospital EMR/HIS — separate procurement and governance; modelled as a partially-trusted external system (boundary TB-6). We do not own it, but we validate all data crossing the EMR interface as untrusted input
Hospital network hardware (switches, firewalls) — outside MediScanTech control; treated as the threat boundary rather than a controlled component

### 1.2 Assets — what are we protecting?

| Asset ID | Asset | Why it matters | Most critical property (C/I/A) |
| --- | --- | --- | --- |
| A-01 | Patient DICOM images with PHI | Contains PHI; disclosure harms patients and breaches privacy law | Confidentiality + Integrity |
| A-02 | AI diagnostic annotations | Clinical decision support; tampering can cause misdiagnosis and patient harm | Integrity |
| A-03 | Imaging unit firmware | Compromise gives persistent control and can alter scan behaviour | Integrity |
| A-04 | Firmware/software update packages | A malicious update compromises every fielded device | Integrity |
| A-05 | Admin + remote-support credentials | Full control of the device if stolen | Confidentiality |
| A-06 | Scan availability (ability to image) | Downtime delays diagnosis in time-critical cases (e.g. stroke) | Availability |
| A-07 | Anonymisation logic | If it under-scrubs, PHI leaks to the cloud | Confidentiality + Integrity |


### 1.3 Entry points — how can someone get in?

| Entry point | How it works | Authentication? | Encrypted? | Who can reach it? |
| --- | --- | --- | --- | --- |
| Local admin console (:8443) | Web UI on the workstation | Username/password, no MFA | Yes (HTTPS) | Anyone on the hospital LAN |
| Remote support (VPN+SSH) | Vendor remote access | Shared credential, no MFA | Yes (VPN) | MediScanTech support staff (internet) |
| Workstation ↔ Local DICOM server | DICOM TCP/104 | None by default | None by default | Anyone on the hospital LAN |
| Workstation ↔ Cloud AI service | HTTPS REST | Mutual TLS + API key | TLS 1.3 | Internet-facing |
| Update delivery | Signed package pull over HTTPS | Package signing (RSA-2048) | TLS 1.3 | Internet-facing |
| Workstation ↔ Hospital EMR (TB-6) | HL7 FHIR over HTTPS | OAuth 2.0 | TLS 1.3 | Partially-trusted external system |
| Imaging unit ↔ Workstation | Proprietary USB | None (physical) | None | Physical access on-site |


### 1.4 Threat actors — who might attack this?

| Actor | Motivation | How they might get in |
| --- | --- | --- |
| Ransomware group | Financial — encrypt systems, demand payment | Phishing hospital staff; exploiting internet-facing services |
| Malicious hospital insider | Sabotage, data theft, bribery | Legitimate LAN access and workstation credentials |
| Nation-state actor | Healthcare disruption, espionage | Supply-chain compromise, spear-phishing, zero-days |
| Rogue MediScanTech engineer | Financial, espionage | Privileged access to cloud backend and update delivery |
| Opportunistic external attacker | Data resale, notoriety | Man-in-the-middle on the hospital LAN; brute force of exposed services |


## Q2: What can go wrong?

### 2.1 Attacker stories

| Story ID | Bad actor | Attacker story | Part of system affected | Impact type (S/P/A) |
| --- | --- | --- | --- | --- |
| S-01 | Ransomware group | As a ransomware group, I want to encrypt the acquisition workstation via a phishing email to hospital staff, so that scanning halts and the hospital pays a ransom. | Acquisition workstation | A |
| S-02 | Opportunistic attacker | As an attacker with a LAN foothold, I want to modify unencrypted DICOM traffic between the workstation and the local DICOM server, so that the radiologist diagnoses from corrupted images. | Workstation ↔ DICOM (TB-3) | S |
| S-03 | External attacker | As an attacker, I want to brute-force the local admin console (no MFA, no rate limiting) via the hospital LAN, so that I gain workstation administrator access. | Admin console :8443 | S |
| S-04 | Rogue vendor technician | As a support technician, I want to use the shared remote-support credential beyond my role, so that I can exfiltrate PHI or plant a backdoor undetected. | Remote support | P |
| S-05 | Nation-state actor | As a nation-state, I want to push a malicious firmware update via the update delivery service, so that I persistently control fielded imaging units and can manipulate scans. | Update delivery → firmware | S |
| S-06 | Rogue MediScanTech engineer | As a cloud engineer, I want to alter the AI model weights, so that the service systematically misclassifies specific lesion types across all hospitals. | Cloud AI model | S |
| S-07 | Malicious insider | As an insider with cloud access, I want to re-identify anonymised images using external demographic data, so that I can breach patient privacy at scale. | Cloud storage | P |
| S-08 | External attacker | As an attacker, I want to flood the cloud AI inference service, so that annotations are unavailable during active scans and the workflow is disrupted. | Cloud AI service | A |
| S-09 | Opportunistic attacker | As an attacker, I want to exploit weak anonymisation (burned-in PHI in pixel data), so that PHI is transmitted to the cloud in the clear. | Anonymisation boundary | P |
| S-10 | Malicious insider | As an admin-level attacker, I want to clear the audit logs on the workstation and DICOM server, so that my actions cannot be attributed. | Workstation + DICOM logs | P |
| S-11 | External attacker (via hospital EMR) | As an attacker who has compromised the partially-trusted hospital EMR, I want to send malformed HL7 FHIR messages across the EMR interface to the workstation, so that I exploit a parser flaw to run code or feed corrupted patient/order data into a scan. | Workstation ↔ EMR (TB-6) | S |


### 2.2 Risk assessment

| Story ID | Exploitability (1–3) | Rationale | Severity (1–3) | Rationale | Risk score | Patient safety? | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-01 | 3 | Phishing is trivial; workstation is internet-connected | 3 | Extended loss of scanning; delays time-critical diagnosis | 9 | Yes | High |
| S-02 | 2 | LAN foothold achievable; DICOM often unencrypted | 3 | Corrupted images drive misdiagnosis — direct patient harm | 6 | Yes | High |
| S-03 | 3 | No MFA, no rate limiting, whole-LAN reachable | 3 | Full workstation control; pivot to connected systems | 9 | Yes | High |
| S-04 | 2 | Shared credential known to many; no MFA | 3 | Undetectable full access; PHI loss and backdoor | 6 | Yes | High |
| S-05 | 1 | Requires compromising the signed update pipeline | 3 | Persistent fleet compromise; scan manipulation | 3 | Yes | High (safety override) |
| S-06 | 1 | Needs privileged model-deploy access; hard to conceal | 3 | Systematic misdiagnosis across hospitals | 3 | Yes | High (safety override) |
| S-07 | 1 | Sophisticated insider + external data needed | 2 | Large-scale PHI breach; regulatory exposure | 2 | No | Medium |
| S-08 | 2 | Public endpoint; may lack rate limiting | 2 | Workflow disruption; radiologist can proceed without AI | 4 | No | Medium |
| S-09 | 2 | Anonymisation bugs are a known DICOM issue class | 2 | PHI breach; GDPR exposure | 4 | No | Medium |
| S-10 | 2 | Needs prior admin access; log clearing then trivial | 1 | Forensics impaired; no direct harm alone | 2 | No | Low |
| S-11 | 2 | EMR is partially-trusted and outside our control; HL7/FHIR parser flaws are a known class | 3 | Code execution on the workstation or corrupted order data used during a scan | 6 | Yes | High |


## Q3: What are we going to do about it?

| Mitigation ID | Addresses story(ies) | Type | What exactly would be done | Residual risk | Regulatory note |
| --- | --- | --- | --- | --- | --- |
| M-01 | S-03, S-04 | Preventive | Enforce TOTP MFA on the admin console; replace the shared remote-support credential with per-engineer PKI certificates; rate-limit logins (5/min, 30-min lockout) and log all sessions | Credential theft still possible on a compromised host | Software/config change — likely no new 510(k) |
| M-02 | S-02 | Preventive | Enable DICOM-over-TLS (port 2762) on all local DICOM connections; allowlist workstation IP/MAC | A compromised workstation can still send malicious data once allowlisted | Config change — document in security file |
| M-03 | S-05, S-06 | Preventive + Detective | Vendor-sign AI inference responses (JWS) and verify on the workstation before display; log all model-version transitions; add post-update firmware integrity attestation | Signing-key compromise still allows tampering | May be a design change — assess FDA impact |
| M-04 | S-01 | Corrective | Immutable off-site backups of the workstation image + tested restore runbook; EDR with isolation | Ransom pressure remains during restore window | Software change; no new submission |
| M-05 | S-09 | Detective | Integrate a DICOM anonymisation audit tool that scans for burned-in PHI before upload and blocks/loggs failures | Zero-day anonymisation gaps missed until the tool updates | Add to design verification |
| M-06 | S-08 | Compensating | Graceful degradation: if AI is unavailable >60s, warn the radiologist and allow manual-only review; alert on-call | No AI assistance during degradation | Software change |
| M-07 | S-11 | Preventive | Treat the EMR interface (TB-6) as untrusted input: strict HL7 FHIR schema validation and sanitisation, run the FHIR parser in a sandboxed least-privilege process, and mutually authenticate the connection (OAuth 2.0 + pinned TLS) | Zero-day parser flaws remain until patched; a fully compromised EMR can still send well-formed but false data | Software change — add interface fuzzing to design verification |


## Q4: Did we do a good job?

### Our top 3 threats
1.  S-03:  No MFA on the admin console with whole-LAN reach — trivial full compromise
2.  S-01:  Ransomware on the internet-connected workstation halts scanning
3.  S-02:  Unencrypted DICOM lets an attacker corrupt images and cause misdiagnosis

### Most surprising finding
S-06 — model-weight manipulation. The AI is a black box the hospital doesn't control, so a systematic bias could harm thousands of patients before anyone notices. It has no clean precedent in traditional device threat modelling.

### Hardest trade-off
Properly fixing S-05 needs secure boot with a hardware root of trust, which forces a hardware revision and a new FDA 510(k). We chose signed updates + post-update integrity attestation as an interim control while planning the hardware change, accepting the residual risk explicitly.

### What we're still unsure about
MediScanTech's rotation SLA for the shared remote-support credential (S-04)
Whether the anonymisation software (S-09) has ever been independently audited
Whether the cloud AI service has its own threat model shared with hospitals
