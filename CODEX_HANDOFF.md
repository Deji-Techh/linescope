# LineScope — Codex Build Handoff

## Project Summary

Build **LineScope**, an autonomous World Cup odds intelligence dashboard powered by TxLINE.

LineScope ingests TxLINE live odds and score feeds, detects important market movement, links odds movement to score events, and presents verifiable signal evidence in a compact operator-console UI.

This is **not** a betting app. Do not build wager execution, bet placement, gambling copy, user betting accounts, payment flows, or prediction-market settlement.

The product should feel like:

> A professional sports-data command center for live odds intelligence, replay, and signal verification.

---

## Core MVP Goal

Build a working MVP that demonstrates:

1. TxLINE data ingestion.
2. Live or replayed odds/score event processing.
3. Autonomous signal detection.
4. A serious dashboard showing matches, odds movement, score timeline, and signal feed.
5. Signal detail drawer showing evidence and optional proof/hash.
6. Replay mode so judges can see the system working even when no live match is active.

The demo must make this flow obvious:

```txt
TxLINE connected
→ fixtures loaded
→ odds/scores streaming in
→ signal generated automatically
→ click signal
→ inspect evidence
→ see verification/proof
```

---

## Product Name

Use:

```txt
LineScope
```

Tagline:

```txt
Autonomous World Cup odds intelligence powered by TxLINE.
```

Short description:

```txt
LineScope ingests live TxLINE odds and score feeds, detects market movement, correlates signals with match events, and produces an auditable signal trail.
```

---

## Required Tech Direction

Use the existing project stack if already present. Otherwise use:

```txt
Next.js
TypeScript
Tailwind CSS
lucide-react
PostgreSQL / Supabase
Prisma or Drizzle
Node.js worker process
```

Frontend must be TypeScript-first and componentized.

Backend/worker must isolate TxLINE ingestion and signal detection from UI code.

---

## TxLINE Integration

Create a TxLINE client module.

Expected files:

```txt
src/lib/txline/client.ts
src/lib/txline/types.ts
src/lib/txline/fixtures.ts
src/lib/txline/odds-stream.ts
src/lib/txline/scores-stream.ts
```

Use environment variables:

```env
TXLINE_BASE_URL=
TXLINE_AUTH_TOKEN=
TXLINE_API_TOKEN=
TXLINE_ACCESS_MODE=guest
```

Support these endpoints/configurations:

```txt
POST /auth/guest/start
POST /api/token/activate
GET /api/fixtures/snapshot
GET /api/odds/stream
GET /api/scores/stream
GET /api/odds/snapshot/{fixtureId}
GET /api/scores/snapshot/{fixtureId}
GET /api/odds/updates/{epochDay}/{hourOfDay}/{interval}
GET /api/scores/updates/{epochDay}/{hourOfDay}/{interval}
```

If live credentials are missing, implement a mock/replay fallback that uses local sample JSON fixtures and events.

The UI must clearly show whether it is running in:

```txt
Live Mode
Replay Mode
Mock Mode
```

Do not fake live mode. If using sample data, label it as replay/mock.

---

## MVP Features

### 1. Command Center Dashboard

Route:

```txt
/
```

or:

```txt
/dashboard
```

The dashboard must include:

* TxLINE connection status
* Current mode: Live / Replay / Mock
* Fixtures loaded
* Odds events processed
* Score events processed
* Signals generated
* Verified signals
* Last update timestamp

Layout must be a three-column operator console:

```txt
┌──────────────────────────────────────────────────────────────┐
│ Top Navigation / Status Bar                                  │
├──────────────────────────────────────────────────────────────┤
│ Compact Metrics Row                                          │
├───────────────┬───────────────────────────────┬──────────────┤
│ Match Rail    │ Match Intelligence             │ Signal Rail  │
└───────────────┴───────────────────────────────┴──────────────┘
```

---

### 2. Match Rail

Component:

```txt
components/match-rail.tsx
```

Each match row should show:

* Teams
* Current state: Live / Upcoming / Final / Replay
* Score if available
* Last update time
* Small icon/status dot

Example:

```txt
FRA vs BRA
In Play · 1-1 · 8s ago
```

Use `lucide-react` icons.

Suggested icons:

```txt
Activity
Clock3
CheckCircle2
Circle
TriangleAlert
Swords
```

---

