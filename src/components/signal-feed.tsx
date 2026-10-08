import { FileSearch, Fingerprint, Goal, ServerCog, ShieldCheck, TriangleAlert, Zap } from "lucide-react";
import type { Signal, SignalType } from "@/lib/signals/types";

interface SignalFeedProps {
  signals: Signal[];
  selectedSignalId: string | null;
  onSelectSignal: (signal: Signal) => void;
}

const signalIcons: Record<SignalType, typeof Zap> = {
  SHARP_MOVEMENT: Zap,
  BOOKMAKER_DIVERGENCE: TriangleAlert,
  SCORE_REACTION: Goal,
  DATA_HEALTH: ServerCog,
};

const signalLabels: Record<SignalType, string> = {
  SHARP_MOVEMENT: "Sharp Movement",
  BOOKMAKER_DIVERGENCE: "Bookmaker Divergence",
  SCORE_REACTION: "Score Reaction",
  DATA_HEALTH: "Data Health",
};

export function SignalFeed({ signals, selectedSignalId, onSelectSignal }: SignalFeedProps) {
  return (
    <aside className="border-l border-border bg-surface">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[14px] font-semibold">Signal Rail</p>
        <p className="mt-1 text-[12px] text-secondaryText">Autonomous detections from replayed TxLINE events</p>
      </div>

      {signals.length === 0 ? (
        <div className="p-4">
          <div className="border border-border bg-background p-4 text-center">
            <FileSearch className="mx-auto h-6 w-6 text-secondaryText" aria-hidden="true" />
            <p className="mt-2 text-[13px] font-semibold text-primaryText">No signals yet</p>
            <p className="mt-1 text-[12px] text-secondaryText">Start replay to process odds and score events.</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {signals.map((signal) => {
            const Icon = signalIcons[signal.type];
            const selected = signal.id === selectedSignalId;
            return (
              <button
                key={signal.id}
                type="button"
                className={`block w-full px-4 py-3 text-left hover:bg-surface2 ${selected ? "bg-surface2" : "bg-surface"}`}
                onClick={() => onSelectSignal(signal)}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-info" aria-hidden="true" />
                    <span className="truncate text-[12px] font-semibold uppercase tracking-normal text-primaryText">
                      {signal.severity} · {signalLabels[signal.type]}
                    </span>
                  </span>
                  {signal.status === "verified" ? (
                    <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-label="Verified" />
                  ) : (
                    <Fingerprint className="h-4 w-4 shrink-0 text-warning" aria-label="Proof pending" />
                  )}
                </span>
                <span className="mt-2 block text-[13px] text-primaryText">{signal.summary}</span>
                <span className="mt-3 flex flex-wrap gap-2 text-[11px] text-secondaryText">
                  <span>{signal.evidence.bookmakerCount ?? 0} bookmakers</span>
                  <span>{signal.evidence.oddsEventIds.length} updates</span>
                  <span>{signal.status === "verified" ? "Verified" : "Needs review"}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
