#!/usr/bin/env python3
"""
Generate the participant threat-model worksheet as a Google-Docs-friendly .docx.

Design constraints for clean Google Docs import:
- Built-in heading styles only (Heading 1/2/3) so Google Docs keeps the outline.
- Standard font (Calibri) and simple tables with a bold header row.
- No content controls, form fields, macros, or text boxes (Google Docs strips them).
- Blank table cells / underscore lines act as fill-in areas.

Usage:
    python generate_template_docx.py [output_path]
Default output: ../../../templates/threat-model-template.docx (relative to this script)
"""

import sys
from pathlib import Path

from docx import Document
from docx.shared import Pt, RGBColor

ACCENT = RGBColor(0x1F, 0x49, 0x7D)      # dark blue for headings
HEADER_FILL = "1F497D"                     # table header shading
NOTE = RGBColor(0x55, 0x55, 0x55)          # grey for hint/italic notes


def set_cell_background(cell, hex_color):
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def style_base(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(11)
    for lvl, size in [("Heading 1", 18), ("Heading 2", 14), ("Heading 3", 12)]:
        st = doc.styles[lvl]
        st.font.name = "Calibri"
        st.font.size = Pt(size)
        st.font.color.rgb = ACCENT


def add_hint(doc, text):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.italic = True
    r.font.color.rgb = NOTE
    r.font.size = Pt(10)
    return p


def add_table(doc, headers, n_blank_rows, example_row=None):
    rows = 1 + (1 if example_row else 0) + n_blank_rows
    table = doc.add_table(rows=rows, cols=len(headers))
    table.style = "Table Grid"
    for j, h in enumerate(headers):
        cell = table.rows[0].cells[j]
        cell.text = ""
        run = cell.paragraphs[0].add_run(h)
        run.bold = True
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        run.font.size = Pt(10)
        set_cell_background(cell, HEADER_FILL)
    r_idx = 1
    if example_row:
        for j, val in enumerate(example_row):
            cell = table.rows[r_idx].cells[j]
            cell.text = ""
            run = cell.paragraphs[0].add_run(val)
            run.italic = True
            run.font.color.rgb = NOTE
            run.font.size = Pt(10)
        r_idx += 1
    doc.add_paragraph()
    return table


def blank_lines(doc, n=3):
    for _ in range(n):
        doc.add_paragraph("_______________________________________________________________")


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else (
        Path(__file__).resolve().parents[4] / "templates" / "threat-model-template.docx"
    )
    out.parent.mkdir(parents=True, exist_ok=True)

    doc = Document()
    style_base(doc)

    # ---- Title block ----
    doc.add_heading("Threat Model — NeuroScan 3000", level=1)
    meta = doc.add_paragraph()
    meta.add_run("Team name: ").bold = True
    meta.add_run("____________________________     ")
    meta.add_run("Date: ").bold = True
    meta.add_run("____________________")
    doc.add_paragraph("Workshop: Medical Device Threat Modeling")
    add_hint(doc, "Fill this worksheet in as you work through Q1–Q4. Import it into "
                  "Google Docs (File → Open → Upload), complete it as a group, then "
                  "export back to .docx or PDF for AI evaluation.")

    # ---- Q1 ----
    doc.add_heading("Q1: What are we working on?", level=2)
    add_hint(doc, "Goal: build a shared map of the system before you look for threats. "
                  "Agree what's in scope, what's worth protecting, and who could cause harm.")

    doc.add_heading("1.1 System boundary", level=3)
    doc.add_paragraph("In scope — components and interfaces your team will analyze:")
    blank_lines(doc, 3)
    doc.add_paragraph("Out of scope — what you exclude, and why "
                      "(e.g. \"hospital Wi-Fi — managed by hospital IT, outside MediScanTech's control\"):")
    blank_lines(doc, 2)

    doc.add_heading("1.2 Assets — what are we protecting?", level=3)
    add_hint(doc, "Ask: what would hurt if it was stolen, changed, or made unavailable? "
                  "Property key: C = Confidentiality, I = Integrity, A = Availability. Aim for ≥5.")
    add_table(doc,
              ["Asset ID", "Asset", "Why it matters", "Most critical property (C/I/A)"],
              n_blank_rows=5,
              example_row=["A-01", "DICOM scan images with patient data",
                           "Contains PHI; misuse could harm patients or breach privacy", "Confidentiality"])

    doc.add_heading("1.3 Entry points — how can someone get in?", level=3)
    add_hint(doc, "Network ports, physical connections, web portals, update channels, remote access.")
    add_table(doc,
              ["Entry point", "How it works", "Authentication?", "Encrypted?", "Who can reach it?"],
              n_blank_rows=5,
              example_row=["Local admin console (:8443)", "Web UI on the workstation",
                           "Username/password, no MFA", "Yes (HTTPS)", "Anyone on hospital LAN"])

    doc.add_heading("1.4 Threat actors — who might attack this?", level=3)
    add_hint(doc, "Go beyond opportunistic hackers — insiders, nation-states, ransomware groups, vendor staff.")
    add_table(doc,
              ["Actor", "Motivation", "How they might get in"],
              n_blank_rows=5,
              example_row=["Ransomware group", "Financial — encrypt systems, demand payment",
                           "Phishing hospital staff; exploiting internet-facing services"])

    # ---- Q2 ----
    doc.add_heading("Q2: What can go wrong?", level=2)
    add_hint(doc, "Goal: think like an attacker. Write stories from the attacker's perspective, "
                  "then assess how serious each one is.")

    doc.add_heading("2.1 Attacker stories", level=3)
    p = doc.add_paragraph()
    p.add_run("Format: ").bold = True
    p.add_run("As a [bad actor], I want to [do something bad] via [method or entry point], "
              "so that [I achieve my goal].").italic = True
    add_hint(doc, "Example: As a rogue vendor technician, I want to access the system beyond my "
                  "support role via the shared remote support credential, so that I can exfiltrate "
                  "patient data or plant a backdoor. Aim for ≥8 stories across different parts of the system.")
    add_table(doc,
              ["Story ID", "Bad actor", "Attacker story", "Part of system affected", "Impact type (S/P/A)"],
              n_blank_rows=8,
              example_row=["S-01", "Ransomware group",
                           "As a ransomware group, I want to encrypt the acquisition workstation via a "
                           "phishing email, so that the hospital cannot perform scans and must pay a ransom.",
                           "Acquisition workstation", "A"])
    add_hint(doc, "Impact type: S = patient safety (physical harm) · P = privacy / PHI "
                  "(confidentiality) · A = availability (loss of scanning / care disruption). "
                  "Tag the dominant type — it tells you which harm to score in 2.2. A threat can carry more than one.")

    doc.add_heading("2.2 Risk assessment", level=3)
    p = doc.add_paragraph()
    p.add_run("Exploitability: ").bold = True
    p.add_run("1 = Low (rare access / high skill) · 2 = Moderate (remote, known weakness) · "
              "3 = High (trivial, public exploit)")
    p1b = doc.add_paragraph()
    p1b.add_run("Severity of harm (patient safety first — also privacy & availability): ").bold = True
    p1b.add_run("1 = Minor (no patient harm; negligible privacy/operational impact) · "
                "2 = Significant (care delayed/degraded, a privacy/PHI breach, or meaningful downtime) · "
                "3 = Serious (direct patient harm, a large-scale PHI breach, or extended loss of scanning)")
    p2 = doc.add_paragraph()
    p2.add_run("Risk = Exploitability × Severity  →  1–2: Low · 3–4: Medium · 6–9: High").bold = True
    note = doc.add_paragraph()
    nr = note.add_run("Patient safety rule: if a story could directly harm a patient, mark it High "
                      "regardless of score and add a note. Score a confidentiality-only threat on the "
                      "severity of its privacy harm — not \"no harm\".")
    nr.bold = True
    fda = doc.add_paragraph()
    fr = fda.add_run("FDA note: security risk is scored on exploitability (how feasible the attack "
                     "is), not probability — the FDA does not permit probabilistic scoring for "
                     "security risk. Exploitability × severity is the FDA's controlled/uncontrolled matrix.")
    fr.italic = True
    fr.font.color.rgb = NOTE
    fr.font.size = Pt(10)
    eng = doc.add_paragraph()
    er = eng.add_run("In a real engagement: this 3×3 is a teaching scale. Production threat models "
                     "usually layer STRIDE (systematic enumeration per component/data flow) and CVSS "
                     "(standardized exploitability scoring) on top — noting base CVSS doesn't capture "
                     "patient-safety severity, so it's adapted with a medical-device rubric, not used raw.")
    er.italic = True
    er.font.color.rgb = NOTE
    er.font.size = Pt(10)
    add_table(doc,
              ["Story ID", "Exploitability (1–3)", "Rationale", "Severity (1–3)", "Rationale",
               "Risk score", "Patient safety?", "Priority"],
              n_blank_rows=8)

    # ---- Q3 ----
    doc.add_heading("Q3: What are we going to do about it?", level=2)
    add_hint(doc, "Goal: for each high-priority story, define at least one concrete mitigation. "
                  "Be specific. Note trade-offs and residual risk.")
    p = doc.add_paragraph()
    p.add_run("Types: ").bold = True
    p.add_run("Preventive (stops it) · Detective (spots it) · Corrective (limits damage) · "
              "Compensating (alternative when the ideal fix isn't feasible)")
    add_hint(doc, "\"Add encryption\" is not specific enough. \"Enable TLS on the DICOM connection "
                  "between the workstation and the local DICOM server\" is.")
    add_table(doc,
              ["Mitigation ID", "Addresses story(ies)", "Type", "What exactly would be done",
               "Residual risk", "Regulatory note"],
              n_blank_rows=6,
              example_row=["M-01", "S-03, S-05", "Preventive",
                           "Replace shared remote support credential with per-engineer certificates; log all sessions",
                           "Insider threat reduced, not eliminated", "Config change only — no new submission"])

    # ---- Q4 ----
    doc.add_heading("Q4: Did we do a good job?", level=2)
    add_hint(doc, "Goal: step back and review your work critically before presenting.")

    doc.add_heading("Our top 3 threats", level=3)
    for i in (1, 2, 3):
        doc.add_paragraph(f"{i}.  S-____:  ______________________________________________________")
    doc.add_heading("Most surprising finding", level=3)
    blank_lines(doc, 2)
    doc.add_heading("Hardest trade-off", level=3)
    blank_lines(doc, 2)
    doc.add_heading("What we're still unsure about", level=3)
    blank_lines(doc, 2)

    doc.add_heading("Completeness checklist", level=3)
    checklist = [
        "At least 8 attacker stories, each covering a different part of the system",
        "Every story written in the full format (actor → action → method → goal)",
        "Every story has an exploitability, severity, and risk score",
        "Any story that could harm a patient is marked High priority with rationale",
        "Every High-priority story has at least one mitigation",
        "Every Medium-priority story has a mitigation or a documented acceptance rationale",
        "Every mitigation says specifically what would be done (not just the category)",
        "Residual risk is noted for each mitigation",
        "Assets and entry points carry stable IDs (supports FDA traceability to the SBOM)",
    ]
    for item in checklist:
        doc.add_paragraph(f"☐  {item}")

    doc.save(str(out))
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
