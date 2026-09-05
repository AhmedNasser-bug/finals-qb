import {
  Purchases,
  type CustomerInfo,
  type Offerings,
  type Offering,
  type Package,
  type PurchaseResult,
  type PurchasesError,
  type PresentPaywallParams,
  type PaywallPurchaseResult,
} from "@revenuecat/purchases-js"
import {
  FINALISTS_AI_ENTITLEMENT,
} from "@/lib/revenuecat/revenuecat-types"
import { logger } from "@/lib/logger"

const DEFAULT_API_KEY = "test_zbsWleAbNOTjaFGkdkzKahntsit"
const ANONYMOUS_USER_STORAGE_KEY = "mold_v2_rc_anonymous_user_id"

export class PurchasesService {
  private static instance: PurchasesService | null = null
  private purchasesInstance: Purchases | null = null
  private currentAppUserId: string | null = null
  private isConfiguring: boolean = false
  private initPromise: Promise<Purchases | null> | null = null

  private constructor() {}

  /**
   * Singleton accessor.
   */
  public static getInstance(): PurchasesService {
    if (!PurchasesService.instance) {
      PurchasesService.instance = new PurchasesService()
    }
    return PurchasesService.instance
  }

  /**
   * Get the RevenueCat API Key (env var or fallback).
   */
  public getApiKey(): string {
    return process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || DEFAULT_API_KEY
  }

  /**
   * Check if running on server-side or if browser window is unavailable.
   */
  public isBrowser(): boolean {
    return typeof window !== "undefined"
  }

  /**
   * Resolves or generates the app user id.
   */
  public resolveAppUserId(customUserId?: string | null): string {
    if (customUserId && customUserId.trim()) {
      return customUserId.trim()
    }

    if (!this.isBrowser()) {
      return "$RCAnonymousID:server_default_guest"
    }

    try {
      const storedId = window.localStorage.getItem(ANONYMOUS_USER_STORAGE_KEY)
      if (storedId) {
        return storedId
      }
      const newAnonId = Purchases.generateRevenueCatAnonymousAppUserId()
      window.localStorage.setItem(ANONYMOUS_USER_STORAGE_KEY, newAnonId)
      return newAnonId
    } catch {
      return "$RCAnonymousID:local_storage_fallback"
    }
  }

  /**
   * Initialize and configure the RevenueCat Purchases Web SDK.
   * Safe to call multiple times; returns existing instance or in-flight promise.
   */
  public async initialize(customUserId?: string | null): Promise<Purchases | null> {
    if (!this.isBrowser()) {
      return null
    }

    const targetUserId = this.resolveAppUserId(customUserId)

    // If already initialized with this user, return existing instance
    if (this.purchasesInstance && this.currentAppUserId === targetUserId) {
      return this.purchasesInstance
    }

    // If another configure call is in progress for the same user, reuse it
    if (this.initPromise && this.currentAppUserId === targetUserId) {
      return this.initPromise
    }

    this.initPromise = (async () => {
      this.isConfiguring = true
      try {
        const apiKey = this.getApiKey()

        // If purchases was already configured with a different user, change user
        if (this.purchasesInstance && this.currentAppUserId !== targetUserId) {
          logger.info("PurchasesService: Changing user id", { newUserId: targetUserId })
          await this.purchasesInstance.changeUser(targetUserId)
          this.currentAppUserId = targetUserId
          return this.purchasesInstance
        }

        if (Purchases.isConfigured()) {
          this.purchasesInstance = Purchases.getSharedInstance()
          this.currentAppUserId = targetUserId
          return this.purchasesInstance
        }

        logger.info("PurchasesService: Configuring RevenueCat SDK", {
          appUserId: targetUserId,
          isSandbox: apiKey.startsWith("test_"),
        })

        this.purchasesInstance = Purchases.configure({
          apiKey,
          appUserId: targetUserId,
        })
        this.currentAppUserId = targetUserId

        // Preload branding asynchronously to speed up checkout
        this.purchasesInstance.preload().catch((err: unknown) => {
          logger.warn("PurchasesService: Preload failed non-critically", { error: err })
        })

        return this.purchasesInstance
      } catch (err: unknown) {
        logger.error("PurchasesService: Initialization failed", { error: err })
        return null
      } finally {
        this.isConfiguring = false
      }
    })()

    return this.initPromise
  }

