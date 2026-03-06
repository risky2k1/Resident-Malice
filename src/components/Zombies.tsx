import { useMap } from '../contexts/MapContext'
import { useZombies } from '../hooks/useZombies'
import { Zombie } from './Zombie'

type ZombiesProps = {
  playerPosition: { lat: number; lng: number }
}

export function Zombies({ playerPosition }: ZombiesProps) {
  const { map } = useMap()
  const zombies = useZombies(playerPosition)

  if (!map) return null

  return (
    <>
      {zombies.map((zombie) => {
        const point = map.project([zombie.lng, zombie.lat])
        return (
          <Zombie
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
