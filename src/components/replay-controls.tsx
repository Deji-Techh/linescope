import { Pause, Play, RefreshCcw } from "lucide-react";
import type { Fixture } from "@/lib/txline/types";

interface ReplayControlsProps {
  fixtures: Fixture[];
  selectedFixtureId: string;
  speed: number;
  isRunning: boolean;
  replayClock: number;
  onFixtureChange: (fixtureId: string) => void;
  onSpeedChange: (speed: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ReplayControls({
  fixtures,
  selectedFixtureId,
  speed,
  isRunning,
  replayClock,
  onFixtureChange,
  onSpeedChange,
  onStart,
  onPause,
  onReset,
}: ReplayControlsProps) {
  return (
    <section className="border-b border-border bg-surface2 px-4 py-3" aria-label="Replay controls">
      <div className="mb-3 border border-border bg-background p-3">
        <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-normal text-info">
          Replay Mode
        </div>
        <p className="text-[12px] text-secondaryText">
          Reconstructing TxLINE odds and score updates. The same autonomous signal engine is running on replayed data.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_auto_auto_auto] lg:items-end">
        <label className="grid gap-1 text-[12px] text-secondaryText">
          Fixture selector
          <select
            className="min-h-10 border border-border bg-background px-3 text-[13px] text-primaryText"
            value={selectedFixtureId}
            onChange={(event) => onFixtureChange(event.target.value)}
          >
            {fixtures.map((fixture) => (
              <option key={fixture.id} value={fixture.id}>
                {fixture.homeTeam} vs {fixture.awayTeam}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2" aria-label="Replay speed">
          {[1, 5, 20].map((value) => (
            <button
              key={value}
              type="button"
              className={`min-h-10 min-w-12 border px-3 text-[12px] font-semibold ${
                speed === value
                  ? "border-info bg-info text-background"
                  : "border-border bg-background text-secondaryText hover:text-primaryText"
              }`}
              onClick={() => onSpeedChange(value)}
            >
              {value}x
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 border border-border bg-background px-3 text-[12px] font-semibold text-primaryText hover:border-info"
            onClick={isRunning ? onPause : onStart}
          >
            {isRunning ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 border border-border bg-background px-3 text-[12px] font-semibold text-primaryText hover:border-info"
            onClick={onReset}
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>

        <div className="font-mono text-[12px] text-secondaryText">T+{replayClock}s</div>
      </div>
    </section>
  );
}
