# LineScope

LineScope is an autonomous World Cup odds intelligence dashboard powered by TxLINE.

It ingests odds and score events, detects market movement, correlates signals with match events, and presents an auditable signal trail in a compact operator-console UI. This repository currently implements Phase 1 and Phase 2 from `CODEX_HANDOFF.md`: UI skeleton, mock data, replay controls, signal engine stubs, and the signal evidence drawer.

## Core Features

- Three-column command center dashboard.
- TxLINE mode label with replay/mock fallback.
- Fixture rail with match status and score summaries.
- Match intelligence panel with probability, odds movement, score timeline, and bookmaker consensus tables.
- Replay controls for fixture selection, speed, start, pause, and reset.
- Deterministic signal stubs for sharp movement, bookmaker divergence, score reaction, and data health.
- Signal drawer with evidence, TxLINE message IDs, local hash, and verification status.

## Architecture

- `src/main.tsx` mounts the React command center.
- `src/components` contains the operator-console UI modules.
- `src/lib/mock-data.ts` loads local sample fixtures and replay events.
- `src/lib/signals` contains the Phase 2 signal engine and rule stubs.
- `src/lib/verification/hash-signal.ts` creates a stable local signal hash.
- `data/*.json` contains realistic sample fixtures, odds events, and score events.

Live TxLINE integration is intentionally not implemented in this phase.

## TxLINE Endpoints Used

These are the planned production endpoints from the handoff. Phase 1/2 uses local replay data instead.

- POST `/auth/guest/start`
- POST `/api/token/activate`
- GET `/api/fixtures/snapshot`
- GET `/api/odds/stream`
- GET `/api/scores/stream`
- GET `/api/odds/snapshot/{fixtureId}`
- GET `/api/scores/snapshot/{fixtureId}`
- GET `/api/odds/updates/{epochDay}/{hourOfDay}/{interval}`
- GET `/api/scores/updates/{epochDay}/{hourOfDay}/{interval}`

## Run Locally

```bash
npm install
npm run dev
```

Open the Vite URL printed by the dev server, usually `http://localhost:5173`.

## Environment Variables

Reserved for Phase 3 and later:

```env
TXLINE_BASE_URL=
TXLINE_AUTH_TOKEN=
TXLINE_API_TOKEN=
TXLINE_ACCESS_MODE=guest
SOLANA_RPC_URL=
SOLANA_PRIVATE_KEY=
```

## Replay Mode

Replay mode reconstructs local TxLINE-style odds and score events from `data/sample-*.json`. The replay controls feed events into the same signal engine used by the dashboard counters, signal rail, and drawer.

## Signal Logic

- `SHARP_MOVEMENT`: consensus implied probability moves by at least 5% within 120 seconds.
- `BOOKMAKER_DIVERGENCE`: a bookmaker implied probability differs from consensus by at least 8%.
- `SCORE_REACTION`: odds movement is linked to a goal within the next 120 seconds.
- `DATA_HEALTH`: a fixture has stale odds updates for at least 180 seconds during replay.

## Verification

Signals receive a local deterministic hash from selected signal fields. Solana devnet memo verification is not configured in Phase 1/2 and is shown as unavailable in the drawer.

## Known Limitations

- Live TxLINE ingestion is not implemented yet.
- Persistence, API routes, and database models are deferred.
- Signal rules are deterministic MVP stubs and should be hardened in Phase 4.
- Solana memo proof is deferred to Phase 5.

## Hackathon Feedback

The demo path is: open LineScope, show replay/mock mode, start replay, watch counters advance, inspect generated signals, and open a signal drawer to verify evidence and local hash.

<!-- paired -->
