'use client'

import type React from 'react'
import { ColorThemeProvider } from "@/lib/themes/theme-context"
import { PageLayoutProvider } from "@/lib/layouts/layout-context"
import { StatsProvider } from "@/lib/game/stats-context"
import { AchievementProvider } from "@/lib/achievement-engine"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ColorThemeProvider>
      <PageLayoutProvider>
        <StatsProvider>
          <AchievementProvider>
            {children}
          </AchievementProvider>
        </StatsProvider>
      </PageLayoutProvider>
    </ColorThemeProvider>
  )
}
