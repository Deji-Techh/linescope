import { Activity, RadioTower, RefreshCcw, ShieldCheck } from "lucide-react";
import type { DashboardCounters } from "./types";

interface StatusBarProps {
  mode: "Live Mode" | "Replay Mode" | "Mock Mode";
  isRunning: boolean;
  counters: DashboardCounters;
  lastUpdate: string;
}

export function StatusBar({ mode, isRunning, counters, lastUpdate }: StatusBarProps) {
  const statusLabel = mode === "Live Mode" ? "TxLINE connected" : "TxLINE replay fallback";

  return (
    <header className="border-b border-border bg-surface">
      <div className="flex min-h-14 flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-border bg-background" aria-hidden="true">
            <RadioTower className="h-5 w-5 text-info" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-semibold leading-none tracking-normal text-primaryText">LineScope</h1>
              <span className="border border-border bg-surface2 px-2 py-1 text-[11px] font-semibold uppercase tracking-normal text-secondaryText">
                {mode}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-secondaryText">Autonomous World Cup odds intelligence powered by TxLINE.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[12px] text-secondaryText">
          <span className="inline-flex min-h-10 items-center gap-2 border border-border bg-background px-3">
            <Activity className={isRunning ? "h-4 w-4 text-success" : "h-4 w-4 text-mutedText"} aria-hidden="true" />
            {isRunning ? "Replay running" : "Replay paused"}
          </span>
          <span className="inline-flex min-h-10 items-center gap-2 border border-border bg-background px-3">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
            {statusLabel}
          </span>
          <span className="inline-flex min-h-10 items-center gap-2 border border-border bg-background px-3 font-mono text-[11px]">
            <RefreshCcw className="h-4 w-4 text-info" aria-hidden="true" />
            {lastUpdate}
          </span>
          <span className="inline-flex min-h-10 items-center border border-border bg-background px-3 font-mono text-[11px]">
            {counters.signalsGenerated} signals
          </span>
        </div>
      </div>
    </header>
  );
}
