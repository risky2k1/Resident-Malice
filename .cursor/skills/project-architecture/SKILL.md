---
name: project-architecture
description: Explains Resident Evil project architecture, folder structure, and deployment. Use when adding new features, configuring Docker, or deploying. Covers NestJS + React + Supabase + Redis + Mapbox.
---

# Project Architecture

## Structure

```
resident-evil/
├── backend/          # NestJS API
├── frontend/         # React + Mapbox + game
├── docker-compose.yml
└── .cursor/          # Rules, skills
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| backend | 3000 | NestJS API |
| frontend | 5173→80 | React app (Vite) |

## Deployment

- **Frontend**: Vercel (static/SSR)
- **Backend**: Railway, Render, or Fly.io (NestJS needs persistent process)
- **DB**: Supabase (PostgreSQL)
- **Redis**: Upstash or Redis Cloud (serverless-friendly)

## Adding Features

1. Backend: New module → controller → service → DTO
2. Frontend: Component + hooks, call API via fetch/axios
3. Game logic: Prefer client-side for real-time; backend for persistence
