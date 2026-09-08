'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'

export interface BasePageWrapperProps extends Omit<PageLayoutProps, 'sidebar'> {
  scanlinesOpacity?: string
}

export function BasePageWrapper({
  children,
  topNav,
  mobileNav,
  footer,
  scanlinesOpacity = "opacity-[0.03]",
}: BasePageWrapperProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className={`scanlines absolute inset-0 ${scanlinesOpacity} pointer-events-none`} />
      {topNav}
      {children}
      {mobileNav}
      {footer}
    </div>
  )
}
