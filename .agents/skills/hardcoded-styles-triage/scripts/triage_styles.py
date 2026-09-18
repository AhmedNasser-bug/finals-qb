#!/usr/bin/env python3
"""
MOLD V2 - Hardcoded Styles Triage & Audit Scanner
Scans source files (.tsx, .ts, .jsx, .js) for hardcoded colors, arbitrary hex values,
and non-semantic color classes that break theme switching and dark/light modes.
"""

import os
import sys
import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Regex patterns for style violations
HEX_PATTERN = re.compile(r'#([0-9a-fA-F]{3,8})\b')
ARBITRARY_COLOR_PATTERN = re.compile(r'\b(?:bg|text|border|ring|shadow|from|to|via)-\[#([0-9a-fA-F]{3,8})(?:\/[0-9%]+)?\]')
NON_SEMANTIC_PALETTES = re.compile(r'\b(bg|text|border|ring|hover:bg|hover:border|hover:text)-(?:zinc|slate|gray|neutral|stone|amber|emerald|red|orange|blue|cyan|violet|purple)-(?:50|100|200|300|400|500|600|700|800|900|950)(?:\/[0-9]+)?\b')
LITERAL_WHITE_BLACK = re.compile(r'\b(?:text-white|bg-black|hover:text-white|hover:bg-black)(?:\/[0-9]+)?\b')
HARDCODED_RGBA_SHADOW = re.compile(r'rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+')

# Direct hex-to-token suggested translations in MOLD V2
TOKEN_TRANSLATIONS = {
    "07080a": "bg-card (base surface / input wells)",
    "101115": "bg-panel (elevated container)",
    "111215": "bg-panel (elevated container)",
    "121318": "bg-secondary/60 (interactive hover)",
    "0d0e11": "bg-card / bg-secondary/40 (top bars / dark wells)",
    "fecc17": "text-primary / bg-primary / border-primary (theme accent)",
    "4ae176": "text-primary / text-emerald-400 (if purely semantic status)",
    "a4acba": "text-muted-foreground",
    "1b1b1f": "bg-card / bg-panel",
    "2a2a2a": "bg-secondary / bg-muted",
    "930013": "text-destructive / border-destructive",
}

DEFAULT_SCAN_DIRS = ["components", "app"]
EXCLUDED_FILES = [
    "globals.css",
    "theme-registry.ts",
    "definitions",
    "triage_styles.py",
    "tailwind.config.ts"
]

def should_skip(path: Path) -> bool:
    posix = path.as_posix()
    for exc in EXCLUDED_FILES:
        if exc in posix:
            return True
    return False

