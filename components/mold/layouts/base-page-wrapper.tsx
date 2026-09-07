'use client'

import React from 'react'

export interface BasePageWrapperProps {
  children: React.ReactNode
  topNav?: React.ReactNode
  mobileNav?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  scanlinesOpacity?: number
}

export function BasePageWrapper({
  children,
  topNav,
  mobileNav,
  footer,
  className = '',
  scanlinesOpacity = 0.03,
}: BasePageWrapperProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative ${className}`}>
      <div className="scanlines absolute inset-0 pointer-events-none" style={{ opacity: scanlinesOpacity }} />
      {topNav}
      {children}
      {mobileNav}
      {footer}
    </div>
  )
}
