import type React from "react"
import { AchievementProvider } from "@/lib/achievement-engine"
import { StatsProvider } from "@/lib/game/stats-context"
import { ColorThemeProvider } from "@/lib/themes/theme-context"
import { PageLayoutProvider } from "@/lib/layouts/layout-context"

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
