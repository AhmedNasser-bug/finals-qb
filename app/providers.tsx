"use client"

import type React from "react"
import { SafeAuthProvider } from "@/lib/user-storage"
import { ColorThemeProvider } from "@/lib/themes/theme-context"
import { PageLayoutProvider } from "@/lib/layouts/layout-context"
import { StatsProvider } from "@/lib/game/stats-context"
import { PurchasesProvider } from "@/lib/revenuecat/purchases-context"
import { AchievementProvider } from "@/lib/achievement-engine"
import { PaywallModal } from "@/components/mold/payment/paywall-modal"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SafeAuthProvider>
      <ColorThemeProvider>
        <PageLayoutProvider>
          <StatsProvider>
            <PurchasesProvider>
              <AchievementProvider>
                {children}
                <PaywallModal />
              </AchievementProvider>
            </PurchasesProvider>
          </StatsProvider>
        </PageLayoutProvider>
      </ColorThemeProvider>
    </SafeAuthProvider>
  )
}
