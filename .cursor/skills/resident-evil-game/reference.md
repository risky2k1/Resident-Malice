# Resident Evil - Technical Reference

## Mapbox

- **Zoom**: 18-20 for street level
- **Tilequery**: Check if point is inside building polygon
- **Vector tiles**: `mapbox://mapbox.mapbox-streets-v8` has building layer

## Coordinate Systems

- **WGS84** (lat/lng): Supabase, persistence
- **Screen** (px): Mapbox `project()` / `unproject()`
- **World** (game units): Optional for PixiJS overlay

## Supabase

- **Auth**: `supabase.auth` - sign in, session
- **Tables**: `players` (position, inventory), `weapons`, `items`
- **RLS**: Enable Row Level Security for user-owned data

## Environment

- `VITE_MAPBOX_TOKEN` - Mapbox access token
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
