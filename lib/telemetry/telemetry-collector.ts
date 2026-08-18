/**
 * @mold/telemetry - Telemetry Ingestion Collector
 *
 * Lightweight, decoupled event sink that records raw cognitive events,
 * notifies registered listeners, and manages local persistence without
 * coupling to game logic, routing, or state transitions.
 */

import type { CognitiveTelemetryEvent } from "./telemetry-types.ts"
import { getNamespacedKey } from "../utils/user-storage.ts"

const TELEMETRY_BASE_KEY = "mold_v2_telemetry_events"
const MAX_STORED_EVENTS = 500

export type TelemetryListener = (event: CognitiveTelemetryEvent) => void

class TelemetryCollector {
  private inMemoryEvents: CognitiveTelemetryEvent[] = []
  private listeners: Set<TelemetryListener> = new Set()

  public record(event: CognitiveTelemetryEvent, userId?: string | null): void {
    // Add unique ID if missing
    if (!event.id) {
      event.id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    }
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString()
    }

    this.inMemoryEvents.push(event)
    if (this.inMemoryEvents.length > MAX_STORED_EVENTS) {
      this.inMemoryEvents.shift()
    }

    // Persist to localStorage safely
    this.persistEvent(event, userId)

    // Notify listeners synchronously
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch (err) {
        console.error("Telemetry listener error:", err)
      }
    })
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public getEvents(filter?: {
    subjectId?: string
    type?: string
    sinceIso?: string
  }): CognitiveTelemetryEvent[] {
    return this.inMemoryEvents.filter((evt) => {
      if (filter?.subjectId && evt.subjectId !== filter.subjectId) return false
      if (filter?.type && evt.type !== filter.type) return false
      if (filter?.sinceIso && new Date(evt.timestamp) < new Date(filter.sinceIso)) return false
      return true
    })
  }

  public loadStoredEvents(subjectId?: string, userId?: string | null): CognitiveTelemetryEvent[] {
    if (typeof window === "undefined") return []
    try {
      const key = getNamespacedKey(
        subjectId ? `${TELEMETRY_BASE_KEY}_${subjectId}` : TELEMETRY_BASE_KEY,
        userId
      )
      const raw = localStorage.getItem(key)
      if (!raw) return []
      const parsed = JSON.parse(raw) as CognitiveTelemetryEvent[]
      this.inMemoryEvents = parsed
      return parsed
    } catch {
      return []
    }
  }

  public clear(subjectId?: string, userId?: string | null): void {
    this.inMemoryEvents = []
    if (typeof window !== "undefined") {
      const key = getNamespacedKey(
        subjectId ? `${TELEMETRY_BASE_KEY}_${subjectId}` : TELEMETRY_BASE_KEY,
        userId
      )
      localStorage.removeItem(key)
    }
  }

  private persistEvent(event: CognitiveTelemetryEvent, userId?: string | null): void {
    if (typeof window === "undefined") return
    try {
      const key = getNamespacedKey(
        event.subjectId ? `${TELEMETRY_BASE_KEY}_${event.subjectId}` : TELEMETRY_BASE_KEY,
        userId
      )
      const raw = localStorage.getItem(key)
      const existing: CognitiveTelemetryEvent[] = raw ? JSON.parse(raw) : []
      existing.push(event)
      if (existing.length > MAX_STORED_EVENTS) {
        existing.splice(0, existing.length - MAX_STORED_EVENTS)
      }
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {}
  }
}

export const telemetryCollector = new TelemetryCollector()
