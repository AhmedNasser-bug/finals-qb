'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { DefaultSidebarLayout } from './default-sidebar-layout'
import { ZenFocusLayout } from './zen-focus-layout'
import { SplitTerminalLayout } from './split-terminal-layout'

export const LAYOUT_COMPONENTS: Record<string, React.ComponentType<PageLayoutProps>> = {
  'default-sidebar': DefaultSidebarLayout,
  'zen-focus': ZenFocusLayout,
  'split-terminal': SplitTerminalLayout,
}

export function resolveLayoutComponent(id: string): React.ComponentType<PageLayoutProps> {
  return LAYOUT_COMPONENTS[id] || DefaultSidebarLayout
}
