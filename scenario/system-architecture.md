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
│  └──────────────┘               └──────────┬───────────────── ┘   │
│                                            │                       │
│                                      Hospital LAN                  │
│                                            │                       │
│                               ┌────────────▼───────────┐          │
│                               │  Local DICOM Server     │          │
│                               │  (stores scan images)   │          │
│                               └────────────────────────-┘          │
│                                                                   │
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

---

## Workshop assumptions

- Treat the hospital network (TB-2, TB-3) as **semi-trusted**: assume an attacker could gain a foothold on the hospital LAN (e.g., via a phishing attack on hospital staff).
- The imaging unit firmware is **not regularly patched** — approximately 18 months between updates due to regulatory requirements.
- The local admin console has **no MFA** and is accessible from anywhere on the hospital LAN.
- Anonymisation is done in software by the acquisition workstation before images are uploaded — this logic has not been independently verified.
- Remote support uses a **single shared credential** for all MediScanTech support staff.
