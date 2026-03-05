# Resident Evil - Technical Reference

## Mapbox

- **Zoom**: 18-20 for street level
- **Tilequery**: Check if point is inside building polygon
- **Vector tiles**: `mapbox://mapbox.mapbox-streets-v8` has building layer

## Coordinate Systems

- **WGS84** (lat/lng): Backend, persistence
- **Screen** (px): Mapbox `project()` / `unproject()`
- **World** (game units): Optional for PixiJS overlay

## API Endpoints (Planned)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /players/:id | Get player + last position |
| PATCH | /players/:id/position | Save position |
| GET | /weapons | List weapons |
| GET | /items | List item types |

## Environment

- `VITE_MAPBOX_TOKEN` - Mapbox access token
- `VITE_API_URL` - Backend base URL
