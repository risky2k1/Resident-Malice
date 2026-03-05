---
name: resident-evil-game
description: Guides development of the Resident Evil bullet hell game. Use when implementing Mapbox integration, collision detection, weapon/projectile systems, zombie spawn logic, or game loop. Covers React + Mapbox + PixiJS/Phaser patterns.
---

# Resident Evil Game Development

## Quick Reference

- **Map**: Mapbox GL, zoom 18-20
- **Movement**: WASD, no walk-through buildings
- **Shooting**: Mouse direction, object pooling for bullets
- **Save**: Every 5 min or shortcut → `{ lat, lng }` to backend

## Mapbox + Collision

1. Use Mapbox GL JS for map rendering
2. Building collision: Mapbox vector tiles (building layer) or Tilequery API
3. Convert screen coords ↔ lat/lng via `map.project()` / `map.unproject()`

## Performance (Bullet Hell)

- **Object pooling**: Reuse projectile instances, don't create/destroy per bullet
- **Spatial partitioning**: Quadtree or grid for collision checks
- **Render**: WebGL (PixiJS/Phaser) over Canvas for many entities

## Weapon Patterns

| Type | Pattern |
|------|---------|
| Pistol | Single shot, straight |
| Shotgun | Spread, multiple pellets |
| Burst | 3-5 shots in sequence |
| Homing | Track nearest enemy |

## Spawn Logic

- Spawn zombies in radius around player (e.g. 50-100m)
- Limit max zombies on screen (e.g. 20-50)
- Use `setInterval` or delta-time for spawn rate

## Additional Resources

- See [reference.md](reference.md) for Mapbox API details
- See `.cursor/rules/game-mechanics.mdc` for conventions
