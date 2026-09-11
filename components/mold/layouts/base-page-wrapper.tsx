import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'

export interface BasePageWrapperProps extends Omit<PageLayoutProps, 'sidebar'> {
  scanlinesClassName?: string
}

export function BasePageWrapper({
  children,
  topNav,
  mobileNav,
  footer,
  scanlinesClassName = "scanlines absolute inset-0 opacity-[0.03] pointer-events-none",
}: BasePageWrapperProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className={scanlinesClassName} />
      {topNav}
      {children}
      {mobileNav}
      {footer}
    </div>
  )
}
