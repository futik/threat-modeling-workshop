const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
const W = 13.33, H = 7.5;

// ---- palette (medical + security) ----
const DARK = "07253A";   // deep navy-teal (title/closing bg)
const PRIMARY = "065A82"; // deep blue
const TEAL = "028090";
const MINT = "02C39A";    // accent
const INK = "172A38";     // body text on light
const MUTE = "5F7280";    // captions
const LIGHT = "FFFFFF";
const SOFT = "EAF3F5";    // card tint
const HEAD = "Cambria";
const BODY = "Calibri";

function bg(slide, color) { slide.background = { color }; }

function title(slide, text, color) {
  slide.addText(text, {
    x: 0.6, y: 0.45, w: 12.1, h: 0.9,
    fontFace: HEAD, fontSize: 34, bold: true, color: color || PRIMARY,
    align: "left", margin: 0,
  });
}

function kicker(slide, text, color) {
  slide.addText(text.toUpperCase(), {
    x: 0.62, y: 0.2, w: 12, h: 0.3,
    fontFace: BODY, fontSize: 13, bold: true, color: color || TEAL,
    charSpacing: 3, align: "left", margin: 0,
  });
}

function numCircle(slide, x, y, n, d, fill) {
  d = d || 0.7;
  slide.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill || MINT } });
  slide.addText(String(n), {
    x, y, w: d, h: d, align: "center", valign: "middle",
    fontFace: HEAD, fontSize: 22, bold: true, color: DARK, margin: 0,
  });
}

// ---------------------------------------------------------------- 1. TITLE
let s = p.addSlide(); bg(s, DARK);
s.addShape(p.ShapeType.ellipse, { x: 10.6, y: -1.7, w: 4.6, h: 4.6, fill: { color: "0E3A55" } });
s.addShape(p.ShapeType.ellipse, { x: 11.7, y: 4.4, w: 3.4, h: 3.4, fill: { color: "0B3247" } });
s.addText("MEDICAL DEVICE SECURITY WORKSHOP", {
  x: 0.7, y: 1.7, w: 11, h: 0.4, fontFace: BODY, fontSize: 15, bold: true,
  color: MINT, charSpacing: 4, margin: 0,
});
s.addText("Threat Modeling a Medical Device", {
  x: 0.7, y: 2.2, w: 11.6, h: 1.6, fontFace: HEAD, fontSize: 52, bold: true,
  color: LIGHT, margin: 0,
});
s.addText("Hands-on threat modeling of the NeuroScan 3000 — a hybrid cloud + on-premise imaging system", {
  x: 0.72, y: 3.95, w: 10.8, h: 0.7, fontFace: BODY, fontSize: 19, color: "CDE3EA", margin: 0,
});
s.addText("Based on the MITRE Playbook for Threat Modeling Medical Devices", {
  x: 0.72, y: 6.5, w: 11, h: 0.4, fontFace: BODY, fontSize: 14, italic: true, color: "8FB6C4", margin: 0,
});

// ---------------------------------------------------------------- 2. WHY IT MATTERS
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "Why threat model a medical device?");
title(s, "The stakes are uniquely high");
const stakes = [
  ["Patients", "A compromised device can directly harm patients — a wrong diagnosis acted on, or care denied in an emergency."],
  ["Ransomware", "Attacks on hospitals have demonstrably delayed care and put patients at risk."],
  ["Data", "Medical records are among the most valuable records on the black market."],
  ["The law", "Since 2023, cybersecurity is a statutory FDA requirement — not optional."],
];
let cx = 0.6, cy = 1.7, cw = 6.0, ch = 1.85, gx = 0.35, gy = 0.3;
stakes.forEach((it, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = cx + col * (cw + gx), y = cy + row * (ch + gy);
  s.addShape(p.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.09, fill: { color: SOFT } });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.3, y: y + 0.32, w: 0.5, h: 0.5, fill: { color: TEAL } });
  s.addText(it[0], { x: x + 1.0, y: y + 0.28, w: cw - 1.2, h: 0.5, fontFace: HEAD, fontSize: 20, bold: true, color: PRIMARY, margin: 0, valign: "middle" });
  s.addText(it[1], { x: x + 1.0, y: y + 0.82, w: cw - 1.25, h: 0.9, fontFace: BODY, fontSize: 14.5, color: INK, margin: 0 });
});

