import type { OddsEvent } from "../../txline/types";
import type { Signal } from "../types";

export function detectSharpMovement(fixtureId: string, oddsEvents: OddsEvent[]): Signal[] {
  const bySelection = new Map<string, OddsEvent[]>();

  oddsEvents
    .filter((event) => event.fixtureId === fixtureId)
    .forEach((event) => {
      const key = `${event.market}:${event.selection}`;
      bySelection.set(key, [...(bySelection.get(key) ?? []), event]);
    });

  const signals: Signal[] = [];

  bySelection.forEach((events) => {
    const sorted = [...events].sort((a, b) => a.offsetSeconds - b.offsetSeconds);
    for (let start = 0; start < sorted.length; start += 1) {
      for (let end = start + 1; end < sorted.length; end += 1) {
        const seconds = sorted[end].offsetSeconds - sorted[start].offsetSeconds;
        const delta = sorted[end].consensusProb - sorted[start].consensusProb;
        if (seconds <= 120 && Math.abs(delta) >= 0.05) {
          signals.push({
            id: `sig-sharp-${fixtureId}-${sorted[start].selection}`,
            fixtureId,
            type: "SHARP_MOVEMENT",
            severity: Math.abs(delta) >= 0.09 ? "high" : "medium",
            confidence: 0.86,
            summary: `${sorted[start].selection} probability moved ${(delta * 100).toFixed(1)}% in ${seconds} seconds.`,
            createdAt: `T+${sorted[end].offsetSeconds}s`,
            status: "verified",
            metrics: {
              selection: sorted[start].selection,
              fromProbability: sorted[start].consensusProb,
              toProbability: sorted[end].consensusProb,
              delta,
              windowSeconds: seconds,
            },
            evidence: {
              oddsEventIds: sorted.slice(start, end + 1).map((event) => event.id),
              scoreEventIds: [],
              txlineMessageIds: sorted.slice(start, end + 1).map((event) => event.messageId),
              bookmakerCount: new Set(sorted.slice(start, end + 1).map((event) => event.bookmaker)).size,
              linkedScoreEvent: false,
            },
          });
          return;
        }
      }
    }
  });

  return signals;
}