def scan_file(file_path: Path) -> Dict[str, Any]:
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        return {"error": str(e), "path": str(file_path)}

    lines = content.splitlines()
    violations = []

    for idx, line in enumerate(lines, start=1):
        line_strip = line.strip()
        # Skip pure comments or imports
        if line_strip.startswith(("//", "/*", "*", "import ")):
            continue

        # 1. Arbitrary hex colors in classNames
        for match in ARBITRARY_COLOR_PATTERN.finditer(line):
            hex_val = match.group(1).lower()
            suggestion = TOKEN_TRANSLATIONS.get(hex_val, "Use dynamic token (bg-card, text-primary, text-muted-foreground, etc.)")
            violations.append({
                "line": idx,
                "type": "arbitrary-hex-class",
                "match": match.group(0),
                "hex": f"#{hex_val}",
                "snippet": line_strip[:120],
                "suggestion": suggestion
            })

        # 2. Raw hex in styles or general strings (excluding SVGs or already caught)
        for match in HEX_PATTERN.finditer(line):
            hex_code = match.group(1).lower()
            matched_str = f"#{hex_code}"
            # Avoid duplicate if caught by arbitrary color
            if any(v["line"] == idx and matched_str in v["match"] for v in violations):
                continue
            if "stroke=" in line or "fill=" in line or "<svg" in line or "<path" in line:
                if hex_code in ["fecc17", "4ae176", "0d0e11"]:
                    violations.append({
                        "line": idx,
                        "type": "svg-hardcoded-hex",
                        "match": matched_str,
                        "hex": matched_str,
                        "snippet": line_strip[:120],
                        "suggestion": "Use currentColor or CSS var"
                    })
                continue
            if hex_code in TOKEN_TRANSLATIONS:
                violations.append({
                    "line": idx,
                    "type": "raw-hex-code",
                    "match": matched_str,
                    "hex": matched_str,
                    "snippet": line_strip[:120],
                    "suggestion": TOKEN_TRANSLATIONS[hex_code]
                })

        # 3. Non-semantic palette colors
        for match in NON_SEMANTIC_PALETTES.finditer(line):
            matched_cls = match.group(0)
            violations.append({
                "line": idx,
                "type": "hardcoded-palette",
                "match": matched_cls,
                "snippet": line_strip[:120],
                "suggestion": "text-foreground, text-muted-foreground, bg-panel, border-border"
            })

        # 4. text-white / bg-black outside intentional components
        for match in LITERAL_WHITE_BLACK.finditer(line):
            matched_cls = match.group(0)
            if "print-only" in line_strip or "print-layout" in str(file_path):
                continue
            violations.append({
                "line": idx,
                "type": "literal-white-black",
                "match": matched_cls,
                "snippet": line_strip[:120],
                "suggestion": "text-foreground or bg-background / bg-card"
            })

        # 5. Hardcoded RGBA shadow glows
        for match in HARDCODED_RGBA_SHADOW.finditer(line):
            if "254,204,23" in line or "254, 204, 23" in line:
                violations.append({
                    "line": idx,
                    "type": "hardcoded-rgba-shadow",
                    "match": "rgba(254, 204, 23, ...)",
                    "snippet": line_strip[:120],
                    "suggestion": "hsl(var(--primary)/opacity) or border-glow"
                })

    return {
        "path": str(file_path),
        "violations": violations,
        "count": len(violations)
    }

def run_triage(dirs: List[str], json_mode: bool = False, min_count: int = 1):
    results = []
    total_violations = 0

    for d in dirs:
        dir_path = Path(d)
        if not dir_path.exists():
            continue
        for ext in ["*.tsx", "*.ts", "*.jsx", "*.js"]:
            for f in dir_path.rglob(ext):
                if should_skip(f):
                    continue
                res = scan_file(f)
                if res.get("count", 0) >= min_count:
                    results.append(res)
                    total_violations += res["count"]

    results.sort(key=lambda x: x.get("count", 0), reverse=True)

    if json_mode:
        print(json.dumps({
            "total_violations": total_violations,
            "total_files_affected": len(results),
            "files": results
        }, indent=2))
        return

    print("=" * 80)
    print(f"MOLD V2 - HARDCODED STYLES TRIAGE REPORT")
    print(f"Total Violations: {total_violations} across {len(results)} files")
    print("=" * 80)

    for item in results:
        print(f"\n📂 {item['path']} ({item['count']} violations):")
        for v in item["violations"]:
            print(f"  Line {v['line']:<4} [{v['type']:<20}] Found: {v['match']:<30}")
            print(f"       -> Suggestion: {v.get('suggestion', 'Use semantic token')}")
            print(f"       -> Snippet: {v['snippet']}")

    print("\n" + "=" * 80)
    print("Next action: Refactor top offender sections using semantic design tokens.")
    print("Verification: Run 'pnpm test' and 'pnpm build' after any refactor.")
    print("=" * 80)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scan codebase for hardcoded style violations.")
    parser.add_argument("dirs", nargs="*", default=DEFAULT_SCAN_DIRS, help="Directories to scan")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--min", type=int, default=1, help="Minimum violation count to report")
    args = parser.parse_args()

    run_triage(args.dirs, json_mode=args.json, min_count=args.min)