// ---------------------------------------------------------------- 3. FOUR QUESTIONS
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "The method");
title(s, "Threat modeling answers four questions");
const qs = [
  ["1", "What are we working on?", "Scope the system — assets, entry points, and who might attack it."],
  ["2", "What can go wrong?", "Identify threats as attacker stories, then assess their risk."],
  ["3", "What are we going to do about it?", "Define concrete mitigations and controls."],
  ["4", "Did we do a good job?", "Review completeness, present, and find the gaps."],
];
cx = 0.6; cy = 1.75; cw = 6.0; ch = 1.95; gx = 0.35; gy = 0.32;
qs.forEach((it, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = cx + col * (cw + gx), y = cy + row * (ch + gy);
  s.addShape(p.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.09, fill: { color: "F4F9FA" }, line: { color: "D6E7EC", width: 1 } });
  numCircle(s, x + 0.32, y + 0.34, it[0], 0.72, MINT);
  s.addText(it[1], { x: x + 1.25, y: y + 0.34, w: cw - 1.5, h: 0.75, fontFace: HEAD, fontSize: 19, bold: true, color: PRIMARY, margin: 0, valign: "middle" });
  s.addText(it[2], { x: x + 1.25, y: y + 1.12, w: cw - 1.5, h: 0.7, fontFace: BODY, fontSize: 14.5, color: INK, margin: 0 });
});

// ---------------------------------------------------------------- 4. WHAT'S DIFFERENT
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "Not just IT security");
title(s, "What makes medical devices different");
const rows = [
  ["Primary risk", "Data breach, downtime", "Patient harm, misdiagnosis"],
  ["Availability", "Important", "Often life-critical"],
  ["Patching", "Weekly / monthly", "12–18 months (clearance)"],
  ["Regulation", "GDPR, CCPA", "FDA, EU MDR, IEC 81001-5-1"],
  ["Attackers", "Opportunistic", "Includes nation-states"],
];
const tx = 0.6, tw = 12.1;
const c1 = 3.1, c2 = 4.5, c3 = 4.5;
let ty = 1.75;
// header row
s.addShape(p.ShapeType.roundRect, { x: tx, y: ty, w: tw, h: 0.6, rectRadius: 0.05, fill: { color: PRIMARY } });
s.addText("Aspect", { x: tx + 0.2, y: ty, w: c1 - 0.2, h: 0.6, fontFace: BODY, bold: true, fontSize: 15, color: LIGHT, valign: "middle", margin: 0 });
s.addText("General IT", { x: tx + c1, y: ty, w: c2, h: 0.6, fontFace: BODY, bold: true, fontSize: 15, color: "BFE0E8", valign: "middle", margin: 0 });
s.addText("Medical Devices", { x: tx + c1 + c2, y: ty, w: c3, h: 0.6, fontFace: BODY, bold: true, fontSize: 15, color: MINT, valign: "middle", margin: 0 });
ty += 0.6;
rows.forEach((r, i) => {
  const h = 0.82;
  s.addShape(p.ShapeType.rect, { x: tx, y: ty, w: tw, h, fill: { color: i % 2 ? "F4F9FA" : "FFFFFF" }, line: { color: "E3EEF1", width: 1 } });
  s.addText(r[0], { x: tx + 0.2, y: ty, w: c1 - 0.2, h, fontFace: BODY, bold: true, fontSize: 14.5, color: PRIMARY, valign: "middle", margin: 0 });
  s.addText(r[1], { x: tx + c1, y: ty, w: c2, h, fontFace: BODY, fontSize: 14.5, color: MUTE, valign: "middle", margin: 0 });
  s.addText(r[2], { x: tx + c1 + c2, y: ty, w: c3, h, fontFace: BODY, fontSize: 14.5, color: INK, valign: "middle", margin: 0 });
  ty += h;
});