### 3. Match Intelligence Panel

Component:

```txt
components/match-intelligence.tsx
```

Must show:

* Selected match title
* Score
* Game state
* Last TxLINE update
* Consensus probability panel
* Odds movement chart or structured movement table
* Score timeline
* Bookmaker consensus table

If charting is not available yet, use a clean table first. Functionality beats decoration.

Consensus probability example:

```txt
France     44.2%
Draw       29.1%
Brazil     26.7%
```

Bookmaker table columns:

```txt
Bookmaker
Market
Selection
Odds
Implied Probability
Delta vs Consensus
Last Update
```

---

### 4. Signal Engine

Create deterministic signal logic.

Expected files:

```txt
src/lib/signals/types.ts
src/lib/signals/engine.ts
src/lib/signals/rules/sharp-movement.ts
src/lib/signals/rules/bookmaker-divergence.ts
src/lib/signals/rules/score-reaction.ts
src/lib/signals/rules/data-health.ts
```

Implement four signal types only.

#### Signal Type 1: Sharp Movement

Detect when consensus implied probability changes significantly within a short time window.

Basic rule:

```txt
If absolute probability delta >= 5% within 120 seconds:
  create SHARP_MOVEMENT signal
```

Signal summary example:

```txt
France win probability moved +9.4% in 84 seconds.
```

#### Signal Type 2: Bookmaker Divergence

Detect when one bookmaker differs significantly from consensus.

Basic rule:

```txt
If bookmaker implied probability differs from consensus by >= 8%:
  create BOOKMAKER_DIVERGENCE signal
```

Signal summary example:

```txt
Bookmaker A is 8.7% away from market consensus.
```

#### Signal Type 3: Score Reaction

Detect odds movement after a score event.

Basic rule:

```txt
When a score event is detected:
  watch odds movement for the next 120 seconds
  summarize probability shift
```

Signal summary example:

```txt
Goal detected. Market moved 14.1% toward France within 2 minutes.
```

#### Signal Type 4: Data Health Alert

Detect stale or missing updates.

Basic rule:

```txt
If a live bookmaker/fixture has no update for >= 180 seconds:
  create DATA_HEALTH signal
```

Signal summary example:

```txt
Bookmaker B has not updated for 4 minutes while fixture is live.
```

---

## Signal Object Shape

Use this shape consistently:

```ts
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
```

---

## Signal Feed

Component:

```txt
components/signal-feed.tsx
```

Right-side rail.

Signal cards must be compact, icon-led, and evidence-focused.

Example card:

```txt
[Zap] HIGH · Sharp Movement
France probability moved +9.4% in 84s.

4 bookmakers · 6 updates · Verified
```

Use icons:

```txt
Zap                 Sharp Movement
TriangleAlert       Bookmaker Divergence
Goal                Score Reaction
ServerCog           Data Health
ShieldCheck         Verified
FileSearch          Evidence
Fingerprint         Proof / Hash
```

---

## Signal Detail Drawer

Component:

```txt
components/signal-drawer.tsx
```

When a user clicks a signal, open a right-side drawer.

Drawer must show:

```txt
Signal type
Severity
Confidence
Summary
Fixture
Detected time
Evidence
TxLINE message IDs
Signal hash
Solana devnet signature if available
Verification status
```

Drawer example:

```txt
Sharp Movement
High severity · Verified

Summary
France moved from 38.4% to 47.8% in 84 seconds.

Evidence
6 odds updates
4 bookmakers
1 linked score event
TxLINE message IDs

Verification
Signal Hash: 0x...
Solana Signature: ...
```

Use mono font for IDs, hashes, and timestamps.

---

## Replay Mode

Replay Mode is mandatory for the hackathon demo.

Route:

```txt
/replay
```

or make it part of the dashboard.

Replay controls:

```txt
Fixture selector
Speed: 1x / 5x / 20x
Start
Pause
Reset
```

Replay mode must:

1. Load historical or mock odds/score events.
2. Feed them through the same signal engine.
3. Update the same dashboard counters.
4. Generate real signal cards from replayed data.
5. Make it obvious that the same logic runs in live and replay mode.

Add this banner:

```txt
Replay Mode
Reconstructing TxLINE odds and score updates. The same autonomous signal engine is running on replayed data.
```

---

## UI/UX Requirements

