"use client"

import type React from "react"
import { SafeAuthProvider } from "@/lib/user-storage"
import { ColorThemeProvider } from "@/lib/themes/theme-context"
import { PageLayoutProvider } from "@/lib/layouts/layout-context"
import { StatsProvider } from "@/lib/game/stats-context"
import { AchievementProvider } from "@/lib/achievement-engine"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SafeAuthProvider>
      <ColorThemeProvider>
        <PageLayoutProvider>
          <StatsProvider>
            <AchievementProvider>
              {children}
            </AchievementProvider>
          </StatsProvider>
        </PageLayoutProvider>
      </ColorThemeProvider>
    </SafeAuthProvider>
  )
}
