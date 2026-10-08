import type { Fixture, OddsEvent, ScoreEvent } from "@/lib/txline/types";

export interface DashboardCounters {
  fixturesLoaded: number;
  oddsEventsProcessed: number;
  scoreEventsProcessed: number;
  signalsGenerated: number;
  verifiedSignals: number;
}

export interface MatchSnapshot {
  fixture: Fixture;
  oddsEvents: OddsEvent[];
  scoreEvents: ScoreEvent[];
}
