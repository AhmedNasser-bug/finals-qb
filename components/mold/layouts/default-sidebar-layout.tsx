'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'

export function DefaultSidebarLayout({
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
      <div className="flex-1 flex flex-col md:flex-row relative">
        {sidebar}
        <main className="md:ml-64 pt-24 pb-20 px-4 sm:px-6 lg:px-12 min-h-screen flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      {mobileNav}
      {footer}
    </div>
  )
}
