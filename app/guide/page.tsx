import type { Metadata } from "next"
import { Suspense } from "react"
import { GuidePageContent } from "@/components/mold/guide/guide-page-content"

export const metadata: Metadata = {
  title: "USER USAGE GUIDE // FINALIST MOLD V2",
  description: "Operational usage manual, cognitive science foundations, game mode rules, SuperMemo SM-2 algorithms, and AI import wizard guide for the Finalist MOLD V2 cognitive engine.",
}

export default function GuidePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 font-mono text-xs">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
          <span className="text-primary tracking-widest uppercase font-bold">LOADING PROTOCOL GUIDE...</span>
        </div>
      </div>
    }>
      <GuidePageContent />
    </Suspense>
  )
}
