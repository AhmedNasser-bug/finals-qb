import json
import re
import sys
import os
import glob

# Configure stdout and stderr to use UTF-8 to prevent UnicodeEncodeError on Windows
try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except AttributeError:
    pass

def clean_enclosure(label):
    """Strip nested enclosures in Mermaid labels (e.g. for cylinder [(...)]) to get the inner label."""
    while len(label) >= 2:
        if label[0] == '(' and label[-1] == ')':
            label = label[1:-1]
        elif label[0] == '[' and label[-1] == ']':
            label = label[1:-1]
        elif label[0] == '{' and label[-1] == '}':
            label = label[1:-1]
        else:
            break
    return label

def check_mermaid_syntax(diagram, qid, errors, warnings):
    """Perform syntax validation on Mermaid diagram strings."""
    if not diagram or not diagram.strip():
        errors.append(f"Question '{qid}' has an empty diagram field")
        return

    lines = diagram.split('\n')
    diag_type = lines[0].strip().split()[0] if lines else ""
    valid_types = {
        "graph", "flowchart", "sequenceDiagram", "classDiagram",
        "stateDiagram-v2", "erDiagram", "gantt", "pie", "requirementDiagram"
    }
    
    if not any(diag_type.startswith(vt) for vt in valid_types):
        warnings.append(f"Question '{qid}' Mermaid diagram starts with unknown diagram type: '{diag_type}'")

    is_flowchart = any(t in diag_type for t in ["graph", "flowchart"])

    for idx, line in enumerate(lines, 1):
        clean_line = line.strip()
        if not clean_line or clean_line.startswith("%%") or clean_line.startswith("//"):
            continue

        # Check balanced double quotes
        if clean_line.count('"') % 2 != 0:
            errors.append(f"Question '{qid}' Mermaid line {idx} has unbalanced double quotes: '{clean_line}'")

        # Check unquoted special characters in flowcharts/graphs (which crash the renderer)
        if is_flowchart:
            # Temporarily remove double-quoted substrings to avoid matching inside them
            line_no_quotes = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"', '""', clean_line)
            matches = re.finditer(r'\b([a-zA-Z0-9_-]+)\s*([\[\(\{])', line_no_quotes)
            for m in matches:
                start_char = m.group(2)
                start_pos = m.end()
                end_char = ']' if start_char == '[' else ')' if start_char == '(' else '}'
                
                # Find matching closing character considering depth
                rest = line_no_quotes[start_pos:]
                end_pos = -1
                depth = 1
                for char_idx, c in enumerate(rest):
                    if c == start_char:
                        depth += 1
                    elif c == end_char:
                        depth -= 1
                        if depth == 0:
                            end_pos = char_idx
                            break
                            
                if end_pos != -1:
                    raw_label = rest[:end_pos]
                    label = clean_enclosure(raw_label.strip())
                    
                    if label.startswith('"') and label.endswith('"'):
                        continue
                        
                    # Check for unquoted special characters in node label
                    if any(c in label for c in ['(', ')', '[', ']', '{', '}']):
                        errors.append(
                            f"Question '{qid}' Mermaid line {idx} has unquoted label containing special characters: '{clean_line}'. "
                            f"Wrap the label in double quotes, e.g. nodeId[\"{label.replace('\"', '')}\"]"
                        )

