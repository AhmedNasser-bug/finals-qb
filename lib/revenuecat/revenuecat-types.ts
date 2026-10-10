import type {
  CustomerInfo,
  Offerings,
  Offering,
  Package,
  PurchaseResult,
  PurchasesError,
  ErrorCode,
} from "@revenuecat/purchases-js"
import type { FullSubjectData } from "@/lib/mold-types"

/**
 * RevenueCat Entitlement ID for the Finalists AI Generation features.
 */
export const FINALISTS_AI_ENTITLEMENT = "finalists_ai"

/**
 * Supported Plan IDs in Finalists AI.
 */
export type FinalistsAiPlanId = "monthly" | "yearly" | "lifetime"

/**
 * Standard Product IDs configured in RevenueCat & Stripe / Web Billing.
 */
export const FINALISTS_AI_PRODUCTS = {
  MONTHLY: "finalists_ai_monthly",
  YEARLY: "finalists_ai_yearly",
  LIFETIME: "finalists_ai_lifetime",
} as const

/**
 * Default fallback offerings metadata when offline or before SDK offerings load.
 */
export interface FinalistsAiPlanConfig {
  id: FinalistsAiPlanId
  productId: string
  title: string
  badge?: string
  price: string
  period: string
  billingSubtext: string
  popular?: boolean
  features: string[]
}

export const FINALISTS_AI_PLANS: FinalistsAiPlanConfig[] = [
  {
    id: "monthly",
    productId: FINALISTS_AI_PRODUCTS.MONTHLY,
    title: "Monthly Access",
    price: "$9.99",
    period: "/ month",
    billingSubtext: "Billed monthly. Cancel anytime.",
    popular: false,
    features: [
      "Unlimited AI Subject & Question Generation",
      "Full Subject JSON Exporter with LaTeX & Mermaid",
      "Cognitive Telemetry & Spaced-Repetition Insights",
      "Priority API Generation Queue",
    ],
  },
  {
    id: "yearly",
    productId: FINALISTS_AI_PRODUCTS.YEARLY,
    title: "Annual Mastery",
    badge: "BEST VALUE — SAVE 40%",
    price: "$5.99",
    period: "/ month",
    billingSubtext: "$71.88 billed annually. 7-day money-back guarantee.",
    popular: true,
    features: [
      "Everything in Monthly",
      "40% Savings vs Monthly billing",
      "Unlimited Flashcard & Terminology Synthesis",
      "Custom Subject Sharing Links & QR Codes",
      "Early Access to New Game Modes & Audio Themes",
    ],
  },
  {
    id: "lifetime",
    productId: FINALISTS_AI_PRODUCTS.LIFETIME,
    title: "Lifetime Founder",
    badge: "ONE-TIME PAYMENT",
    price: "$149",
    period: "lifetime",
    billingSubtext: "Pay once, own forever. Zero recurring fees.",
    popular: false,
    features: [
      "Perpetual Lifetime Access to All Current & Future AI Features",
      "Zero Subscription Friction",
      "Unlimited AI Exam Generation & Synthesis",
      "Founder Badge on Profile & Study Logs",
      "Direct Priority Support & Feature Requests",
    ],
  },
]

/**
 * Server verification response shape.
 */
export interface PaymentVerifyResponse {
  appUserId: string
  hasAiEntitlement: boolean
  expirationDate: string | null
  activeSubscriptions: string[]
  managementUrl?: string | null
}

/**
 * RevenueCat Webhook Payload shape according to RC Webhook specs.
 */
export interface RevenueCatWebhookPayload {
  api_version: string
  event: {
    id: string
    type:
      | "INITIAL_PURCHASE"
      | "RENEWAL"
      | "PRODUCT_CHANGE"
      | "CANCELLATION"
      | "UNCANCELLATION"
      | "NON_RENEWING_PURCHASE"
      | "SUBSCRIPTION_PAUSED"
      | "EXPIRATION"
      | "BILLING_ISSUE"
      | "TEST"
    app_user_id: string
    original_app_user_id?: string
    product_id: string
    entitlement_ids?: string[] | null
    purchased_at_ms: number
    expiration_at_ms?: number | null
    environment: "SANDBOX" | "PRODUCTION"
    currency?: string
    price?: number
    country_code?: string
  }
}

/**
 * AI Question/Subject Generation Request.
 */
export interface AiGenerateRequest {
  topic: string
  level?: "undergraduate" | "graduate" | "competitive_exam" | "high_school"
  categoryCount?: number
  questionsPerCategory?: number
  appUserId?: string
}

/**
 * AI Generation Job Status.
 */
export type AiJobStatus = "queued" | "processing" | "completed" | "failed"

/**
 * AI Job Status response.
 */
export interface AiJobStatusResponse {
  jobId: string
  status: AiJobStatus
  progress: number
  error?: string
  subjectData?: FullSubjectData
}

export type {
  CustomerInfo,
  Offerings,
  Offering,
  Package,
  PurchaseResult,
  PurchasesError,
  ErrorCode,
}
