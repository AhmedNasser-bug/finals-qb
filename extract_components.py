import os
import re

def extract_component_info(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception as e:
        return None

    # Module Name
    filename = os.path.basename(filepath)
    module_name = filename.replace('.tsx', '').title()

    # Characteristics
    is_client = '"use client"' in content or "'use client'" in content
    has_children = 'children' in content
    uses_routing = 'next/navigation' in content or 'next/router' in content
    uses_dynamic = 'next/dynamic' in content

    # State Dependencies
    hooks = re.findall(r'\buse[A-Z][a-zA-Z0-9_]*\b', content)
    unique_hooks = sorted(list(set(hooks)))
    state_deps = ", ".join(unique_hooks) if unique_hooks else "None"

    # Performance Characteristics
    perf_hooks = [h for h in unique_hooks if h in ['useMemo', 'useCallback']]
    if perf_hooks:
        perf = f"Utilizes memoization: {', '.join(perf_hooks)} to prevent unnecessary re-renders."
    else:
        perf = "No explicit memoization hooks (useMemo/useCallback) used."

    # Properties & Slots (Interface)
    props_match = re.search(r'interface\s+[A-Za-z0-9_]+Props\s*\{([^}]+)\}', content)
    if not props_match:
        props_match = re.search(r'type\s+[A-Za-z0-9_]+Props\s*=\s*\{([^}]+)\}', content)

    props_text = "None"
    if props_match:
        props_text = props_match.group(1).strip()
        # Clean up comments and formatting
        props_lines = [line.strip() for line in props_text.split('\n') if line.strip()]
        props_text = '\n  '.join(props_lines)

    # Edge-Case Input Handling & Validation
    edge_cases = []
    if is_client:
        edge_cases.append("- Pure presentation component or interactive client component.")
    if 'className' in props_text:
        edge_cases.append("- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.")
    if 'storage' in content.lower():
        edge_cases.append("- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.")
    if not edge_cases:
        edge_cases.append("- Standard component behavior.")

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
    print("# Frontend Component Registry & Developer Guide")
    print("\nThis document serves as a comprehensive registry for the modern frontend architecture. It outlines component APIs, content hydration pipelines, state dependencies, performance characteristics, and routing/lazy-loading logic.\n")
    print("## 1. Core Architecture & Hydration Pipelines\n")
    print("The application uses Next.js with React Server Components where applicable, but primarily relies on Client Components (`\"use client\"`) for interactive UI. State management utilizes a combination of React hooks, context (`AchievementProvider`), and local/session storage for persistence.\n")
    print("### 1.1 State Dependencies")
    print("Global state like active subjects is managed through `active-subject-store.ts` and `subject-store.ts`. Real-time game engine state is driven by custom hooks like `useGameEngine`.\n")
    print("### 1.2 Asset Delivery & Lazy Loading")
    print("The application leverages Next.js optimizations. No explicit `next/dynamic` calls are currently used for components; standard Next.js routing handles code splitting at the page level.\n")
    print("### 1.3 Routing States")
    print("Routing is managed via Next.js App Router. Components utilizing routing hooks (`useRouter`, `useSearchParams`) are documented below.\n")
    print("## 2. Component Registry\n")

    files_to_scan = []
    for root, dirs, files in os.walk('app'):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                files_to_scan.append(os.path.join(root, file))

    for root, dirs, files in os.walk('components'):
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
