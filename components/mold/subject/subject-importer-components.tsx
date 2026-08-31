"use client"

import React, { useState } from "react"

export function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono rounded border border-border bg-background px-2.5 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  )
}

export function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function InfoToolbox({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative inline-block ml-2 select-none align-middle"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Help information details"
        className="w-4.5 h-4.5 rounded-full border border-primary/50 bg-primary/10 text-primary text-[10px] font-mono font-bold flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-150 cursor-pointer focus-ring"
      >
        i
      </button>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-64 p-3 bg-popover border border-border shadow-2xl rounded text-[11px] leading-relaxed text-popover-foreground z-50 font-sans normal-case tracking-normal text-left animate-fade-in">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-popover z-50" />
          {content}
        </div>
      )}
    </div>
  )
}