// ---------------------------------------------------------------- 5. SCENARIO
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "Today's scenario");
title(s, "The NeuroScan 3000");
s.addText("A hybrid MRI-based neurological imaging system. Part sits in the hospital; part runs in the cloud. You will threat model the whole system.", {
  x: 0.62, y: 1.55, w: 7.4, h: 1.2, fontFace: BODY, fontSize: 17, color: INK, margin: 0,
});
const comps = [
  "Imaging unit + acquisition workstation (on-prem)",
  "Local DICOM server (on-prem)",
  "Cloud AI diagnostic service",
  "Remote vendor support channel",
  "Hospital EMR — a partially-trusted dependency",
];
s.addText(
  comps.map((c) => ({ text: c, options: { bullet: { code: "2022", indent: 18 }, breakLine: true, paraSpaceAfter: 8 } })),
  { x: 0.62, y: 2.85, w: 7.4, h: 3.4, fontFace: BODY, fontSize: 16, color: INK, margin: 0 }
);
// simple architecture cue on the right
s.addShape(p.ShapeType.roundRect, { x: 8.5, y: 1.7, w: 4.2, h: 4.6, rectRadius: 0.1, fill: { color: SOFT } });
s.addText("HOSPITAL", { x: 8.7, y: 1.85, w: 3.8, h: 0.3, fontFace: BODY, bold: true, fontSize: 12, color: TEAL, charSpacing: 2, margin: 0 });
["Imaging unit", "Acquisition workstation", "Local DICOM server"].forEach((t, i) => {
  s.addShape(p.ShapeType.roundRect, { x: 8.75, y: 2.25 + i * 0.72, w: 3.7, h: 0.56, rectRadius: 0.06, fill: { color: LIGHT }, line: { color: TEAL, width: 1 } });
  s.addText(t, { x: 8.75, y: 2.25 + i * 0.72, w: 3.7, h: 0.56, align: "center", valign: "middle", fontFace: BODY, fontSize: 13.5, color: INK, margin: 0 });
});
s.addShape(p.ShapeType.line, { x: 10.6, y: 4.5, w: 0, h: 0.35, line: { color: MUTE, width: 1.5, dashType: "dash" } });
s.addText("CLOUD", { x: 8.7, y: 4.9, w: 3.8, h: 0.3, fontFace: BODY, bold: true, fontSize: 12, color: PRIMARY, charSpacing: 2, margin: 0 });
s.addShape(p.ShapeType.roundRect, { x: 8.75, y: 5.25, w: 3.7, h: 0.85, rectRadius: 0.06, fill: { color: PRIMARY } });
s.addText("Cloud AI diagnostic service", { x: 8.75, y: 5.25, w: 3.7, h: 0.85, align: "center", valign: "middle", fontFace: BODY, fontSize: 13.5, bold: true, color: LIGHT, margin: 0 });

// ---------------------------------------------------------------- 6. AGENDA
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "How the two hours run");
title(s, "Run of show");
const agenda = [
  ["15m", "Introduction", "Why medical device security — and the scenario"],
  ["20m", "Q1 · What are we working on?", "Scope, assets, entry points, actors"],
  ["35m", "Q2 · What can go wrong?", "Attacker stories + risk scoring"],
  ["20m", "Q3 · What will we do about it?", "Mitigations and trade-offs"],
  ["20m", "Q4 · Did we do a good job?", "Review + group presentations"],
  ["10m", "Debrief & wrap-up", "What was missed, and what's next"],
];
let ay = 1.7;
agenda.forEach((r) => {
  const h = 0.82;
  s.addShape(p.ShapeType.roundRect, { x: 0.6, y: ay, w: 1.5, h: h - 0.12, rectRadius: 0.06, fill: { color: DARK } });
  s.addText(r[0], { x: 0.6, y: ay, w: 1.5, h: h - 0.12, align: "center", valign: "middle", fontFace: HEAD, bold: true, fontSize: 18, color: MINT, margin: 0 });
  s.addText(r[1], { x: 2.35, y: ay - 0.02, w: 5.6, h: h - 0.08, fontFace: HEAD, bold: true, fontSize: 17, color: PRIMARY, valign: "middle", margin: 0 });
  s.addText(r[2], { x: 8.0, y: ay - 0.02, w: 4.9, h: h - 0.08, fontFace: BODY, fontSize: 14, color: MUTE, valign: "middle", margin: 0 });
  ay += h;
});

