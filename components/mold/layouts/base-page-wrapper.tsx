'use client'

import React from 'react'

export interface BasePageWrapperProps {
  children: React.ReactNode
  topNav?: React.ReactNode
  mobileNav?: React.ReactNode
  footer?: React.ReactNode
  scanlineOpacity?: string
}

export function BasePageWrapper({
  children,
  topNav,
  mobileNav,
  footer,
  scanlineOpacity = "0.03",
}: BasePageWrapperProps) {
  // Use a style object for opacity to avoid Tailwind arbitrary value compilation issues
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div
        className="scanlines absolute inset-0 pointer-events-none"
        style={{ opacity: scanlineOpacity }}
      />
      {topNav}
      {children}
      {mobileNav}
      {footer}
    </div>
  )
}
