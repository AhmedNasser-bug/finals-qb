import type { PageLayoutMetadata } from './layout-types'

export const PAGE_LAYOUTS: PageLayoutMetadata[] = [
  {
    id: 'default-sidebar',
    name: 'Command Sidebar',
    label: 'DEFAULT / DOCKED',
    description: 'Full command interface with docked persistent sidebar and responsive main canvas.',
    iconName: 'Sidebar',
  },
  {
    id: 'zen-focus',
    name: 'Zen Minimal',
    label: 'ZEN / MINIMAL',
    description: 'Distraction-free centered layout with collapsed navigation for focused mastery runs.',
    iconName: 'Minimize2',
  },
  {
    id: 'split-terminal',
    name: 'Wide Terminal HUD',
    label: 'WIDE / MULTI-PANE',
    description: 'Expansive wide-canvas interface optimized for ultrawide and multi-pane desktop monitors.',
    iconName: 'Columns',
  },
]

export const DEFAULT_LAYOUT_ID = 'default-sidebar'

export function getLayoutById(id: string | null | undefined): PageLayoutMetadata {
  if (!id) return PAGE_LAYOUTS[0]
  const found = PAGE_LAYOUTS.find((l) => l.id === id)
  return found || PAGE_LAYOUTS[0]
}

export function isValidLayoutId(id: string): boolean {
  return PAGE_LAYOUTS.some((l) => l.id === id)
}
