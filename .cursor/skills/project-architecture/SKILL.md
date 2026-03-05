---
name: project-architecture
description: Explains Resident Evil project architecture, folder structure, and deployment. Use when adding new features, configuring Docker, or deploying. Covers React + Supabase + Mapbox.
---

# Project Architecture

## Structure

```
resident-evil/
├── src/              # React app source
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── Dockerfile
├── docker-compose.yml
└── .cursor/          # Rules, skills
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| app (prod) | 5173→80 | React app (nginx) |
| app-dev | 5173 | Vite dev server |

## Deployment

- **App**: Vercel (static/SPA)
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Edge Functions)

## Adding Features

1. Supabase: Add tables, RLS policies, Edge Functions if needed
2. Frontend: Component + hooks, call Supabase client
3. Game logic: Prefer client-side for real-time; Supabase for persistence
