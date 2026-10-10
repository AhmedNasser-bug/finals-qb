import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import "./globals.css"
import "katex/dist/katex.min.css"
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Offline-resilient font fallback for --font-display (configured in globals.css)
const outfit = {
  variable: "",
}

export const metadata: Metadata = {
  title: "Finalist — Mastery Protocol",
  description: "High-performance educational quiz and revision system. Master your subjects with Speedrun, Blitz, Hardcore, Survival, Practice, Flashcards, and Full Revision modes.",
  generator: "v0.dev",
}

import { Providers } from "@/app/providers"

import { MicrosoftClarity } from "@/components/analytics/clarity-analytics"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = (
    <Providers>
      {children}
    </Providers>
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
        <GoogleAnalytics gaId="G-NE62TX80VB" />
        <MicrosoftClarity projectId="yvia03evn3" />
      </body>
    </html>
  )
}
