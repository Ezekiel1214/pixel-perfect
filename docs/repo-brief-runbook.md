# Pixel Perfect Repository Brief + Runbook

## 1) What this repository is

`pixel-perfect` is a Vite + React + TypeScript web application for creating, editing, and publishing AI-generated web projects. The app has three major experiences:

- **Marketing/Landing** (`/`): product positioning and conversion pages.
- **Authenticated Dashboard** (`/dashboard`): project management for signed-in users.
- **Project Editor + Public Viewer** (`/project/:id`, `/p/:slug`): AI chat-driven editing with live preview and optional public publishing.

The frontend uses Supabase for authentication, database access, and storage. A Supabase Edge Function (`functions/chat`) proxies AI chat-completion requests to Lovable's AI gateway using a server-side API key.

---

## 2) Project structure

### Top-level layout

- `src/`: application source code (pages, hooks, components, data, integrations).
- `supabase/`: project-level Supabase config, SQL migrations, and Edge Functions.
- `.github/workflows/`: CI automation.
- `public/`: static assets.

### Frontend runtime architecture

- **Routing and providers** are composed in `src/App.tsx` with:
  - `HelmetProvider` for SEO/head tags.
  - `QueryClientProvider` for TanStack Query caching.
  - `AuthProvider` for Supabase auth state.
  - `BrowserRouter` route map.
- **Pages** under `src/pages/` split responsibilities:
  - `Index.tsx` (landing)
  - `Auth.tsx`, password recovery/update pages
  - `Dashboard.tsx`
  - `ProjectEditor.tsx`
  - `PublicProject.tsx`

### Feature modules

- `src/components/landing/`: marketing sections.
- `src/components/dashboard/`: workspace navigation and project listing.
- `src/components/editor/`: chat, preview, code, publish dialog, analytics dialog, team dialog, assets, etc.
- `src/hooks/`: auth/session logic, project data workflows, undo/redo history.
- `src/integrations/supabase/`: generated typings and the singleton client.

### Backend/Supabase layout

- `supabase/migrations/*.sql`: schema, indexes, and RLS policies.
- `supabase/functions/chat/index.ts`: AI gateway proxy function.
- `supabase/config.toml`: Supabase local config for functions.

---

## 3) How to run locally

### Prerequisites

- Node.js 18+ (LTS recommended).
- npm (bundled with Node).
- Optional for backend workflows: Supabase CLI.

### Install and run frontend

```bash
npm install
npm run dev
```

By default Vite serves locally at `http://localhost:5173`.

### Production build and preview

```bash
npm run build
npm run preview
```

### Quality checks

```bash
npm run lint
```

### Optional: local Supabase function workflow

If using local Supabase CLI development:

```bash
supabase start
supabase functions serve chat
```

Then point the frontend to your local Supabase project URL/keys.

---

## 4) Configuration and environment

### Frontend environment variables

Create `.env.local` (or `.env`) in the repo root:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-or-publishable-key>
```

These are read by `src/integrations/supabase/client.ts` when creating the browser client.

### Supabase Edge Function secret

`supabase/functions/chat/index.ts` expects:

- `LOVABLE_API_KEY` (server-side secret)

Set it in Supabase project secrets:

```bash
supabase secrets set LOVABLE_API_KEY=<value> --project-ref <project-ref>
```

### Lovable integration notes

- The default README flow assumes this repo is connected to a Lovable project.
- Deploy/publish can be initiated from Lovable UI once project linkage and environment values are valid.

---

## 5) Security posture and production hardening (prioritized)

Below are the highest-value hardening actions to execute before production rollout.

### P0 (Critical)

1. **Require JWT verification on the `chat` function**  
   `supabase/config.toml` currently sets `verify_jwt = false` for `functions.chat`, allowing unauthenticated access. Set this to `true` and enforce user auth/authorization checks in-function.

2. **Restrict CORS on the chat function**  
   `Access-Control-Allow-Origin` is currently `*`. Replace with an allowlist of trusted frontend origins per environment.

3. **Protect analytics update policy**  
   The `project_analytics` update policy currently allows `USING (true)` and `WITH CHECK (true)`, permitting broad writes. Restrict to controlled pathways (RPC/function with checks, owner/member permissions, or signed-token gate).

### P1 (High)

4. **Harden custom JS/CSS publication path**  
   Public projects inject `custom_css` and `custom_js` into rendered HTML. Add sanitization/validation and CSP strategy to reduce XSS risk for viewer contexts.

5. **Implement basic rate limiting / abuse controls**  
   Add throttling for chat requests and auth endpoints to reduce token abuse and brute-force behavior.

6. **Review storage bucket exposure**  
   `project-assets` is publicly readable by policy. Confirm this is intentional for all assets; otherwise split private vs public asset buckets.

### P2 (Medium)

7. **Replace/repair CI workflow**  
   Existing workflow runs `npx webpack` even though this repo is Vite-based. Switch CI to `npm run lint && npm run build`.

8. **Add observability and runbook alerts**  
   Capture function error rates, 429/402 responses, and auth anomalies; document paging/escalation thresholds.

9. **Document backup/recovery SOP**  
   Define migration rollback strategy, data backup cadence, and incident ownership.

---

## 6) Operations runbook

### Local development startup checklist

1. Install dependencies (`npm install`).
2. Configure `.env.local` with Supabase URL and publishable key.
3. Run `npm run dev`.
4. Verify auth flow (`/auth`), dashboard (`/dashboard`), and editor route (`/project/:id`).

### Release checklist

1. Run lint and production build.
2. Confirm Supabase migrations are applied in target env.
3. Confirm `LOVABLE_API_KEY` exists in secrets.
4. Confirm `functions.chat` JWT + CORS settings are production-safe.
5. Smoke-test publish flow and public slug route (`/p/:slug`).

### Incident quick triage

- **Auth failures**: validate Supabase URL/key envs, auth provider health, redirect URLs.
- **Chat failures**: inspect function logs, verify `LOVABLE_API_KEY`, check upstream 402/429 volume.
- **Public page issues**: verify `is_public=true`, slug uniqueness, and content/custom script integrity.

---

## 7) Suggested next steps

1. Execute P0 hardening items before external launch.
2. Update CI workflow to Vite-native checks.
3. Add environment-specific config docs (`dev/staging/prod` matrix).
4. Add lightweight smoke tests for key user journeys.
5. Maintain this runbook in-repo and require updates for major infra/auth changes.
