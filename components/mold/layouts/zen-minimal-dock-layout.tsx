'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'

/**
 * Zen Minimal Dock Layout
 * An ultra-clean, distraction-free study layout with a centered focus container
 * and seamless dynamic theme color integration.
 */
export function ZenMinimalDockLayout({
  children,
  topNav,
  mobileNav,
  footer,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary animate-fade-in relative">
      <div className="scanlines absolute inset-0 opacity-[0.02] pointer-events-none" />
      {topNav}
      
      {/* Centered Focus Canvas */}
      <div className="flex-1 flex justify-center items-start relative px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        <main className="w-full max-w-5xl mx-auto space-y-6 animate-slide-up">
          {children}
        </main>
      </div>

      {mobileNav}
      {footer}
    </div>
  )
}
