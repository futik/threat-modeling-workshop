# Scenario: NeuroScan 3000 — Hybrid Medical Imaging System

> **Workshop note:** This is a fictional device created for training purposes. Any resemblance to real products is coincidental.

---

## Overview

**NeuroScan 3000** is a neurological imaging system manufactured by *MediScanTech Inc.* It combines MRI-guided imaging with AI-assisted diagnostics to help clinicians detect neurological conditions such as stroke, tumours, and MS lesions.

The system is **hybrid**: it has hardware on-premise in the hospital, and a cloud platform operated by MediScanTech that provides AI analysis and software updates. Both parts are essential to its operation.

---

## Intended use

- Clinical setting: radiology departments in hospitals
- Primary users: radiologists, biomedical engineers, IT administrators
- Regulatory classification: Class II medical device (EU MDR Class IIb, FDA 510(k))

---

## System components

### On-premise (hospital)

| Component | Description |
|-----------|-------------|
| **Imaging unit** | Physical MRI scanner with embedded firmware (proprietary operating system) |
| **Acquisition workstation** | PC connected to the imaging unit. Runs the scanning software and a local admin console accessible on the hospital network. |
| **Local DICOM server** | Stores scan images on-site. Connected to the hospital network. |

### Cloud (MediScanTech-operated)

| Component | Description |
|-----------|-------------|
| **AI inference service** | Receives anonymised scan images, runs the AI diagnostic model, and returns annotations |
| **Cloud storage** | Stores anonymised images and AI outputs |
| **Update delivery service** | Delivers firmware and software updates to on-premise components |
| **Manufacturer backend** | MediScanTech internal systems: model training, monitoring, remote support |

### External dependencies (not part of the device)

| Component | Description |
|-----------|-------------|
| **Hospital EMR** | The hospital's Electronic Medical Record system. Owned and operated by the hospital, with its own procurement and security governance. The acquisition workstation exchanges data with it over HL7 FHIR (e.g. pushing diagnostic reports, pulling patient/order details). Because MediScanTech does not control it, treat it as a **partially-trusted external system** — usually scoped *out* of the device threat model, with the connection to it treated as a threat boundary. |

---

## How a scan works (data flow)

1. Patient undergoes scan → imaging unit captures raw data
2. Acquisition workstation processes the raw data → creates DICOM images
3. Images stored on the local DICOM server
4. Anonymised images sent to the cloud AI inference service (encrypted)
5. Cloud returns AI diagnostic annotations → displayed to radiologist on the workstation
6. MediScanTech pushes firmware and software updates to the workstation and imaging unit
7. The workstation exchanges diagnostic reports and patient/order data with the hospital EMR over HL7 FHIR (external, hospital-owned system)

---

## Users and roles

| Role | What they do | Where they access from |
|------|-------------|----------------------|
| Radiologist | Views images and AI annotations, signs diagnostic reports | Hospital workstation |
| Biomedical engineer | Maintains the device, accesses local admin console | Hospital (on-site) |
| Hospital IT admin | Manages network and local server | Hospital network |
| MediScanTech support | Remote access for diagnostics and troubleshooting | Internet |
| MediScanTech engineer | Manages cloud backend and update delivery | MediScanTech datacentre |

---

## Key security assumptions (read carefully)

- The acquisition workstation is **connected to the internet** — it talks to the cloud AI service and receives updates
- The hospital network is **shared** with other hospital systems (not a dedicated medical-only network)
- The local admin console has **no multi-factor authentication** and is reachable from anywhere on the hospital network
- Remote support uses a **shared credential** — one login used by all MediScanTech support staff (known gap)
- Anonymisation of images before cloud upload is done in software and has **not been independently audited**
- The imaging unit firmware is patched approximately **every 18 months** due to regulatory constraints
- The workstation integrates with the **hospital EMR**, which MediScanTech does not own or secure — treat it as a **partially-trusted external dependency** and do not assume data received from it is safe
