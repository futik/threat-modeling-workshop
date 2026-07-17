# Facilitator Guide — Medical Device Threat Modeling Workshop

> **Not for distribution to participants.** This guide is for facilitators running the workshop.

---

## Workshop overview

| Item | Details |
|------|---------|
| Duration | **2 hours** |
| Group size | 3–5 participants per group, 2–5 groups total |
| Target audience | Security engineers, product security teams, biomedical engineers, regulatory affairs |
| Format | Brief facilitated intros + hands-on group exercises |
| Deliverable | Each group submits a completed threat model template |

---

## Run-of-show at a glance

| Time | Block | Duration |
|------|-------|---------|
| 0:00 | Introduction | 15 min |
| 0:15 | Q1: What are we working on? | 20 min |
| 0:35 | Q2: What can go wrong? | 35 min |
| 1:10 | Q3: What are we going to do about it? | 20 min |
| 1:30 | Q4: Did we do a good job? + Group presentations | 20 min |
| 1:50 | Debrief & wrap-up | 10 min |
| 2:00 | End | |

Keep the time visible to all groups. The blocks are tight — the facilitator's job is to keep energy up and prevent groups from going too deep on any single threat.

---

## Block 1 — Introduction (15 min)

**Facilitated presentation** — cover `workshop/00-introduction.md`:
- Why medical device security matters (use 2–3 real examples: FDA recalls, ransomware on hospitals)
- The four questions we'll answer today
- What makes medical devices harder than regular IT
- Overview of the scenario: NeuroScan 3000

**Key message:** *"You are the attacker before the attacker. Your job is to find the problems before a patient gets hurt."*

**FDA lens — establish the frame here (3 min).** Plant three ideas that the rest of the day hangs off (full detail in `workshop/fda-supportive-notes.md`):

1. **Threat modeling is "foundational."** The FDA calls it the foundational input to *security risk management* — it should "be performed to inform and support the risk analysis activities." What the groups build today is the raw material a real submission is assessed on.
2. **Security risk ≠ safety risk.** "Performing security risk management is distinct from performing safety risk management as described in ISO 14971." Safety risk is *probabilistic*; security risk is *exploitability-based*. Keep this alive all day.
3. **This is now law.** Section 524B of the FD&C Act (in force since March 2023) makes cybersecurity a *statutory* requirement for "cyber devices." Failure to maintain it is a **"prohibited act"** — a legal violation, not a guidance deviation.

> **Quotable line:** *"Your threat model is the foundation the FDA builds its entire security risk assessment on — and since 524B, getting it wrong is a prohibited act, not a style note."*

Use the current guidance edition (**February 2026**), which supersedes the 2023 and 2025 editions.

**Hand out / share:**
- `scenario/device-overview.md`
- `scenario/system-architecture.md`
- `templates/threat-model-template.md`

Give groups **5 minutes** to read the scenario silently before you move on.

---

## Block 2 — Q1: What are we working on? (20 min)

**3 min — say to the group:**
> *"Before we can find threats, we need to agree on what we're actually protecting. This first question is about building a shared map of the system — the components, the data, where it flows, and who's involved. Without this, different people in your group will be thinking about different things. We're going to identify: what are the valuable assets, where are the doors in and out, and who might want to cause harm. Don't worry about being perfect — you can always refine as you go."*

**17 min:** Groups work on Q1 of the template

**Facilitation tips:**
- Walk between groups and listen — don't give answers, ask questions
- If stuck on scope: *"What components does MediScanTech actually control? Start there."*
- Common mistake: forgetting the cloud side entirely — prompt: *"Where do the images go after they leave the hospital?"*
- If a group is racing ahead: ask them to check they've listed at least 5 assets and mapped entry points

**Checkpoint:** before moving on, each group should have at least 5 assets and 3–4 entry points listed.

**FDA lens — scope & traceability foundation.** The FDA wants the model scoped at the **medical device system** level — the device *plus* its connected/cloud/interoperable parts (Interoperability §V.A.3; Third-Party Software §V.A.4), not just the box. Two things to nudge groups on:
- **Capture third-party components now** — they become the **SBOM** required by §524B(b)(3).
- **Assets/entry points get stable IDs** — the FDA requires "traceability between the threat model, cybersecurity risk assessment, SBOM, and testing documentation," and that's impossible without IDs set here.
> *Reviewer red flag:* a boundary drawn around the device only, ignoring the cloud AI service.

