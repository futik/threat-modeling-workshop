#!/usr/bin/env python3
"""
Extract the text of a filled participant submission (.docx) so it can be pasted
into the evaluation prompt. Reads paragraphs and tables in document order.

Usage:
    python extract_submission.py <submission.docx> [output.md]

If output is omitted, prints to stdout. Handles the .docx a team exports from
Google Docs (File → Download → Microsoft Word .docx).
"""

import sys
from pathlib import Path

from docx import Document
from docx.document import Document as _Doc
from docx.table import Table
from docx.text.paragraph import Paragraph


def iter_block_items(parent):
    """Yield paragraphs and tables in document order."""
    from docx.oxml.ns import qn
    if isinstance(parent, _Doc):
        parent_elm = parent.element.body
    else:
        parent_elm = parent._tc
    for child in parent_elm.iterchildren():
        if child.tag == qn("w:p"):
            yield Paragraph(child, parent)
        elif child.tag == qn("w:tbl"):
            yield Table(child, parent)


def table_to_md(table):
    rows = []
    for r in table.rows:
        cells = [" ".join(c.text.split()) for c in r.cells]
        rows.append("| " + " | ".join(cells) + " |")
    if not rows:
        return ""
    header = rows[0]
    sep = "| " + " | ".join(["---"] * len(table.rows[0].cells)) + " |"
    return "\n".join([header, sep] + rows[1:])


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    src = Path(sys.argv[1])
    doc = Document(str(src))
    out_lines = []
    for block in iter_block_items(doc):
        if isinstance(block, Paragraph):
            text = block.text.rstrip()
            if text:
                style = (block.style.name or "").lower()
                if style.startswith("heading 1"):
                    out_lines.append(f"\n# {text}")
                elif style.startswith("heading 2"):
                    out_lines.append(f"\n## {text}")
                elif style.startswith("heading 3"):
                    out_lines.append(f"\n### {text}")
                else:
                    out_lines.append(text)
        elif isinstance(block, Table):
            out_lines.append("")
            out_lines.append(table_to_md(block))
            out_lines.append("")
    result = "\n".join(out_lines).strip() + "\n"
    if len(sys.argv) >= 3:
        Path(sys.argv[2]).write_text(result, encoding="utf-8")
        print(f"Wrote {sys.argv[2]}")
    else:
        print(result)


if __name__ == "__main__":
    main()
