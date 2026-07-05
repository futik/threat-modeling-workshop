# Scenario: NeuroScan 3000 — Hybrid Medical Imaging System

> **Workshop note:** This is a fictional device created for training purposes. Any resemblance to real products is coincidental.

---

## Overview

**NeuroScan 3000** is a hybrid neurological imaging system manufactured by *MediScanTech Inc.* It combines MRI-guided imaging with AI-assisted diagnostics to support clinicians in detecting neurological conditions (stroke, tumors, MS lesions).

The system is **hybrid**: it has an on-premise hardware component in the hospital and a cloud-based processing and analytics platform. Both are critical to its operation.

---

## Intended use

- Clinical setting: radiology departments and neurology wards in hospitals
- Primary users: radiologists, neurologists, biomedical engineers, IT administrators
- Patient population: adults and pediatric patients undergoing neurological examination
- Regulatory classification: Class II medical device (EU MDR Class IIb, FDA 510(k))

---

## System components

### On-premise (hospital)

| Component | Description |
|-----------|-------------|
| **Imaging unit** | Physical MRI scanner with embedded firmware (proprietary RTOS) |
| **Acquisition workstation** | Ubuntu 22.04 LTS workstation connected to the imaging unit via USB/proprietary protocol. Runs the acquisition software (NeuroScan Acquire v4.2). |
| **Local DICOM server** | Stores raw and processed images. Connected to hospital PACS (Picture Archiving and Communication System). |
| **HIS/EMR interface** | HL7 FHIR API integration with the hospital's Electronic Medical Record system for patient data and orders |
| **Local admin console** | Web-based admin UI (runs on the acquisition workstation, accessible on port 8443) |

### Cloud (MediScanTech-operated)

| Component | Description |
|-----------|-------------|
| **AI inference service** | REST API that receives anonymized DICOM images, runs the AI model, and returns diagnostic annotations |
| **Cloud storage** | Encrypted blob storage for anonymized images and model outputs |
| **Analytics dashboard** | Web portal for radiologists and hospital admins — performance metrics, usage, alerts |
| **Update delivery service** | Delivers firmware and software updates to on-premise components |
| **Manufacturer backend** | Internal MediScanTech systems: model training, monitoring, support ticketing |

---

## Key data flows

1. Patient undergoes scan → imaging unit captures raw data
2. Acquisition workstation processes raw data → creates DICOM images
3. DICOM images stored on local DICOM server → pushed to cloud AI inference service (TLS 1.3, mutual auth)
4. Cloud returns AI annotations → stored locally and displayed in acquisition UI
5. Radiologist reviews annotated images → signs report → report written to EMR via HL7 FHIR
6. Hospital admin accesses cloud analytics dashboard → views aggregated metrics
7. MediScanTech pushes firmware/software updates → acquisition workstation and imaging unit

---

## Users and roles

| Role | Access level | Location |
|------|-------------|----------|
| Patient | None (subject of data) | Hospital |
| Radiologist | Read images, view AI output, sign reports | Hospital workstation |
| Biomedical engineer | Device maintenance, local admin console | Hospital / on-site |
| Hospital IT admin | Network config, local server admin | Hospital network |
| MediScanTech support | Remote access (break-glass) for diagnostics | Internet |
| MediScanTech engineer | Cloud backend, update delivery | MediScanTech datacenter |

---

## Key assumptions and constraints

- The acquisition workstation is **not air-gapped** — it connects to the hospital LAN and to the cloud AI service
- The hospital network is **shared** with other hospital IT systems (not a dedicated medical VLAN in all deployments)
- Patient data must comply with **GDPR** (EU) and **HIPAA** (US) depending on deployment region
- The device runs **between-scan updates** — it cannot be patched mid-procedure
- The AI model runs **on MediScanTech cloud infrastructure**, not on-premise — raw (anonymized) image data leaves the hospital
- Remote support access is authenticated via a **shared credential** (known issue, flagged for next release)
