# FDA Supportive Notes — Facilitator Insert per Section

**Purpose.** This is the theory layer for the workshop. For each of the four
questions, it gives you a short block to present to the audience: *what the FDA
actually expects at this step, the tips that get a threat model accepted, and the
red flags reviewers catch.* Drop the relevant block into each section as you run
it.

**How to use.** Run the practical exercise from the `workshop/qX-*.md` files as
written. At the intro to each question (or the debrief), spend 2–3 minutes on the
matching block below. Each block ends with a **quotable line** you can put on a
slide.

**Source.** Everything here traces to
[`../references/fda-cybersecurity-risk-assessment-research.md`](../references/fda-cybersecurity-risk-assessment-research.md),
which is compiled from the FDA premarket guidance *Cybersecurity in Medical
Devices: QMS Considerations and Content of Premarket Submissions* (Final,
**February 2026**), the 2016 Postmarket guidance, **Section 524B** of the FD&C
Act, and MITRE's Playbook. Section references below (e.g. §V.A.1) are to the FDA
premarket guidance.

---

## The one frame to establish first

Before Q1, plant three ideas. Everything else in the day hangs off them.

1. **Threat modeling is "foundational."** The FDA calls it the foundational
   input to *security risk management* — it "should be performed to inform and
   support the risk analysis activities." What the groups build today is the raw
   material a real submission is assessed on.
2. **Security risk ≠ safety risk.** "Performing security risk management is
   distinct from performing safety risk management as described in ISO 14971."
   Safety risk is *probabilistic*; security risk is *exploitability-based*. Keep
   this distinction alive all day — it's the single idea reviewers most want to
   see manufacturers understand.
3. **This is now law, not just guidance.** Section 524B of the FD&C Act (in force
   since March 2023) makes cybersecurity a *statutory* requirement for "cyber
   devices." Failure to maintain it is a **"prohibited act"** — a legal
   violation, not a guidance deviation.

> **Quotable line:** "Your threat model is the foundation the FDA builds its
> entire security risk assessment on — and since 524B, getting it wrong is a
> prohibited act, not a style note."

---

## Intro (`00-introduction.md`) — Framing & regulatory stakes

**What the FDA expects.** A manufacturer that understands *why* it threat models:
to feed a security risk assessment that is separate from, but interfaced with,
the ISO 14971 safety process. The FDA wants both a safety risk assessment **and**
a separate, accompanying security risk assessment.

**Tips to get accepted.**

- Anchor to the **current edition (February 2026)**. It supersedes the June 2025
  and September 2023 editions and aligns to the QMSR (ISO 13485). The core risk
  framework has been stable across the 2023/2025/2026 editions, but cite the
  current one.
- Frame the threat model inside a **Secure Product Development Framework (SPDF)**.
  The FDA recommends (does not strictly require) an SPDF and structures its whole
  Section V as "Using an SPDF to Manage Cybersecurity Risks."
- Know the **"cyber device" test** (§524B(c)): software + ability to connect
  (interpreted broadly — USB, Ethernet, Bluetooth, Wi-Fi, cellular…) + a
  vulnerable technological characteristic. The NeuroScan 3000 is squarely a cyber
  device.

**Red flags reviewers catch.**

- Treating cybersecurity as a subset of the ISO 14971 safety file, with no
  distinct security risk process.
- Citing the outdated 2023 edition as if it were current.

> **Quotable line:** "Safety risk asks 'how likely is a failure?' Security risk
> asks 'how exploitable is this?' — the FDA will not let you answer the second
> question with the tools of the first."

---

## Q1 — What are we working on? → **Scope & traceability foundation**

**What the FDA expects.** Scope at the **medical device system** level — the
device *plus* its connected, cloud, and interoperable components — not just the
box. Interoperability (§V.A.3) and third-party software components (§V.A.4) are
explicit sub-sections of security risk management. The assets, entry points, and
trust boundaries captured here are the anchors that everything downstream must
trace back to.

**Tips to get accepted.**

- **Draw the whole system.** For NeuroScan, that means the imaging unit,
  acquisition workstation, local DICOM server, **and** the cloud AI service, with
  the hospital EMR shown as a partially-trusted external dependency. A
  device-only boundary is the most common scoping deficiency.
- **Capture third-party components now** — they become your **SBOM** (required by
  §524B(b)(3)). Every COTS/open-source component you list in Q1 should later
  appear in the SBOM and be traceable to the threats against it.
- **Make traceability a design goal from step one.** The FDA requires
  "traceability between the threat model, cybersecurity risk assessment, SBOM,
  and testing documentation." If Q1 assets don't carry stable IDs, that
  traceability is impossible later.

**Red flags reviewers catch.**

- Boundary drawn around the device only, ignoring cloud/interoperable systems.
- Trust boundaries not identified, so no basis for reasoning about where controls
  belong.
- Third-party components absent from scope (they resurface as an incomplete
  SBOM).

> **Quotable line:** "If it's not in your system boundary, it's not in your SBOM,
> your risk assessment, or your traceability matrix — scope is where acceptance
> is won or lost."

---

## Q2 — What can go wrong? → **Exploitability, not probability**

