"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  X,
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  ExternalLink,
  Crown,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { usePurchases } from "@/lib/revenuecat/purchases-context"
import {
  FINALISTS_AI_PLANS,
  type FinalistsAiPlanConfig,
} from "@/lib/revenuecat/revenuecat-types"
import type { Package } from "@revenuecat/purchases-js"

interface PaywallModalProps {
  isOpen?: boolean
  onClose?: () => void
}

export function PaywallModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }: PaywallModalProps) {
  const {
    isPaywallOpen,
    closePaywall,
    currentOffering,
    hasAiEntitlement,
    customerInfo,
    purchasePackage,
    presentNativePaywall,
    openCustomerCenter,
  } = usePurchases()

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isPaywallOpen
  const onClose = controlledOnClose !== undefined ? controlledOnClose : closePaywall

  const [selectedPlanId, setSelectedPlanId] = useState<string>("yearly")
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Find matching RC Package for plan
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
        // If package not loaded into offerings yet, attempt presenting native paywall
        await presentNativePaywall()
        setPurchaseSuccess(true)
      }
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || "Purchase failed or was cancelled."
      // Don't show scary error if user cancelled
      if (!errorMsg.toLowerCase().includes("cancelled") && !errorMsg.toLowerCase().includes("user")) {
        setPurchaseError(errorMsg)
      }
    } finally {
      setIsPurchasing(false)
    }
  }

  const handlePresentNative = async () => {
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

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-panel border border-border/80 shadow-2xl rounded-md p-6 sm:p-8 flex flex-col text-foreground focus:outline-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close paywall modal"
          className="absolute top-4 right-4 p-2 border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors rounded focus-ring"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/40 bg-primary/10 rounded font-mono text-[10px] tracking-widest text-primary font-bold uppercase mb-3 shadow-[0_0_12px_hsla(var(--primary),0.2)]">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            FINALISTS AI GENERATION PROTOCOL
          </div>
          <h2
            id="paywall-title"
            className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground"
          >
            UNLOCK <span className="text-primary">AUTONOMOUS MASTERY</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl">
            Synthesize full multi-chapter subjects, custom multiple-choice question banks,
            and flashcards instantly using state-of-the-art cognitive engineering models.
          </p>
        </div>

        {/* Entitlement Banner if already unlocked */}
        {hasAiEntitlement && (
          <div className="mb-6 p-4 border border-emerald-500/40 bg-emerald-500/10 rounded flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
              <div className="text-left">
                <p className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  FINALISTS AI PASS ACTIVE
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Your account has unlimited access to AI generation and analysis engines.
                </p>
              </div>
            </div>
            {customerInfo?.managementURL && (
              <button
                onClick={() => openCustomerCenter()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold tracking-wider uppercase rounded transition-colors focus-ring"
              >
                <span>MANAGE SUBSCRIPTION</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Error Feedback */}
        {purchaseError && (
          <div
            role="alert"
            className="mb-6 p-3 border border-destructive/60 bg-destructive/10 text-destructive text-xs font-mono rounded flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{purchaseError}</span>
          </div>
        )}

        {/* Success Feedback */}
        {purchaseSuccess && (
          <div
            role="status"
            className="mb-6 p-3 border border-emerald-500/60 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded flex items-center gap-2"
          >
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Entitlement updated! Finalists AI is now active on your account.</span>
          </div>
        )}

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {FINALISTS_AI_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id
            const isPopular = plan.popular

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative flex flex-col justify-between p-5 border rounded cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[0_0_20px_hsla(var(--primary),0.15)] ring-1 ring-primary"
                    : "border-border/80 bg-background/50 hover:border-border hover:bg-secondary/40"
                }`}
              >
                {/* Badge if available */}
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase rounded border ${
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
                    <span className="font-mono text-sm font-bold tracking-wide text-foreground uppercase">
                      {plan.title}
                    </span>
                    {isPopular && <Crown className="w-4 h-4 text-primary" aria-hidden="true" />}
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="font-mono text-3xl font-extrabold text-foreground">
                      {plan.price}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{plan.period}</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
                    {plan.billingSubtext}
                  </p>

                  <div className="border-t border-border/50 pt-3 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-left">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-[11px] text-foreground/90 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40">
                  <button
                    type="button"
                    disabled={isPurchasing}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlanId(plan.id)
                      handleCheckout(plan)
                    }}
                    className={`w-full py-2.5 px-4 font-mono text-xs font-bold tracking-wider uppercase rounded transition-all focus-ring flex items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_hsla(var(--primary),0.3)] cursor-pointer"
                        : "border border-border text-foreground hover:border-primary/50 hover:text-primary cursor-pointer"
                    }`}
                  >
                    {isPurchasing && selectedPlanId === plan.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{plan.id === "lifetime" ? "GET LIFETIME" : "ACTIVATE ACCESS"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border/60 gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-mono text-[10px]">
            <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>SECURE WEB BILLING VIA REVENUECAT & STRIPE</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePresentNative}
              disabled={isPurchasing}
              className="text-muted-foreground hover:text-primary underline underline-offset-4 font-mono text-[10px] tracking-wide uppercase transition-colors cursor-pointer"
            >
              LAUNCH REVENUECAT PAYWALL OVERLAY
            </button>

            {customerInfo?.managementURL && (
              <button
                onClick={() => openCustomerCenter()}
                className="text-primary hover:underline underline-offset-4 font-mono text-[10px] tracking-wide uppercase transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>CUSTOMER CENTER</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
