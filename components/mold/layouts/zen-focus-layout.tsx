'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { BaseLayoutShell } from './blocks/base-layout-shell'

export function ZenFocusLayout({
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
      innerClassName="flex-1 flex justify-center relative"
    >
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl w-full mx-auto animate-fade-in">
        {children}
      </main>
    </BaseLayoutShell>
  )
}