This is the most FDA-sensitive section. Run the exercise with the workshop's
Likelihood × Impact scoring (it's the most approachable for a mixed audience),
**but state the FDA position explicitly** — the gap is the lesson.

**What the FDA expects.** Security risk is assessed on **exploitability**, not
probability. In the FDA's words: cybersecurity risks are "difficult to predict,
meaning that it is not possible to assess and quantify the likelihood of an
incident occurring based on historical data or modeling (also known as a
'probabilistic manner')… Instead, security risk assessment processes focus on
exploitability." The 2016 Postmarket guidance operationalizes this with a
two-axis matrix: **exploitability × severity of patient harm → controlled /
uncontrolled risk**.

**The workshop-vs-FDA callout (say this out loud):**

> "Today we're scoring **Likelihood × Impact** because it's the fastest way to
> get everyone thinking about risk. In a real FDA submission you must reframe the
> first axis as **Exploitability** — *how feasible is it to exploit this?* — not
> *how probable is an attack?* The FDA explicitly prohibits estimating security
> risk probabilistically the way ISO 14971 does for safety. Same table, different
> and more defensible meaning."

**Tips to get accepted.**

- Reframe your "likelihood" reasoning as **exploitability**: attacker skill
  required, access needed, whether a known exploit exists, whether the interface
  is remote. That's exactly what the FDA's exploitability axis captures.
- Keep the **severity-of-patient-harm** axis explicit. The workshop's *"could
  this directly harm a patient? → mark it High regardless of score"* rule **is**
  the FDA severity axis — call it that.
- Aim for the **controlled / uncontrolled** determination the FDA's matrix
  produces; that's the language a reviewer expects.
- Remember cybersecurity risk **scales independently** of software/safety risk: a
  low-software-risk device can carry significant cybersecurity risk, and vice
  versa. Don't inherit safety scores.

**Red flags reviewers catch.**

- Probabilistic likelihood language ("1-in-X chance", frequency estimates) —
  the classic security-risk deficiency.
- No severity-of-harm dimension, so no controlled/uncontrolled call.
- Threats that don't trace back to a Q1 asset or entry point.

> **Quotable line:** "The FDA doesn't ask how *likely* an attack is — it asks how
> *exploitable* you are. You can't roll dice on an adversary."

---

## Q3 — What are we going to do about it? → **Risk assessment consumes the model**

**What the FDA expects.** The cybersecurity risk assessment (§V.A.2) *consumes*
the threat model: it evaluates controls against the identified threats, computes
**pre- and post-mitigation (residual) risk**, and records **acceptability
decisions** against defined criteria. The guidance wants the *method* documented,
not just the numbers: "the methods used for scoring the risk pre- and
post-mitigation and the associated acceptance criteria… should also be provided."

**Tips to get accepted.**

- Document **acceptance criteria and the scoring method**, not only per-threat
  scores. Reviewers assess the method as much as the results.
- Show **residual risk** for every mitigation (your template already has the
  field — insist it's filled).
- Mind the **safety ↔ security interface**: "risk control measures for one type
  of risk assessment [must] not inadvertently introduce new risks in the other."
  Your medical-device trade-off discussion (MFA locking out the biomedical
  engineer in an emergency; secure boot forcing a new submission) is exactly this
  interface — name it as such.
- Note where a control **transfers a security risk into the safety risk
  assessment**; the FDA wants that transfer method documented.
- Use the **living-document reality**: exploitability rises over the device
  lifecycle, so "it might be more difficult to mitigate cybersecurity issues once
  the device is marketed" — favour controls you can actually maintain.

**Red flags reviewers catch.**

- Mitigations with no residual-risk statement.
- A security control that quietly creates a safety hazard (or vice versa) with no
  acknowledgement of the interface.
- Acceptance decisions with no stated criteria behind them.

> **Quotable line:** "A mitigation without a documented residual risk and an
> acceptance criterion is, to the FDA, an unfinished thought."

---

## Q4 — Did we do a good job? → **A living document across the TPLC**

**What the FDA expects.** Threat modeling and risk assessment are **maintained
throughout the Total Product Life Cycle (TPLC)** — not a one-time premarket
artifact. §V.A.6 and §VII.C.1 require updating the documentation "as new
information becomes available, such as when new threats, vulnerabilities, assets,
or adverse impacts are discovered." The statutory hook is the word **"maintain"**
in §524B(b)(2).

**Tips to get accepted.**

- Show the model is **maintained**, with clear **re-trigger criteria**: new
  feature, new interface, new deployment environment, a related vulnerability
  disclosed, or a security incident. (Your Q4 list already matches the FDA's.)
- Demonstrate **end-to-end traceability**: threat model ↔ risk assessment ↔ SBOM
  ↔ testing. Add a checklist line for it — reviewers look for it explicitly.
- Be ready for **per-fielded-version risk profiles**: "if an update is not
  applied automatically for all fielded devices… there will likely be different
  risk profiles for differing software configurations." Assess vulnerabilities
  per version.
- Track the FDA's suggested **postmarket metrics** (§V.A.6): percent of
  vulnerabilities patched (defect density); time from identification to patch;
  time from patch availability to full deployment.
- Store it in **version control** (like this repo) so changes are diffable — the
  practical embodiment of "maintained."

**Red flags reviewers catch.**

- A threat model presented as "done" with no maintenance/re-trigger plan.
- No traceability matrix linking the four artifacts.
- Assuming one risk profile when fielded devices run different versions.

> **Quotable line:** "The FDA's word is *maintain*. A threat model you finish and
> file is already out of compliance — the one you keep updating is the one that
> passes."

---

## Cross-cutting: the traceability spine

If participants remember one structural thing, make it this chain — it's what the
FDA assesses and what ties all four questions together:

```
Q1 assets/entry points ──► Q2 threats ──► Q3 controls + residual risk ──► Q4 maintained + tested
        │                        │                    │                          │
        └──────────── SBOM ◄──────┴──── Risk Assessment ┴──── Testing evidence ◄──┘
   "traceability between the threat model, cybersecurity risk assessment, SBOM,
    and testing documentation"  (FDA premarket guidance)
```
