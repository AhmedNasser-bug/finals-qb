import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { AchievementProvider } from "@/lib/achievement-engine"
import { StatsProvider } from "@/lib/game/stats-context"
import "./globals.css"
import "katex/dist/katex.min.css"

import { hasClerk } from "@/lib/user-storage"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Finalist — Mastery Protocol",
  description: "High-performance educational quiz and revision system. Master your subjects with Speedrun, Blitz, Hardcore, Survival, Practice, Flashcards, and Full Revision modes.",
  generator: "v0.dev",
}

import { ColorThemeProvider } from "@/lib/themes/theme-context"
import { PageLayoutProvider } from "@/lib/layouts/layout-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = (
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

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${outfit.variable}`}>
      <body className="font-sans">
        {hasClerk ? (
          <ClerkProvider appearance={{ theme: shadcn }}>
            {content}
          </ClerkProvider>
        ) : (
          content
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
