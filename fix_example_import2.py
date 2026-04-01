import re

with open('components/mold/subject-selector.tsx', 'r') as f:
    content = f.read()

# Replace the part that renders the "Select a Subject" grid to include system templates
templates_section = """
          {/* Templates grid */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-mono text-muted-foreground tracking-widest border-b border-border pb-2">
              SYSTEM TEMPLATES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXAMPLES.map((ex) => {
                const isLoaded = subjects.some(s => s.id === ex.id)
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                        if (!isLoaded) {
                            const full = getExampleSubject(ex.id)
                            if (full) onAddSubject(full)
                        } else {
                            const full = subjects.find(s => s.id === ex.id)
                            if (full) onSelect(full)
                        }
                    }}
                    className="group relative flex flex-col bg-surface-container-lowest transition-colors hover:bg-surface-container-highest p-4 text-left focus-visible:outline-none focus-visible:bg-surface-container-highest rounded border border-border/40"
                  >
                    <div className="flex items-start justify-between gap-2 w-full mb-3">
                      <p className="text-sm font-sans font-semibold text-primary leading-snug text-pretty">
                        {ex.name}
                      </p>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-surface-container-low text-muted-foreground shrink-0 border border-outline-variant/30">
                        {isLoaded ? "LOADED" : "v" + (ex.version ?? "1.0")}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {ex.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <StatPill label="Q" value={ex.totalQuestions} />
                      <StatPill label="FC" value={ex.totalFlashcards} />
                      <StatPill label="CAT" value={ex.totalCategories} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
"""

content = content.replace('          {/* Subject grid */}', templates_section + '\n          {/* Subject grid */}')

with open('components/mold/subject-selector.tsx', 'w') as f:
    f.write(content)
