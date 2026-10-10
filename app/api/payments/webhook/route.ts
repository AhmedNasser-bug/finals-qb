import { NextRequest, NextResponse } from "next/server"
import type { RevenueCatWebhookPayload } from "@/lib/revenuecat/revenuecat-types"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    // Optional webhook authorization verification
    const expectedAuth = process.env.REVENUECAT_WEBHOOK_AUTH_TOKEN
    if (expectedAuth) {
      const authHeader = request.headers.get("authorization")
      if (
        !authHeader ||
        (authHeader !== expectedAuth && authHeader !== `Bearer ${expectedAuth}`)
      ) {
        logger.warn("RevenueCat webhook: Unauthorized attempt")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const payload = (await request.json()) as RevenueCatWebhookPayload

    if (!payload || !payload.event) {
      return NextResponse.json(
        { error: "Invalid webhook payload structure" },
        { status: 400 }
      )
    }

    const { event } = payload

    logger.info("RevenueCat webhook received event", {
      type: event.type,
      appUserId: event.app_user_id,
      productId: event.product_id,
      environment: event.environment,
    })

    switch (event.type) {
      case "INITIAL_PURCHASE":
        logger.info("RevenueCat: New subscriber purchase recorded", {
          appUserId: event.app_user_id,
          productId: event.product_id,
        })
        break

      case "RENEWAL":
        logger.info("RevenueCat: Subscription renewed successfully", {
          appUserId: event.app_user_id,
          productId: event.product_id,
        })
        break

      case "CANCELLATION":
      case "EXPIRATION":
        logger.info("RevenueCat: Subscription cancelled or expired", {
          appUserId: event.app_user_id,
          productId: event.product_id,
        })
        break

      case "PRODUCT_CHANGE":
        logger.info("RevenueCat: Product tier change", {
          appUserId: event.app_user_id,
          newProductId: event.product_id,
        })
        break

      case "TEST":
        logger.info("RevenueCat: Webhook connectivity test received")
        break

      default:
        logger.info("RevenueCat: Unhandled webhook event type", {
          type: (event as any).type,
        })
        break
    }

    return NextResponse.json({
      received: true,
      eventId: event.id,
      timestamp: Date.now(),
    })
  } catch (error: unknown) {
    logger.error("Error processing RevenueCat webhook", { error })
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    )
  }
}
