# RevenueCat Web SDK & Finalists AI Integration Guide

This guide provides comprehensive, step-by-step instructions for configuring and operating the RevenueCat Web Billing SDK (`@revenuecat/purchases-js`) within the **Finalist (MOLD V2)** platform.

---

## 1. Overview & Architecture

Finalist integrates RevenueCat Web Billing to monetize autonomous AI-powered exam and question bank synthesis via the `finalists_ai` entitlement.

```mermaid
graph TD
    Client[Finalist Next.js Client] -->|PurchasesService| RCSDK[@revenuecat/purchases-js]
    RCSDK -->|Stripe / Web Billing| RCBackend[RevenueCat API]
    Client -->|Check Entitlement| GatedFeature[AI Subject Generation Engine]
    RCBackend -->|Webhook POST| WebhookAPI[/api/payments/webhook]
    Client -->|Server Verification| VerifyAPI[/api/payments/verify]
    VerifyAPI -->|Verify Key & Entitlement| RCBackend
    RCBackend -->|managementURL| CustomerCenter[Customer Center Portal]
```

---

## 2. RevenueCat Dashboard Setup

### Step 1: Create a Project & Web Billing App
1. Log in to [app.revenuecat.com](https://app.revenuecat.com).
2. Create or select your Project: **Finalist**.
3. Under **Project Settings > Apps**, click **+ New App** and select **Web Billing (Stripe)**.
4. Connect your Stripe account to enable automated web checkout.
5. Copy your **Public API Key**:
   - Sandbox Key: `test_zbsWleAbNOTjaFGkdkzKahntsit`
   - Production Key: `rcb_live_...`

### Step 2: Configure Products
Navigate to **Product Catalog > Products** and register the three tiers:

| Product Identifier | Type | Suggested Price | Duration |
|--------------------|------|-----------------|----------|
| `finalists_ai_monthly` | Subscription | $9.99 USD | 1 Month |
| `finalists_ai_yearly` | Subscription | $71.88 USD ($5.99/mo) | 1 Year |
| `finalists_ai_lifetime` | Non-Renewing Purchase | $149.00 USD | Lifetime |

### Step 3: Configure Entitlement
1. Navigate to **Product Catalog > Entitlements**.
2. Create an Entitlement with identifier:
   - **Identifier:** `finalists_ai`
   - **Display Name:** Finalists AI Autonomous Access
3. Attach all three products (`finalists_ai_monthly`, `finalists_ai_yearly`, `finalists_ai_lifetime`) to this entitlement.

### Step 4: Configure Offerings & Packages
1. Navigate to **Product Catalog > Offerings**.
2. Ensure the **Default Offering** (`default`) is active.
3. Attach the packages:
   - `$rc_monthly` (Monthly) → `finalists_ai_monthly`
   - `$rc_annual` (Annual) → `finalists_ai_yearly`
   - `$rc_lifetime` (Lifetime) → `finalists_ai_lifetime`

### Step 5: Configure Webhooks
1. Navigate to **Integrations > Webhooks**.
2. Add a new Webhook:
   - **Webhook URL:** `https://your-domain.vercel.app/api/payments/webhook`
   - **Authorization Token:** Set a high-entropy secret and store it in `.env` as `REVENUECAT_WEBHOOK_AUTH_TOKEN`.
   - **Events:** Select `Initial Purchase`, `Renewal`, `Cancellation`, `Expiration`, `Product Change`.

---

## 3. Environment Variables Configuration

Add the following variables to `.env.local` and your Vercel project environment variables:

```bash
# Public key used by client-side @revenuecat/purchases-js
NEXT_PUBLIC_REVENUECAT_API_KEY=test_zbsWleAbNOTjaFGkdkzKahntsit

# Server secret key used for backend verification (optional, falls back to public key)
REVENUECAT_SECRET_KEY=test_zbsWleAbNOTjaFGkdkzKahntsit

# Webhook authorization secret token
REVENUECAT_WEBHOOK_AUTH_TOKEN=your_webhook_secret_token_here
```

---

## 4. Client-Side Implementation Patterns

### 4.1. SDK Initialization

Initialize the singleton wrapper on the client side:

```typescript
import { Purchases } from "@revenuecat/purchases-js"

// Object-based configuration (modern standard)
const purchases = Purchases.configure({
  apiKey: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || "test_zbsWleAbNOTjaFGkdkzKahntsit",
  appUserId: userId || Purchases.generateRevenueCatAnonymousAppUserId(),
})

// Optional: Preload branding styles to speed up modal renders
await purchases.preload()
```

### 4.2. Entitlement Checking

Check whether the user has access to `finalists_ai`:

```typescript
const isEntitled = await purchases.isEntitledTo("finalists_ai")

if (isEntitled) {
  // Grant access to AI generation capabilities
} else {
  // Open Paywall Modal
}
```

### 4.3. Customer Info Retrieval

Retrieve detailed subscription metadata and expiration dates:

```typescript
const customerInfo = await purchases.getCustomerInfo()

const hasActivePass = customerInfo.entitlements.all["finalists_ai"]?.isActive
const expirationDate = customerInfo.entitlements.all["finalists_ai"]?.expirationDate
```

### 4.4. Presenting RevenueCat Web Paywall

Launch the RevenueCat Web Paywall:

```typescript
import { purchasesService } from "@/lib/revenuecat/purchases-service"

// Launch full-screen or target container paywall
const result = await purchasesService.presentPaywall({
  customerEmail: userEmail,
})

if (result.customerInfo.entitlements.all["finalists_ai"]?.isActive) {
  console.log("Paywall purchase succeeded!")
}
```

### 4.5. Customer Center & Self-Service Portal

RevenueCat Web Billing provides a hosted management portal (`managementURL`) where subscribers can update payment details, change tiers, or cancel subscriptions:

```typescript
const customerInfo = await purchases.getCustomerInfo()

if (customerInfo.managementURL) {
  // Redirect or open in new tab
  window.open(customerInfo.managementURL, "_blank", "noopener,noreferrer")
}
```

---

## 5. Server-Side Endpoints & Security

### 5.1. Entitlement Verification (`/api/payments/verify`)
Query `GET /api/payments/verify?appUserId=<USER_ID>` to verify entitlement status server-side without relying on client claims.

### 5.2. Webhook Listener (`/api/payments/webhook`)
Processes asynchronous events from RevenueCat. Authenticated using `REVENUECAT_WEBHOOK_AUTH_TOKEN`.

### 5.3. Gated AI Generation (`/api/ai/generate`)
Requires `finalists_ai` entitlement. Rejects unentitled requests with HTTP 403 Forbidden.

---

## 6. Error Handling & Edge Cases

1. **User Cancellation:** When a customer closes the Stripe checkout modal without paying, RevenueCat throws `PurchasesError` with code `ErrorCode.UserCancelledError`. Suppress alert modals for this expected user action.
2. **Anonymous to Authenticated Transition:** When an anonymous guest signs in with Clerk, invoke `purchases.changeUser(clerkUserId)` to synchronize entitlements.
3. **Offline / Network Errors:** The application gracefully falls back to local offerings if RevenueCat API requests encounter transient timeouts.