def validate_subject(file_path):
    print(f"\n========================================================")
    print(f"=== VALIDATING SUBJECT: {file_path}")
    print(f"========================================================")

    errors = []
    warnings = []

    if not os.path.exists(file_path):
        errors.append(f"File not found: {file_path}")
        print(f"[-] ERROR: File not found")
        return False, errors, warnings

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        errors.append(f"Failed to parse JSON: {e}")
        print(f"[-] ERROR: JSON parsing failed: {e}")
        return False, errors, warnings

    # Metadata extraction
    subject_id = data.get("id")
    subject_name = data.get("name")
    config = data.get("config", {})
    
    questions = data.get("questions", [])
    flashcards = data.get("flashcards", [])
    terminology = data.get("terminology", {})
    achievements = data.get("achievements", [])

    print(f"[i] Metadata:")
    print(f"    Subject ID:   {subject_id}")
    print(f"    Subject Name: {subject_name}")
    print(f"    Config Title: {config.get('title')}")
    print(f"[i] Component Counts:")
    print(f"    Questions:    {len(questions)}")
    print(f"    Flashcards:   {len(flashcards)}")
    print(f"    Glossary Categories: {len(terminology)}")
    print(f"    Achievements: {len(achievements)}")

    # 1. Structure & Duplicate ID Checks
    seen_q_ids = {}
    for idx, q in enumerate(questions):
        qid = q.get("id")
        if not qid:
            errors.append(f"Question at index {idx} is missing an ID")
            continue
        if qid in seen_q_ids:
            errors.append(f"Duplicate Question ID: '{qid}' found at index {seen_q_ids[qid]} and {idx}")
        seen_q_ids[qid] = idx

    seen_fc_ids = {}
    for idx, fc in enumerate(flashcards):
        fid = fc.get("id")
        if not fid:
            errors.append(f"Flashcard at index {idx} is missing an ID")
            continue
        if fid in seen_fc_ids:
            errors.append(f"Duplicate Flashcard ID: '{fid}' found at index {seen_fc_ids[fid]} and {idx}")
        seen_fc_ids[fid] = idx

    # 2. Dynamic Categories Extractor & Slugs check
    q_cats = set(q.get("category") for q in questions if q.get("category"))
    f_cats = set(fc.get("category") for fc in flashcards if fc.get("category"))
    t_cats = set(terminology.keys())
    all_cats = q_cats.union(f_cats).union(t_cats)

    # Validate category slug formats
    slug_regex = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    for cat in all_cats:
        if not slug_regex.match(cat):
            errors.append(f"Category '{cat}' is not in valid kebab-case format (alphanumeric + single hyphens)")

    # Cross-section category alignment checks
    cats_q_no_t = q_cats - t_cats
    if cats_q_no_t:
        warnings.append(f"Categories present in questions but NOT in terminology glossary: {cats_q_no_t}")

    cats_t_no_q = t_cats - q_cats
    if cats_t_no_q:
        warnings.append(f"Categories present in terminology glossary but NOT in questions: {cats_t_no_q}")

    cats_fc_no_q = f_cats - q_cats
    if cats_fc_no_q:
        warnings.append(f"Categories present in flashcards but NOT in questions: {cats_fc_no_q}")

    cats_q_no_fc = q_cats - f_cats
    if cats_q_no_fc:
        warnings.append(f"Categories present in questions but NOT in flashcards: {cats_q_no_fc}")

    # 3. Question Content Validation
    for q in questions:
        qid = q.get("id", "?")
        qtype = q.get("type", "MCQ")
        text = q.get("question", "")
        options = q.get("options", [])
        answer = q.get("answer")
        explanation = q.get("explanation", "")
        hint = q.get("hint", "")

        if qtype not in ["MCQ", "TrueFalse"]:
            errors.append(f"Question '{qid}' has invalid type: '{qtype}'")

        if not options:
            errors.append(f"Question '{qid}' has no options")
            continue

        if qtype == "TrueFalse":
            if len(options) != 2:
                errors.append(f"TrueFalse Question '{qid}' has {len(options)} options instead of 2")
            else:
                opt_texts = [o.get("text") for o in options]
                if "True" not in opt_texts or "False" not in opt_texts:
                    errors.append(f"TrueFalse Question '{qid}' options do not contain exactly 'True' and 'False': {opt_texts}")
        
        # Verify Option Labels (A, B, C...)
        option_labels = []
        for opt_idx, opt in enumerate(options):
            if not isinstance(opt, dict):
                errors.append(f"Question '{qid}' option at index {opt_idx} is not a dictionary")
                continue
            label = opt.get("label")
            opt_text = opt.get("text")
            expected_label = chr(65 + opt_idx)
            
            if not label:
                errors.append(f"Question '{qid}' option at index {opt_idx} has no label")
            elif label != expected_label:
                errors.append(f"Question '{qid}' option at index {opt_idx} has label '{label}' instead of expected '{expected_label}'")
            if not opt_text:
                errors.append(f"Question '{qid}' option at index {opt_idx} has no text")
            if label:
                option_labels.append(label)

        if not answer:
            errors.append(f"Question '{qid}' is missing correct 'answer'")
        elif answer not in option_labels:
            errors.append(f"Question '{qid}' correct answer '{answer}' is not in option labels {option_labels}")

        # LaTeX Delimiter scan (un-escaped $)
        fields_to_scan = [text, explanation, hint] + [o.get("text", "") for o in options if isinstance(o, dict)]
        for field in fields_to_scan:
            if field and "$" in field:
                # Allow double $$ but flag single $
                # Simple check: if there is a single unescaped $
                # We can replace $$ with empty strings and see if there are still $ left
                stripped_field = field.replace("$$", "")
                if "$" in stripped_field:
                    errors.append(f"Question '{qid}' contains LaTeX '$' delimiter. Use double '$$' instead: '{field}'")

        # Diagram alignment and syntax checks
        has_diagram_tag = "[EXAMINE DIAGRAM]" in text
        diagram = q.get("diagram")
        diag_pos = q.get("diagramPosition")

        if has_diagram_tag and not diagram:
            errors.append(f"Question '{qid}' text starts/contains '[EXAMINE DIAGRAM]' but has no 'diagram' field")
        if not has_diagram_tag and diagram:
            warnings.append(f"Question '{qid}' has a 'diagram' field but lacks '[EXAMINE DIAGRAM]' tag in its question text")
        if diag_pos and not diagram:
            errors.append(f"Question '{qid}' defines 'diagramPosition' but has no 'diagram' field")
        if diagram:
            if not diag_pos:
                errors.append(f"Question '{qid}' has a 'diagram' field but is missing 'diagramPosition'")
            elif diag_pos not in ["left", "right"]:
                errors.append(f"Question '{qid}' has invalid 'diagramPosition': '{diag_pos}'. Must be 'left' or 'right'")
            
            # Syntax validation of the diagram itself
            check_mermaid_syntax(diagram, qid, errors, warnings)

    # 4. Duplicate Question Text Check
    normalized_questions = {}
    for q in questions:
        qid = q.get("id", "?")
        text = q.get("question", "")
        if not text:
            continue
        # Normalize: strip, collapse whitespace, lowercase
        norm_text = " ".join(text.strip().lower().split())
        if norm_text in normalized_questions:
            normalized_questions[norm_text].append(qid)
        else:
            normalized_questions[norm_text] = [qid]

    for norm_text, qids in normalized_questions.items():
        if len(qids) > 1:
            errors.append(f"Duplicate question text found across question IDs: {qids}. Text snippet: '{norm_text[:80]}...'")

    # 5. Glossary Validation
    for cat, entries in terminology.items():
        if not isinstance(entries, list):
            errors.append(f"Terminology category '{cat}' must map to a list of glossary entries")
            continue
        for idx, entry in enumerate(entries):
            if not isinstance(entry, dict):
                errors.append(f"Terminology '{cat}' entry at index {idx} is not a dictionary")
                continue
            term = entry.get("term")
            definition = entry.get("definition")
            if not term:
                errors.append(f"Terminology '{cat}' entry at index {idx} has no 'term'")
            if not definition:
                errors.append(f"Terminology '{cat}' entry at index {idx} has no 'definition'")

    # 6. Flashcard & Terminology Mismatch check (per category)
    fc_by_cat = {}
    for fc in flashcards:
        cat = fc.get("category")
        if cat:
            if cat not in fc_by_cat:
                fc_by_cat[cat] = set()
            fc_by_cat[cat].add(fc.get("term", "").strip().lower())

    term_by_cat = {}
    for cat, entries in terminology.items():
        if isinstance(entries, list):
            term_by_cat[cat] = set(e.get("term", "").strip().lower() for e in entries if isinstance(e, dict) and e.get("term"))

    # Check alignment for categories in the intersection
    common_cats = set(fc_by_cat.keys()).intersection(set(term_by_cat.keys()))
    for cat in common_cats:
        fc_terms = fc_by_cat[cat]
        t_terms = term_by_cat[cat]
        
        in_t_not_fc = t_terms - fc_terms
        if in_t_not_fc:
            warnings.append(f"Category '{cat}': Terms in terminology but missing in flashcards: {in_t_not_fc}")
            
        in_fc_not_t = fc_terms - t_terms
        if in_fc_not_t:
            warnings.append(f"Category '{cat}': Terms in flashcards but missing in terminology: {in_fc_not_t}")

    # 7. Achievements Validation
    valid_cond_types = {
        "accuracy_gte", "streak_gte", "mode_complete", "speedrun_under",
        "no_hints", "all_categories", "runs_gte", "all_unlocked"
    }
    has_meta_achievement = False
    for ach in achievements:
        aid = ach.get("id", "?")
        title = ach.get("title")
        desc = ach.get("description")
        icon = ach.get("icon")
        cond = ach.get("condition", {})

        if not title:
            errors.append(f"Achievement '{aid}' has no title")
        if not desc:
            errors.append(f"Achievement '{aid}' has no description")
        if not icon:
            warnings.append(f"Achievement '{aid}' has no icon")
        
        ctype = cond.get("type")
        if not ctype:
            errors.append(f"Achievement '{aid}' has no condition type")
        elif ctype not in valid_cond_types:
            errors.append(f"Achievement '{aid}' has invalid condition type '{ctype}'")
        
        if ctype == "all_unlocked":
            has_meta_achievement = True
            if aid not in ["grand-master", "grand_master"]:
                warnings.append(
                    f"Meta-achievement '{aid}' has condition 'all_unlocked' but its ID is '{aid}'. "
                    f"Recommended: 'grand-master' or 'grand_master' for backward compatibility."
                )

    if not has_meta_achievement and achievements:
        warnings.append("No meta-achievement ('all_unlocked' condition) defined in achievements list")

    # Print summary
    print(f"\n[i] Results for {file_path}:")
    print(f"    Errors:   {len(errors)}")
    print(f"    Warnings: {len(warnings)}")
    
    if errors:
        print("    [!] ERRORS:")
        for err in errors[:15]:
            print(f"        - {err}")
        if len(errors) > 15:
            print(f"        ... and {len(errors) - 15} more errors")
            
    if warnings:
        print("    [*] WARNINGS:")
        for warn in warnings[:15]:
            print(f"        - {warn}")
        if len(warnings) > 15:
            print(f"        ... and {len(warnings) - 15} more warnings")

    return len(errors) == 0, errors, warnings

