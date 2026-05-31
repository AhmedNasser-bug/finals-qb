#!/usr/bin/env python3
import os
import re
import sys
import argparse

# Target directories to scan for Tailwind arbitrary values
TARGET_DIRS = ["components", "app"]
CSS_FILE = "app/globals.css"

# Regex to find arbitrary Tailwind classes, matching e.g. bg-[#131313], text-[10px], border-[#930013]/50
# Group 1: prefix (e.g. bg, text, border, shadow, w, h, min-h)
# Group 2: arbitrary value inside brackets (e.g. #131313, 10px, rgba(...))
# Group 3: optional opacity tail (e.g. 50, 5, 80)
TAILWIND_CLASS_PATTERN = re.compile(
    r"\b([a-zA-Z-]+)-\[([^\]]+)\](?:\/([a-zA-Z0-9%]+))?\b"
)

def slugify(value):
    """
    Sanitize arbitrary values into valid CSS custom variable names.
    E.g. #fecc17 -> fecc17
    E.g. 10px -> 10px
    E.g. rgba(254,204,23,0.02) -> rgba-254-204-23-0-02
    """
    clean = value.strip().lower()
    if clean.startswith('#'):
        return clean.replace('#', '')
    
    # Replace non-alphanumeric characters with hyphens
    sanitized = re.sub(r'[^a-z0-9]', '-', clean)
    # Remove duplicate hyphens
    sanitized = re.sub(r'-+', '-', sanitized)
    # Trim leading/trailing hyphens
    return sanitized.strip('-')

def determine_var_name(value):
    """
    Determine the CSS custom variable name based on the arbitrary value type.
    """
    val_strip = value.strip()
    if val_strip.startswith('var('):
        return None  # Already a variable reference
    
    slug = slugify(val_strip)
    if not slug:
        return None

    # Check if value is a hex color
    if re.match(r'^#[0-9a-fA-F]{3,8}$', val_strip):
        return f"--tw-hex-{slug}"
    # Check if value is a size (px, rem, em, vh, vw, %)
    elif re.match(r'^[0-9]+(?:\.[0-9]+)?(?:px|rem|em|vh|vw|%)?$', val_strip):
        return f"--tw-size-{slug}"
    else:
        return f"--tw-val-{slug}"

def scan_files():
    """
    Scan all JS/TS/JSX/TSX files in target directories and count arbitrary tailwind classes.
    Returns:
        dict: mapping of raw value -> list of occurrences (dict with file_path, prefix, opacity)
    """
    occurrences = {}
    
    for target_dir in TARGET_DIRS:
        if not os.path.exists(target_dir):
            continue
            
        for root, _, files in os.walk(target_dir):
            for file in files:
                if not file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    continue
                    
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception as e:
                    print(f"Warning: Could not read {file_path}: {e}")
                    continue
                
                for match in TAILWIND_CLASS_PATTERN.finditer(content):
                    prefix = match.group(1)
                    value = match.group(2)
                    opacity = match.group(3)
                    
                    var_name = determine_var_name(value)
                    if not var_name:
                        continue
                        
                    if value not in occurrences:
                        occurrences[value] = []
                        
                    occurrences[value].append({
                        "file_path": file_path,
                        "prefix": prefix,
                        "opacity": opacity,
                        "var_name": var_name,
                        "full_match": match.group(0)
                    })
                    
    return occurrences