The UI must not look like generic AI SaaS.

### Hard Rules

Do not use:

```txt
Gradients
Glassmorphism
Neon glow
AI orb graphics
Huge empty hero sections
3D illustrations
Over-rounded cards
Fake chat assistant UI
Betting CTA copy
```

Use:

```txt
Flat dark surfaces
Sharp borders
Compact spacing
Icon-heavy controls
Tables
Drawers
Tabs
Badges
Mono IDs
Real data density
```

### Design Tokens

Use these colors:

```txt
Background:      #080A0D
Surface:         #0D1117
Surface 2:       #111827
Border:          #1F2937
Text primary:    #F9FAFB
Text secondary:  #9CA3AF
Text muted:      #6B7280
Success:         #22C55E
Warning:         #F59E0B
Danger:          #EF4444
Info:            #38BDF8
```

No gradients.

### Typography

Use:

```txt
Sans: Inter or Geist Sans
Mono: JetBrains Mono or Geist Mono
```

Suggested sizes:

```txt
Page title: 24px
Section title: 14px
Body: 13px / 14px
Metadata: 12px
Table text: 12px
Hash/IDs: 11px mono
```

---

## Icon Requirement

Install:

```bash
npm install lucide-react
```

Use icons throughout the dashboard.

Recommended icon map:

```ts
import {
  Activity,
  RadioTower,
  CalendarDays,
  LineChart,
  Zap,
  ShieldCheck,
  TriangleAlert,
  ServerCog,
  Fingerprint,
  FileSearch,
  Clock3,
  Gauge,
  Building2,
  RefreshCcw,
  Swords,
  CheckCircle2,
  Circle,
  Goal,
} from "lucide-react";
```

Icons should support comprehension, not decoration.

---

## Data Models

If using Prisma, create models equivalent to:

```prisma
model Fixture {
  id              String   @id
  participant1    String?
  participant2    String?
  competitionId   String?
  startTime       DateTime?
  status          String?
  raw             Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model OddsEvent {
  id               String   @id @default(cuid())
  fixtureId        String
  messageId        String?
  timestamp        DateTime?
  bookmaker        String?
  bookmakerId      String?
  market           String?
  selection        String?
  odds             Float?
  impliedProb      Float?
  inRunning        Boolean?
  gameState        String?
  raw              Json
  createdAt        DateTime @default(now())
}

model ScoreEvent {
  id          String   @id @default(cuid())
  fixtureId   String
  sequence    Int?
  timestamp   DateTime?
  action      String?
  score       Json?
  gameState   String?
  raw         Json
  createdAt   DateTime @default(now())
}

model Signal {
  id               String   @id @default(cuid())
  fixtureId         String
  type              String
  severity          String
  confidence        Float
  summary           String
  status            String
  metrics           Json
  evidence          Json
  signalHash        String?
  solanaSignature   String?
  createdAt         DateTime @default(now())
}
```

Adapt to Drizzle/Supabase if the repo already uses it.

---

## Verification / Proof

For MVP, implement at least local signal hashing.

Expected file:

```txt
src/lib/verification/hash-signal.ts
```

Function:

```ts
export function hashSignal(signal: Signal): string {
  // Stable JSON stringify selected fields.
  // SHA-256 hash.
}
```

Hash fields:

```txt
fixtureId
type
summary
metrics
evidence
createdAt
```

If time allows, add Solana devnet memo.

Expected file:

```txt
src/lib/verification/solana-memo.ts
```

Environment variables:

```env
SOLANA_RPC_URL=
SOLANA_PRIVATE_KEY=
```

If Solana is not configured, still show:

```txt
Verification: Local hash generated
```

Do not block the MVP on Solana integration.

---

## API Routes

Create these API routes if using Next.js API/app routes:

```txt
GET /api/fixtures
GET /api/events/odds
GET /api/events/scores
GET /api/signals
GET /api/signals/:id
POST /api/replay/start
POST /api/replay/pause
POST /api/replay/reset
GET /api/system/status
```

If using a separate backend, expose equivalent endpoints.

---

## System Status

Add a small status section/page:

```txt
/system
```

Show:

```txt
TxLINE connection status
Odds stream status
Scores stream status
Database status
Signal engine status
Replay engine status
Last processed event
Last generated signal
```

This helps judging and production-readiness.

---

## Mock / Sample Data

