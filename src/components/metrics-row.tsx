import { Activity, CalendarDays, CheckCircle2, LineChart, ShieldCheck, Zap } from "lucide-react";
import type { DashboardCounters } from "./types";

const metricIcons = {
  fixtures: CalendarDays,
  odds: LineChart,
  scores: Activity,
  signals: Zap,
  verified: ShieldCheck,
  health: CheckCircle2,
};

interface MetricsRowProps {
  counters: DashboardCounters;
}

export function MetricsRow({ counters }: MetricsRowProps) {
  const metrics = [
    { label: "Fixtures loaded", value: counters.fixturesLoaded, icon: metricIcons.fixtures },
    { label: "Odds events", value: counters.oddsEventsProcessed, icon: metricIcons.odds },
    { label: "Score events", value: counters.scoreEventsProcessed, icon: metricIcons.scores },
    { label: "Signals generated", value: counters.signalsGenerated, icon: metricIcons.signals },
    { label: "Verified signals", value: counters.verifiedSignals, icon: metricIcons.verified },
    { label: "Engine status", value: "Ready", icon: metricIcons.health },
  ];

  return (
    <section className="grid gap-px border-b border-border bg-border sm:grid-cols-2 lg:grid-cols-6" aria-label="System metrics">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.label} className="flex min-h-20 items-center justify-between bg-surface px-4 py-3">
            <div>
              <p className="text-[12px] text-secondaryText">{metric.label}</p>
              <p className="mt-1 font-mono text-[20px] font-semibold text-primaryText">{metric.value}</p>
            </div>
            <Icon className="h-5 w-5 text-info" aria-hidden="true" />
          </div>
        );
      })}
    </section>
  );
}
