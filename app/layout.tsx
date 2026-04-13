import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AchievementProvider } from "@/lib/achievement-engine"
import "./globals.css"

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
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <AchievementProvider>
          {children}
        </AchievementProvider>
        <Analytics />
      </body>
    </html>
  )
}