If TxLINE credentials are unavailable during development, create sample files:

```txt
data/sample-fixtures.json
data/sample-odds-events.json
data/sample-score-events.json
```

Sample data must be realistic enough to trigger:

```txt
Sharp Movement
Bookmaker Divergence
Score Reaction
Data Health Alert
```

Add a clear UI label:

```txt
Mock Mode
Using local sample events.
```

---

## Landing Page

Keep it minimal.

Sections:

1. Hero
2. Four feature blocks
3. CTA to Command Center

Hero copy:

```txt
LineScope

Autonomous World Cup odds intelligence powered by TxLINE.

Monitor live odds and scores, detect market movement, and verify every signal with an auditable proof trail.
```

Feature blocks:

```txt
Live TxLINE Ingestion
Autonomous Signal Engine
Replayable Match Intelligence
Verifiable Signal Trail
```

Do not overbuild marketing pages.

---

## Copy Rules

Use professional analytics language.

Do not write:

```txt
Betting opportunity found
Place bet
Guaranteed edge
This team will win
Make money
```

Use:

```txt
Sharp market movement detected
Consensus probability shifted
View evidence
Signal verified
Market divergence detected
Score reaction observed
```

---

## Build Order

Follow this order exactly:

### Phase 1 — UI skeleton

Build:

```txt
App shell
Top status bar
Metrics row
Match rail
Match intelligence placeholder
Signal feed placeholder
Signal drawer
```

Use mock data first.

### Phase 2 — Mock replay

Build:

```txt
Sample data
Replay controls
Event counters
Signal generation from mock data
Signal drawer evidence
```

This gives a working demo quickly.

### Phase 3 — TxLINE ingestion

Build:

```txt
TxLINE client
Fixtures fetcher
Odds stream listener
Scores stream listener
Raw event persistence
```

### Phase 4 — Real signal engine

Build:

```txt
Probability normalization
Consensus calculation
Sharp movement rule
Divergence rule
Score reaction rule
Data health rule
```

### Phase 5 — Verification

Build:

```txt
Stable signal hash
Verification badge
Optional Solana devnet memo
```

### Phase 6 — Polish

Build:

```txt
README
Technical docs
Demo script
Deployment config
Error states
Loading states
```

---

## Acceptance Criteria

The MVP is acceptable when:

```txt
Dashboard loads without errors.
UI uses dark flat operator-console style.
No gradients or AI-slop visuals are present.
At least 3 fixtures are visible.
Replay mode works.
Events stream into the dashboard during replay.
At least 4 signal types can be generated.
Clicking a signal opens a drawer.
Drawer shows evidence and hash.
Counters update during replay.
README explains TxLINE endpoints used.
Project can be deployed and tested by judges.
```

---

## README Requirements

Update `README.md` with:

```txt
Project name
Short description
Core features
Architecture
TxLINE endpoints used
How to run locally
Environment variables
Replay mode explanation
Signal logic explanation
Verification explanation
Known limitations
Hackathon feedback section
```

Include this section:

```md
## TxLINE Endpoints Used

- POST /auth/guest/start
- POST /api/token/activate
- GET /api/fixtures/snapshot
- GET /api/odds/stream
- GET /api/scores/stream
- GET /api/odds/snapshot/{fixtureId}
- GET /api/scores/snapshot/{fixtureId}
- GET /api/odds/updates/{epochDay}/{hourOfDay}/{interval}
- GET /api/scores/updates/{epochDay}/{hourOfDay}/{interval}
```

---

## Demo Script Target

The demo video should show:

```txt
1. Open LineScope.
2. Show TxLINE / replay mode status.
3. Show fixtures loaded.
4. Start replay.
5. Watch odds and score events enter.
6. Show autonomous signals appearing.
7. Click Sharp Movement signal.
8. Show evidence: odds updates, bookmakers, TxLINE message IDs.
9. Show signal hash / verification.
10. Explain production use case.
```

Keep the demo under 5 minutes.

---

## Final Instruction

Prioritize a working, credible, demoable product over visual complexity.

The product should look like a serious real-time data tool, not a startup landing page and not an AI chatbot.

Build the smallest complete version of:

```txt
TxLINE ingestion
+ replay
+ autonomous signal engine
+ operator dashboard
+ signal evidence drawer
+ verification hash
```

That is the winning MVP.
