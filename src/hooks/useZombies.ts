import { useCallback, useEffect, useState, useId } from 'react'
import type { Direction } from '../assets/zom_char'

const ZOMBIE_SPEED = 0.0000012
const SPAWN_RADIUS = 0.00015
const INITIAL_COUNT = 3
const LIFESPAN_MS = 5000

export type ZombieState = 'alive' | 'dying' | 'dead'

const DEATH_DURATION_MS = 700

export type Zombie = {
  id: string
  lat: number
  lng: number
  direction: Direction
  state: ZombieState
  spawnTime: number
  deathStartTime?: number
}

function getDirectionToward(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Direction {
  const dLat = to.lat - from.lat
  const dLng = to.lng - from.lng
  if (Math.abs(dLat) < 1e-10 && Math.abs(dLng) < 1e-10) return 'south'
  const angle = (Math.atan2(dLat, dLng) * 180) / Math.PI
  const normalized = ((angle + 360) % 360)
  const sectors: Direction[] = [
    'east',
    'north-east',
    'north',
    'north-west',
    'west',
    'south-west',
    'south',
    'south-east',
  ]
  const index = Math.round(normalized / 45) % 8
  return sectors[index]
}

function spawnZombieNear(
  center: { lat: number; lng: number },
  id: string
): Zombie {
  const angle = Math.random() * Math.PI * 2
  const r = SPAWN_RADIUS * (0.5 + Math.random() * 0.5)
  const lat = center.lat + Math.cos(angle) * r
  const lng = center.lng + Math.sin(angle) * r
  return {
    id,
    lat,
    lng,
    direction: 'south',
    state: 'alive',
    spawnTime: Date.now(),
  }
}

export type UseZombiesOptions = {
  isWalkable?: (lat: number, lng: number) => boolean
}

export function useZombies(
  playerPosition: { lat: number; lng: number },
  options?: UseZombiesOptions
) {
  const { isWalkable } = options ?? {}
  const baseId = useId()
  const [zombies, setZombies] = useState<Zombie[]>(() =>
    Array.from({ length: INITIAL_COUNT }, (_, i) =>
      spawnZombieNear(playerPosition, `${baseId}-${i}`)
    )
  )

  useEffect(() => {
    let rafId: number
    const tick = () => {
      const now = Date.now()
      setZombies((prev) =>
        prev
          .map((z) => {
            if (z.state === 'dead') return null

            // Die after 5s
            if (z.state === 'alive' && now - z.spawnTime > LIFESPAN_MS) {
              return { ...z, state: 'dying' as ZombieState, deathStartTime: now }
            }

            // Remove after death animation
            if (
              z.state === 'dying' &&
              z.deathStartTime &&
              now - z.deathStartTime > DEATH_DURATION_MS
            ) {
              return null
            }
            if (z.state === 'dying') return z

            // Move toward player
            const dLat = playerPosition.lat - z.lat
            const dLng = playerPosition.lng - z.lng
            const dist = Math.sqrt(dLat * dLat + dLng * dLng) || 1e-10
            const step = Math.min(ZOMBIE_SPEED, dist * 0.1)
            const newLat = z.lat + (dLat / dist) * step
            const newLng = z.lng + (dLng / dist) * step
            if (isWalkable && !isWalkable(newLat, newLng)) return z
            const direction = getDirectionToward(
              { lat: z.lat, lng: z.lng },
              playerPosition
            )

            return { ...z, lat: newLat, lng: newLng, direction }
          })
          .filter((z): z is Zombie => z !== null)
      )
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [playerPosition.lat, playerPosition.lng, isWalkable])

  const hitZombie = useCallback((id: string) => {
    setZombies((prev) =>
      prev.map((z) =>
        z.id === id && z.state === 'alive'
          ? { ...z, state: 'dying' as ZombieState, deathStartTime: Date.now() }
          : z
      )
    )
  }, [])

  return { zombies, hitZombie }
}
