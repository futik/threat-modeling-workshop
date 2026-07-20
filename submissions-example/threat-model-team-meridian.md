# Threat Model Worksheet — NeuroScan 3000
Team name: Team Meridian     Date: 2026-05-14
Workshop: Medical Device Threat Modeling

## Q1: What are we working on?

### 1.1 System boundary
In scope — components and interfaces your team will analyze:
Acquisition workstation and admin console
Local DICOM server
Cloud AI inference service
Update delivery
Out of scope — what you exclude, and why:
Hospital Wi-Fi — managed by hospital IT
Imaging unit firmware — we assumed it was trusted (did not analyse in depth)

### 1.2 Assets — what are we protecting?

| Asset ID | Asset | Why it matters | Most critical property (C/I/A) |
| --- | --- | --- | --- |
| A-01 | Patient images (PHI) | Privacy and patient trust | Confidentiality |
| A-02 | AI results | Used for diagnosis | Integrity |
| A-03 | Admin credentials | Control of the workstation | Confidentiality |
| A-04 | Scanning availability | Needed for patient care | Availability |
| A-05 | Update packages | Could be abused to push bad code | Integrity |


### 1.3 Entry points — how can someone get in?

| Entry point | How it works | Authentication? | Encrypted? | Who can reach it? |
| --- | --- | --- | --- | --- |
| Admin console :8443 | Web UI | Password only | HTTPS | Hospital LAN |
| Remote support | Vendor login | Shared credential | VPN | Internet |
| Cloud AI API | REST | TLS + key | Yes | Internet |
| DICOM server | DICOM | None | No | Hospital LAN |


### 1.4 Threat actors — who might attack this?

| Actor | Motivation | How they might get in |
| --- | --- | --- |
| Hackers | Money / ransomware | Phishing, internet-facing services |
| Insider | Revenge or money | Existing access |
| Vendor staff | Misuse of access | Remote support credential |


## Q2: What can go wrong?

### 2.1 Attacker stories

| Story ID | Bad actor | Attacker story | Part of system affected | Impact type (S/P/A) |
| --- | --- | --- | --- | --- |
| S-01 | Hackers | As a hacker, I want to phish staff and deploy ransomware on the workstation, so that the hospital can't scan. | Workstation | A |
| S-02 | Hackers | As an attacker on the LAN, I want to read DICOM traffic, so that I can steal patient images. | DICOM server | P |
| S-03 | Hackers | As an attacker, I want to log into the admin console because there is no MFA, so that I control the workstation. | Admin console | P |
| S-04 | Vendor staff | As a support engineer, I want to use the shared credential to access more than I should, so that I can view patient data. | Remote support | P |
| S-05 | Insider | As an insider, I want to change AI results, so that a patient is misdiagnosed. | Cloud AI service | S |
| S-06 | Hackers | As an attacker, I want to push a fake update, so that I can install malware on the device. | Update delivery | S |
| S-07 | Hackers | As an attacker, I want to DoS the cloud AI, so that annotations are unavailable. | Cloud AI service | A |
| S-08 | Insider | As an insider, I want to copy anonymised images and re-identify them, so that I breach privacy. | Cloud storage | P |


### 2.2 Risk assessment

| Story ID | Exploitability (1–3) | Rationale | Severity (1–3) | Rationale | Risk score | Patient safety? | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-01 | 3 | Phishing is easy | 3 | No scanning | 9 | Yes | High |
| S-02 | 2 | LAN access needed | 2 | Privacy breach | 4 | No | Medium |
| S-03 | 3 | No MFA | 2 | Attacker gets in | 6 | No | High |
| S-04 | 2 | Shared credential | 2 | Data access | 4 | No | Medium |
| S-05 | 2 | Needs access | 3 | Wrong diagnosis | 6 | Yes | High |
| S-06 | 2 | Updates are signed but process is weak | 3 | Malware on device | 6 | Yes | High |
| S-07 | 2 | Public API | 1 | AI down but manual works | 2 | No | Low |
| S-08 | 1 | Hard to re-identify | 2 | Privacy breach | 2 | No | Low |


## Q3: What are we going to do about it?

| Mitigation ID | Addresses story(ies) | Type | What exactly would be done | Residual risk | Regulatory note |
| --- | --- | --- | --- | --- | --- |
| M-01 | S-03 | Preventive | Add MFA to the admin console | Some risk remains |  |
| M-02 | S-02 | Preventive | Encrypt DICOM traffic |  |  |
| M-03 | S-04 | Preventive | Give each engineer their own login instead of a shared one | Insider risk remains | Process change |
| M-04 | S-01 | Corrective | Keep backups so we can restore after ransomware | Downtime during restore |  |
| M-05 | S-05, S-06 | Preventive | Sign AI results and updates and check the signatures | Key compromise |  |


## Q4: Did we do a good job?

### Our top 3 threats
1.  S-01:  Ransomware stops scanning
2.  S-03:  No MFA on the admin console
3.  S-05:  AI result tampering leads to misdiagnosis

### Most surprising finding
That the AI results could be tampered with — we first thought only data theft mattered, but changing a diagnosis is worse.

### Hardest trade-off
MFA is good but engineers said it slows down emergency access, so we weren't sure how strict to make it.

### What we're still unsure about
How firmware updates are actually verified on the imaging unit
Whether encrypting DICOM breaks anything in the hospital