def inject_css_variables(tokens, dry_run=True):
    """
    Inject newly created CSS variables into the `:root` block in globals.css.
    """
    if not os.path.exists(CSS_FILE):
        print(f"Error: CSS file {CSS_FILE} not found.", file=sys.stderr)
        return False
        
    with open(CSS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find existing variables inside the CSS file to avoid duplicates
    existing_vars = set(re.findall(r'(--tw-[a-z0-9-]+)\s*:', content))
    
    new_vars_to_add = {}
    for value, var_name in tokens.items():
        if var_name not in existing_vars:
            new_vars_to_add[var_name] = value

    if not new_vars_to_add:
        print("CSS Info: No new unique CSS variables need to be injected.")
        return True
        
    # Generate variable declarations block
    css_lines = ["\n    /* === Extracted Tailwind Custom Tokens === */"]
    for var_name, value in sorted(new_vars_to_add.items()):
        css_lines.append(f"    {var_name}: {value};")
    css_block = "\n".join(css_lines) + "\n"
    
    if dry_run:
        print("\n=== CSS VARIABLES TO INJECT ===")
        print(css_block.strip())
        return True
        
    # Insert variables right after :root {
    match = re.search(r':root\s*\{', content)
    if not match:
        print("Error: Could not find ':root {' block in globals.css", file=sys.stderr)
        return False
        
    insert_pos = match.end()
    updated_content = content[:insert_pos] + css_block + content[insert_pos:]
    
    with open(CSS_FILE, 'w', encoding='utf-8') as f:
        f.write(updated_content)
        
    print(f"CSS Success: Injected {len(new_vars_to_add)} variables into {CSS_FILE}")
    return True

def replace_tokens_in_files(tokens, occurrences, dry_run=True):
    """
    Replace detected arbitrary Tailwind values in source files with variable tokens.
    """
    # Group occurrences by file_path to do one write per file
    files_to_update = {}
    for value, occs in occurrences.items():
        var_name = tokens.get(value)
        if not var_name:
            continue
            
        for occ in occs:
            file_path = occ["file_path"]
            if file_path not in files_to_update:
                files_to_update[file_path] = []
            files_to_update[file_path].append(occ)
            
    print(f"\n=== SOURCE FILE UPDATE PLAN ({'DRY RUN' if dry_run else 'WRITE MODE'}) ===")
    total_replacements = 0
    
    for file_path, occs in sorted(files_to_update.items()):
        print(f"File: {file_path}")
        
        # Read file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # We perform a regex substitution using a callback function
        def replacer(match):
            prefix = match.group(1)
            value = match.group(2)
            opacity = match.group(3)
            
            var_name = determine_var_name(value)
            if var_name and var_name in tokens.values():
                replacement = f"{prefix}-[var({var_name})]"
                if opacity:
                    replacement += f"/{opacity}"
                return replacement
            return match.group(0)
            
        updated_content, count = TAILWIND_CLASS_PATTERN.subn(replacer, content)
        total_replacements += count
        
        for occ in occs:
            op_str = f"/{occ['opacity']}" if occ['opacity'] else ""
            var_name = determine_var_name(occ['value_raw'])
            target = f"{occ['prefix']}-[var({var_name})]{op_str}"
            print(f"  - Replaced: {occ['full_match']}  =>  {target}")
            
        if not dry_run and count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"  [SUCCESS] Wrote {count} updates.")
            
    print(f"\nTotal Arbitrary Replacements: {total_replacements} across {len(files_to_update)} files.")
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Tailwind Hardcoded Arbitrary Value Extractor & CSS Tokenizer"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--dry-run", 
        action="store_true", 
        help="Scan files and output what changes would be made, without writing."
    )
    group.add_argument(
        "--write", 
        action="store_true", 
        help="Perform replacements in code files and inject tokens into CSS root."
    )
    
    args = parser.parse_args()
    
    print("Scanning codebase for arbitrary hardcoded Tailwind values...")
    occurrences = scan_files()
    
    if not occurrences:
        print("No arbitrary Tailwind hardcoded values detected in scanned folders.")
        return
        
    # Count frequency and map raw values to variable tokens
    unique_tokens = {}
    
    print("\n=== DETECTED HARDCODED ARBITRARY VALUES ===")
    print(f"{'tailwind class pattern':<45} | {'prefix':<10} | {'value':<25} | {'occurrences':<12} | {'variable name'}")
    print("-" * 115)
    
    for value, occs in sorted(occurrences.items(), key=lambda x: len(x[1]), reverse=True):
        count = len(occs)
        prefix = occs[0]["prefix"]
        var_name = occs[0]["var_name"]
        
        # Attach raw value for easier lookup
        for occ in occs:
            occ["value_raw"] = value
            
        unique_tokens[value] = var_name
        
        example_match = occs[0]["full_match"]
        print(f"{example_match:<45} | {prefix:<10} | {value:<25} | {count:<12} | {var_name}")
        
    # Inject variables into globals.css
    css_success = inject_css_variables(unique_tokens, dry_run=args.dry_run)
    if not css_success:
        print("Error during CSS variable injection phase.", file=sys.stderr)
        sys.exit(1)
        
    # Perform substitutions in React/TS files
    replace_tokens_in_files(unique_tokens, occurrences, dry_run=args.dry_run)
    
    if args.dry_run:
        print("\n[DRY RUN COMPLETE] No source files or CSS stylesheets were modified.")
    else:
        print("\n[WRITE MODE COMPLETE] Design tokens successfully extracted and applied.")

if __name__ == "__main__":
    main()
