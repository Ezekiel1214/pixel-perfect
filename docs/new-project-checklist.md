# Lessons Applied → New Project Checklist

*(Derived directly from the audit of the old project)*

This is the **non-negotiable checklist** for the **new agent-swarm project** so you don’t repeat the same limitations.

## A. Cost & Abuse Are First-Class (Not Afterthoughts)

- [ ] **AI spend ledger exists from day one**
  - Per request: provider, model, tokens, cost
  - Stored server-side (Postgres)
- [ ] **Budget thresholds**
  - User-level
  - Project-level
  - System-level
- [ ] **Alerts**
  - 402 / 429 spike
  - Cost anomaly detection
- [ ] **Hard cutoffs**
  - Requests blocked when budget exceeded

> Lesson: Reactive handling is not enough.

## B. Rate Limiting Must Be Distributed

- [ ] No in-memory limiters
- [ ] Shared store (Redis / Supabase KV / Upstash)
- [ ] Keyed by:
  - user_id (JWT sub)
  - IP fallback
- [ ] Burst + sustained limits
- [ ] Separate limits per route (AI > editor > public)

> Lesson: Edge scaling breaks local state.

## C. Collaboration Is Event-Based, Not Blob-Based

- [ ] No full-document overwrites
- [ ] All edits become **events**
- [ ] Event log is append-only
- [ ] Deterministic replay from events
- [ ] Version vector / clock for conflict detection

> Lesson: Last-write-wins does not scale past small teams.

## D. Undo / Replay Is Shared State

- [ ] Undo/redo operates on events, not snapshots
- [ ] Shared across collaborators
- [ ] Time-travel uses the same event log
- [ ] “Playback” is just replay at variable speed

> Lesson: Local history ≠ collaboration history.

## E. AI Is a Proposer, Never a Mutator

- [ ] Agents **cannot** write to state directly
- [ ] All AI output passes:
  - schema validation
  - security validation
  - collaboration safety check
- [ ] Only the **mutation layer** commits changes

> Lesson: This preserves safety and predictability.

## F. Secrets & Env Hygiene

- [ ] `.env` never tracked
- [ ] `.env.example` only
- [ ] Explicit server/client env boundaries
- [ ] Automated secret scanning in CI

> Lesson: Small sloppiness compounds later.

## G. Observability Is Mandatory

- [ ] Error tracking (Sentry or equivalent)
- [ ] Health checks
- [ ] AI latency + failure dashboards
- [ ] Collaboration conflict metrics

> Lesson: You can’t debug what you can’t see.
