import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { AchievementProvider } from "@/lib/achievement-engine"
import "./globals.css"

import { hasClerk } from "@/lib/user-storage"

export const metadata: Metadata = {
  title: "MOLD V2 — Mastery Protocol",
  description: "High-performance educational quiz and revision system. Master your subjects with Speedrun, Blitz, Hardcore, Survival, Practice, Flashcards, and Full Revision modes.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = (
    <AchievementProvider>
      {children}
    </AchievementProvider>
  )

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
