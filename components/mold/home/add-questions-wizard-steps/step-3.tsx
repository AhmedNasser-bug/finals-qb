import React from "react"
import { cn } from "@/lib/utils"
import { formatLabel } from "@/lib/mold-types"

export interface WizardStep3Props {
  categoryFocus: "all" | "existing" | "new"
  setCategoryFocus: (focus: "all" | "existing" | "new") => void
  existingCategories: string[]
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  newCategoryName: string
  setNewCategoryName: (name: string) => void
}

export function WizardStep3({
  categoryFocus,
  setCategoryFocus,
  existingCategories,
  selectedCategory,
  setSelectedCategory,
  newCategoryName,
  setNewCategoryName
}: WizardStep3Props) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
          STEP 03 // CATEGORY_TARGETING
        </span>
        <h3 className="text-lg font-bold font-mono text-white tracking-tight">
          Choose Category Targeting Profile
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Choose where the new items belong. You can target all existing categories, target a specific existing one, or create a brand new category.
        </p>
      </div>

      {/* Category Focus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: "all", name: "All Categories", desc: "Distribute generated items across current categories" },
          { id: "existing", name: "Existing Category", desc: "Focus strictly on a single category selected below" },
          { id: "new", name: "New Category", desc: "Create a brand new category slug and display name" },
        ].map((focus) => {
          const isSelected = categoryFocus === focus.id
          return (
            <button
              key={focus.id}
              type="button"
              onClick={() => setCategoryFocus(focus.id as any)}
              className={cn(
                "p-5 border text-left flex flex-col justify-between gap-3 transition-all duration-150 cursor-pointer rounded-none min-h-[120px]",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground border-glow"
                  : "border-border bg-[#101115] text-zinc-400 hover:text-white"
              )}
            >
              <span className={cn("text-xs font-mono font-bold uppercase tracking-wide", isSelected ? "text-primary" : "text-white")}>
                {focus.name}
              </span>
              <span className="text-[10px] leading-snug font-sans text-zinc-500">
                {focus.desc}
              </span>
            </button>
          )
        })}
      </div>

      {/* Conditional Inputs */}
      <div className="pt-4 border-t border-zinc-900">
        {categoryFocus === "existing" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="existing-category-select" className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              Select Target Existing Category
            </label>
            {existingCategories.length > 0 ? (
              <select
                id="existing-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#07080a] border border-border rounded-none px-4 py-2.5 text-sm text-white font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[40px] cursor-pointer"
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatLabel(cat)} ({cat})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs font-mono text-zinc-600 uppercase">
                No existing categories found in this subject.
              </p>
            )}
          </div>
        )}

        {categoryFocus === "new" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="new-category-input" className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center justify-between">
              <span>Enter New Category Name</span>
              <span className="text-[10px] text-primary font-mono font-normal">REQUIRED</span>
            </label>
            <input
              id="new-category-input"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="E.g., Lexical Analysis, Socratic Dialogues, Heart Anatomy..."
              className="w-full bg-[#07080a] border border-border rounded-none px-4 py-2.5 text-sm text-white font-mono placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[40px]"
              autoComplete="off"
            />
            {newCategoryName.trim() && (
              <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1">
                Slug mapping: {newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
              </p>
            )}
          </div>
        )}

        {categoryFocus === "all" && (
          <div className="p-4 bg-zinc-900/40 border border-border/50 text-xs font-mono text-zinc-400">
            <p className="font-bold text-white uppercase mb-1">Target Categories Context:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {existingCategories.map((cat) => (
                <span key={cat} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700/50">
                  {formatLabel(cat)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
