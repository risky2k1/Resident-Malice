# Resident Evil - Bullet Hell Game

Single-player bullet hell trên Mapbox. WASD di chuyển, chuột bắn, zombie spawn xung quanh.

## Stack

- React + Vite + TypeScript
- Mapbox GL, PixiJS/Phaser (game)
- Supabase (Auth, PostgreSQL, Realtime)
- Deploy: Vercel

## Chạy

```bash
# Dev (Docker)
docker compose --profile dev up

# Prod (Docker)
docker compose --profile prod up
```

## Env

- `VITE_MAPBOX_TOKEN` - Mapbox token
- `VITE_SUPABASE_URL` - Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
