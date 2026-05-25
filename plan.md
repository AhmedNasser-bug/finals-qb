1.  **Analyze Request**: The user wants to scan the modern frontend repository and its content hydration pipelines. Then generate an automated component registry documentation file that specifies properties, slots, state dependencies, performance characteristics, client-side lazy-loading logic, asset delivery configurations, routing states, and edge-case input handling/validation rules.
2.  **Locate Target File**: The target file is `docs/architecture/component-registry.md`.
3.  **Create Script**: Create a Python script (`generate_registry_improved.py`) that reads all `.tsx` and `.ts` files in the `app/` and `components/mold/` directories.
4.  **Extract Information**: The script will extract:
    *   Module Name
    *   Characteristics (Client Component, Supports Slots, Uses Routing, Dynamic Lazy-Loading)
    *   State Dependencies (Hooks)
    *   Performance Characteristics (useMemo/useCallback)
    *   Properties & Slots (Interface)
    *   Edge-Case Input Handling & Validation Rules (className, storage, JSON parsing, sanitization, mermaid, errors, interactivity, duplication).
5.  **Generate Documentation**: The script will write the extracted information, along with standard architecture and hydration overviews, to `docs/architecture/component-registry.md`.
6.  **Execute & Verify**: Run the script and verify the output in the target file.
7.  **Pre-commit & Submit**: Complete pre-commit steps and submit the changes.
