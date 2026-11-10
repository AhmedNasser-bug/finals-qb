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
  if (events.length === 0) {
    return {
      averageLatencyMs: baselineLatencyMs,
      recentLatencySlope: 0,
      cognitiveHesitationIndex: 1.0,
      totalEventsAnalyzed: 0,
      advice: "OPTIMAL",
      message: "Cognitive readiness optimal.",
    }
  }

  let totalEventsAnalyzed = 0;
  let totalLatency = 0;
  const latencySamples: number[] = []; // Still need this to calculate median/slope easily

  // Single pass without chained methods
  for (let i = 0; i < events.length; i++) {
    const evt = events[i];
    let latency = 0;
    if (evt.type === "rating_submitted") {
      latency = evt.decisionLatencyMs;
    } else if (evt.type === "card_flipped") {
      latency = evt.durationBeforeFlipMs;
    } else if (evt.type === "question_answered") {
      latency = evt.totalDecisionLatencyMs;
    }

    if (latency > 0) {
      latencySamples.push(latency);
      totalLatency += latency;
      totalEventsAnalyzed++;
    }
  }

  if (totalEventsAnalyzed === 0) {
    return {
      averageLatencyMs: baselineLatencyMs,
      recentLatencySlope: 0,
      cognitiveHesitationIndex: 1.0,
      totalEventsAnalyzed: 0,
      advice: "OPTIMAL",
      message: "Cognitive readiness optimal.",
    }
  }

  const avg = totalLatency / totalEventsAnalyzed;

  let slope = 0;
  if (totalEventsAnalyzed >= 4) {
    const mid = Math.floor(totalEventsAnalyzed / 2);
    let sum1 = 0;
    let sum2 = 0;
    for (let i = 0; i < mid; i++) sum1 += latencySamples[i];
    for (let i = mid; i < totalEventsAnalyzed; i++) sum2 += latencySamples[i];

    const avg1 = sum1 / mid;
    const avg2 = sum2 / (totalEventsAnalyzed - mid);
    slope = Math.round((avg2 - avg1) * 10) / 10;
  }

  const chi = Math.max(0.5, Math.round((avg / baselineLatencyMs) * 100) / 100);

  let advice: CognitiveLoadAnalysis["advice"] = "OPTIMAL";
  let message = "Cognitive readiness optimal.";

  if (chi > 2.2 || slope > 3000) {
    advice = "SUGGEST_BREAK";
    message = "High cognitive hesitation detected. A 5-minute break is recommended.";
  } else if (chi > 1.6 || slope > 1500) {
    advice = "FATIGUE_WARNING";
    message = "Latency increasing. Memory consolidation slowing down.";
  } else if (chi > 1.2) {
    advice = "SLIGHT_FATIGUE";
    message = "Slight response delay. Maintaining steady pace.";
  }

  return {
    averageLatencyMs: Math.round(avg),
    recentLatencySlope: slope,
    cognitiveHesitationIndex: chi,
    totalEventsAnalyzed,
    advice,
    message,
  }
}
