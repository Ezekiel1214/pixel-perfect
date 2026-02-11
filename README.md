# Pixel Perfect

Pixel Perfect is a Vite + React + TypeScript project for AI-assisted website creation, editing, and publishing.

## Primary docs

- **Repository brief + runbook:** [`docs/repo-brief-runbook.md`](docs/repo-brief-runbook.md)

## Quick start

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173` by default.

## Required environment variables

Create `.env.local` in the repo root:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

## Build and validation

```bash
npm run lint
npm run build
npm run preview
```

## Lovable workflow (if this repo is linked)

1. Open the linked Lovable project.
2. Prompt or edit in Lovable.
3. Changes are committed back to this repository.

For complete architecture notes, Supabase function setup, release checklist, and security hardening priorities, use the runbook linked above.
