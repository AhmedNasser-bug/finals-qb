'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { BasePageWrapper } from './base-page-wrapper'

export function ZenFocusLayout({
  children,
  topNav,
  mobileNav,
  footer,
}: PageLayoutProps) {
  return (
    <BasePageWrapper
      topNav={topNav}
      mobileNav={mobileNav}
      footer={footer}
    >
      <div className="flex-1 flex justify-center relative">
        <main className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </BasePageWrapper>
  )
}
