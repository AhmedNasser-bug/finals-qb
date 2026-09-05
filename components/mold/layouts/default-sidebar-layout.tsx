'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { BasePageWrapper } from './base-page-wrapper'

export function DefaultSidebarLayout({
  children,
  sidebar,
  topNav,
  mobileNav,
  footer,
}: PageLayoutProps) {
  return (
    <BasePageWrapper topNav={topNav} mobileNav={mobileNav} footer={footer}>
      <div className="flex-1 flex flex-col md:flex-row relative">
        {sidebar}
        <main className="md:ml-64 pt-24 pb-20 px-4 sm:px-6 lg:px-12 min-h-screen flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </BasePageWrapper>
  )
}