---

## Block 3 — Q2: What can go wrong? (35 min)

**5 min — say to the group:**
> *"Now that we know what we're working on, we need to think like attackers. We're going to use a technique called Attacker Stories — like agile user stories, but written from the perspective of someone who wants to cause harm. The format is: 'As a [bad actor], I want to [do something bad] via [method or entry point], so that [I can achieve my goal].' You don't need the technical details perfectly — think about what a bad actor would want, then work backwards to how they'd get it. Once you have your stories, you'll quickly score each one."*

**20 min:** Groups write attacker stories (Q2.1)  
**10 min:** Groups score risk (Q2.2)

**Explaining Attacker Stories (use these words):**  
*"Think of it like an agile user story — but you're the villain. The format is: 'As a [bad actor], I want to [do something bad] via [method], so that [I achieve my goal].' Start with the goal — what does the attacker want? Then work out how they'd get there."*

Write the format on the board or project it.

**Tips — story writing:**
- If a group is stuck: *"Look at the entry points you listed in Q1. Pick one — what's the worst thing an attacker could do through it?"*
- Common mistake: all stories are about data theft — prompt: *"What about physical harm? What if the AI gave a wrong diagnosis that a doctor acted on?"*
- If a group has fewer than 6 stories at the 15-min mark: point them to the prompts in `workshop/q2-what-can-go-wrong.md`

**Good whole-room prompt at 10 min:**  
*"What's the most dangerous thing an attacker could do to this device — and I don't mean 'steal data'?"*

**Tips — risk scoring:**
- Keep it moving: scoring should take 10 min, not 25
- Common mistake: scoring everything 3×3 because "it's a medical device" — push for differentiation
- If no patient safety flags: *"Which of your stories, if it happened, could mean a patient got the wrong diagnosis and was treated for the wrong condition?"*

**FDA lens — exploitability, not probability (say this out loud).** This is the most FDA-sensitive step, and the template scores it the FDA way: **Exploitability × Severity of patient harm**, not Likelihood × Impact. Make the reason explicit:

> *"We don't score how* likely *an attack is — you can't put odds on an adversary, and the FDA explicitly rejects probabilistic scoring for security risk. We score* exploitability*: how feasible is the attack — skill, access, is there a public exploit, is it reachable remotely?"*

- The two axes — exploitability × severity of patient harm — are the FDA's 2016 **controlled / uncontrolled** risk matrix.
- The *"could this directly harm a patient? → mark High"* rule is the **severity axis** doing its job.
- Cybersecurity risk scales *independently* of software/safety risk — don't inherit safety scores.
> *Reviewer red flag:* probabilistic language ("1-in-X chance", frequencies) — the classic security-risk deficiency.

---

## Block 4 — Q3: What are we going to do about it? (20 min)

**3 min — say to the group:**
> *"Now that we know what can go wrong, we decide what to do about it. Not everything needs fixing — sometimes the risk is low enough to accept, or there's no feasible fix. What matters is that you make a conscious decision and document it. For each high-priority threat, define at least one concrete mitigation. Be specific — 'add encryption' is not a mitigation; 'enable TLS on the DICOM connection between the workstation and the local server' is. And remember this is a medical device: some mitigations may require a new regulatory submission, or create new risks for clinicians in an emergency. Those trade-offs are worth discussing."*

**17 min:** Groups work on Q3 of the template

**Tips:**
- Push for specificity: *"What exactly does 'improve authentication' mean for this device?"*
- Prompt regulatory thinking: *"If you add MFA to the admin console, does that change the device's behaviour enough to need a new regulatory submission?"*
- Common mistake: generic mitigations — redirect to the template example
- For groups that finish fast: ask them to note residual risk for each mitigation, and whether the hospital or the manufacturer is responsible for implementing it

