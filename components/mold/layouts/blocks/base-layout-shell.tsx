import React from 'react'

export interface BaseLayoutShellProps {
  children: React.ReactNode
  topNav?: React.ReactNode
  mobileNav?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  innerClassName?: string
}

export function BaseLayoutShell({
  children,
  topNav,
  mobileNav,
  footer,
  className = '',
  innerClassName = 'flex-1 flex flex-col md:flex-row relative',
}: BaseLayoutShellProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative ${className}`}>
      <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none" />
      {topNav}
      <div className={innerClassName}>
        {children}
      </div>
      {mobileNav}
      {footer}
    </div>
  )
}
