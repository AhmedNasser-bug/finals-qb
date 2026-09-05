import { NextRequest, NextResponse } from "next/server"
import { FINALISTS_AI_ENTITLEMENT, type PaymentVerifyResponse } from "@/lib/revenuecat/revenuecat-types"
import { logger } from "@/lib/logger"

const REVENUECAT_API_BASE = "https://api.revenuecat.com/v1"
const DEFAULT_KEY = "test_zbsWleAbNOTjaFGkdkzKahntsit"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appUserId = searchParams.get("appUserId")

    if (!appUserId) {
      return NextResponse.json(
        { error: "Missing required 'appUserId' parameter." },
        { status: 400 }
      )
    }

    const apiKey =
      process.env.REVENUECAT_SECRET_KEY ||
      process.env.NEXT_PUBLIC_REVENUECAT_API_KEY ||
      DEFAULT_KEY

    const response = await fetch(`${REVENUECAT_API_BASE}/subscribers/${encodeURIComponent(appUserId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      // If 404, subscriber does not exist yet
      if (response.status === 404) {
        const notFoundResult: PaymentVerifyResponse = {
          appUserId,
          hasAiEntitlement: false,
          expirationDate: null,
          activeSubscriptions: [],
          managementUrl: null,
        }
        return NextResponse.json(notFoundResult)
      }

      logger.warn("RevenueCat verify API returned non-OK status", {
        status: response.status,
        appUserId,
      })

      // Return default guest state rather than crash
      const fallbackResult: PaymentVerifyResponse = {
        appUserId,
        hasAiEntitlement: false,
        expirationDate: null,
        activeSubscriptions: [],
        managementUrl: null,
      }
      return NextResponse.json(fallbackResult)
    }

    const data = await response.json()
    const subscriber = data?.subscriber

    const aiEntitlement = subscriber?.entitlements?.[FINALISTS_AI_ENTITLEMENT]
    const expiresDate = aiEntitlement?.expires_date || null
    const isActive = Boolean(
      aiEntitlement &&
        (!expiresDate || new Date(expiresDate).getTime() > Date.now())
    )

    const activeSubscriptions: string[] = []
    if (subscriber?.subscriptions) {
      for (const [prodId, sub] of Object.entries<any>(subscriber.subscriptions)) {
        if (!sub.expires_date || new Date(sub.expires_date).getTime() > Date.now()) {
          activeSubscriptions.push(prodId)
        }
      }
    }

    const result: PaymentVerifyResponse = {
      appUserId,
      hasAiEntitlement: isActive,
      expirationDate: expiresDate,
      activeSubscriptions,
      managementUrl: subscriber?.management_url || null,
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    logger.error("Error in /api/payments/verify", { error })
    return NextResponse.json(
      { error: "Internal server error verifying subscriber entitlement." },
      { status: 500 }
    )
  }
}
