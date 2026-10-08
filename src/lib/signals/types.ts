export type SignalSeverity = "low" | "medium" | "high" | "critical";

export type SignalType =
  | "SHARP_MOVEMENT"
  | "BOOKMAKER_DIVERGENCE"
  | "SCORE_REACTION"
  | "DATA_HEALTH";

export interface Signal {
  id: string;
  fixtureId: string;
  type: SignalType;
  severity: SignalSeverity;
  confidence: number;
  summary: string;
  createdAt: string;
  status: "new" | "verified" | "needs_review";
  metrics: Record<string, unknown>;
  evidence: {
    oddsEventIds: string[];
    scoreEventIds: string[];
    txlineMessageIds: string[];
    bookmakerCount?: number;
    linkedScoreEvent?: boolean;
  };
  verification?: {
    signalHash: string;
    solanaSignature?: string;
    verifiedAt?: string;
  };
}
