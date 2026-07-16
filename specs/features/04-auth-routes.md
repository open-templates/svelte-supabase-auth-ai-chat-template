---
type: Feature
title: Auth routes
description: Guest and authenticated routes including /chat.
tags: [auth, routing]
timestamp: 2026-07-15T00:00:00Z
---

# Routes

| Route | Guard | Component |
|-------|-------|-----------|
| `/login` | Guest | `Login.svelte` |
| `/signup` | Guest | `Signup.svelte` |
| `/recover-password` | Guest | `RecoverPassword.svelte` |
| `/reset-password` | Auth | `ResetPassword.svelte` |
| `/` | Auth | `Home.svelte` — `GET /me` debug |
| `/chat` | Auth | `Chat.svelte` — `POST /chat` |

Guests hitting `/` or `/chat` redirect to `/login` (via `svelte-spa-router` conditions in `src/routes.ts`).
