"use client"

import React, { useState, useCallback } from "react"
import Link from "next/link"
import {
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  Crown,
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react"
import { usePurchases } from "@/lib/revenuecat/purchases-context"
import {
  FINALISTS_AI_PLANS,
  type FinalistsAiPlanConfig,
} from "@/lib/revenuecat/revenuecat-types"
import type { Package } from "@revenuecat/purchases-js"
import { RevenueCatLogo, RevenueCatBadge } from "@/components/mold/payment/revenuecat-logo"

export default function PricingPage() {
  const {
    hasAiEntitlement,
    customerInfo,
    currentOffering,
    purchasePackage,
    presentNativePaywall,
    openCustomerCenter,
  } = usePurchases()

  const [selectedPlanId, setSelectedPlanId] = useState<string>("yearly")
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const findRcPackageForPlan = useCallback(
    (planId: string): Package | undefined => {
      if (!currentOffering?.packages) return undefined
      const targetPlan = FINALISTS_AI_PLANS.find((p) => p.id === planId)
      return currentOffering.packages.find(
        (pkg) =>
          pkg.identifier.toLowerCase().includes(planId) ||
          (targetPlan && pkg.rcBillingProduct?.identifier === targetPlan.productId)
      )
    },
    [currentOffering]
  )

  const handleCheckout = async (plan: FinalistsAiPlanConfig) => {
    setIsPurchasing(true)
    setPurchaseError(null)
    setPurchaseSuccess(false)

    try {
      const rcPkg = findRcPackageForPlan(plan.id)
      if (rcPkg) {
        await purchasePackage(rcPkg)
        setPurchaseSuccess(true)
      } else {
        await presentNativePaywall()
        setPurchaseSuccess(true)
      }
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || "Purchase failed or was cancelled."
      if (
        !errorMsg.toLowerCase().includes("cancelled") &&
        !errorMsg.toLowerCase().includes("user")
      ) {
        setPurchaseError(errorMsg)
      }
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleLaunchNativePaywall = async () => {
    setIsPurchasing(true)
    setPurchaseError(null)
    try {
      await presentNativePaywall()
      setPurchaseSuccess(true)
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || "Paywall presentation failed."
      if (!errorMsg.toLowerCase().includes("cancelled")) {
        setPurchaseError(errorMsg)
      }
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-black">
      {/* Top Navigation Strip */}
      <header className="w-full border-b border-border/60 bg-panel/80 backdrop-blur sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-xs font-semibold uppercase tracking-wider focus-ring"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>RETURN TO MASTERY PROTOCOL</span>
        </Link>

        {/* RevenueCat Header Recognition Badge */}
        <RevenueCatBadge label="MADE WITH REVENUECAT" />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-primary/40 bg-primary/10 rounded-full font-mono text-[10px] tracking-widest text-primary font-bold uppercase mb-4 shadow-[0_0_15px_hsla(var(--primary),0.15)]">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            FINALISTS AI GENERATION ACCESS
          </div>
          <h1 className="text-3xl sm:text-5xl font-mono font-extrabold tracking-tight text-foreground">
            AUTONOMOUS <span className="text-primary">EXAM SYNTHESIS</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Generate complete subjects, custom question banks, and flashcard decks on demand.
            Integrated with modern cognitive reinforcement and spaced repetition.
          </p>

          {/* Prominent "Made with RevenueCat" Recognition Card */}
          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 border border-[#F2545B]/40 bg-panel/90 shadow-lg rounded-md border-glow">
            <div className="p-1.5 rounded bg-[#F2545B]/15 border border-[#F2545B]/30 flex items-center justify-center">
              <RevenueCatLogo className="w-5 h-5 text-[#F2545B] shrink-0" aria-hidden="true" />
            </div>
            <div className="text-left">
              <span className="block font-mono text-[11px] tracking-widest text-[#F2545B] font-bold uppercase">
                MADE WITH REVENUECAT
              </span>
              <span className="block text-[10px] text-muted-foreground font-mono">
                Official Web Billing SDK & Entitlement Engine
              </span>
            </div>
            <a
              href="https://www.revenuecat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1 text-muted-foreground hover:text-[#F2545B] transition-colors"
              title="Visit RevenueCat"
              aria-label="Visit RevenueCat website"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Customer Status Banner */}
        {hasAiEntitlement && (
          <div className="w-full max-w-4xl mb-8 p-4 sm:p-5 border border-emerald-500/40 bg-emerald-500/10 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wide">
                  FINALISTS AI PASS IS ACTIVE
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your account has unlimited access to AI Subject and Question Generation.
                </p>
              </div>
            </div>

            {customerInfo?.managementURL ? (
              <button
                onClick={() => openCustomerCenter()}
                className="flex items-center gap-2 px-4 py-2 border border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold tracking-wider uppercase rounded transition-colors cursor-pointer focus-ring"
              >
                <span>CUSTOMER CENTER</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : (
              <span className="font-mono text-xs text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded">
                PERPETUAL ACCESS
              </span>
            )}
          </div>
        )}

        {/* Feedback alerts */}
        {purchaseError && (
          <div
            role="alert"
            className="w-full max-w-4xl mb-6 p-4 border border-destructive/60 bg-destructive/10 text-destructive text-xs font-mono rounded-md flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{purchaseError}</span>
          </div>
        )}

        {purchaseSuccess && (
          <div
            role="status"
            className="w-full max-w-4xl mb-6 p-4 border border-emerald-500/60 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-md flex items-center gap-3"
          >
            <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Success! Entitlement verified. Finalists AI features are unlocked!</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {FINALISTS_AI_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id
            const isPopular = plan.popular

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative flex flex-col justify-between p-6 sm:p-7 border rounded-lg cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? "border-primary bg-panel shadow-[0_0_25px_hsla(var(--primary),0.12)] ring-1 ring-primary"
                    : "border-border/80 bg-panel/50 hover:border-border hover:bg-secondary/40"
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase rounded border ${
                      isPopular
                        ? "bg-primary text-black border-primary shadow-[0_0_10px_hsla(var(--primary),0.4)]"
                        : "bg-secondary text-primary border-primary/40"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mt-1 mb-2">
                    <span className="font-mono text-base font-bold tracking-wide text-foreground uppercase">
                      {plan.title}
                    </span>
                    {isPopular && <Crown className="w-5 h-5 text-primary" aria-hidden="true" />}
                  </div>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="font-mono text-4xl font-extrabold text-foreground">
                      {plan.price}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{plan.period}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {plan.billingSubtext}
                  </p>

                  <div className="border-t border-border/60 pt-4 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-left">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-xs text-foreground/90 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/50">
                  <button
                    type="button"
                    disabled={isPurchasing}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlanId(plan.id)
                      handleCheckout(plan)
                    }}
                    className={`w-full py-3 px-4 font-mono text-xs font-bold tracking-wider uppercase rounded transition-all focus-ring flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_hsla(var(--primary),0.3)]"
                        : "border border-border text-foreground hover:border-primary/60 hover:text-primary"
                    }`}
                  >
                    {isPurchasing && selectedPlanId === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" aria-hidden="true" />
                        <span>{plan.id === "lifetime" ? "GET LIFETIME PASS" : "CHOOSE PLAN"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Alternative Native Paywall Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center mb-16">
          <span className="font-mono text-xs text-muted-foreground">
            Prefer standard RevenueCat modal checkout?
          </span>
          <button
            onClick={handleLaunchNativePaywall}
            disabled={isPurchasing}
            className="font-mono text-xs font-bold text-primary hover:underline underline-offset-4 uppercase tracking-wider transition-colors cursor-pointer"
          >
            LAUNCH REVENUECAT HOSTED PAYWALL OVERLAY →
          </button>
        </div>

        {/* Feature Comparison Table */}
        <section className="w-full max-w-4xl border border-border/80 rounded-md bg-panel p-6 sm:p-8 mb-16">
          <h2 className="font-mono text-xl font-bold tracking-tight text-foreground uppercase mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            TIER COMPARISON MATRIX
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground uppercase">
                  <th className="pb-3 font-bold">CAPABILITY</th>
                  <th className="pb-3 font-bold text-center">CORE (FREE)</th>
                  <th className="pb-3 font-bold text-center text-primary">FINALISTS AI PASS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                <tr>
                  <td className="py-3">Included Practice Quizzes</td>
                  <td className="py-3 text-center">Unlimited</td>
                  <td className="py-3 text-center text-primary font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3">All 7 Game Modes (Speedrun, Survival, Blitz)</td>
                  <td className="py-3 text-center">Included</td>
                  <td className="py-3 text-center text-primary font-bold">Included</td>
                </tr>
                <tr>
                  <td className="py-3">Autonomous AI Subject & Exam Synthesis</td>
                  <td className="py-3 text-center text-muted-foreground">—</td>
                  <td className="py-3 text-center text-primary font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3">LaTeX & Mermaid Diagram Question Builder</td>
                  <td className="py-3 text-center text-muted-foreground">—</td>
                  <td className="py-3 text-center text-primary font-bold">Included</td>
                </tr>
                <tr>
                  <td className="py-3">Spaced Repetition & Cognitive Insights</td>
                  <td className="py-3 text-center text-muted-foreground">—</td>
                  <td className="py-3 text-center text-primary font-bold">Advanced Kernel</td>
                </tr>
                <tr>
                  <td className="py-3">RevenueCat Self-Service Management</td>
                  <td className="py-3 text-center text-muted-foreground">—</td>
                  <td className="py-3 text-center text-primary font-bold">1-Click Portal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer & FAQ */}
        <footer className="w-full max-w-4xl border-t border-border/60 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <RevenueCatLogo className="w-5 h-5 text-[#F2545B]" aria-hidden="true" />
            <span className="font-semibold text-foreground/90">Built with RevenueCat Web Billing SDK & Stripe</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-primary transition-colors">
              HOME
            </Link>
            <span>•</span>
            <Link href="/guide" className="hover:text-primary transition-colors">
              USER GUIDE
            </Link>
            <span>•</span>
            <a
              href="https://www.revenuecat.com/docs/web/web-billing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>REVENUECAT DOCS</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
