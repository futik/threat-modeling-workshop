# Threat Model Worksheet — NeuroScan 3000
Team name: Team Northwind     Date: 2026-05-14
Workshop: Medical Device Threat Modeling

## Q1: What are we working on?

### 1.1 System boundary
In scope — components and interfaces your team will analyze:
The workstation
The cloud
Out of scope — what you exclude, and why:
Everything else

### 1.2 Assets — what are we protecting?

| Asset ID | Asset | Why it matters | Most critical property (C/I/A) |
| --- | --- | --- | --- |
| A-01 | Patient data | It's private | Confidentiality |
| A-02 | The system | We need it to work | Availability |
| A-03 | Passwords | Security | Confidentiality |


### 1.3 Entry points — how can someone get in?

| Entry point | How it works | Authentication? | Encrypted? | Who can reach it? |
| --- | --- | --- | --- | --- |
| Website / console | Login page | Password | Yes | Users |
| Internet | Cloud connection | Yes | Yes | Anyone |


### 1.4 Threat actors — who might attack this?

| Actor | Motivation | How they might get in |
| --- | --- | --- |
| Hackers | To steal data | The internet |
| Viruses | Damage | Email |


## Q2: What can go wrong?

### 2.1 Attacker stories

| Story ID | Bad actor | Attacker story | Part of system affected | Impact type (S/P/A) |
| --- | --- | --- | --- | --- |
| S-01 | Hackers | A hacker could steal patient data. | Cloud | P |
| S-02 | Hackers | A hacker could get the password and log in. | Console | P |
| S-03 | Virus | A virus could infect the workstation and break it. | Workstation | A |
| S-04 | Hackers | A hacker could take down the website. | Cloud | A |
| S-05 | Hackers | Someone could listen to the network traffic. | Network | P |


### 2.2 Risk assessment

| Story ID | Exploitability (1–3) | Rationale | Severity (1–3) | Rationale | Risk score | Patient safety? | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-01 | High | Hackers are common | High | Data is sensitive | High |  | High |
| S-02 | Medium | Passwords can be guessed | Medium | They get in | Medium |  | Medium |
| S-03 | High | Viruses are everywhere | High | System breaks | High |  | High |
| S-04 | Low | DDoS is hard | Medium | Website down | Low |  | Low |
| S-05 | Medium | Sniffing is possible | Low | Maybe see data | Low |  | Low |


## Q3: What are we going to do about it?

| Mitigation ID | Addresses story(ies) | Type | What exactly would be done | Residual risk | Regulatory note |
| --- | --- | --- | --- | --- | --- |
| M-01 | S-01 | Preventive | Add encryption |  |  |
| M-02 | S-02 | Preventive | Use strong passwords |  |  |
| M-03 | S-03 | Preventive | Install antivirus |  |  |
| M-04 | S-04 | Preventive | Use a firewall |  |  |


## Q4: Did we do a good job?

### Our top 3 threats
1.  S-01:  Data theft
2.  S-03:  Virus
3.  S-02:  Password stolen

### Most surprising finding
That there are so many ways to attack a medical device.

### Hardest trade-off
Encryption can slow things down.

### What we're still unsure about
How the cloud works exactly
