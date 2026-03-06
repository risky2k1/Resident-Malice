import type { Map as MapboxMap } from 'mapbox-gl'

const BUILDING_LAYER_ID = '3d-buildings'

/**
 * Check if (lat, lng) is inside a building footprint.
 * Uses map.queryRenderedFeatures on the 3d-buildings layer.
 * Returns true if walkable (not in building), false if blocked.
 */
export function isWalkable(
  map: MapboxMap | null,
  lat: number,
  lng: number
): boolean {
  if (!map) return true
  try {
    const point = map.project([lng, lat])
    // Small bbox (3px) for more reliable hit detection
    const bbox: [[number, number], [number, number]] = [
      [point.x - 2, point.y - 2],
      [point.x + 2, point.y + 2],
    ]
    const features = map.queryRenderedFeatures(bbox, {
      layers: [BUILDING_LAYER_ID],
    })
    return features.length === 0
  } catch {
    return true
  }
}
