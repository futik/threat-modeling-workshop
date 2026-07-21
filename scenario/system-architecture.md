# System Architecture — NeuroScan 3000

## Architecture diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  HOSPITAL NETWORK                                                 │
│                                                                   │
│  ┌──────────────┐    USB /      ┌────────────────────────────┐   │
│  │              │  Proprietary  │  Acquisition Workstation    │   │
│  │  Imaging     │◄─────────────►│  (Windows 10)              │   │
│  │  Unit        │   Protocol    │                             │   │
│  │  (RTOS)      │               │  Scanning software          │   │
│  │              │               │  Admin console (:8443)      │   │
│  └──────────────┘               └────┬──────────────┬──────── ┘   │
│                                      │              │              │
│                                Hospital LAN    HL7 FHIR / HTTPS    │
│                                      │              │ (TB-6)       │
│                        ┌─────────────▼──────┐  ┌────▼───────────┐ │
│                        │  Local DICOM Server│  ╎ Hospital EMR    ╎ │
│                        │  (stores scan      │  ╎ (partially-     ╎ │
│                        │   images)          │  ╎  trusted,       ╎ │
│                        └────────────────────┘  ╎  hospital-owned)╎ │
│                                                 └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘ │
│                              (dashed box = external, out-of-scope) │
└──────────────────────────┬───────────────────────────────────────┘
                           │ Internet (TLS 1.3, mutual TLS)
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│  MEDIISCANTECH CLOUD                                              │
│                                                                   │
│  ┌──────────────────┐   ┌──────────────────┐                     │
│  │  AI Inference    │   │  Cloud Storage   │                     │
│  │  Service         │◄──│  (anon. images   │                     │
│  │  (REST API)      │   │  + AI outputs)   │                     │
│  └──────────────────┘   └──────────────────┘                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Manufacturer Backend (model training, monitoring, support) │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Update Delivery Service                                    │  │
│  └────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────── ┼──────────────────────────────────────┘
                             │ Updates (TLS, signed packages)
                             ▼
                    [Acquisition Workstation
                     + Imaging Unit firmware]
```

---

## Trust boundaries

| Boundary | Between | Notes |
|----------|---------|-------|
| **TB-1** | Imaging unit ↔ Acquisition workstation | Physical/proprietary — assumed trusted within the device |
| **TB-2** | Acquisition workstation ↔ Hospital LAN | Shared hospital network — may include non-medical systems |
| **TB-3** | Hospital LAN ↔ Local DICOM server | Internal — should be on a dedicated VLAN but often is not |
| **TB-4** | Hospital ↔ MediScanTech cloud | Internet — protected by mutual TLS; main external boundary |
| **TB-5** | MediScanTech backend ↔ Update service | Internal cloud — must be authenticated and integrity-protected |
| **TB-6** | Acquisition workstation ↔ Hospital EMR | External system, hospital-owned — separate security governance; treat as partially-trusted |

---

## Data flows

| Data | Sensitivity | Path |
|------|-------------|------|
| Raw DICOM images (with patient data) | High | Imaging unit → Workstation → Local DICOM server |
| Anonymised DICOM images | Medium | Local DICOM server → Cloud AI service → Cloud storage |
| AI diagnostic annotations | Medium | Cloud → Workstation → Local DICOM server |
| Device logs / telemetry | Low–Medium | Workstation → MediScanTech backend |
| Firmware / software updates | High (integrity) | MediScanTech → Workstation + Imaging unit |
| Admin credentials | Critical | Local admin console, remote support |
| Diagnostic reports / patient & order data | High | Workstation ↔ Hospital EMR (HL7 FHIR) |

---

## Key interfaces

| Interface | Protocol | Authentication | Notes |
|-----------|----------|---------------|-------|
| Imaging unit → Workstation | Proprietary USB | None (physical) | Assumed trusted |
| Workstation → Local DICOM server | DICOM (TCP 104) | None by default | No built-in auth in most deployments |
| Workstation → Cloud AI service | HTTPS REST | Mutual TLS + API key | |
| Local admin console | HTTPS (:8443) | Username/password | No MFA |
| Remote support | VPN + SSH | Shared credential | **Known security gap** |
| Update delivery | HTTPS | Package signing (RSA-2048) + TLS | |
| Workstation → Hospital EMR | HL7 FHIR over HTTPS | OAuth 2.0 | External hospital-owned system; treat as partially-trusted |

---

## Workshop assumptions

- Treat the hospital network (TB-2, TB-3) as **semi-trusted**: assume an attacker could gain a foothold on the hospital LAN (e.g., via a phishing attack on hospital staff).
- The imaging unit firmware is **not regularly patched** — approximately 18 months between updates due to regulatory requirements.
- The local admin console has **no MFA** and is accessible from anywhere on the hospital LAN.
- Anonymisation is done in software by the acquisition workstation before images are uploaded — this logic has not been independently verified.
- Remote support uses a **single shared credential** for all MediScanTech support staff.
- The hospital EMR is **owned and operated by the hospital**, not MediScanTech. It is a **partially-trusted external dependency** (TB-6): the device exchanges data with it over HL7 FHIR but cannot assume it is secure, patched, or free of malicious input. Typically scoped *out* of the device threat model, with the boundary to it treated as a threat boundary.
