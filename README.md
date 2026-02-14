# AI Web Builder Pro

AI Web Builder Pro is a Vite + React + TypeScript project for AI-assisted website creation, editing, and publishing.

## Primary docs

- **Repository brief + runbook:** [`docs/repo-brief-runbook.md`](docs/repo-brief-runbook.md)

## Quick start

```bash
npm install
npm run dev
```

If you extracted the project from a ZIP on Windows (for example, under a path like `C:\Users\surface\Downloads\pixel-perfect-main\pixel-perfect`), open a terminal in that folder before running the commands above.

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

## Supabase Edge Function secrets

For `supabase/functions/chat`, configure:

```bash
supabase secrets set LOVABLE_API_KEY=<value> --project-ref <project-ref>
supabase secrets set ALLOWED_ORIGINS=https://your-app.com,https://staging.your-app.com --project-ref <project-ref>
```

The chat function is JWT-protected (`verify_jwt = true`) and expects authenticated bearer tokens.
If `ALLOWED_ORIGINS` does not include your exact frontend origin, chat calls will be rejected with `403 Origin not allowed`.

## Lovable workflow (if this repo is linked)

1. Open the linked Lovable project.
1. Prompt or edit in Lovable.
1. Changes are committed back to this repository.

For complete architecture notes, Supabase function setup, release checklist, and security hardening priorities, use the runbook linked above.
