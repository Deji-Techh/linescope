export type FixtureStatus = "Live" | "Upcoming" | "Final" | "Replay";

export interface FixtureScore {
  home: number;
  away: number;
}

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  startTime: string;
  status: FixtureStatus;
  score: FixtureScore | null;
  lastUpdateOffset: number;
}

export interface OddsEvent {
  id: string;
  fixtureId: string;
  messageId: string;
  offsetSeconds: number;
  bookmaker: string;
  market: string;
  selection: string;
  odds: number;
  impliedProb: number;
  consensusProb: number;
  gameState: string;
}

export interface ScoreEvent {
  id: string;
  fixtureId: string;
  messageId: string;
  offsetSeconds: number;
  action: "KICK_OFF" | "GOAL" | "FINAL";
  team: string | null;
  score: FixtureScore;
  gameState: string;
}
