import { useCallback } from 'react'
import { useMap } from '../contexts/MapContext'
import { isWalkable as checkWalkable } from '../utils/collision'
import { Map } from './Map'
import { Player } from './Player'
import { Zombies } from './Zombies'
import { usePlayerMovement } from '../hooks/usePlayerMovement'

export function Game() {
  const { map } = useMap()
  const isWalkable = useCallback(
    (lat: number, lng: number) => checkWalkable(map, lat, lng),
    [map]
  )
  const { position, keys } = usePlayerMovement(10.799, 106.7, { isWalkable })

  return (
    <>
      <Map center={position} />
      <Player keys={keys} />
      <Zombies playerPosition={position} isWalkable={isWalkable} />
    </>
  )
}
