# Threat Modeling Workshop — Medical Devices

A hands-on workshop for security practitioners and engineers on how to threat model a hybrid medical device. Based on the [MITRE Playbook for Threat Modeling Medical Devices](https://www.mitre.org/sites/default/files/2021-11/Playbook-for-Threat-Modeling-Medical-Devices.pdf).

---

## What you will learn

Working through four questions — *What are we working on? What can go wrong? What are we going to do about it? Did we do a good job?* — you will practice:

- Scoping and decomposing a medical device system
- Identifying threats using STRIDE and MITRE ATT&CK for ICS/Healthcare
- Assessing and prioritizing risks in a regulated medical context
- Proposing and documenting mitigations
- Using AI to assist in building and evaluating threat models

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
│   ├── 00-introduction.md                        ← why threat model medical devices?
│   ├── q1-what-are-we-working-on.md              ← scope, assets, entry points, actors
│   ├── q2-what-can-go-wrong.md                   ← STRIDE, MITRE ATT&CK, risk assessment
│   ├── q3-what-are-we-going-to-do-about-it.md   ← controls & countermeasures
│   └── q4-did-we-do-a-good-job.md               ← validation, review, documentation
│
├── templates/
│   └── threat-model-template.md     ← blank worksheet for participants
│
├── examples/                        ← worked (filled-in) examples, not for editing
│   ├── filled-template/             ← the reference threat model, filled in
│   │   ├── example-filled-template.md
│   │   └── example-filled-template.docx
│   └── submissions/                 ← three sample teams, already evaluated
│
├── submissions/                     ← real participant worksheets go here
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
4. Follow the four questions in `workshop/q1-what-are-we-working-on.md` → `q4-did-we-do-a-good-job.md` as guided by the facilitator.
5. At the end, submit your completed template as instructed — it will be evaluated by an AI model for feedback.

If you get stuck, check [`examples/filled-template/example-filled-template.md`](examples/filled-template/example-filled-template.md) for a reference example.

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