// ---------------------------------------------------------------- 7. HOW WE WORK
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "Ground rules");
title(s, "How we'll work");
const how = [
  ["Groups", "Work in groups of 3–5. Different views make a better model."],
  ["One template", "Fill in the shared worksheet as you go through Q1–Q4."],
  ["Be specific", "Vague threats and vague fixes don't help. Name the component."],
  ["AI feedback", "Submit your template at the end — an AI evaluator gives written feedback."],
];
cx = 0.6; cy = 1.75; cw = 6.0; ch = 1.9; gx = 0.35; gy = 0.32;
how.forEach((it, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = cx + col * (cw + gx), y = cy + row * (ch + gy);
  s.addShape(p.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.09, fill: { color: SOFT } });
  s.addText(it[0], { x: x + 0.35, y: y + 0.28, w: cw - 0.7, h: 0.5, fontFace: HEAD, bold: true, fontSize: 20, color: TEAL, margin: 0 });
  s.addText(it[1], { x: x + 0.35, y: y + 0.85, w: cw - 0.7, h: 0.9, fontFace: BODY, fontSize: 15, color: INK, margin: 0 });
});

// ---------------------------------------------------------------- 8. Q1
function questionSlide(num, heading, lead, points) {
  const sl = p.addSlide(); bg(sl, DARK);
  sl.addShape(p.ShapeType.ellipse, { x: 11.4, y: -1.4, w: 3.8, h: 3.8, fill: { color: "0E3A55" } });
  numCircle(sl, 0.7, 0.6, num, 0.95, MINT);
  sl.addText(heading, { x: 1.9, y: 0.62, w: 10.8, h: 0.95, fontFace: HEAD, bold: true, fontSize: 34, color: LIGHT, valign: "middle", margin: 0 });
  sl.addText(lead, { x: 0.72, y: 1.85, w: 11.5, h: 0.9, fontFace: BODY, fontSize: 18, italic: true, color: "BFE0E8", margin: 0 });
  sl.addText(
    points.map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 18 }, breakLine: true, paraSpaceAfter: 12 } })),
    { x: 0.72, y: 2.95, w: 11.6, h: 3.6, fontFace: BODY, fontSize: 18, color: "E6F1F4", margin: 0 }
  );
  return sl;
}
questionSlide("1", "What are we working on?",
  "Build a shared map of the system before you hunt for threats.",
  [
    "Agree what's in scope — and what's out (and why).",
    "List the assets worth protecting; mark each C, I, or A.",
    "Map the entry points — every door data or commands come through.",
    "Name the threat actors — insiders, ransomware, nation-states, vendors.",
  ]);

