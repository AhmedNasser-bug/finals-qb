import type { Metadata } from "next"
import { Suspense } from "react"
import { AnalyticsDashboard } from "@/components/mold/analytics/analytics-dashboard"

export const metadata: Metadata = {
  title: "SYSTEM OBSERVABILITY & TELEMETRY LAB // FINALIST MOLD V2",
  description: "Collective real-user monitoring (RUM), Microsoft Clarity behavioral friction telemetry, and Google Lighthouse Core Web Vitals assessment dashboard.",
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 font-mono text-xs">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
            <span className="text-primary tracking-widest uppercase font-bold">
              INITIALIZING TELEMETRY LAB...
            </span>
          </div>
        </div>
      }
    >
      <AnalyticsDashboard />
    </Suspense>
  )
}
