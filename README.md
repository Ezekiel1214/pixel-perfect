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

App runs on `http://localhost:8080` by default.

### Dev proxy for Supabase Edge Functions

In development, this repo proxies `http://localhost:8080/functions/v1/*` to `${VITE_SUPABASE_URL}/functions/v1/*` so browser requests avoid CORS issues.

To use the proxy, call edge functions with a relative URL in development (for example `fetch("/functions/v1/chat")`) instead of calling `https://<project-ref>.supabase.co/functions/v1/...` directly.

In production, call the fully qualified Supabase function URL (`https://<project-ref>.supabase.co/functions/v1/...`) so CORS is handled by your deployed backend/origin setup.

Quick verification:

```bash
curl -i \
  -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_PUBLISHABLE_KEY" \
  http://localhost:8080/functions/v1/chat
```

If a function expects JSON POST:

```bash
curl -i \
  -H "Content-Type: application/json" \
  -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_PUBLISHABLE_KEY" \
  -d '{"ping":true}' \
  http://localhost:8080/functions/v1/chat
```

### Optional: clear Browserslist warning

If you see `caniuse-lite is outdated` during local builds, run:

```bash
npx update-browserslist-db@latest
```

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
