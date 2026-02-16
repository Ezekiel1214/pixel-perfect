# AIWebBuilder Pro v2.2.1 — Frozen Reference

## Status
🚫 **FROZEN — NO FURTHER DEVELOPMENT**

This repository represents **AIWebBuilder Pro v2.2.1** as of December 2025.
It is retained as a **golden reference** and **safety backup**.

A new project is being built elsewhere with a different architectural model.

---

## Allowed Work
Only the following are permitted:
- Audit and inspection
- Security verification
- Documentation updates
- Emergency hotfixes (explicit approval required)

---

## Explicitly Out of Scope
❌ Rebuilds or re-architecture  
❌ Agent swarm implementation  
❌ CRDT or replay systems  
❌ Major refactors  
❌ Build system changes  
❌ API contract changes  

If a task would violate this list: **STOP**.

---

## Current Architecture (Snapshot)
- Frontend: React 19 + Vite + TypeScript
- Backend: Supabase (Auth, Postgres, RLS, Realtime)
- AI: Multi-provider, server-side only
- Collaboration: Realtime sync (non-CRDT)
- Billing: Stripe
- CI/CD: GitHub Actions + Vercel

---

## Known Limitations (Accepted)
- No distributed rate limiting
- No AI cost ledger / alerts
- Collaboration is last-write-wins
- Undo/redo is local-only
- No timelapse replay

These are **intentional tradeoffs** for this version.

---

## Security Rules (Non-Negotiable)
- No backend logic in frontend
- No browser-side AI calls
- RLS must never be weakened
- JWT verification stays enabled
- Secrets remain server-side
- CORS is strict allowlist only

---

## Branching & Tags
- This repo should remain on its frozen tag/branch.
- Any emergency fix must be isolated, minimal, and documented.

---

## Contact
For questions or emergency fixes, contact the project owner.

This file exists to prevent accidental drift or partial rebuilds.
