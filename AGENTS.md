# Agent Quick Reference

Dự án **Resident Evil** - bullet hell game trên Mapbox.

## Tham khảo nhanh

- **Rules**: `.cursor/rules/` - conventions, patterns
- **Skills**: `.cursor/skills/` - game dev, architecture

## Stack

- App: React + Vite + Mapbox + PixiJS/Phaser
- Backend: Supabase (Auth, PostgreSQL, Realtime)
- Deploy: Vercel

## Docker

**Luôn dùng Docker** - không chạy npm/node trên host. Dev: `docker compose --profile dev up` | Prod: `docker compose --profile prod up`

## Khi làm việc với

| Context | Xem |
|---------|-----|
| Docker, npm, dev commands | `.cursor/rules/docker-workflow.mdc` |
| React, Mapbox, game | `.cursor/rules/frontend-react.mdc` |
| Game mechanics | `.cursor/rules/game-mechanics.mdc` |
| Mapbox, collision, weapons | `.cursor/skills/resident-evil-game/` |
| Architecture, deploy | `.cursor/skills/project-architecture/` |