// ---------------------------------------------------------------- 9. Q2 story format
s = p.addSlide(); bg(s, DARK);
numCircle(s, 0.7, 0.6, "2", 0.95, MINT);
s.addText("What can go wrong?", { x: 1.9, y: 0.62, w: 10.8, h: 0.95, fontFace: HEAD, bold: true, fontSize: 34, color: LIGHT, valign: "middle", margin: 0 });
s.addText("Think like an attacker. Write ATTACKER STORIES.", { x: 0.72, y: 1.8, w: 11.6, h: 0.6, fontFace: BODY, fontSize: 18, italic: true, color: "BFE0E8", margin: 0 });
s.addShape(p.ShapeType.roundRect, { x: 0.9, y: 2.7, w: 11.5, h: 1.7, rectRadius: 0.12, fill: { color: "0E3A55" }, line: { color: MINT, width: 1.5 } });
s.addText([
  { text: "As a ", options: { color: "BFE0E8" } },
  { text: "[bad actor]", options: { color: MINT, bold: true } },
  { text: ", I want to ", options: { color: "BFE0E8" } },
  { text: "[do something bad]", options: { color: MINT, bold: true } },
  { text: " via ", options: { color: "BFE0E8" } },
  { text: "[method]", options: { color: MINT, bold: true } },
  { text: ", so that ", options: { color: "BFE0E8" } },
  { text: "[goal].", options: { color: MINT, bold: true } },
], { x: 1.2, y: 2.7, w: 10.9, h: 1.7, fontFace: HEAD, fontSize: 24, valign: "middle", margin: 0, lineSpacingMultiple: 1.15 });
s.addText("Example: As a rogue vendor technician, I want to change the AI model via the remote support channel, so that the system returns false negatives and patients are misdiagnosed.", {
  x: 0.9, y: 4.65, w: 11.5, h: 1.1, fontFace: BODY, fontSize: 16, italic: true, color: "CDE3EA", margin: 0,
});
s.addText("Aim for at least 8 stories across different parts of the system.", {
  x: 0.9, y: 5.95, w: 11.5, h: 0.5, fontFace: BODY, bold: true, fontSize: 16, color: MINT, margin: 0,
});

// ---------------------------------------------------------------- 10. Q2 scoring
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "Q2 · continued");
title(s, "Then score each story");
s.addShape(p.ShapeType.roundRect, { x: 0.6, y: 1.7, w: 3.9, h: 2.5, rectRadius: 0.09, fill: { color: SOFT } });
s.addText("Likelihood", { x: 0.8, y: 1.85, w: 3.5, h: 0.5, fontFace: HEAD, bold: true, fontSize: 20, color: TEAL, margin: 0 });
s.addText([
  { text: "1  Hard", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "2  Realistic", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "3  Easy", options: {} },
], { x: 0.8, y: 2.45, w: 3.5, h: 1.6, fontFace: BODY, fontSize: 16, color: INK, margin: 0 });

s.addText("×", { x: 4.55, y: 2.4, w: 0.6, h: 1.0, align: "center", valign: "middle", fontFace: HEAD, fontSize: 40, bold: true, color: MUTE, margin: 0 });

s.addShape(p.ShapeType.roundRect, { x: 5.2, y: 1.7, w: 3.9, h: 2.5, rectRadius: 0.09, fill: { color: SOFT } });
s.addText("Impact", { x: 5.4, y: 1.85, w: 3.5, h: 0.5, fontFace: HEAD, bold: true, fontSize: 20, color: TEAL, margin: 0 });
s.addText([
  { text: "1  Minor", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "2  Significant", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "3  Serious", options: {} },
], { x: 5.4, y: 2.45, w: 3.5, h: 1.6, fontFace: BODY, fontSize: 16, color: INK, margin: 0 });

s.addShape(p.ShapeType.roundRect, { x: 9.5, y: 1.7, w: 3.2, h: 2.5, rectRadius: 0.09, fill: { color: PRIMARY } });
s.addText("Risk", { x: 9.7, y: 1.85, w: 2.8, h: 0.5, fontFace: HEAD, bold: true, fontSize: 20, color: MINT, margin: 0 });
s.addText([
  { text: "1–2  Low", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "3–4  Medium", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "6–9  High", options: {} },
], { x: 9.7, y: 2.45, w: 2.8, h: 1.6, fontFace: BODY, fontSize: 16, color: LIGHT, margin: 0 });

