/**
 * @mold/analytics - Google Analytics 4 (GA4) Telemetry Bridge
 *
 * Provides event tracking, conversion reporting, and pageview dispatching
 * for Google Analytics (gtag.js).
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Send custom event to Google Analytics if active
 */
export function trackGAEvent(action: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("event", action, params)
    } catch {
      // Ignore delivery errors
    }
  }
}

/**
 * Set user property or dimension in Google Analytics
 */
export function setGAUserProperty(properties: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("set", "user_properties", properties)
    } catch {
      // Ignore errors
    }
  }
}
