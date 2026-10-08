import type { OddsEvent, ScoreEvent } from "../../txline/types";
import type { Signal } from "../types";

export function detectScoreReaction(
  fixtureId: string,
  oddsEvents: OddsEvent[],
  scoreEvents: ScoreEvent[],
): Signal[] {
  return scoreEvents
    .filter((event) => event.fixtureId === fixtureId && event.action === "GOAL")
    .flatMap((scoreEvent) => {
      const linkedOdds = oddsEvents.filter(
        (oddsEvent) =>
          oddsEvent.fixtureId === fixtureId &&
          oddsEvent.offsetSeconds >= scoreEvent.offsetSeconds &&
          oddsEvent.offsetSeconds <= scoreEvent.offsetSeconds + 120,
      );

      if (linkedOdds.length < 2) {
        return [];
      }

      const first = linkedOdds[0];
      const strongest = linkedOdds.reduce((best, current) =>
        Math.abs(current.consensusProb - first.consensusProb) > Math.abs(best.consensusProb - first.consensusProb)
          ? current
          : best,
      );
      const delta = strongest.consensusProb - first.consensusProb;

      return [
        {
          id: `sig-score-${scoreEvent.id}`,
          fixtureId,
          type: "SCORE_REACTION" as const,
          severity: Math.abs(delta) >= 0.1 ? "high" : "medium",
          confidence: 0.82,
          summary: `Goal detected. Market moved ${(Math.abs(delta) * 100).toFixed(1)}% within 2 minutes.`,
          createdAt: `T+${strongest.offsetSeconds}s`,
          status: "verified" as const,
          metrics: {
            scoreAction: scoreEvent.action,
            team: scoreEvent.team,
            score: scoreEvent.score,
            probabilityShift: delta,
            windowSeconds: strongest.offsetSeconds - scoreEvent.offsetSeconds,
          },
          evidence: {
            oddsEventIds: linkedOdds.map((event) => event.id),
            scoreEventIds: [scoreEvent.id],
            txlineMessageIds: [scoreEvent.messageId, ...linkedOdds.map((event) => event.messageId)],
            bookmakerCount: new Set(linkedOdds.map((event) => event.bookmaker)).size,
            linkedScoreEvent: true,
          },
        },
      ];
    });
}
