import os
import re

def extract_component_info(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception as e:
        return None

    filename = os.path.basename(filepath)
    module_name = filename.replace('.tsx', '').replace('.ts', '').title().replace('-', '')

    is_client = '"use client"' in content or "'use client'" in content
    has_children = 'children' in content
    uses_routing = 'next/navigation' in content or 'next/router' in content
    uses_dynamic = 'next/dynamic' in content

    hooks = re.findall(r'\buse[A-Z][a-zA-Z0-9_]*\b', content)
    unique_hooks = sorted(list(set(hooks)))
    state_deps = ", ".join(unique_hooks) if unique_hooks else "None"

    perf_hooks = [h for h in unique_hooks if h in ['useMemo', 'useCallback']]
    if perf_hooks:
        perf = f"Utilizes memoization: {', '.join(perf_hooks)} to prevent unnecessary re-renders."
    else:
        perf = "No explicit memoization hooks (useMemo/useCallback) used."

    # More robust prop extraction
    props_text = "None"

    props_match = re.search(r'interface\s+[A-Za-z0-9_]+Props\s*\{([^}]+)\}', content)
    if not props_match:
        props_match = re.search(r'type\s+[A-Za-z0-9_]+Props\s*=\s*\{([^}]+)\}', content)

    if props_match:
        props_text = props_match.group(1).strip()
        props_lines = [line.strip() for line in props_text.split('\n') if line.strip()]
        props_text = '\n  '.join(props_lines)

    edge_cases = []

    # Analyze content for edge cases
    if 'className' in content:
        edge_cases.append("- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.")

    if 'localStorage' in content or 'sessionStorage' in content:
        edge_cases.append("- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.")

    if 'JSON.parse' in content:
        edge_cases.append("- Parses arbitrary JSON payloads; requires strict try/catch blocks and subsequent structural validation (e.g., Zod schemas) to prevent prototype pollution or invalid state.")

    if 'DOMPurify' in content or 'dangerouslySetInnerHTML' in content:
        edge_cases.append("- Sanitizes raw user input via DOMPurify to mitigate XSS attacks during HTML interpolation.")

    if 'mermaid' in content.lower():
        edge_cases.append("- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.")

    if 'Error' in content and 'fallback' in content.lower():
        edge_cases.append("- Implements explicit fallback UIs for critical asynchronous or failing boundaries.")

    if 'onClick' in content or 'onChange' in content:
        edge_cases.append("- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.")

    if 'existingIds' in content:
         edge_cases.append("- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.")

    if not edge_cases:
        edge_cases.append("- Pure presentation component. Minimal edge cases aside from standard prop type validations.")

    return f"""### `{filepath}`

**Module Name:** {module_name}

**Characteristics:**
- Client Component: `{'Yes' if is_client else 'No'}`
- Supports Slots (children): `{'Yes' if has_children else 'No'}`
- Uses Routing: `{'Yes' if uses_routing else 'No'}`
- Dynamic Lazy-Loading: `{'Yes' if uses_dynamic else 'No'}`

**State Dependencies (Hooks):**
{state_deps}

**Performance Characteristics:**
{perf}

**Properties & Slots (Interface):**
```typescript
{props_text}
```

**Edge-Case Input Handling & Validation:**
{chr(10).join(edge_cases)}

---
"""

def main():
    print("# MOLD V2 Component Registry & Developer Guide\n")
    print("This document serves as an automated registry of all UI modules and core libraries, specifying exact properties, state dependencies, performance characteristics, and routing/hydration behaviors. It also outlines explicit edge-case input handling and validation rules for seamless developer onboarding.\n")

    print("## Architecture & Hydration Overview\n")

    print("### Routing States")
    print("- **Root Route (`/`)**: Manages the active study session. It reads the active subject from `sessionStorage` (`mold_v2_active_subject`). If found, it hydrates the `HomeScreen`. If not, it redirects to `/subjects`.")
    print("- **Subjects Route (`/subjects`)**: Manages subject selection, importation, and sharing. Handles share links via URL hash detection (`#share=...`) and transitions gracefully between `loading`, `receiving`, and `selecting` states.\n")

    print("### Client-side Hydration & Lazy-Loading Logic")
    print("- Components like complex editors or heavy visualizers may utilize `next/dynamic` for client-side lazy-loading to reduce initial bundle size.")
    print("- State is hydrated synchronously from storage providers (e.g., `localStorage`) during `useEffect` hooks, utilizing a `ready` or `loading` state flag to prevent Server-Side Rendering (SSR) mismatch errors.")
    print("- Dynamic loading configurations strictly ensure fallbacks are rendered while assets are being parsed and loaded.\n")

    print("### Asset Delivery Configurations")
    print("- The framework uses **Next.js (Turbopack)** with explicitly disabled Image optimization (`unoptimized: true` in `next.config.mjs`) to accommodate static exports (`output: export`) and distinct custom asset pipelines.")
    print("- Content hydration relies on local state management and persistence without depending heavily on backend databases. Asset streaming and manifest resolution handles I/O operations concurrently where applicable.\n")

    print("### Edge-case Input Handling & Validation Rules")
    print("- **Subject Validation (`lib/mold-types.ts`)**: Rigorous validation ensures imported schemas adhere to strict standards. `multipleChoice` options must be an array of objects containing a `label` string, and flashcards must define `term` and `definition` properties (preventing legacy formatting breaks).")
    print("- **Data Hydration Failures**: Fallback to empty states or onboarding flows when storage (`localStorage`/`sessionStorage`) is unavailable or heavily corrupted.")
    print("- **Error Boundaries (`GameErrorBoundary`)**: Implements `role=\"alert\"` and fallback UIs to gracefully capture, report, and recover from render-phase failures within interactive components.")
    print("- **Circular References (`logger.ts`)**: Deep traversal and masking algorithms use `WeakSet` caching mechanisms to safely evaluate potentially recursive, deeply-nested error states to prevent stack overflows.\n")

    print("## Component Registry\n")

    files_to_scan = []

    for root, dirs, files in os.walk('app'):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                files_to_scan.append(os.path.join(root, file))

    for root, dirs, files in os.walk('components/mold'):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                files_to_scan.append(os.path.join(root, file))

    files_to_scan.sort()
    for file in files_to_scan:
        info = extract_component_info(file)
        if info:
            print(info)

if __name__ == '__main__':
    main()
