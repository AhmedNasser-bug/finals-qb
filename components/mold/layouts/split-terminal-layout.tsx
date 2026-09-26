'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { BasePageWrapper } from './base-page-wrapper'

export function SplitTerminalLayout({
  children,
  sidebar,
  topNav,
  mobileNav,
  footer,
}: PageLayoutProps) {
  return (
    <BasePageWrapper topNav={topNav} mobileNav={mobileNav} footer={footer}>
      <div className="flex-1 flex flex-col lg:flex-row relative max-w-[1600px] w-full mx-auto">
        {sidebar}
        <main className="lg:ml-64 pt-24 pb-20 px-4 sm:px-8 flex-1 w-full">
          {children}
        </main>
      </div>
    </BasePageWrapper>
  )
}
