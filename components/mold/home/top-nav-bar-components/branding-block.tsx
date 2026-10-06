import { ProtocolIcon } from "./icons"

export function BrandingBlock() {
  return (
    <div className="flex items-center gap-2.5">
      <ProtocolIcon className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
      <div>
        <p className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase leading-none">FINALIST</p>
        <p className="text-[9px] font-mono text-muted-foreground tracking-wider leading-none mt-1">STUDY SYSTEM</p>
      </div>
    </div>
  )
}