def main():
    # If a specific file is supplied as argument, validate only that file
    if len(sys.argv) > 1:
        target_file = sys.argv[1]
        success, _, _ = validate_subject(target_file)
        sys.exit(0 if success else 1)
        
    # Otherwise, discover and validate all JSON files in examples and root
    examples_pattern = os.path.join("public", "examples", "*.json")
    demo_pattern = os.path.join("public", "demo-diagram-subject.json")
    
    files_to_check = glob.glob(examples_pattern)
    if os.path.exists(demo_pattern):
        files_to_check.append(demo_pattern)
        
    files_to_check = sorted(list(set(files_to_check)))
    
    if not files_to_check:
        print("[-] No subject files found in public/examples/ or public/demo-diagram-subject.json")
        sys.exit(1)
        
    print(f"=== Discovering and validating {len(files_to_check)} subject files ===")
    
    global_success = True
    results = []
    
    for f_path in files_to_check:
        success, errors, warnings = validate_subject(f_path)
        results.append({
            "file": f_path,
            "success": success,
            "errors": len(errors),
            "warnings": len(warnings)
        })
        if not success:
            global_success = False
            
    # Print beautiful summary table
    print("\n" + "=" * 80)
    print(f"{'SUBJECT VALIDATION RUN SUMMARY':^80}")
    print("=" * 80)
    print(f"{'Subject File':<50} | {'Status':<8} | {'Errors':<6} | {'Warnings':<8}")
    print("-" * 80)
    for r in results:
        status_str = "PASS" if r["success"] else "FAIL"
        print(f"{r['file']:<50} | {status_str:<8} | {r['errors']:<6} | {r['warnings']:<8}")
    print("=" * 80)
    
    if global_success:
        print("\n[+] SUCCESS: All discovered subjects passed validation schema checks!")
        sys.exit(0)
    else:
        print("\n[!] FAILURE: One or more subjects failed validation schema checks.")
        sys.exit(1)

if __name__ == '__main__':
    main()
