'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { BaseLayoutShell } from './blocks/base-layout-shell'

export function SplitTerminalLayout({
  children,
  sidebar,
  topNav,
  mobileNav,
  footer,
}: PageLayoutProps) {
  return (
    <BaseLayoutShell
      topNav={topNav}
      mobileNav={mobileNav}
      footer={footer}
      innerClassName="flex-1 flex flex-col lg:flex-row relative max-w-[1600px] w-full mx-auto"
    >
      {sidebar}
      <main className="lg:ml-64 pt-24 pb-20 px-4 sm:px-8 flex-1 w-full">
        {children}
      </main>
    </BaseLayoutShell>
  )
}
