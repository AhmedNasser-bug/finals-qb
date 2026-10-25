import React from "react"
import { cn } from "@/lib/utils"
import { formatLabel } from "@/lib/mold-types"

interface Props {
  categoryFocus: "all" | "existing" | "new"
  setCategoryFocus: (val: "all" | "existing" | "new") => void
  existingCategories: string[]
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  newCategoryName: string
  setNewCategoryName: (val: string) => void
}

export function WizardStep3CategoryFocus({
  categoryFocus,
  setCategoryFocus,
  existingCategories,
  selectedCategory,
  setSelectedCategory,
  newCategoryName,
  setNewCategoryName,
}: Props) {
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
          <div className="space-y-3 animate-fade-in">
            <label htmlFor="existing-category-select" className="text-[10px] font-mono font-bold tracking-wider text-white uppercase">
              Select Target Category
            </label>
            <select
              id="existing-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#07080a] border border-border px-4 py-3 font-mono text-xs text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none cursor-pointer rounded-none"
            >
              {existingCategories.length === 0 ? (
                <option value="" disabled>No existing categories found.</option>
              ) : (
                existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatLabel(cat)} [{cat}]
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        {categoryFocus === "new" && (
          <div className="space-y-3 animate-fade-in">
            <label htmlFor="new-category-input" className="text-[10px] font-mono font-bold tracking-wider text-white uppercase">
              Define New Category Name
            </label>
            <input
              id="new-category-input"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Advanced Networking, Graph Algorithms..."
              className="w-full bg-[#07080a] border border-border px-4 py-3 font-mono text-xs text-white placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-none"
            />
            {newCategoryName.trim() && (
              <p className="text-[10px] font-mono text-zinc-500">
                Generated Slug: <span className="text-primary">{newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || "invalid-slug"}</span>
              </p>
            )}
          </div>
        )}

        {categoryFocus === "all" && (
          <div className="text-[10px] font-mono text-zinc-500 py-3 animate-fade-in">
            System will instruct AI to distribute content evenly across:
            <div className="mt-2 flex flex-wrap gap-2">
              {existingCategories.map(cat => (
                <span key={cat} className="px-2 py-1 border border-border/50 bg-[#101115] text-zinc-400">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
