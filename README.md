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

## Cấu hình Supabase

1. Copy `.env.example` → `.env`
2. Lấy credentials từ [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → API
3. Điền vào `.env`:
   - `VITE_SUPABASE_URL` - Project URL
   - `VITE_SUPABASE_ANON_KEY` - anon/public key

## Env

| Biến | Mô tả |
|------|-------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_MAPBOX_TOKEN` | Mapbox access token |
