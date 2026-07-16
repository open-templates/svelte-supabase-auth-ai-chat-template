---
type: Feature
title: Layout
description: App shell with sidebar chat layout on Chat route.
tags: [ui, architecture]
timestamp: 2026-07-15T00:00:00Z
---

# Hierarchy

```text
App.svelte
└── AppShell
    ├── AppHeader
    └── Router (svelte-spa-router)
        └── Home.svelte (/) | Chat.svelte (/chat) | auth routes
```

`Chat.svelte` uses full-bleed layout (`chat-full-bleed`) with `ChatSidebar` + message column. `AppShell` drops max-width padding on `/chat`.
