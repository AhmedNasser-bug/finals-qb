'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { BaseLayoutShell } from './blocks/base-layout-shell'

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
    <BaseLayoutShell
      topNav={topNav}
      mobileNav={mobileNav}
      footer={footer}
      innerClassName="flex-1 flex justify-center items-start relative px-4 sm:px-6 lg:px-8 pt-24 pb-24"
    >
      <main className="w-full max-w-5xl mx-auto space-y-6 animate-slide-up">
        {children}
      </main>
    </BaseLayoutShell>
  )
}
