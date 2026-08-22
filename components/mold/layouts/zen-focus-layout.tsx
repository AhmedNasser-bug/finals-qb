'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'

export function ZenFocusLayout({
  children,
  topNav,
  mobileNav,
  footer,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none" />
      {topNav}
      <div className="flex-1 flex justify-center relative">
        <main className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
      {mobileNav}
      {footer}
    </div>
  )
}
