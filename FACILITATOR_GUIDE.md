# Facilitator Guide — Medical Device Threat Modeling Workshop

> **Not for distribution to participants.** This guide is for facilitators running the workshop.

---

## Workshop overview

| Item | Details |
|------|---------|
| Duration | 3–4 hours (half day) |
| Group size | 3–5 participants per group, 2–5 groups total |
| Target audience | Security engineers, product security teams, biomedical engineers, regulatory affairs |
| Format | Mix of brief theory presentations + hands-on group exercises |
| Deliverable | Each group submits a completed threat model template |

---

## Run-of-show

### Pre-workshop (30 min before)
- Ensure participants have access to the repository (GitHub link or printed handouts)
- Set up the room: groups of 3–5 at separate tables/breakouts
- Prepare a shared screen or slides for theory segments
- Optional: print `scenario/device-overview.md` and `scenario/system-architecture.md` for each participant

---

### Block 1 — Introduction (20 min)

**Facilitated presentation**

Cover the content in `workshop/00-introduction.md`:
- Why medical device security matters (3–4 real incidents as examples: Medigate reports, FDA recalls)
- The four-question framework
- What makes medical devices different from general IT
- Overview of today's scenario (NeuroScan 3000)

**Key message to land:** "You are the attacker before the attacker. Your job is to find the problems before a patient gets hurt."

**Hand out / share:**
- `scenario/device-overview.md`
- `scenario/system-architecture.md`
- `templates/threat-model-template.md`

Give groups 10 minutes to read the scenario silently.

---

### Block 2 — Q1: What are we working on? (25 min)

**5 min:** Brief explanation using `workshop/q1-what-are-we-working-on.md`  
**20 min:** Groups work on Q1 of the template (assets, entry points, trust boundaries, threat actors)

**Facilitation tips:**
- Walk between groups, listen, prompt — don't give answers
- If a group is stuck: "What happens to the patient data between the scanner and the cloud?"
- Common mistake: groups scope only the on-premise part and forget the cloud; gently redirect
- If a group is racing ahead: ask them to check if they've identified all trust boundaries

**Checkpoint before moving on:** Each group should have at least 5 assets and 5 entry points listed.

---

### Block 3 — Q2: What can go wrong? (50 min)

**10 min:** Explain STRIDE and MITRE ATT&CK using `workshop/q2-what-can-go-wrong.md`  
**25 min:** Groups identify threats (Part A of the template)  
**15 min:** Groups score risk (Part B of the template)

**Tips — threat identification:**
- Write the STRIDE mnemonic on the board: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
- Prompt for ATT&CK: "Have you looked at T0839 Module Firmware? Does that apply here?"
- Common mistake: all threats are Information Disclosure (data breach focus); push groups to consider Tampering and DoS which have direct patient safety implications
- If a group has fewer than 8 threats at the 15-min mark, prompt: "What could an attacker do to the update channel? What about the admin console?"

**Good discussion prompt for the room (halfway through):** "What's the most dangerous thing an attacker could do to this device — and I don't mean 'steal data'?"

**Tips — risk scoring:**
- Remind groups: "Likelihood scores should reflect the specific context — a hospital LAN is not the internet"
- Common mistake: scoring everything as High/High because it's a medical device; push for differentiation
- If a group has no patient safety overrides: ask "Which of your threats could directly harm a patient if exploited?"

---

### Break (10 min)

---

### Block 4 — Q3: What are we going to do about it? (30 min)

**5 min:** Explain mitigation types using `workshop/q3-what-are-we-going-to-do-about-it.md`. Highlight the regulatory constraint discussion.  
**25 min:** Groups work on Q3 of the template

**Tips:**
- Push for specificity: "What exactly does 'add encryption' mean for DICOM here?"
- Prompt regulatory thinking: "If you add MFA to the admin console, does that require a new 510(k)?"
- Common mistake: generic mitigations ("implement proper authentication") — redirect to specific controls
- For advanced groups: ask them to distinguish between what the manufacturer can do vs. what the hospital must do

---

### Block 5 — Q4: Did we do a good job? / Group presentations (25 min total)

**5 min:** Groups review their work using the checklist in `workshop/q4-did-we-do-a-good-job.md`  
**15–20 min:** Each group presents (~5 min per group):
1. Their top 3 highest-risk threats and why
2. Their most interesting/unexpected threat
3. Their hardest mitigation trade-off

Other groups: ask one question after each presentation — "Did you consider X?"

**Facilitator role:** note common themes, highlight threats that multiple groups found, call out unique threats that only one group found.

---

### Block 6 — Debrief & wrap-up (15 min)

Cover:
1. What most groups got right (patterns you observed)
2. Key threats that groups commonly missed — reveal 1–2 from the example template
3. How AI evaluation will work: "After the workshop, I'll run your templates through an AI evaluator and you'll receive feedback"
4. Real-world link: "This process is what manufacturers submit to the FDA"
5. Where to go next: MITRE Playbook, FDA 2023 guidance, IEC 81001-5-1

---

### Post-workshop — AI Evaluation

After the workshop, collect completed templates and use `prompts/evaluation-system-prompt.md` to evaluate each team's submission.

Steps:
1. Gather all submitted `threat-model-[team-name].md` files
2. For each file, open your LLM of choice (Claude recommended)
3. Set the evaluation system prompt
4. Paste the scenario + participant template as the user message
5. Save the feedback as `submissions/feedback-[team-name].md`
6. Share feedback with participants by email or a shared folder

Optional: run the batch comparison prompt to generate a cross-team summary.

---

## Common facilitation challenges

| Challenge | Response |
|-----------|---------|
| Group finishes too fast | Ask them to ATT&CK-map their threats and add mitigations for Medium risks too |
| Group is stuck on scoping | Remind them: "You can always refine scope — start with the hardware and work outward" |
| Group argues about risk scores | That's good! Let it run for 2 min then move on — "Note it as a contested score and move on" |
| Someone asks "is this realistic?" | "Yes — all the security gaps in the scenario are based on real vulnerabilities documented in FDA advisories and CVEs" |
| Group focuses only on data privacy | "Imagine a nation-state, not a data broker. What do they want to do to patients?" |

---

## Suggested materials to bring

- Printed scenario and architecture sheets (one per participant)
- Printed blank templates (one per participant)
- STRIDE cheat sheet on the board or a projected slide
- Link to MITRE ATT&CK for ICS on devices/screens
- Optional: timer visible to all groups during work blocks
