# System Architecture — NeuroScan 3000

## Architecture diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  HOSPITAL NETWORK                                                    │
│                                                                      │
│  ┌──────────────┐    USB /      ┌─────────────────────────────────┐ │
│  │              │  Proprietary  │   Acquisition Workstation        │ │
│  │  Imaging     │◄─────────────►│   (Windows 11)                  │ │
│  │  Unit        │   Protocol    │                                  │ │
│  │  (RTOS)      │               │  NeuroScan Acquire v4.2          │ │
│  │              │               │  Local Admin Console (:8443)     │ │
│  └──────────────┘               └──────────┬──────────────────────┘ │
│                                            │                         │
│                                     Hospital LAN                     │
│                                            │                         │
│                         ┌──────────────────┼──────────────────┐     │
│                         │                  │                  │     │
│               ┌─────────▼──────┐  ┌────────▼───────┐  ┌──────▼───┐ │
│               │  Local DICOM   │  │  HIS / EMR     │  │  Hospital│ │
│               │  Server        │  │  (HL7 FHIR)    │  │  IT Infra│ │
│               └────────────────┘  └────────────────┘  └──────────┘ │
│                                                                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ Internet (TLS 1.3, mutual TLS)
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│  MEDIISCANTECH CLOUD                                                 │
│                                                                      │
│  ┌─────────────────┐   ┌──────────────────┐   ┌───────────────────┐ │
│  │  AI Inference   │   │  Cloud Storage   │   │  Analytics        │ │
│  │  Service        │◄──│  (anon. images)  │   │  Dashboard        │ │
│  │  (REST API)     │   │                  │   │  (web portal)     │ │
│  └────────┬────────┘   └──────────────────┘   └───────────────────┘ │
│           │                                                           │
│  ┌────────▼────────────────────────────────────────────────────────┐ │
│  │  Manufacturer Backend (model training, monitoring, support)     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Update Delivery Service                                        │  │
│  └──────────────────────────────┬──────────────────────────────── ┘  │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │ Update channel (TLS, signed packages)
                                  ▼
                         [Acquisition Workstation
                          + Imaging Unit firmware]
```

---

## Trust boundaries

| Boundary | Between | Notes |
|----------|---------|-------|
| **TB-1** | Imaging unit ↔ Acquisition workstation | Physical/proprietary — assumed trusted within the device enclosure |
| **TB-2** | Acquisition workstation ↔ Hospital LAN | Hospital network — shared with non-medical systems in some deployments |
| **TB-3** | Hospital LAN ↔ DICOM server | Internal — should be on a dedicated VLAN but often is not |
| **TB-4** | Hospital LAN ↔ EMR/HIS | HL7 FHIR — authenticated, but EMR is a separate system with its own controls |
| **TB-5** | Hospital ↔ MediScanTech cloud | Internet — protected by mutual TLS; main external boundary |
| **TB-6** | Cloud ↔ Analytics dashboard | Internet — HTTPS, SSO authentication |
| **TB-7** | MediScanTech backend ↔ Update service | Internal cloud — must be authenticated and integrity-protected |

---

## Data classification

| Data type | Sensitivity | Where it flows |
|-----------|-------------|----------------|
| Raw DICOM images (with PHI) | High | Imaging unit → Workstation → Local DICOM server |
| Anonymized DICOM images | Medium | Local DICOM server → Cloud AI service → Cloud storage |
| AI diagnostic annotations | Medium | Cloud → Workstation → Local DICOM server → EMR |
| Patient demographics / orders | High | EMR → Workstation (via HL7 FHIR) |
| Device telemetry / logs | Low–Medium | Workstation → MediScanTech backend |
| Firmware / software updates | High integrity | MediScanTech → Workstation + Imaging unit |
| Admin credentials | Critical | Local admin console, cloud portal |

---

## Key interfaces

| Interface | Protocol | Auth mechanism | Notes |
|-----------|----------|---------------|-------|
| Imaging unit → Workstation | Proprietary USB | None (physical) | Assumed trusted |
| Workstation → Local DICOM | DICOM (TCP 104) | None by default | DICOM has no built-in auth in most deployments |
| Workstation → Cloud AI | HTTPS REST | Mutual TLS + API key | |
| Workstation → EMR | HL7 FHIR over HTTPS | OAuth 2.0 | |
| Admin console | HTTPS (:8443) | Local username/password | No MFA by default |
| Cloud dashboard | HTTPS | SSO (SAML) | |
| Remote support | VPN + RDP | Shared credential | **Known security gap** |
| Update delivery | HTTPS | Package signing (RSA-2048) + TLS | |

---

## Assumptions for the workshop

- Treat the hospital network (TB-2, TB-3) as **semi-trusted**: assume an attacker could gain a foothold on the hospital LAN (e.g., via phishing of a hospital employee).
- The imaging unit firmware is **not regularly patched** — average time between patches is 18 months.
- The local admin console has **no MFA** and is accessible from anywhere on the hospital LAN.
- Anonymization is done by the acquisition software before upload — the anonymization logic is **not independently verified**.
- The AI model is a black box to the hospital — its outputs are not explainable and could be manipulated.
