import type { OddsEvent } from "../../txline/types";
import type { Signal } from "../types";

export function detectBookmakerDivergence(fixtureId: string, oddsEvents: OddsEvent[]): Signal[] {
  return oddsEvents
    .filter((event) => event.fixtureId === fixtureId)
    .filter((event) => Math.abs(event.impliedProb - event.consensusProb) >= 0.08)
    .map((event) => ({
      id: `sig-divergence-${event.id}`,
      fixtureId,
      type: "BOOKMAKER_DIVERGENCE",
      severity: "medium",
      confidence: 0.78,
      summary: `${event.bookmaker} is ${Math.abs((event.impliedProb - event.consensusProb) * 100).toFixed(1)}% away from market consensus.`,
      createdAt: `T+${event.offsetSeconds}s`,
      status: "needs_review",
      metrics: {
        bookmaker: event.bookmaker,
        selection: event.selection,
        impliedProbability: event.impliedProb,
        consensusProbability: event.consensusProb,
        delta: event.impliedProb - event.consensusProb,
      },
      evidence: {
        oddsEventIds: [event.id],
        scoreEventIds: [],
        txlineMessageIds: [event.messageId],
        bookmakerCount: 1,
        linkedScoreEvent: false,
      },
    }));
}
