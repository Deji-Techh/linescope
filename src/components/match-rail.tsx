import { CheckCircle2, Circle, Clock3, Swords } from "lucide-react";
import type { Fixture } from "@/lib/txline/types";

interface MatchRailProps {
  fixtures: Fixture[];
  selectedFixtureId: string;
  onSelectFixture: (fixtureId: string) => void;
}

function statusIcon(status: Fixture["status"]) {
  if (status === "Final") return CheckCircle2;
  if (status === "Upcoming") return Clock3;
  if (status === "Replay") return Swords;
  return Circle;
}

function scoreLabel(fixture: Fixture) {
  if (!fixture.score) return "No score";
  return `${fixture.score.home}-${fixture.score.away}`;
}

export function MatchRail({ fixtures, selectedFixtureId, onSelectFixture }: MatchRailProps) {
  if (fixtures.length === 0) {
    return (
      <aside className="border-r border-border bg-surface p-4">
        <p className="text-[14px] font-semibold">Match Rail</p>
        <p className="mt-2 text-[12px] text-secondaryText">No fixtures loaded.</p>
      </aside>
    );
  }

  return (
    <aside className="border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[14px] font-semibold">Match Rail</p>
        <p className="mt-1 text-[12px] text-secondaryText">{fixtures.length} fixtures loaded</p>
      </div>

      <div className="divide-y divide-border">
        {fixtures.map((fixture) => {
          const Icon = statusIcon(fixture.status);
          const selected = fixture.id === selectedFixtureId;

          return (
            <button
              key={fixture.id}
              type="button"
              className={`flex min-h-20 w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface2 ${
                selected ? "bg-surface2" : "bg-surface"
              }`}
              onClick={() => onSelectFixture(fixture.id)}
            >
              <Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${selected ? "text-info" : "text-secondaryText"}`}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-primaryText">
                  {fixture.homeTeam} vs {fixture.awayTeam}
                </span>
                <span className="mt-1 block text-[12px] text-secondaryText">
                  {fixture.status} · {scoreLabel(fixture)} · {fixture.lastUpdateOffset}s ago
                </span>
                <span className="mt-2 block font-mono text-[11px] text-mutedText">{fixture.id}</span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
