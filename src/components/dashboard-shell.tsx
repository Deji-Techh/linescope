"use client";

import { useEffect, useMemo, useState } from "react";
import { MatchIntelligence } from "@/components/match-intelligence";
import { MatchRail } from "@/components/match-rail";
import { MetricsRow } from "@/components/metrics-row";
import { ReplayControls } from "@/components/replay-controls";
import { SignalDrawer } from "@/components/signal-drawer";
import { SignalFeed } from "@/components/signal-feed";
import { StatusBar } from "@/components/status-bar";
import { getReplayEvents, sampleFixtures } from "@/lib/mock-data";
import { runSignalEngine } from "@/lib/signals/engine";
import type { Signal } from "@/lib/signals/types";
import type { OddsEvent, ScoreEvent } from "@/lib/txline/types";

interface DashboardShellProps {
  initialMode: "Live Mode" | "Replay Mode" | "Mock Mode";
}

const replayEndSeconds = 360;

export function DashboardShell({ initialMode }: DashboardShellProps) {
  const [selectedFixtureId, setSelectedFixtureId] = useState(sampleFixtures[0].id);
  const [speed, setSpeed] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [replayClock, setReplayClock] = useState(0);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setReplayClock((current) => {
        const next = Math.min(current + speed, replayEndSeconds);
        if (next >= replayEndSeconds) {
          setIsRunning(false);
        }
        return next;
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [isRunning, speed]);

  const replayEvents = useMemo(() => getReplayEvents(selectedFixtureId), [selectedFixtureId]);

  const processedOddsEvents = useMemo(
    () =>
      replayEvents
        .filter((item) => item.kind === "odds" && item.offsetSeconds <= replayClock)
        .map((item) => item.event as OddsEvent),
    [replayClock, replayEvents],
  );

  const processedScoreEvents = useMemo(
    () =>
      replayEvents
        .filter((item) => item.kind === "score" && item.offsetSeconds <= replayClock)
        .map((item) => item.event as ScoreEvent),
    [replayClock, replayEvents],
  );

  const signals = useMemo(
    () =>
      runSignalEngine({
        fixtures: sampleFixtures,
        oddsEvents: processedOddsEvents,
        scoreEvents: processedScoreEvents,
        replayClock,
      }),
    [processedOddsEvents, processedScoreEvents, replayClock],
  );

  const selectedFixture = sampleFixtures.find((fixture) => fixture.id === selectedFixtureId) ?? sampleFixtures[0];
  const selectedFixtureForDrawer = selectedSignal
    ? sampleFixtures.find((fixture) => fixture.id === selectedSignal.fixtureId)
    : selectedFixture;

  const counters = {
    fixturesLoaded: sampleFixtures.length,
    oddsEventsProcessed: processedOddsEvents.length,
    scoreEventsProcessed: processedScoreEvents.length,
    signalsGenerated: signals.length,
    verifiedSignals: signals.filter((signal) => signal.status === "verified").length,
  };

  function resetReplay(nextFixtureId = selectedFixtureId) {
    setSelectedFixtureId(nextFixtureId);
    setReplayClock(0);
    setIsRunning(false);
    setSelectedSignal(null);
  }

  return (
    <div className="min-h-screen bg-background text-primaryText">
      <StatusBar
        mode={initialMode}
        isRunning={isRunning}
        counters={counters}
        lastUpdate={processedOddsEvents[processedOddsEvents.length - 1]?.messageId ?? "waiting-for-replay"}
      />
      <MetricsRow counters={counters} />
      <ReplayControls
        fixtures={sampleFixtures}
        selectedFixtureId={selectedFixtureId}
        speed={speed}
        isRunning={isRunning}
        replayClock={replayClock}
        onFixtureChange={(fixtureId) => resetReplay(fixtureId)}
        onSpeedChange={setSpeed}
        onStart={() => setIsRunning(true)}
        onPause={() => setIsRunning(false)}
        onReset={() => resetReplay()}
      />

      <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <MatchRail fixtures={sampleFixtures} selectedFixtureId={selectedFixtureId} onSelectFixture={resetReplay} />
        <MatchIntelligence
          fixture={selectedFixture}
          oddsEvents={processedOddsEvents}
          scoreEvents={processedScoreEvents}
          replayClock={replayClock}
        />
        <SignalFeed
          signals={signals}
          selectedSignalId={selectedSignal?.id ?? null}
          onSelectSignal={(signal) => setSelectedSignal(signal)}
        />
      </div>

      <SignalDrawer signal={selectedSignal} fixture={selectedFixtureForDrawer} onClose={() => setSelectedSignal(null)} />
    </div>
  );
}
