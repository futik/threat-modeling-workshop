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

**Hand out / share:**
- `scenario/device-overview.md`
- `scenario/system-architecture.md`
- `templates/threat-model-template.md`

Give groups **5 minutes** to read the scenario silently before you move on.

---

## Block 2 — Q1: What are we working on? (20 min)

**3 min:** Read the facilitator intro from `workshop/q1-what-are-we-working-on.md`  
**17 min:** Groups work on Q1 of the template

**Facilitation tips:**
- Walk between groups and listen — don't give answers, ask questions
- If stuck on scope: *"What components does MediScanTech actually control? Start there."*
- Common mistake: forgetting the cloud side entirely — prompt: *"Where do the images go after they leave the hospital?"*
- If a group is racing ahead: ask them to check they've listed at least 5 assets and mapped entry points

**Checkpoint:** before moving on, each group should have at least 5 assets and 3–4 entry points listed.

---

## Block 3 — Q2: What can go wrong? (35 min)

**5 min:** Read the facilitator intro from `workshop/q2-what-can-go-wrong.md`, explain Attacker Stories  
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

---

## Block 4 — Q3: What are we going to do about it? (20 min)

**3 min:** Read the facilitator intro from `workshop/q3-what-are-we-going-to-do-about-it.md`  
**17 min:** Groups work on Q3 of the template

**Tips:**
- Push for specificity: *"What exactly does 'improve authentication' mean for this device?"*
- Prompt regulatory thinking: *"If you add MFA to the admin console, does that change the device's behaviour enough to need a new regulatory submission?"*
- Common mistake: generic mitigations — redirect to the template example
- For groups that finish fast: ask them to note residual risk for each mitigation, and whether the hospital or the manufacturer is responsible for implementing it

---

## Block 5 — Q4: Did we do a good job? + Presentations (20 min)

**3 min:** Groups review their template against the checklist (Q4)  
**~5 min per group:** Each group presents:
1. Their **top 3 threats** and why they ranked them highest
2. Their **most surprising** story
3. Their **hardest trade-off** in mitigations

Other groups: ask one question — *"Did you consider X?"*

**Facilitator role:** note themes across groups; call out threats that only one group found; highlight where groups disagreed on risk scores.

---

## Block 6 — Debrief & wrap-up (10 min)

1. What most groups got right
2. One or two threats that groups commonly missed — reveal from the example template
3. How AI evaluation will work: *"I'll run your templates through an AI evaluator and you'll receive written feedback"*
4. Real-world link: *"This is the kind of analysis the FDA now requires manufacturers to submit"*
5. Where to go deeper: MITRE Playbook, FDA 2023 guidance, IEC 81001-5-1

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
