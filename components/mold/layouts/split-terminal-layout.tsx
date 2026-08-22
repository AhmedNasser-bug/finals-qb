'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'

export function SplitTerminalLayout({
  children,
  sidebar,
  topNav,
  mobileNav,
  footer,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none" />
      {topNav}
      <div className="flex-1 flex flex-col lg:flex-row relative max-w-[1600px] w-full mx-auto">
        {sidebar}
        <main className="lg:ml-64 pt-24 pb-20 px-4 sm:px-8 flex-1 w-full">
          {children}
        </main>
      </div>
      {mobileNav}
      {footer}
    </div>
  )
}