s.addShape(p.ShapeType.roundRect, { x: 0.6, y: 4.55, w: 12.1, h: 1.5, rectRadius: 0.1, fill: { color: "FDECEC" }, line: { color: "E5A6A6", width: 1 } });
s.addText("Patient safety rule", { x: 0.9, y: 4.7, w: 11.5, h: 0.45, fontFace: HEAD, bold: true, fontSize: 18, color: "B23A3A", margin: 0 });
s.addText("If a story could directly harm a patient — wrong diagnosis acted on, device down in an emergency — mark it HIGH regardless of the score, and note why.", {
  x: 0.9, y: 5.15, w: 11.5, h: 0.8, fontFace: BODY, fontSize: 15.5, color: "7A2E2E", margin: 0,
});

// ---------------------------------------------------------------- 11. Q3
questionSlide("3", "What are we going to do about it?",
  "For each high-priority threat, define at least one concrete mitigation.",
  [
    "Preventive · Detective · Corrective · Compensating — pick the right kind.",
    "Be specific: not \"add encryption\" but \"enable TLS on the DICOM link.\"",
    "Note the residual risk that remains after the fix.",
    "Flag regulatory impact — could a change need a new FDA submission?",
  ]);

// ---------------------------------------------------------------- 12. Q4
questionSlide("4", "Did we do a good job?",
  "A threat model only has value if it's honest and complete.",
  [
    "Run the completeness checklist in your template.",
    "Present your top 3 threats, your most surprising find, your hardest trade-off.",
    "Other groups: ask \"did you consider…?\" — the goal is to find gaps.",
    "The best outcome is another group spotting something you missed.",
  ]);

// ---------------------------------------------------------------- 13. FDA reality
s = p.addSlide(); bg(s, LIGHT);
kicker(s, "The regulatory reality");
title(s, "What the FDA is looking for");
const fda = [
  ["Exploitability, not odds", "Security risk is judged on how exploitable you are — not on the probability of an attack."],
  ["Patient harm first", "Severity of patient harm drives the risk, and can override a low score."],
  ["A living document", "The model must be maintained across the device's whole lifecycle — not filed once."],
  ["Traceability", "Threat model → risk assessment → SBOM → testing must all connect."],
];
cx = 0.6; cy = 1.75; cw = 6.0; ch = 1.95; gx = 0.35; gy = 0.32;
fda.forEach((it, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = cx + col * (cw + gx), y = cy + row * (ch + gy);
  s.addShape(p.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.09, fill: { color: "F4F9FA" }, line: { color: "D6E7EC", width: 1 } });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.32, y: y + 0.34, w: 0.5, h: 0.5, fill: { color: PRIMARY } });
  s.addText(it[0], { x: x + 1.05, y: y + 0.3, w: cw - 1.3, h: 0.6, fontFace: HEAD, bold: true, fontSize: 18, color: PRIMARY, valign: "middle", margin: 0 });
  s.addText(it[1], { x: x + 1.05, y: y + 0.95, w: cw - 1.3, h: 0.85, fontFace: BODY, fontSize: 14.5, color: INK, margin: 0 });
});

// ---------------------------------------------------------------- 14. CLOSING
s = p.addSlide(); bg(s, DARK);
s.addShape(p.ShapeType.ellipse, { x: -1.6, y: 4.4, w: 4.4, h: 4.4, fill: { color: "0E3A55" } });
s.addText("You are the attacker before the attacker.", {
  x: 0.8, y: 2.2, w: 11.6, h: 1.6, fontFace: HEAD, bold: true, fontSize: 40, color: LIGHT, margin: 0,
});
s.addText("Find the problems before a patient gets hurt.", {
  x: 0.82, y: 3.8, w: 11, h: 0.7, fontFace: BODY, fontSize: 20, color: MINT, margin: 0,
});
s.addText("When you're done: name your file threat-model-[team].docx and submit as instructed.", {
  x: 0.82, y: 5.9, w: 11.6, h: 0.5, fontFace: BODY, fontSize: 15, italic: true, color: "9FC3D0", margin: 0,
});

p.writeFile({ fileName: "workshop-intro-slides.pptx" }).then((f) => console.log("Wrote", f));
