import { useEffect, useState, useCallback, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'

const BULLET_SPEED = 0.000008
const BULLET_MAX_DISTANCE = 0.0005
const FIRE_RATE_MS = 150

export type Bullet = {
  id: number
  lat: number
  lng: number
  startLat: number
  startLng: number
  dirLat: number
  dirLng: number
}

let nextId = 0

function getShootDirection(
  map: MapboxMap,
  mouseX: number,
  mouseY: number
): { dirLat: number; dirLng: number } {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const dx = mouseX - centerX
  const dy = mouseY - centerY
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const ndx = dx / len
  const ndy = dy / len

  const scale = 50
  const endX = centerX + ndx * scale
  const endY = centerY + ndy * scale

  const start = map.unproject([centerX, centerY])
  const end = map.unproject([endX, endY])

  const dirLng = end.lng - start.lng
  const dirLat = end.lat - start.lat
  const dLen = Math.sqrt(dirLat * dirLat + dirLng * dirLng) || 1e-10
  return { dirLat: dirLat / dLen, dirLng: dirLng / dLen }
}

export function usePlayerShooting(
  playerPosition: { lat: number; lng: number },
  map: MapboxMap | null
) {
  const [bullets, setBullets] = useState<Bullet[]>([])
  const lastShotRef = useRef(0)

  const shoot = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!map) return
      const now = Date.now()
      if (now - lastShotRef.current < FIRE_RATE_MS) return
      lastShotRef.current = now

      const { dirLat, dirLng } = getShootDirection(map, mouseX, mouseY)

      const bullet: Bullet = {
        id: nextId++,
        lat: playerPosition.lat,
        lng: playerPosition.lng,
        startLat: playerPosition.lat,
        startLng: playerPosition.lng,
        dirLat,
        dirLng,
      }
      setBullets((prev) => [...prev, bullet])
    },
    [map, playerPosition.lat, playerPosition.lng]
  )

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      shoot(e.clientX, e.clientY)
    }
    window.addEventListener('mousedown', handleMouseDown)
    return () => window.removeEventListener('mousedown', handleMouseDown)
  }, [shoot])

  useEffect(() => {
    if (bullets.length === 0) return

    let rafId: number
    const tick = () => {
      setBullets((prev) =>
        prev
          .map((b) => {
            const newLat = b.lat + b.dirLat * BULLET_SPEED
            const newLng = b.lng + b.dirLng * BULLET_SPEED
            const dist =
              Math.sqrt(
                (newLat - b.startLat) ** 2 + (newLng - b.startLng) ** 2
              )
            if (dist > BULLET_MAX_DISTANCE) return null
            return { ...b, lat: newLat, lng: newLng }
          })
          .filter((b): b is Bullet => b !== null)
      )
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [bullets.length])

  return bullets
}
