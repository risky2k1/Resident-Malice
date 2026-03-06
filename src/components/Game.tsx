import { useCallback } from 'react'
import { useMap } from '../contexts/MapContext'
import { isWalkable as checkWalkable } from '../utils/collision'
import { Map } from './Map'
import { Player } from './Player'
import { Zombies } from './Zombies'
import { Bullets } from './Bullets'
import { usePlayerMovement } from '../hooks/usePlayerMovement'
import { usePlayerShooting } from '../hooks/usePlayerShooting'
import { useZombies } from '../hooks/useZombies'

export function Game() {
  const { map } = useMap()
  const isWalkable = useCallback(
    (lat: number, lng: number) => checkWalkable(map, lat, lng),
    [map]
  )
  const { position, keys } = usePlayerMovement(10.799, 106.7, { isWalkable })
  const { zombies, hitZombie } = useZombies(position, { isWalkable })
  const bullets = usePlayerShooting(position, map, {
    isWalkable,
    zombies,
    onZombieHit: hitZombie,
  })

  return (
    <>
      <Map center={position} />
      <Player keys={keys} />
      <Zombies zombies={zombies} />
      <Bullets bullets={bullets} />
    </>
  )
}
