import { useMap } from '../contexts/MapContext'
import type { Bullet } from '../hooks/usePlayerShooting'

type BulletsProps = {
  bullets: Bullet[]
}

export function Bullets({ bullets }: BulletsProps) {
  const { map } = useMap()

  if (!map) return null

  return (
    <>
      {bullets.map((bullet) => {
        const point = map.project([bullet.lng, bullet.lat])
        return (
          <div
            key={bullet.id}
            className="bullet"
            style={{
              left: point.x,
              top: point.y,
            }}
          />
        )
      })}
    </>
  )
}
