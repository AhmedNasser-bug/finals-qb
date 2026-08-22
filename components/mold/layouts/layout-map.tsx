'use client'

import React from 'react'
import type { PageLayoutProps } from '@/lib/layouts/layout-types'
import { DefaultSidebarLayout } from './default-sidebar-layout'
import { ZenFocusLayout } from './zen-focus-layout'
import { SplitTerminalLayout } from './split-terminal-layout'
import { ZenMinimalDockLayout } from './zen-minimal-dock-layout'

export const LAYOUT_COMPONENTS: Record<string, React.ComponentType<PageLayoutProps>> = {
  'default-sidebar': DefaultSidebarLayout,
  'zen-focus': ZenFocusLayout,
  'zen-minimal-dock': ZenMinimalDockLayout,
  'split-terminal': SplitTerminalLayout,
}

export function resolveLayoutComponent(id: string): React.ComponentType<PageLayoutProps> {
  return LAYOUT_COMPONENTS[id] || DefaultSidebarLayout
}
