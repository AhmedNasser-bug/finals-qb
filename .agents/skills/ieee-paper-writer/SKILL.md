---
name: ieee-paper-writer
description: Generates, formats, and validates academic research papers conforming strictly to the IEEE Conference Template specifications (IEEEtran.cls, 2-column, 3-5 pages).
---

# IEEE Conference Paper Writer Skill

This skill enforces strict adherence to official IEEE Conference publishing standards (`IEEEtran.cls` in conference mode), incorporating academic rigor, mathematical modeling, and empirical alignment.

---

## 1. Structural & Typography Specifications

| Element | Specification / Constraint |
| :--- | :--- |
| **Document Class** | `\documentclass[conference]{IEEEtran}` |
| **Page Budget** | 3–5 pages, strict two-column format (`letterpaper`). |
| **Title Format** | Title case; no math, symbols, or footnotes in title (`\title{...}`). |
| **Author Block** | Multi-column using `\IEEEauthorblockN{}` and `\IEEEauthorblockA{}` with affiliation, country, and ORCID. |
| **Abstract** | Single italicized block, 150–250 words. No citations or math symbols in abstract. |
| **Index Terms** | 4–8 IEEE-approved keywords separated by commas (`\begin{IEEEkeywords}`). |
| **Headings** | Upper-case Roman numerals (`I. INTRODUCTION`, `II. RELATED WORK`). |
| **Subheadings** | Capital letters italicized (`A. Spaced Retrieval`, `B. Bloom's Taxonomy`). |
| **Equations** | Numbered consecutively in `\begin{equation}` with soft references `(\ref{...})`. |
| **Figures & Tables** | Positioned at top/bottom of columns. Captions: Table above, Figure below. |
| **Citations** | IEEE bracket style `[1]`, `[1]--[3]` managed via BibTeX (`IEEEtran.bst`). |

---

## 2. Mandatory Writing Workflow

1. **Title & Authorship Definition**:
   - Explicit paper title without acronyms.
   - Author names, affiliations, email/ORCID.
2. **Abstract & Index Terms Formulation**:
   - State problem, solution, empirical grounding, and key results.
3. **Core Argument Sections (I to VII)**:
   - **Section I**: Introduction & Problem Statement.
   - **Section II**: Empirical Cognitive / Theoretical Foundations.
   - **Section III**: System Architecture & Multi-Modal Delivery.
   - **Section IV**: Gamification Mechanics & Behavioral Pacing.
   - **Section V**: Formative Analytics & Telemetry Engine.
   - **Section VI**: Governance, Open Access & Sustainability Model.
   - **Section VII**: Conclusion & Future Directions.
4. **BibTeX Verification**:
   - Ensure all references have author, title, venue, year, and DOI/URL.

---

## 3. PDF Compilation Protocol

To generate the distribution PDF:
```bash
# Direct Chrome/Edge headless rendering:
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="finalists_paper.pdf" "paper_preview.html"
```
Or via TeX engine:
```bash
pdflatex main.tex && bibtex main && pdflatex main.tex && pdflatex main.tex
```
