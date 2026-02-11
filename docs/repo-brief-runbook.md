# Pixel Perfect Repository Brief + Runbook

## 1) Executive brief

`pixel-perfect` is a full-stack web app centered on AI-assisted website generation/editing.

At runtime, it combines:

- **React SPA frontend** (Vite + TypeScript + Tailwind + shadcn UI)
- **Supabase backend services** (Auth, Postgres, Storage, Edge Functions)
- **Lovable AI gateway integration** via `supabase/functions/chat`

Core user journeys:

1. Discover product on `/` (landing pages).
2. Authenticate and manage projects on `/dashboard`.
3. Build/edit in `/project/:id` using chat + preview + code views.
4. Publish and share on `/p/:slug`.

---

## 2) System map and repository structure

## Top-level directories

| Path | Purpose |
|---|---|
| `src/` | Frontend application code. |
| `supabase/` | DB migrations, edge function code, Supabase config. |
| `.github/workflows/` | CI workflow definitions. |
| `public/` | Static assets served by Vite. |

## Frontend organization (`src/`)

| Path | Purpose |
|---|---|
| `pages/` | Route-level screens (`Index`, `Dashboard`, `ProjectEditor`, `PublicProject`, auth flows). |
| `components/landing/` | Marketing/landing sections. |
| `components/dashboard/` | Dashboard shell and project grid. |
| `components/editor/` | Editor/chat/publish/assets/version/team/analytics dialogs. |
| `hooks/` | Auth, editor state, content history, project loading/mutations. |
| `integrations/supabase/` | Supabase browser client and generated types. |
| `lib/` | Utilities and export helpers. |

## Backend/Supabase organization

| Path | Purpose |
|---|---|
| `supabase/migrations/*.sql` | Table definitions, indexes, RLS policies, helper functions. |
| `supabase/functions/chat/index.ts` | Edge Function proxying chat completion requests to Lovable AI gateway. |
| `supabase/config.toml` | Project function config (including `verify_jwt`). |

---

## 3) Local development runbook

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- Optional: Supabase CLI (for local function/database workflows)

## First-time setup

```bash
npm install
cp .env.example .env.local  # if you maintain an example file
```

If `.env.example` does not exist, create `.env.local` manually:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

## Run the frontend

```bash
npm run dev
```

Default URL: `http://localhost:5173`

## Build, lint, and preview

```bash
npm run lint
npm run build
npm run preview
```

## Optional local Supabase workflow

```bash
supabase start
supabase functions serve chat
```

If using local Supabase, ensure frontend env vars point to local project credentials.

---

## 4) Configuration: Supabase + Lovable

## Frontend env vars

Consumed by `src/integrations/supabase/client.ts`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Edge Function secret

`supabase/functions/chat/index.ts` requires:

- `LOVABLE_API_KEY`

Set in Supabase secrets:

```bash
supabase secrets set LOVABLE_API_KEY=<value> --project-ref <project-ref>
```

## Deployment note

Supabase Edge Function deploy command:

```bash
supabase functions deploy chat --project-ref <project-ref>
```

---

## 5) Data model and access-control summary

## Primary tables

- `public.projects`: project metadata + AI content + publish fields + custom CSS/JS.
- `public.project_versions`: version history snapshots.
- `public.project_members`: project collaborators and role enum.
- `public.project_analytics`: basic per-project view counters.

## RLS model (high-level)

- Owner-scoped access for core project CRUD.
- Helper functions `has_project_access` / `can_edit_project` used for versions + collaboration gates.
- Public-read policy for published projects (`is_public = true`).

## Storage

- Bucket `project-assets` exists.
- Policies allow owner-folder scoped writes/deletes.
- Public read policy exists for all bucket objects (verify this business decision).

---

## 6) Production hardening plan (prioritized)

## P0 — critical before broad production exposure

1. **Enable JWT verification for chat function**
   - Current config: `[functions.chat] verify_jwt = false`.
   - Action: set `verify_jwt = true` and validate auth claims in function handler.

2. **Replace wildcard CORS**
   - Current function uses `Access-Control-Allow-Origin: *`.
   - Action: allowlist explicit origins by environment (`dev/staging/prod`).

3. **Constrain analytics update writes**
   - Current `project_analytics` update policy allows unrestricted updates (`USING (true)` / `WITH CHECK (true)`).
   - Action: route increments through secured RPC or restrict update permissions to trusted contexts.

## P1 — high priority

4. **Sanitize/validate custom CSS/JS execution path**
   - Public viewer injects `custom_css` / `custom_js` into rendered content.
   - Action: add sanitization + content policies + optional feature flag for custom JS.

5. **Add abuse controls / throttling**
   - Protect chat function and auth endpoints from excessive request volume.

6. **Review public storage policy scope**
   - Evaluate splitting private and public assets into separate buckets.

## P2 — medium priority

7. **Fix CI workflow mismatch**
   - Current workflow invokes `npx webpack` although project builds with Vite.
   - Action: change CI to `npm ci && npm run lint && npm run build`.

8. **Observability + alerts**
   - Instrument edge-function failures, auth anomalies, and AI provider 402/429 spikes.

9. **Backup and incident SOPs**
   - Define backup cadence, restore runbook, migration rollback process, and ownership.

---

## 7) Operations checklists

## Daily developer checklist

1. Pull latest `main` and install deps if lockfile changed.
2. Confirm env vars are present.
3. Run `npm run dev` and verify key routes load.
4. Run `npm run build` before opening PR.

## Pre-release checklist

1. Run lint/build successfully (or document known pre-existing lint debt).
2. Confirm latest Supabase migrations are applied to target env.
3. Confirm `LOVABLE_API_KEY` exists in target env secrets.
4. Verify `chat` function JWT + CORS config for target environment.
5. Smoke test:
   - sign-in / sign-out
   - create/edit/save project
   - publish project
   - open `/p/:slug` public page

## Incident triage checklist

- **Auth failures:** validate Supabase URL/key, auth redirect URLs, and provider status.
- **Chat failures:** inspect edge-function logs, verify `LOVABLE_API_KEY`, inspect 402/429 rate.
- **Public rendering issues:** validate publish flags/slug, inspect injected custom CSS/JS, check content integrity.
- **Asset issues:** verify bucket policies and object paths (`<user-id>/...`).

---

## 8) 30-60-90 day implementation roadmap

## 0–30 days

- Complete all P0 hardening actions.
- Correct CI workflow to Vite-native commands.
- Add explicit `dev/staging/prod` configuration matrix document.

## 31–60 days

- Add smoke/E2E coverage for core journeys.
- Add structured logging + alert thresholds for function/auth errors.
- Add security review for custom script execution path.

## 61–90 days

- Introduce finer-grained analytics model and secured write pathways.
- Add operational SLOs and on-call expectations.
- Run production readiness review with rollback drill.

---

## 9) Ownership notes

To keep this runbook useful, update it whenever any of the following change:

- Authentication flow or redirect behavior
- Supabase policy/function configuration
- Deployment process
- Security controls (JWT/CORS/rate limits)
- CI pipeline commands or release policy