  /**
   * Get the underlying SDK instance.
   */
  public getSDKInstance(): Purchases | null {
    if (!this.purchasesInstance && this.isBrowser() && Purchases.isConfigured()) {
      this.purchasesInstance = Purchases.getSharedInstance()
    }
    return this.purchasesInstance
  }

  /**
   * Fetch current CustomerInfo from RevenueCat.
   */
  public async getCustomerInfo(appUserId?: string): Promise<CustomerInfo | null> {
    const sdk = await this.initialize(appUserId)
    if (!sdk) return null

    try {
      return await sdk.getCustomerInfo()
    } catch (err: unknown) {
      logger.error("PurchasesService: Failed to retrieve CustomerInfo", { error: err })
      throw err
    }
  }

  /**
   * Checks whether the current user has the `finalists_ai` entitlement.
   */
  public async hasFinalistsAiEntitlement(appUserId?: string): Promise<boolean> {
    const sdk = await this.initialize(appUserId)
    if (!sdk) return false

    try {
      return await sdk.isEntitledTo(FINALISTS_AI_ENTITLEMENT)
    } catch (err: unknown) {
      logger.error("PurchasesService: Failed checking finalists_ai entitlement", { error: err })
      return false
    }
  }

  /**
   * Fetch all configured offerings for the current user.
   */
  public async getOfferings(appUserId?: string): Promise<Offerings | null> {
    const sdk = await this.initialize(appUserId)
    if (!sdk) return null

    try {
      return await sdk.getOfferings()
    } catch (err: unknown) {
      logger.error("PurchasesService: Failed to get offerings", { error: err })
      throw err
    }
  }

  /**
   * Purchase a specific RevenueCat Package.
   */
  public async purchasePackage(
    pkg: Package,
    customerEmail?: string,
    htmlTarget?: HTMLElement
  ): Promise<PurchaseResult> {
    const sdk = await this.initialize()
    if (!sdk) {
      throw new Error("PurchasesService: SDK unavailable or offline")
    }

    try {
      logger.info("PurchasesService: Initiating purchase for package", {
        packageId: pkg.identifier,
        productId: pkg.rcBillingProduct?.identifier,
      })

      return await sdk.purchase({
        rcPackage: pkg,
        customerEmail,
        htmlTarget,
      })
    } catch (err: unknown) {
      const purchasesError = err as PurchasesError
      logger.warn("PurchasesService: Purchase error occurred", {
        code: purchasesError?.errorCode,
        message: purchasesError?.message,
      })
      throw err
    }
  }

  /**
   * Present the official RevenueCat Web Paywall modal / container.
   */
  public async presentPaywall(
    params: PresentPaywallParams = {}
  ): Promise<PaywallPurchaseResult> {
    const sdk = await this.initialize()
    if (!sdk) {
      throw new Error("PurchasesService: SDK unavailable for paywall presentation")
    }

    logger.info("PurchasesService: Presenting RevenueCat Paywall")
    return await sdk.presentPaywall(params)
  }

  /**
   * Extract management URL for active subscriptions (Customer Center web link).
   */
  public async getCustomerCenterUrl(appUserId?: string): Promise<string | null> {
    const info = await this.getCustomerInfo(appUserId)
    return info?.managementURL || null
  }

  /**
   * Open Customer Center in a new tab/window if a managementURL is available.
   */
  public async openCustomerCenter(appUserId?: string): Promise<boolean> {
    if (!this.isBrowser()) return false

    try {
      const url = await this.getCustomerCenterUrl(appUserId)
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer")
        return true
      }
      logger.warn("PurchasesService: No active managementURL found for customer")
      return false
    } catch (err: unknown) {
      logger.error("PurchasesService: Error opening Customer Center", { error: err })
      return false
    }
  }
}

export const purchasesService = PurchasesService.getInstance()
