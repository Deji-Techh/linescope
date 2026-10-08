import { Activity, Building2, Clock3, Goal, LineChart } from "lucide-react";
import type { Fixture, OddsEvent, ScoreEvent } from "@/lib/txline/types";

interface MatchIntelligenceProps {
  fixture: Fixture;
  oddsEvents: OddsEvent[];
  scoreEvents: ScoreEvent[];
  replayClock: number;
}

const selections = ["France", "Draw", "Brazil", "Argentina", "Germany", "United States", "Japan"];

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function latestBySelection(oddsEvents: OddsEvent[]) {
  return selections
    .map((selection) =>
      oddsEvents
        .filter((event) => event.selection === selection)
        .sort((a, b) => b.offsetSeconds - a.offsetSeconds)[0],
    )
    .filter(Boolean) as OddsEvent[];
}

export function MatchIntelligence({ fixture, oddsEvents, scoreEvents, replayClock }: MatchIntelligenceProps) {
  const latestOdds = [...oddsEvents].sort((a, b) => b.offsetSeconds - a.offsetSeconds)[0];
  const latestScore = [...scoreEvents].sort((a, b) => b.offsetSeconds - a.offsetSeconds)[0];
  const consensusRows = latestBySelection(oddsEvents);
  const score = latestScore?.score ?? fixture.score;

  return (
    <main className="min-w-0 bg-background">
      <div className="border-b border-border bg-surface px-4 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-normal text-secondaryText">{fixture.competition}</p>
            <h2 className="mt-1 text-[24px] font-semibold leading-tight text-primaryText">
              {fixture.homeTeam} vs {fixture.awayTeam}
            </h2>
            <p className="mt-1 text-[13px] text-secondaryText">
              {latestScore?.gameState ?? fixture.status} · {score ? `${score.home}-${score.away}` : "Score pending"}
            </p>
          </div>
          <div className="grid gap-2 font-mono text-[11px] text-secondaryText">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-info" aria-hidden="true" />
              Last TxLINE update: T+{latestOdds?.offsetSeconds ?? replayClock}s
            </span>
            <span>Replay clock: T+{replayClock}s</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <LineChart className="h-4 w-4 text-info" aria-hidden="true" />
            <h3 className="text-[14px] font-semibold">Consensus Probability</h3>
          </div>
          {consensusRows.length === 0 ? (
            <p className="p-3 text-[12px] text-secondaryText">Start replay to load market probability.</p>
          ) : (
            <div className="divide-y divide-border">
              {consensusRows.map((event) => (
                <div key={`${event.selection}-${event.id}`} className="grid grid-cols-[1fr_auto] gap-3 px-3 py-3">
                  <span className="text-[13px] text-primaryText">{event.selection}</span>
                  <span className="font-mono text-[13px] font-semibold text-primaryText">{formatPercent(event.consensusProb)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Activity className="h-4 w-4 text-info" aria-hidden="true" />
            <h3 className="text-[14px] font-semibold">Odds Movement</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[12px]">
              <thead className="text-secondaryText">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 font-medium">Time</th>
                  <th className="px-3 py-2 font-medium">Bookmaker</th>
                  <th className="px-3 py-2 font-medium">Selection</th>
                  <th className="px-3 py-2 font-medium">Odds</th>
                  <th className="px-3 py-2 font-medium">Consensus</th>
                </tr>
              </thead>
              <tbody>
                {oddsEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-secondaryText">
                      No odds events processed yet.
                    </td>
                  </tr>
                ) : (
                  [...oddsEvents]
                    .sort((a, b) => b.offsetSeconds - a.offsetSeconds)
                    .slice(0, 8)
                    .map((event) => (
                      <tr key={event.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 font-mono text-[11px] text-secondaryText">T+{event.offsetSeconds}s</td>
                        <td className="px-3 py-2 text-primaryText">{event.bookmaker}</td>
                        <td className="px-3 py-2 text-secondaryText">{event.selection}</td>
                        <td className="px-3 py-2 font-mono text-primaryText">{event.odds.toFixed(2)}</td>
                        <td className="px-3 py-2 font-mono text-primaryText">{formatPercent(event.consensusProb)}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Goal className="h-4 w-4 text-info" aria-hidden="true" />
            <h3 className="text-[14px] font-semibold">Score Timeline</h3>
          </div>
          <div className="divide-y divide-border">
            {scoreEvents.length === 0 ? (
              <p className="px-3 py-6 text-center text-[12px] text-secondaryText">No score events processed yet.</p>
            ) : (
              scoreEvents.map((event) => (
                <div key={event.id} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 px-3 py-3">
                  <span className="font-mono text-[11px] text-secondaryText">T+{event.offsetSeconds}s</span>
                  <span className="text-[13px] text-primaryText">
                    {event.action}
                    {event.team ? ` · ${event.team}` : ""}
                  </span>
                  <span className="font-mono text-[12px] text-primaryText">
                    {event.score.home}-{event.score.away}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Building2 className="h-4 w-4 text-info" aria-hidden="true" />
            <h3 className="text-[14px] font-semibold">Bookmaker Consensus</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-[12px]">
              <thead className="text-secondaryText">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 font-medium">Bookmaker</th>
                  <th className="px-3 py-2 font-medium">Market</th>
                  <th className="px-3 py-2 font-medium">Selection</th>
                  <th className="px-3 py-2 font-medium">Odds</th>
                  <th className="px-3 py-2 font-medium">Implied</th>
                  <th className="px-3 py-2 font-medium">Delta</th>
                  <th className="px-3 py-2 font-medium">Update</th>
                </tr>
              </thead>
              <tbody>
                {oddsEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-secondaryText">
                      Start replay to populate bookmaker rows.
                    </td>
                  </tr>
                ) : (
                  oddsEvents.slice(-8).map((event) => {
                    const delta = event.impliedProb - event.consensusProb;
                    return (
                      <tr key={`book-${event.id}`} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 text-primaryText">{event.bookmaker}</td>
                        <td className="px-3 py-2 text-secondaryText">{event.market}</td>
                        <td className="px-3 py-2 text-secondaryText">{event.selection}</td>
                        <td className="px-3 py-2 font-mono text-primaryText">{event.odds.toFixed(2)}</td>
                        <td className="px-3 py-2 font-mono text-primaryText">{formatPercent(event.impliedProb)}</td>
                        <td className={delta >= 0 ? "px-3 py-2 font-mono text-success" : "px-3 py-2 font-mono text-warning"}>
                          {(delta * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-secondaryText">T+{event.offsetSeconds}s</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
