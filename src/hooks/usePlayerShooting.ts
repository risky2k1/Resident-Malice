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

export type UsePlayerShootingOptions = {
  isWalkable?: (lat: number, lng: number) => boolean
  zombies?: { id: string; lat: number; lng: number; state: string }[]
  onZombieHit?: (zombieId: string) => void
}

const ZOMBIE_HIT_RADIUS = 0.000035

export function usePlayerShooting(
  playerPosition: { lat: number; lng: number },
  map: MapboxMap | null,
  options?: UsePlayerShootingOptions
) {
  const { isWalkable, zombies = [], onZombieHit } = options ?? {}
  const [bullets, setBullets] = useState<Bullet[]>([])
  const lastShotRef = useRef(0)
  const isHoldingRef = useRef(false)
  const mousePosRef = useRef({ x: 0, y: 0 })

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
      if (e.button !== 0) return
      isHoldingRef.current = true
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      shoot(e.clientX, e.clientY)
    }
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return
      isHoldingRef.current = false
    }
    const handleMouseLeave = () => {
      isHoldingRef.current = false
    }
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }
    const fireInterval = setInterval(() => {
      if (isHoldingRef.current) {
        shoot(mousePosRef.current.x, mousePosRef.current.y)
      }
    }, FIRE_RATE_MS)

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(fireInterval)
    }
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

            // Hit building
            if (isWalkable && !isWalkable(newLat, newLng)) return null

            // Hit zombie
            const aliveZombies = zombies.filter((z) => z.state === 'alive')
            for (const z of aliveZombies) {
              const d =
                (newLat - z.lat) ** 2 + (newLng - z.lng) ** 2
              if (d < ZOMBIE_HIT_RADIUS ** 2) {
                onZombieHit?.(z.id)
                return null
              }
            }

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
  }, [bullets.length, isWalkable, zombies, onZombieHit])

  return bullets
}
