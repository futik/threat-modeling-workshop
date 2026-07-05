# Threat Modeling Workshop — Medical Devices

A hands-on workshop for security practitioners and engineers on how to threat model a hybrid medical device. Based on the [MITRE Playbook for Threat Modeling Medical Devices](https://www.mitre.org/sites/default/files/2021-11/Playbook-for-Threat-Modeling-Medical-Devices.pdf).

---

## What you will learn

- How to scope and decompose a medical device system
- How to identify threats using STRIDE and MITRE ATT&CK for ICS/Healthcare
- How to assess and prioritize risks in a regulated medical context
- How to propose and document mitigations
- How AI can assist in building and evaluating threat models

---

## Repository layout

```
threat-modeling-workshop/
├── README.md                        ← you are here
├── FACILITATOR_GUIDE.md             ← timing, tips, group logistics (facilitators only)
│
├── scenario/
│   ├── device-overview.md           ← the hypothetical device description
│   └── system-architecture.md       ← components, data flows, trust boundaries
│
├── workshop/
│   ├── 00-introduction.md           ← why threat model medical devices?
│   ├── 01-scoping.md                ← step 1 — scope & system decomposition
│   ├── 02-threat-identification.md  ← step 2 — STRIDE + MITRE ATT&CK
│   ├── 03-risk-assessment.md        ← step 3 — likelihood, impact, prioritization
│   ├── 04-mitigations.md            ← step 4 — controls & countermeasures
│   └── 05-documentation.md         ← step 5 — writing the threat model report
│
├── templates/
│   ├── threat-model-template.md     ← blank worksheet for participants
│   └── example-filled-template.md  ← worked example for reference
│
├── prompts/
│   ├── threat-model-system-prompt.md   ← system prompt: generate a threat model
│   └── evaluation-system-prompt.md     ← system prompt: evaluate a threat model
│
└── references/
    └── mitre-playbook-notes.md      ← key concepts from the MITRE playbook
```

---

## Quick start for participants

1. Read [`scenario/device-overview.md`](scenario/device-overview.md) to understand the device you will be threat modeling.
2. Review [`scenario/system-architecture.md`](scenario/system-architecture.md) — study the components and data flows.
3. Open [`templates/threat-model-template.md`](templates/threat-model-template.md) — this is your working document. Fill it in as you go through the workshop steps.
4. Follow the steps in `workshop/01-scoping.md` → `05-documentation.md` as guided by the facilitator.
5. At the end, submit your completed template as instructed — it will be evaluated by an AI model for feedback.

If you get stuck, check [`templates/example-filled-template.md`](templates/example-filled-template.md) for a reference example.

---

## Quick start for facilitators

See [`FACILITATOR_GUIDE.md`](FACILITATOR_GUIDE.md) for the full run-of-show, group instructions, timing, and facilitation tips.

---

## AI-assisted evaluation

After the workshop, participant-submitted threat models can be evaluated using the prompts in `prompts/`. See [`prompts/evaluation-system-prompt.md`](prompts/evaluation-system-prompt.md) for instructions on how to use them with any LLM (Claude, GPT-4, etc.).

---

## References

- [MITRE Playbook for Threat Modeling Medical Devices (2021)](https://www.mitre.org/sites/default/files/2021-11/Playbook-for-Threat-Modeling-Medical-Devices.pdf)
- [STRIDE threat model (Microsoft)](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats)
- [MITRE ATT&CK for ICS](https://attack.mitre.org/matrices/ics/)
- [FDA Cybersecurity in Medical Devices Guidance (2023)](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-system-considerations-and-content-premarket-submissions)
