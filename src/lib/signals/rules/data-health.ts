import type { Fixture, OddsEvent } from "../../txline/types";
import type { Signal } from "../types";

export function detectDataHealth(fixtures: Fixture[], oddsEvents: OddsEvent[], replayClock: number): Signal[] {
  return fixtures.flatMap((fixture) => {
    const latest = oddsEvents
      .filter((event) => event.fixtureId === fixture.id)
      .sort((a, b) => b.offsetSeconds - a.offsetSeconds)[0];

    if (!latest || replayClock - latest.offsetSeconds < 180 || fixture.status === "Final") {
      return [];
    }

    return [
      {
        id: `sig-health-${fixture.id}`,
        fixtureId: fixture.id,
        type: "DATA_HEALTH" as const,
        severity: "low" as const,
        confidence: 0.74,
        summary: `${latest.bookmaker} has not updated for ${Math.floor((replayClock - latest.offsetSeconds) / 60)} minutes while fixture is active.`,
        createdAt: `T+${replayClock}s`,
        status: "new" as const,
        metrics: {
          bookmaker: latest.bookmaker,
          staleSeconds: replayClock - latest.offsetSeconds,
          lastOddsEvent: latest.id,
        },
        evidence: {
          oddsEventIds: [latest.id],
          scoreEventIds: [],
          txlineMessageIds: [latest.messageId],
          bookmakerCount: 1,
          linkedScoreEvent: false,
        },
      },
    ];
  });
}
