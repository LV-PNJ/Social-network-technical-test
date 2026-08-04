from fpdf import FPDF
from pathlib import Path
import unicodedata
import re


def ascii_safe(s: str) -> str:
    repl = {
        "\u2014": "-",
        "\u2013": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2026": "...",
        "\u00a0": " ",
        "**": "",
        "`": "",
    }
    for a, b in repl.items():
        s = s.replace(a, b)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = unicodedata.normalize("NFKD", s)
    return s.encode("ascii", "ignore").decode("ascii").strip()


class ManualPDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Pagina {self.page_no()}", align="C")


def md_to_pdf(md_path: Path, pdf_path: Path, title: str) -> None:
    lines = md_path.read_text(encoding="utf-8").splitlines()
    pdf = ManualPDF()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.set_margins(18, 18, 18)
    usable = pdf.w - pdf.l_margin - pdf.r_margin

    pdf.set_font("Helvetica", "B", 16)
    pdf.multi_cell(usable, 9, ascii_safe(title))
    pdf.ln(4)

    in_code = False
    for raw in lines:
        line = raw.rstrip()
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            pdf.set_font("Courier", "", 9)
            safe = ascii_safe(line)[:110] or " "
            pdf.multi_cell(usable, 5, safe)
            continue

        if not line.strip() or line.startswith("|") or line.startswith("---") or line.startswith("- ["):
            pdf.ln(2)
            continue

        if line.startswith("# "):
            pdf.ln(3)
            pdf.set_font("Helvetica", "B", 14)
            pdf.multi_cell(usable, 8, ascii_safe(line[2:]))
            continue
        if line.startswith("## "):
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 12)
            pdf.multi_cell(usable, 7, ascii_safe(line[3:]))
            continue
        if line.startswith("### "):
            pdf.set_font("Helvetica", "B", 11)
            pdf.multi_cell(usable, 6, ascii_safe(line[4:]))
            continue

        if line.startswith("- ") or line.startswith("* "):
            pdf.set_font("Helvetica", "", 11)
            pdf.multi_cell(usable, 6, "* " + ascii_safe(line[2:]))
            continue

        pdf.set_font("Helvetica", "", 11)
        safe = ascii_safe(line)
        if safe:
            pdf.multi_cell(usable, 6, safe)

    pdf.output(str(pdf_path))
    print("Wrote", pdf_path)


if __name__ == "__main__":
    base = Path(__file__).resolve().parent
    md_to_pdf(
        base / "manual-instalacion.md",
        base / "Manual_Instalacion_DEVEXP.pdf",
        "Manual de instalacion - DEVEXP",
    )
    md_to_pdf(
        base / "manual-usuario.md",
        base / "Manual_Usuario_DEVEXP.pdf",
        "Manual de usuario - DEVEXP",
    )
