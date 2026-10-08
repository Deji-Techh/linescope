import fixtures from "../../data/sample-fixtures.json";
import oddsEvents from "../../data/sample-odds-events.json";
import scoreEvents from "../../data/sample-score-events.json";
import type { Fixture, OddsEvent, ScoreEvent } from "./txline/types";

export const sampleFixtures = fixtures as Fixture[];
export const sampleOddsEvents = oddsEvents as OddsEvent[];
export const sampleScoreEvents = scoreEvents as ScoreEvent[];

export type ReplayEvent =
  | { kind: "odds"; offsetSeconds: number; event: OddsEvent }
  | { kind: "score"; offsetSeconds: number; event: ScoreEvent };

export function getReplayEvents(fixtureId: string): ReplayEvent[] {
  const odds = sampleOddsEvents
    .filter((event) => event.fixtureId === fixtureId)
    .map((event) => ({ kind: "odds" as const, offsetSeconds: event.offsetSeconds, event }));

  const scores = sampleScoreEvents
    .filter((event) => event.fixtureId === fixtureId)
    .map((event) => ({ kind: "score" as const, offsetSeconds: event.offsetSeconds, event }));

  return [...odds, ...scores].sort((a, b) => a.offsetSeconds - b.offsetSeconds);
}
