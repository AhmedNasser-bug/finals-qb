'use client'

import React from 'react'

export interface BasePageWrapperProps {
  children: React.ReactNode
  topNav?: React.ReactNode
  mobileNav?: React.ReactNode
  footer?: React.ReactNode
  scanlinesOpacityClass?: string
}

export function BasePageWrapper({
  children,
  topNav,
  mobileNav,
  footer,
  scanlinesOpacityClass = 'opacity-[0.03]',
}: BasePageWrapperProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className={`scanlines absolute inset-0 ${scanlinesOpacityClass} pointer-events-none`} />
      {topNav}
      {children}
      {mobileNav}
      {footer}
    </div>
  )
}
