import React from "react"

export function NeuralCorePanel() {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6 select-none lg:sticky lg:top-6 h-fit">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
          SYSTEM_NEURAL_CORE
        </span>
      </div>

      {/* Decorative Brain/Cortex Image Card */}
      <div className="aspect-square bg-zinc-950 border border-zinc-800 p-2.5 relative overflow-hidden group rounded-md select-none border-glow shadow-[0_0_15px_rgba(254,204,23,0.05)] hover:shadow-[0_0_25px_rgba(254,204,23,0.12)] transition-all duration-500">
        <img
          alt="Digital telemetry brain cortical visualization"
          className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-85 transition-all duration-700"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhXfd0BDWa6914O52t-6kHaB-iWXeSbkhlPio2Rtnl0JuAXsT60dN-YcowvASlkY8LY-uix1yLSB1kHqi1cUoxaHZloZMJF4vieq1bHrMfVySIWJaziKL_eo6q-iCdfqQJ-KTZVAgvDOmENMEeh-45IvE95U-YvUj0j6AUiLfIXieCQkdS3VSWQv4G75KySxVy8vpJWxoIe3BMbV16qwJMa1Zts8Rb_QdZoNeXrrzWAA7A1JMxVXIZ3_6uFokFise-DQ8c6V82m6Fl"
        />
        <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />

        {/* TOP RIGHT: SYS_FEED label */}
        <div className="absolute top-4 right-4 bg-black/85 px-2 py-0.5 font-mono text-[8px] text-primary border border-primary/20 tracking-wider">
          SYS_FEED
        </div>

        {/* BOTTOM LEFT: Cortex identifier */}
        <div className="absolute bottom-4 left-4 bg-black/85 px-3 py-1 font-mono text-[9px] text-primary border border-primary/20 uppercase tracking-widest font-bold">
          REF_ID: حلتيتة
        </div>
      </div>

      {/* Neural Uptime and Stats Telemetry Panel */}
      <div className="bg-[#101115] border border-border p-5 rounded-md space-y-4 font-mono text-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 border-b border-border pb-2.5">
          <span className="text-[9px] text-[var(--tw-hex-fecc17)]/80 tracking-widest font-bold uppercase">
            INTELLIGENCE_LAYER_TELEMETRY
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-muted-foreground uppercase">NODE_STATUS</span>
            <span className="font-bold text-emerald-400">ONLINE</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-muted-foreground uppercase">SYNAPSE_LINKS</span>
            <span className="font-bold text-white">4,096 ACTIVE</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-muted-foreground uppercase">COGNITIVE_EFFICIENCY</span>
            <span className="font-bold text-primary">99.8%</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-muted-foreground uppercase">PROCESSING_CYCLE</span>
            <span className="font-bold text-primary">0.12ms / TICK</span>
          </div>
        </div>
      </div>
    </div>
  )
}
