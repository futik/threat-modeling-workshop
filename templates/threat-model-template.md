# Threat Model — NeuroScan 3000

> **Team name:** _________________________________  
> **Date:** _________________________________  
> **Workshop:** Medical Device Threat Modeling  

---

## Section 1: Scope

### 1.1 System boundary

**In scope:**
<!-- List the components and interfaces you are threat modeling -->
- 
- 
- 

**Out of scope (with rationale):**
<!-- List components you are explicitly excluding and why -->
- 

---

### 1.2 Assets

| Asset ID | Asset | Type | Most critical property (C/I/A) | Notes |
|----------|-------|------|-------------------------------|-------|
| A-01 | | | | |
| A-02 | | | | |
| A-03 | | | | |
| A-04 | | | | |
| A-05 | | | | |

*(add rows as needed)*

---

### 1.3 Entry points & interfaces

| Entry point | Protocol / interface | Authentication | Encryption | Trust level |
|-------------|---------------------|---------------|-----------|-------------|
| | | | | |
| | | | | |
| | | | | |

---

### 1.4 Threat actors

| Actor | Motivation | Likely access vector | Assumed capability |
|-------|-----------|---------------------|-------------------|
| | | | |
| | | | |
| | | | |

---

## Section 2: Threat Identification

*Use STRIDE categories and/or MITRE ATT&CK techniques. Write each threat as a structured statement:*  
*"[Threat actor] can [action] the [asset/component] via [entry point], causing [impact]."*

| Threat ID | STRIDE category | ATT&CK technique (optional) | Threat statement | Component / data flow affected |
|-----------|----------------|---------------------------|-----------------|-------------------------------|
| T-01 | | | | |
| T-02 | | | | |
| T-03 | | | | |
| T-04 | | | | |
| T-05 | | | | |
| T-06 | | | | |
| T-07 | | | | |
| T-08 | | | | |
| T-09 | | | | |
| T-10 | | | | |

*(add rows as needed — aim for at least 10)*

---

## Section 3: Risk Assessment

| Threat ID | Likelihood (1–3) | Likelihood rationale | Impact (1–3) | Impact rationale | Risk score (L×I) | Patient safety override? | Priority |
|-----------|-----------------|---------------------|-------------|-----------------|-----------------|------------------------|---------|
| T-01 | | | | | | | |
| T-02 | | | | | | | |
| T-03 | | | | | | | |
| T-04 | | | | | | | |
| T-05 | | | | | | | |
| T-06 | | | | | | | |
| T-07 | | | | | | | |
| T-08 | | | | | | | |
| T-09 | | | | | | | |
| T-10 | | | | | | | |

---

## Section 4: Mitigations

*For every High-priority threat, define at least one mitigation. For Medium-priority, define a mitigation or document an acceptance rationale.*

| Mitigation ID | Addresses threat(s) | Type (Preventive/Detective/Corrective/Compensating) | Description | Residual risk | Regulatory note |
|--------------|--------------------|----------------------------------------------------|-------------|--------------|----------------|
| M-01 | | | | | |
| M-02 | | | | | |
| M-03 | | | | | |
| M-04 | | | | | |
| M-05 | | | | | |

*(add rows as needed)*

---

## Section 5: Summary & Open Questions

### Top 3 highest-risk threats

1. **T-__**: 
2. **T-__**: 
3. **T-__**: 

### Most surprising or unexpected threat

> 

### Hardest mitigation trade-off

> 

### Open questions / items needing further investigation

- 
- 
- 

---

## Review checklist

Before submitting, confirm:

- [ ] Every threat has a unique ID
- [ ] Every threat has a structured statement (actor → action → asset → impact)
- [ ] Every threat has a likelihood, impact, and risk score
- [ ] Patient safety overrides are noted with rationale
- [ ] Every High-risk threat has at least one mitigation
- [ ] Every Medium-risk threat has a mitigation or acceptance rationale
- [ ] Every mitigation references at least one threat ID
- [ ] Residual risk is noted for each mitigation
