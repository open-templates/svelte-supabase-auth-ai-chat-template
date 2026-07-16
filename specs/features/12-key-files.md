---
type: Reference
title: Key files
description: Source map for chat, auth, and API modules.
tags: [reference]
timestamp: 2026-07-15T00:00:00Z
---

| Path | Role |
|------|------|
| `src/routes/Home.svelte` | Authenticated home + `/me` debug |
| `src/routes/Chat.svelte` | Chat UI, thread state, message flow |
| `src/components/ChatMarkdown.svelte` | GFM renderer for assistant bubbles |
| `src/components/ChatSidebar.svelte` | Session thread list |
| `src/lib/chat-threads.ts` | `sessionStorage` persistence |
| `src/lib/chat.ts` | `POST /chat` client |
| `src/lib/api.ts` | `apiFetch` with JWT + refresh |
| `src/lib/auth.ts` | Supabase auth + `clearAllChatState` on sign out |
