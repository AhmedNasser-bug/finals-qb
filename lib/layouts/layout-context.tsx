'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import type { PageLayoutMetadata, PageLayoutSpec } from './layout-types'
import { PAGE_LAYOUTS, DEFAULT_LAYOUT_ID, getLayoutById } from './layout-registry'
import { resolveLayoutComponent } from '@/components/mold/layouts/layout-map'

const STORAGE_KEY = 'mold_v2_active_layout'

interface PageLayoutContextValue {
  activeLayout: PageLayoutSpec
  activeLayoutId: string
  setLayoutId: (layoutId: string) => void
  availableLayouts: PageLayoutMetadata[]
}

const PageLayoutContext = createContext<PageLayoutContextValue | null>(null)

export function PageLayoutProvider({ children }: { children: React.ReactNode }) {
  const [layoutId, setLayoutIdState] = useState<string>(DEFAULT_LAYOUT_ID)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setLayoutIdState(saved)
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, [])

  const setLayoutId = useCallback((id: string) => {
    setLayoutIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // Ignore localStorage write errors
    }
  }, [])

  const activeLayout = useMemo<PageLayoutSpec>(() => {
    const meta = getLayoutById(layoutId)
    const Component = resolveLayoutComponent(layoutId)
    return {
      ...meta,
      Component,
    }
  }, [layoutId])

  const contextValue = useMemo<PageLayoutContextValue>(
    () => ({
      activeLayout,
      activeLayoutId: layoutId,
      setLayoutId,
      availableLayouts: PAGE_LAYOUTS,
    }),
    [activeLayout, layoutId, setLayoutId]
  )

  return (
    <PageLayoutContext.Provider value={contextValue}>
      {children}
    </PageLayoutContext.Provider>
  )
}

export function usePageLayout(): PageLayoutContextValue {
  const ctx = useContext(PageLayoutContext)
  if (!ctx) {
    const meta = getLayoutById(DEFAULT_LAYOUT_ID)
    const Component = resolveLayoutComponent(DEFAULT_LAYOUT_ID)
    return {
      activeLayout: { ...meta, Component },
      activeLayoutId: DEFAULT_LAYOUT_ID,
      setLayoutId: () => {},
      availableLayouts: PAGE_LAYOUTS,
    }
  }
  return ctx
}
