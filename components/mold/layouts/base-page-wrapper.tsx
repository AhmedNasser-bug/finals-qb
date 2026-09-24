import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'

export interface BasePageWrapperProps extends PageLayoutProps {
  scanlinesClassName?: string
}

export function BasePageWrapper({
  children,
  topNav,
  mobileNav,
  footer,
  scanlinesClassName = "opacity-[0.03]"
}: BasePageWrapperProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className={`scanlines absolute inset-0 pointer-events-none ${scanlinesClassName}`} />
      {topNav}
      {children}
      {mobileNav}
      {footer}
    </div>
  )
}
