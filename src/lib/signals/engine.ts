import type { Fixture, OddsEvent, ScoreEvent } from "../txline/types";
import { hashSignal } from "../verification/hash-signal";
import { detectBookmakerDivergence } from "./rules/bookmaker-divergence";
import { detectDataHealth } from "./rules/data-health";
import { detectScoreReaction } from "./rules/score-reaction";
import { detectSharpMovement } from "./rules/sharp-movement";
import type { Signal } from "./types";

export interface SignalEngineInput {
  fixtures: Fixture[];
  oddsEvents: OddsEvent[];
  scoreEvents: ScoreEvent[];
  replayClock: number;
}

export function runSignalEngine(input: SignalEngineInput): Signal[] {
  const fixtureSignals = input.fixtures.flatMap((fixture) => [
    ...detectSharpMovement(fixture.id, input.oddsEvents),
    ...detectBookmakerDivergence(fixture.id, input.oddsEvents),
    ...detectScoreReaction(fixture.id, input.oddsEvents, input.scoreEvents),
  ]);

  const allSignals = [...fixtureSignals, ...detectDataHealth(input.fixtures, input.oddsEvents, input.replayClock)];
  const uniqueSignals = Array.from(new Map(allSignals.map((signal) => [signal.id, signal])).values());

  return uniqueSignals
    .map((signal): Signal => {
      const signalHash = hashSignal(signal);
      return {
        ...signal,
        verification: {
          signalHash,
          verifiedAt: signal.status === "verified" ? signal.createdAt : undefined,
        },
      };
    })
    .sort((a, b) => Number(b.createdAt.replace(/\D/g, "")) - Number(a.createdAt.replace(/\D/g, "")));
}
