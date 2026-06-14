import sys
import os
import json

# Add current folder to sys.path so we can import validate_ap
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from validate_ap import validate_subject as base_validate_subject

def validate_subject(file_path):
    # Call base validation first
    success, errors, warnings = base_validate_subject(file_path)
    
    # Read the JSON file to check for custom system-programming rules
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            questions = data.get("questions", [])
            for q in questions:
                qid = q.get("id", "?")
                qtype = q.get("type", "MCQ")
                options = q.get("options", [])
                if qtype == "MCQ" and options:
                    # Check length of each option text
                    lengths = [len(opt.get("text", "")) for opt in options if isinstance(opt, dict)]
                    if len(set(lengths)) > 1:
                        errors.append(f"Question '{qid}' has options of differing character lengths: {lengths} (all options must be exactly equal length to prevent guessing)")
                        success = False
        except Exception as e:
            errors.append(f"Error checking option lengths: {e}")
            success = False
            
    # Print custom sp diagnostics summary
    print(f"\n[sp-diagnostic] Option length check complete.")
    print(f"    Total Errors (including base + option lengths): {len(errors)}")
    return success, errors, warnings

# Main CLI entry point
if __name__ == '__main__':
    if len(sys.argv) > 1:
        target_file = sys.argv[1]
        success, _, _ = validate_subject(target_file)
        sys.exit(0 if success else 1)
    else:
        # If no arguments, check public/examples/system-programming.json
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        target_file = os.path.join(base_dir, "public", "examples", "system-programming.json")
        if os.path.exists(target_file):
            success, _, _ = validate_subject(target_file)
            sys.exit(0 if success else 1)
        else:
            print(f"[-] No file specified and default path not found: {target_file}")
            sys.exit(1)
