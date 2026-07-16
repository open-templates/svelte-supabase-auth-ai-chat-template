# svelte-supabase-auth-ai-chat-template — Agent Skills Index

Skills in `.agents/skills/` teach agents how this repository works and how to extend it safely.

## Project status (current template)

**Svelte 5 + Supabase Auth** SPA with **AI chat UI**, paired with **cf-hono-supabase-gemini-api-template**:

- **Auth:** Google OAuth + email/password (`src/lib/auth.ts`, `src/routes/`)
- **API calls:** `GET /health` (header), `GET /me` (home), `POST /chat` (chat) via `apiFetch`
- **Routes:** `/`, `/chat`, `/login`, `/signup`, `/recover-password`, `/reset-password`
- **Chat:** multi-turn threads in `sessionStorage`; assistant replies rendered with GFM markdown

Canonical OKF specs: [`index.md`](../../index.md) · OKF modules: [`.agents/skills/index.md`](index.md)

## OKF modules (local)

| Module | Use when |
|--------|----------|
| [api-fetch](modules/api-fetch.md) | `apiFetch` with Bearer token and 401 retry |
| [chat-page](modules/chat-page.md) | `Chat.svelte` send flow and UI state |
| [chat-threads](modules/chat-threads.md) | `sessionStorage` thread list and cleanup on sign-out |
| [chat-markdown](modules/chat-markdown.md) | `marked` + `DOMPurify` for assistant bubbles |

Shared concepts (synced): [shared/auth/](shared/auth/) · [shared/supabase/](shared/supabase/)

## Project layout

```
src/
├── lib/           # auth.ts, api.ts, chat.ts, chat-threads.ts, me.ts, health.ts
├── routes/        # Home.svelte, Chat.svelte, auth pages
├── components/    # ChatSidebar, ChatMarkdown, AppHeader, AppShell
index.md           # OKF bundle root (repo root)
specs/features/    # numbered features + log
.agents/skills/    # OKF modules
```

## Extension order

1. **Backend first** — add route in `cf-hono-supabase-gemini-api-template`, document in both `index.md` files
2. **Frontend API module** — `src/lib/<feature>.ts` using `apiFetch`
3. **Route + UI** — Svelte route in `src/routes/` and entry in `src/routes.ts`
4. **Update** `specs/features/`, `.agents/skills/modules/`, and this file when patterns change
