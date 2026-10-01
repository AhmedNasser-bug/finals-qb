import React from 'react'

export interface LayoutContainerProps {
  children: React.ReactNode
  topNav?: React.ReactNode
  mobileNav?: React.ReactNode
  footer?: React.ReactNode
  scanlineClass?: string
}

export function LayoutContainer({
  children,
  topNav,
  mobileNav,
  footer,
  scanlineClass = "opacity-[0.03]",
}: LayoutContainerProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className={`scanlines absolute inset-0 pointer-events-none ${scanlineClass}`} />
      {topNav}
      {children}
      {mobileNav}
      {footer}
    </div>
  )
}
