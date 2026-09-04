/**
 * @mold/telemetry - Cognitive Fatigue & Hesitation Detector
 *
 * Decoupled analyzer that processes decision latencies and option jitter
 * to detect cognitive exhaustion and output non-intrusive advisory recommendations.
 */

import type { CognitiveTelemetryEvent } from "./telemetry-types.ts"

export interface CognitiveLoadAnalysis {
  averageLatencyMs: number
  recentLatencySlope: number // Positive means slowing down
  cognitiveHesitationIndex: number // 1.0 (baseline) to 3.0+ (high fatigue)
  totalEventsAnalyzed: number
  advice: "OPTIMAL" | "SLIGHT_FATIGUE" | "FATIGUE_WARNING" | "SUGGEST_BREAK"
  message: string
}

/**
 * Evaluates cognitive load from raw telemetry events.
 */
export function analyzeCognitiveLoad(
  events: CognitiveTelemetryEvent[],
  baselineLatencyMs: number = 2500
): CognitiveLoadAnalysis {
  const latencySamples: number[] = []

  events.forEach((evt) => {
    if (evt.type === "rating_submitted") {
      latencySamples.push(evt.decisionLatencyMs)
    } else if (evt.type === "card_flipped") {
      latencySamples.push(evt.durationBeforeFlipMs)
    } else if (evt.type === "question_answered") {
      latencySamples.push(evt.totalDecisionLatencyMs)
    }
  })

  if (latencySamples.length === 0) {
    return {
      averageLatencyMs: baselineLatencyMs,
      recentLatencySlope: 0,
      cognitiveHesitationIndex: 1.0,
      totalEventsAnalyzed: 0,
      advice: "OPTIMAL",
      message: "Cognitive readiness optimal.",
    }
  }

  let sumAll = 0;
  for (let i = 0; i < latencySamples.length; i++) {
    sumAll += latencySamples[i];
  }
  const avg = sumAll / latencySamples.length;

  // Calculate slope between first half and second half if >= 4 samples
  let slope = 0
  if (latencySamples.length >= 4) {
    const mid = Math.floor(latencySamples.length / 2)
    let sum1 = 0;
    for(let i=0; i<mid; i++) sum1 += latencySamples[i];
    let sum2 = sumAll - sum1;

    const avg1 = sum1 / mid;
    const avg2 = sum2 / (latencySamples.length - mid);
    slope = Math.round((avg2 - avg1) * 10) / 10
  }

  // CHI is ratio of average latency to baseline
  const chi = Math.max(0.5, Math.round((avg / baselineLatencyMs) * 100) / 100)

  let advice: CognitiveLoadAnalysis["advice"] = "OPTIMAL"
  let message = "Cognitive readiness optimal."

  if (chi > 2.2 || slope > 3000) {
    advice = "SUGGEST_BREAK"
    message = "High cognitive hesitation detected. A 5-minute break is recommended."
  } else if (chi > 1.6 || slope > 1500) {
    advice = "FATIGUE_WARNING"
    message = "Latency increasing. Memory consolidation slowing down."
  } else if (chi > 1.2) {
    advice = "SLIGHT_FATIGUE"
    message = "Slight response delay. Maintaining steady pace."
  }

  return {
    averageLatencyMs: Math.round(avg),
    recentLatencySlope: slope,
    cognitiveHesitationIndex: chi,
    totalEventsAnalyzed: latencySamples.length,
    advice,
    message,
  }
}
