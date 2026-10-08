"use client";

import { useEffect } from "react";
import { FileSearch, Fingerprint, ShieldCheck, X } from "lucide-react";
import type { Fixture } from "@/lib/txline/types";
import type { Signal } from "@/lib/signals/types";

interface SignalDrawerProps {
  signal: Signal | null;
  fixture: Fixture | undefined;
  onClose: () => void;
}

function fieldLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SignalDrawer({ signal, fixture, onClose }: SignalDrawerProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (signal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, signal]);

  if (!signal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Signal details">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-background/80"
        aria-label="Close signal drawer"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[460px] overflow-y-auto border-l border-border bg-surface shadow-2xl shadow-black">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-surface px-4 py-4">
          <div>
            <p className="text-[12px] uppercase tracking-normal text-secondaryText">{fieldLabel(signal.type)}</p>
            <h2 className="mt-1 text-[20px] font-semibold text-primaryText">{fieldLabel(signal.severity)} severity</h2>
            <p className="mt-1 text-[12px] text-secondaryText">
              {signal.status === "verified" ? "Verified" : "Needs review"} · Confidence {(signal.confidence * 100).toFixed(0)}%
            </p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-10 min-w-10 items-center justify-center border border-border bg-background text-primaryText hover:border-info"
            aria-label="Close drawer"
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <section className="border border-border bg-background p-3">
            <h3 className="text-[14px] font-semibold">Summary</h3>
            <p className="mt-2 text-[13px] text-secondaryText">{signal.summary}</p>
          </section>

          <section className="border border-border bg-background p-3">
            <h3 className="text-[14px] font-semibold">Fixture</h3>
            <p className="mt-2 text-[13px] text-primaryText">
              {fixture ? `${fixture.homeTeam} vs ${fixture.awayTeam}` : signal.fixtureId}
            </p>
            <p className="mt-1 font-mono text-[11px] text-secondaryText">Detected {signal.createdAt}</p>
          </section>

          <section className="border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-info" aria-hidden="true" />
              <h3 className="text-[14px] font-semibold">Evidence</h3>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <dt className="text-secondaryText">Odds updates</dt>
                <dd className="mt-1 font-mono text-primaryText">{signal.evidence.oddsEventIds.length}</dd>
              </div>
              <div>
                <dt className="text-secondaryText">Score events</dt>
                <dd className="mt-1 font-mono text-primaryText">{signal.evidence.scoreEventIds.length}</dd>
              </div>
              <div>
                <dt className="text-secondaryText">Bookmakers</dt>
                <dd className="mt-1 font-mono text-primaryText">{signal.evidence.bookmakerCount ?? 0}</dd>
              </div>
              <div>
                <dt className="text-secondaryText">Linked score</dt>
                <dd className="mt-1 font-mono text-primaryText">{signal.evidence.linkedScoreEvent ? "yes" : "no"}</dd>
              </div>
            </dl>
          </section>

          <section className="border border-border bg-background p-3">
            <h3 className="text-[14px] font-semibold">TxLINE Message IDs</h3>
            <div className="mt-3 grid gap-2">
              {signal.evidence.txlineMessageIds.map((id) => (
                <code key={id} className="break-all border border-border bg-surface2 px-2 py-1 font-mono text-[11px] text-secondaryText">
                  {id}
                </code>
              ))}
            </div>
          </section>

          <section className="border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              {signal.status === "verified" ? (
                <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
              ) : (
                <Fingerprint className="h-4 w-4 text-warning" aria-hidden="true" />
              )}
              <h3 className="text-[14px] font-semibold">Verification</h3>
            </div>
            <p className="mt-2 text-[12px] text-secondaryText">Local hash generated. Solana devnet memo is not configured in Phase 1/2.</p>
            <code className="mt-3 block break-all border border-border bg-surface2 px-2 py-2 font-mono text-[11px] text-primaryText">
              Signal Hash: {signal.verification?.signalHash ?? "pending"}
            </code>
            <code className="mt-2 block break-all border border-border bg-surface2 px-2 py-2 font-mono text-[11px] text-secondaryText">
              Solana Signature: not configured
            </code>
          </section>
        </div>
      </aside>
    </div>
  );
}
