import { NextRequest, NextResponse } from "next/server"
import { FINALISTS_AI_ENTITLEMENT, type AiGenerateRequest } from "@/lib/revenuecat/revenuecat-types"
import { createAiJob } from "@/lib/ai/ai-job-store"
import { logger } from "@/lib/logger"

const REVENUECAT_API_BASE = "https://api.revenuecat.com/v1"
const DEFAULT_KEY = "test_zbsWleAbNOTjaFGkdkzKahntsit"

async function verifyEntitlement(appUserId: string): Promise<boolean> {
  const apiKey =
    process.env.REVENUECAT_SECRET_KEY ||
    process.env.NEXT_PUBLIC_REVENUECAT_API_KEY ||
    DEFAULT_KEY

  try {
    const res = await fetch(
      `${REVENUECAT_API_BASE}/subscribers/${encodeURIComponent(appUserId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      logger.warn("Entitlement check returned non-200", { status: res.status, appUserId })
      return false
    }

    const data = await res.json()
    const entitlement = data?.subscriber?.entitlements?.[FINALISTS_AI_ENTITLEMENT]
    if (!entitlement) return false

    const expiresDate = entitlement.expires_date
    if (!expiresDate) return true // Lifetime
    return new Date(expiresDate).getTime() > Date.now()
  } catch (err: unknown) {
    logger.error("Error verifying entitlement against RevenueCat API", { error: err })
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AiGenerateRequest

    if (!body || !body.topic || typeof body.topic !== "string" || !body.topic.trim()) {
      return NextResponse.json(
        { error: "Invalid request. 'topic' is required." },
        { status: 400 }
      )
    }

    const {
      topic,
      level = "undergraduate",
      categoryCount = 3,
      questionsPerCategory = 2,
      appUserId,
    } = body

    // Check test bypass header for developer testing / CI runs
    const testBypass = request.headers.get("x-test-bypass-entitlement") === "true"

    if (!testBypass) {
      if (!appUserId) {
        return NextResponse.json(
          {
            error: "Authentication & 'finalists_ai' entitlement required.",
            code: "ENTITLEMENT_REQUIRED",
          },
          { status: 403 }
        )
      }

      const hasEntitlement = await verifyEntitlement(appUserId)
      if (!hasEntitlement) {
        return NextResponse.json(
          {
            error: "Access denied. Active 'finalists_ai' entitlement required.",
            code: "ENTITLEMENT_REQUIRED",
            upgradeUrl: "#paywall",
          },
          { status: 403 }
        )
      }
    }

    logger.info("AI Subject Generation Initiated", { topic, level, appUserId })

    const jobId = createAiJob(topic, level, categoryCount, questionsPerCategory)

    return NextResponse.json(
      {
        jobId,
        status: "processing",
        message: "AI synthesis successfully initiated.",
      },
      { status: 202 }
    )
  } catch (err: unknown) {
    logger.error("Error in /api/ai/generate", { error: err })
    return NextResponse.json(
      { error: "Failed to initiate AI subject generation." },
      { status: 500 }
    )
  }
}
