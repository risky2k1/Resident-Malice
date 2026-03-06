import { useMap } from '../contexts/MapContext'
import type { Zombie } from '../hooks/useZombies'
import { Zombie as ZombieSprite } from './Zombie'

type ZombiesProps = {
  zombies: Zombie[]
}

export function Zombies({ zombies }: ZombiesProps) {
  const { map } = useMap()

  if (!map) return null

  return (
    <>
      {zombies.map((zombie) => {
        const point = map.project([zombie.lng, zombie.lat])
        return (
          <ZombieSprite
            key={zombie.id}
            zombie={zombie}
            x={point.x}
            y={point.y}
          />
        )
      })}
    </>
  )
}