**FDA lens — the risk assessment consumes the model.** The cybersecurity risk assessment (§V.A.2) evaluates controls against the threats, computes **pre- and post-mitigation (residual) risk**, and records **acceptability decisions** against defined criteria. The FDA wants the *method* documented, not just the numbers.
- Insist on a **residual risk** statement for every mitigation.
- Name the **safety ↔ security interface**: a security control "must not inadvertently introduce new risks in the other" assessment. The MFA-locks-out-the-engineer and secure-boot-needs-a-new-submission trade-offs *are* this interface.
> *Reviewer red flag:* a mitigation with no residual risk, or an acceptance decision with no stated criteria.

---

## Block 5 — Q4: Did we do a good job? + Presentations (20 min)

**3 min — say to the group:**
> *"The last question is about stepping back and reviewing your own work. A threat model is only useful if it's honest — it shouldn't just list the obvious threats and call it done. Use the checklist in your template to make sure nothing is missing. Then each group presents its top findings — not to compete, but to find gaps. The best outcome is that another group spots something you missed."*

Then groups review their template against the checklist (Q4).

**~5 min per group:** Each group presents:
1. Their **top 3 threats** and why they ranked them highest
2. Their **most surprising** story
3. Their **hardest trade-off** in mitigations

Other groups: ask one question — *"Did you consider X?"*

**Facilitator role:** note themes across groups; call out threats that only one group found; highlight where groups disagreed on risk scores.

**FDA lens — a living document across the TPLC.** Threat modeling and risk assessment must be **maintained throughout the Total Product Life Cycle** — not a one-time premarket artifact (§V.A.6, §VII.C.1). The statutory hook is the word **"maintain"** in §524B(b)(2).
- Point to concrete **re-trigger criteria**: new feature, new interface, new deployment environment, a disclosed vulnerability, or an incident.
- Stress **end-to-end traceability** — threat model ↔ risk assessment ↔ SBOM ↔ testing. Reviewers look for it explicitly.
- Mention the FDA's suggested postmarket **metrics**: percent patched, time-to-patch, time-to-deploy; and **per-fielded-version risk profiles**.

**The traceability spine (put this on a slide):**
```
Q1 assets/entry points ─► Q2 threats ─► Q3 controls + residual risk ─► Q4 maintained + tested
        │                     │                   │                          │
        └───────── SBOM ◄──────┴──── Risk Assessment ┴──── Testing evidence ◄─┘
```

---

## Block 6 — Debrief & wrap-up (10 min)

1. What most groups got right
2. One or two threats that groups commonly missed — reveal from the example template
3. How AI evaluation will work: *"I'll run your templates through an AI evaluator and you'll receive written feedback"*
4. Real-world link: *"This is the kind of analysis the FDA now requires manufacturers to submit"*
5. Where to go deeper: MITRE Playbook, **FDA premarket guidance (Feb 2026 edition)**, Section 524B of the FD&C Act, IEC 81001-5-1 — see `workshop/fda-supportive-notes.md` for the per-section detail and quotable lines

---

## Post-workshop — AI Evaluation

After the workshop, collect completed templates and use `prompts/evaluation-system-prompt.md`.

Steps:
1. Gather all submitted `threat-model-[team-name].md` files
2. Open Claude (or your LLM of choice)
3. Set the evaluation system prompt
4. Paste the scenario + participant template as the user message
5. Save feedback as `submissions/feedback-[team-name].md`
6. Share with participants by email or shared folder

---

## Common facilitation challenges

| Challenge | Response |
|-----------|---------|
| Group finishes Q1 too fast | Ask them to revisit trust boundaries — *"Is the hospital LAN really trusted?"* |
| Group is stuck writing stories | Point them to the prompts in the Q2 file; or say: *"Pick one entry point and ask what happens if it's compromised"* |
| Group argues about risk scores | Good! Let it run 1–2 min then cut: *"Note it as contested and move on"* |
| Someone asks "is this realistic?" | *"Yes — all the security weaknesses in the scenario are based on real issues documented in FDA advisories and CVEs"* |
| Group focuses only on data theft | *"Imagine a nation-state actor. They don't want your data — they want patients to be harmed or care to be disrupted. What do they do?"* |
| Running out of time | Skip the per-group presentations and do a single whole-room debrief instead |

---

## Materials to prepare

- Printed scenario and architecture sheets (one per participant)
- Printed blank templates (one per participant)
- Timer visible to all groups
- The attacker story format written on a whiteboard or projected: *"As a [actor], I want to [action] via [method], so that [goal]."*
