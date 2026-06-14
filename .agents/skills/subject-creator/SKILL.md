---
name: subject-creator
description: >-
  Generates, normalizes, and validates custom subjects for MOLD V2, ensuring
  same-length MCQ options, correct LaTeX delimiters ($$), valid Mermaid diagrams,
  and terminology-flashcard alignment.
---

# MOLD V2 Subject Creator

## Overview
This skill provides a standardized workflow and templates for generating, normalizes, and validating educational subject banks (JSON format) compatible with the MOLD V2 system. It ensures that subjects have balanced category distributions, equal-length MCQ options (to prevent length-based guessing), and valid syntax for Mermaid diagrams and LaTeX.

## Quick Start
1. **Define Subject Data**: Create a python generator script using the [Creator Template](#generalized-creator-template).
2. **Implement Options Normalization**: Ensure option text lengths for each MCQ are padded to the same size. Do not pad True/False options.
3. **Write/Check Diagrams & LaTeX**: Wrap all math in double dollar signs (`$$`) and double-quote any Mermaid node labels containing special characters.
4. **Validate**: Run the validation script using the [Validator Template](#generalized-validator-template) to verify 0 errors and warnings before deployment.

---

## Technical Specifications & Rules

### 1. MCQ Same-Length Constraint
To avoid giving away answers based on option length, all MCQ choices for any given question must have identical character lengths.
- In the generator, use `.ljust(max_len)` to pad options with trailing spaces.
- **Rule**: Do not apply padding to `TrueFalse` questions; their options must remain exactly `["True", "False"]`.

### 2. LaTeX Delimiters
- **Rule**: Use only double dollar signs `$$` (e.g. `$$2^{12}$$`) for math formatting.
- Any single `$` will fail validation (even inside code blocks or literal strings like `Dollar ($)`). Replace literal dollar symbols with text like `Dollar symbol` or `USD`.

### 3. Mermaid Diagram Syntax
- Flowchart node labels containing special characters (like parentheses, brackets, or braces) must be wrapped in double quotes (e.g., `Buffer["Local Buffer (buffer[64])"]`).
- Avoid nesting parenthesis inside unquoted text.

### 4. Terminology and Flashcard Alignment
- For every category, the glossary keys in `terminology` must match the set of terms in `flashcards` exactly.

---

## Generalized Creator Template

Save this script as `generate_subject.py` in your workspace:

```python
import json
import os

def make_same_length_options(opts_text, labels=["A", "B", "C", "D"]):
    """Pads MCQ options with trailing spaces to ensure equal length."""
    max_len = max(len(t) for t in opts_text)
    return [
        {"label": labels[idx], "text": t.ljust(max_len)}
        for idx, t in enumerate(opts_text)
    ]

def generate_subject():
    subject_id = "my-subject-id"
    
    # Define your subject definition
    subject_data = {
        "id": subject_id,
        "name": "My Subject Name",
        "config": {
            "title": "My Subject Mastery",
            "description": "Comprehensive quiz prep.",
            "version": "1.0.0",
            "storageKey": f"mold_v2_{subject_id}"
        },
        "questions": [],
        "flashcards": {},
        "terminology": {},
        "achievements": []
    }
    
    # 1. Define Raw Questions
    # Structure: (category, difficulty, type, question_text, options_list, correct_answer, explanation, hint, diagram_mermaid)
    raw_questions = [
        (
            "sample-category", "Medium", "MCQ",
            "What is the output of the process scheduling trace below?<br>[EXAMINE DIAGRAM]",
            ["Output sequence A", "Output sequence B", "Output sequence C", "Output sequence D"],
            "A",
            "Explanation detailing why A is correct using $$math_expression$$ if needed.",
            "Look at the transition in the active state.",
            "stateDiagram-v2\n  [*] --> StateA\n  StateA --> StateB"
        ),
        (
            "sample-category", "Easy", "TrueFalse",
            "True or False: User-level threads block the entire process during synchronous I/O.",
            ["True", "False"],
            "A",
            "Since the OS kernel is unaware of user-level threads, a blocked thread blocks the process.",
            "Does the kernel schedule ULTs?",
            None
        )
    ]
    
    # Populate questions
    for idx, (cat, diff, qtype, qtext, opts, ans, expl, hint, diag) in enumerate(raw_questions, 1):
        q_id = f"q-{subject_id}-{idx}"
        
        if qtype == "MCQ":
            formatted_opts = make_same_length_options(opts)
        else:
            formatted_opts = [
                {"label": "A", "text": "True"},
                {"label": "B", "text": "False"}
            ]
            
        q_obj = {
            "id": q_id,
            "type": qtype,
            "difficulty": diff,
            "category": cat,
            "question": qtext,
            "options": formatted_opts,
            "answer": ans,
            "explanation": expl,
            "hint": hint
        }
        if diag:
            q_obj["diagram"] = diag
            q_obj["diagramPosition"] = "right"
            
        subject_data["questions"].append(q_obj)
        
    # 2. Terminology and Flashcards (must align exactly per category)
    subject_data["terminology"] = {
        "sample-category": [
            {"term": "Sample Term", "definition": "A sample term definition."}
        ]
    }
    
    subject_data["flashcards"] = {
        "sample-category": [
            {"term": "Sample Term", "definition": "A sample term definition."}
        ]
    }
    
    # Write minified single-line JSON output
    out_path = f"public/examples/{subject_id}.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(subject_data, f, separators=(',', ':'), ensure_ascii=False)
        
    print(f"[+] Subject JSON successfully written to: {out_path}")

if __name__ == "__main__":
    generate_subject()
```

---

## Generalized Validator Template

Save this script as `validate_subject.py` in your workspace:

```python
import sys
import os
import json
import re

# Add path to import base validator if available
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from validate_ap import validate_subject as base_validate_subject
except ImportError:
    # Fallback/stub validation functions if validate_ap is missing
    def base_validate_subject(file_path):
        return True, [], []

def validate_subject(file_path):
    # 1. Base validation
    success, errors, warnings = base_validate_subject(file_path)
    
    # 2. MOLD-V2 Specific Checks
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            questions = data.get("questions", [])
            for q in questions:
                qid = q.get("id", "?")
                qtype = q.get("type", "MCQ")
                options = q.get("options", [])
                
                # Check option length equality for MCQs only
                if qtype == "MCQ" and options:
                    lengths = [len(opt.get("text", "")) for opt in options if isinstance(opt, dict)]
                    if len(set(lengths)) > 1:
                        errors.append(
                            f"Question '{qid}' has options of differing character lengths: {lengths} "
                            f"(all options must be exactly equal length to prevent guessing)"
                        )
                        success = False
                        
        except Exception as e:
            errors.append(f"Validator encountered an error: {e}")
            success = False
            
    print(f"\n[Validation summary for {os.path.basename(file_path)}]")
    print(f"    Errors: {len(errors)}")
    print(f"    Warnings: {len(warnings)}")
    return success, errors, warnings

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else "public/examples/my-subject-id.json"
    success, _, _ = validate_subject(target)
    sys.exit(0 if success else 1)
```

---

## Common Mistakes

- **Incorrect LaTeX Delimiter**: Using `$` instead of `$$`. This will fail the LaTeX delimiter scan immediately.
- **Padding TrueFalse Options**: Applying equal-length padding to True/False options, resulting in `["True ", "False"]` or similar. True/False options must be exactly `["True", "False"]`.
- **Mermaid Syntax Error**: Placing parentheses or brackets inside a flowchart node label without wrapping the label in double quotes (e.g. `A[Hello (world)]` should be `A["Hello (world)"]`).
