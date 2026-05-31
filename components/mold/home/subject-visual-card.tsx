"use client"

interface SubjectVisualCardProps {
  subjectId: string
  subjectName: string
}

export function SubjectVisualCard({ subjectId, subjectName }: SubjectVisualCardProps) {
  return (
    <div className="aspect-square bg-zinc-950 border border-zinc-800 p-2.5 relative overflow-hidden group rounded-md select-none">
      <img 
        alt={`${subjectName} digital telemetry brain cortical visualization`} 
        className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhXfd0BDWa6914O52t-6kHaB-iWXeSbkhlPio2Rtnl0JuAXsT60dN-YcowvASlkY8LY-uix1yLSB1kHqi1cUoxaHZloZMJF4vieq1bHrMfVySIWJaziKL_eo6q-iCdfqQJ-KTZVAgvDOmENMEeh-45IvE95U-YvUj0j6AUiLfIXieCQkdS3VSWQv4G75KySxVy8vpJWxoIe3BMbV16qwJMa1Zts8Rb_QdZoNeXrrzWAA7A1JMxVXIZ3_6uFokFise-DQ8c6V82m6Fl"
      />
      <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 bg-black/85 px-3 py-1 font-mono text-[9px] text-primary border border-primary/20 uppercase tracking-widest font-bold">
        REF_ID: {subjectId.toUpperCase().substring(0, 10)}_CORTEX
      </div>
    </div>
  )
}
