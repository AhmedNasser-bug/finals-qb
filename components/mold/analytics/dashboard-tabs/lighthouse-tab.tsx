import * as React from 'react'
import { ShieldCheck, Activity, AlertTriangle, Zap, Eye, CheckCircle2 } from 'lucide-react'
import type { LighthouseAuditReport } from "@/lib/analytics/lighthouse-service"

export interface LighthouseTabProps {
  report: LighthouseAuditReport
}

export function LighthouseTab({ report }: LighthouseTabProps) {
  return (
  <div className="space-y-6 animate-fade-in">
    {/* 4 Computed Categories Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(report.categories).map((cat) => (
        <div key={cat.id} className="border border-border bg-panel p-4 rounded space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-foreground">{cat.title}</span>
            <span className={`font-mono text-xs font-bold px-1.5 py-0.5 border rounded ${
              cat.score >= 90
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : "text-amber-400 bg-amber-500/10 border-amber-500/30"
            }`}>
              {cat.score >= 90 ? "PASS" : "AVERAGE"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {cat.score}
            </span>
            <span className="text-xs font-mono text-muted-foreground">/ 100</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {cat.description}
          </p>
        </div>
      ))}
    </div>
     {/* Core Web Vitals Deep-Dive Table */}
    <div className="border border-border bg-panel rounded overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Measured Core Web Vitals (Real Browser Navigation Timing)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dynamically probed using window.performance for the current loaded webpage session.
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
          STATUS: 100% LIVE PROBED
        </span>
      </div>
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Metric</th>
              <th className="p-3">Measured Value</th>
              <th className="p-3">Google P75 Target</th>
              <th className="p-3">Health Status</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {report.coreWebVitals.map((metric) => (
              <tr key={metric.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-3 font-bold text-foreground">
                  {metric.name} ({metric.abbr})
                </td>
                <td className="p-3 font-bold text-emerald-400 text-sm">
                  {metric.value}
                </td>
                <td className="p-3 text-muted-foreground">
                  {metric.target}
                </td>
                <td className="p-3">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                    metric.status === "good"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}>
                    {metric.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground text-[11px] max-w-md">
                  {metric.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
     {/* Live Client Navigation Timing Bar */}
    <div className="border border-border bg-panel rounded p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <h4 className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          Navigation Timing API Performance Readouts
        </h4>
        <span className="font-mono text-[10px] text-muted-foreground">
          Network: {report.liveMetrics.networkType}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="border border-border/60 bg-background/50 p-2.5 rounded">
          <span className="text-muted-foreground text-[10px] uppercase block">Time to First Byte (TTFB)</span>
          <span className="text-foreground font-bold text-sm">{report.liveMetrics.ttfbMs} ms</span>
        </div>
        <div className="border border-border/60 bg-background/50 p-2.5 rounded">
          <span className="text-muted-foreground text-[10px] uppercase block">First Contentful Paint (FCP)</span>
          <span className="text-emerald-400 font-bold text-sm">{report.liveMetrics.fcpMs} ms</span>
        </div>
        <div className="border border-border/60 bg-background/50 p-2.5 rounded">
          <span className="text-muted-foreground text-[10px] uppercase block">DOM Content Loaded</span>
          <span className="text-foreground font-bold text-sm">{report.liveMetrics.domContentLoadedMs} ms</span>
        </div>
        <div className="border border-border/60 bg-background/50 p-2.5 rounded">
          <span className="text-muted-foreground text-[10px] uppercase block">Load Event Duration</span>
          <span className="text-foreground font-bold text-sm">{report.liveMetrics.loadEventMs} ms</span>
        </div>
      </div>
    </div>
     {/* Diagnostic Audits Table */}
    <div className="border border-border bg-panel rounded overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30">
        <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Live DOM & Codebase Verification Checklist
        </h3>
      </div>
      <div className="divide-y divide-border">
        {report.audits.map((item) => (
          <div key={item.id} className="p-3.5 flex items-start gap-3 hover:bg-secondary/15 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">{item.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 border border-border uppercase text-muted-foreground rounded">
                  {item.category}
                </span>
                {item.savings && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 rounded">
                    {item.savings}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}
