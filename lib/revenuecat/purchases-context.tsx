"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"
import type {
  CustomerInfo,
  Offerings,
  Offering,
  Package,
  PurchaseResult,
  PurchasesError,
  PresentPaywallParams,
  PaywallPurchaseResult,
} from "@revenuecat/purchases-js"
import { purchasesService } from "@/lib/revenuecat/purchases-service"
import { FINALISTS_AI_ENTITLEMENT } from "@/lib/revenuecat/revenuecat-types"
import { logger } from "@/lib/logger"

export interface PurchasesContextValue {
  isConfigured: boolean
  isLoading: boolean
  customerInfo: CustomerInfo | null
  hasAiEntitlement: boolean
  offerings: Offerings | null
  currentOffering: Offering | null
  error: Error | PurchasesError | null
  isPaywallOpen: boolean
  openPaywall: () => void
  closePaywall: () => void
  refreshCustomerInfo: () => Promise<CustomerInfo | null>
  purchasePackage: (
    pkg: Package,
    customerEmail?: string,
    htmlTarget?: HTMLElement
  ) => Promise<PurchaseResult>
  presentNativePaywall: (
    params?: PresentPaywallParams
  ) => Promise<PaywallPurchaseResult>
  openCustomerCenter: () => Promise<boolean>
}

const PurchasesContext = createContext<PurchasesContextValue | null>(null)

export interface PurchasesProviderProps {
  children: React.ReactNode
  userId?: string | null
}

export function PurchasesProvider({ children, userId }: PurchasesProviderProps) {
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [hasAiEntitlement, setHasAiEntitlement] = useState(false)
  const [offerings, setOfferings] = useState<Offerings | null>(null)
  const [error, setError] = useState<Error | PurchasesError | null>(null)
  const [isPaywallOpen, setIsPaywallOpen] = useState(false)

  const evaluateEntitlement = useCallback((info: CustomerInfo | null): boolean => {
    if (!info || !info.entitlements) return false
    const ent = info.entitlements.all[FINALISTS_AI_ENTITLEMENT]
    return Boolean(ent && ent.isActive)
  }, [])

  const syncState = useCallback(async (appUserId?: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const sdk = await purchasesService.initialize(appUserId)
      if (!sdk) {
        setIsConfigured(false)
        setIsLoading(false)
        return
      }
      setIsConfigured(true)

      const [info, fetchedOfferings] = await Promise.all([
        purchasesService.getCustomerInfo(appUserId || undefined).catch((err) => {
          logger.warn("PurchasesProvider: Non-fatal error getting customer info", { err })
          return null
        }),
        purchasesService.getOfferings(appUserId || undefined).catch((err) => {
          logger.warn("PurchasesProvider: Non-fatal error getting offerings", { err })
          return null
        }),
      ])

      setCustomerInfo(info)
      setHasAiEntitlement(evaluateEntitlement(info))
      setOfferings(fetchedOfferings)
    } catch (err: unknown) {
      logger.error("PurchasesProvider: Error syncing purchases state", { error: err })
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [evaluateEntitlement])

  useEffect(() => {
    syncState(userId)
  }, [userId, syncState])

  const refreshCustomerInfo = useCallback(async (): Promise<CustomerInfo | null> => {
    try {
      const info = await purchasesService.getCustomerInfo(userId || undefined)
      setCustomerInfo(info)
      setHasAiEntitlement(evaluateEntitlement(info))
      return info
    } catch (err: unknown) {
      logger.error("PurchasesProvider: Failed to refresh CustomerInfo", { error: err })
      setError(err as Error)
      return null
    }
  }, [userId, evaluateEntitlement])

  const openPaywall = useCallback(() => {
    setIsPaywallOpen(true)
  }, [])

  const closePaywall = useCallback(() => {
    setIsPaywallOpen(false)
  }, [])

  const handlePurchasePackage = useCallback(
    async (
      pkg: Package,
      customerEmail?: string,
      htmlTarget?: HTMLElement
    ): Promise<PurchaseResult> => {
      try {
        setError(null)
        const result = await purchasesService.purchasePackage(pkg, customerEmail, htmlTarget)
        if (result && result.customerInfo) {
          setCustomerInfo(result.customerInfo)
          setHasAiEntitlement(evaluateEntitlement(result.customerInfo))
        }
        return result
      } catch (err: unknown) {
        setError(err as Error)
        throw err
      }
    },
    [evaluateEntitlement]
  )

  const handlePresentNativePaywall = useCallback(
    async (params?: PresentPaywallParams): Promise<PaywallPurchaseResult> => {
      try {
        setError(null)
        const result = await purchasesService.presentPaywall(params)
        if (result && result.customerInfo) {
          setCustomerInfo(result.customerInfo)
          setHasAiEntitlement(evaluateEntitlement(result.customerInfo))
        }
        return result
      } catch (err: unknown) {
        setError(err as Error)
        throw err
      }
    },
    [evaluateEntitlement]
  )

  const handleOpenCustomerCenter = useCallback(async (): Promise<boolean> => {
    return await purchasesService.openCustomerCenter(userId || undefined)
  }, [userId])

  const currentOffering = useMemo(() => {
    return offerings?.current || null
  }, [offerings])

  const contextValue = useMemo<PurchasesContextValue>(
    () => ({
      isConfigured,
      isLoading,
      customerInfo,
      hasAiEntitlement,
      offerings,
      currentOffering,
      error,
      isPaywallOpen,
      openPaywall,
      closePaywall,
      refreshCustomerInfo,
      purchasePackage: handlePurchasePackage,
      presentNativePaywall: handlePresentNativePaywall,
      openCustomerCenter: handleOpenCustomerCenter,
    }),
    [
      isConfigured,
      isLoading,
      customerInfo,
      hasAiEntitlement,
      offerings,
      currentOffering,
      error,
      isPaywallOpen,
      openPaywall,
      closePaywall,
      refreshCustomerInfo,
      handlePurchasePackage,
      handlePresentNativePaywall,
      handleOpenCustomerCenter,
    ]
  )

  return (
    <PurchasesContext.Provider value={contextValue}>
      {children}
    </PurchasesContext.Provider>
  )
}

/**
 * Hook to access RevenueCat purchases state, entitlements, and actions.
 */
export function usePurchases(): PurchasesContextValue {
  const context = useContext(PurchasesContext)
  if (!context) {
    throw new Error("usePurchases must be used within a PurchasesProvider")
  }
  return context
}
