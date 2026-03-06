import { useMemo } from 'react'
import type { Direction } from '../assets/main_char/rotations'
import { ROTATION_SPRITES } from '../assets/main_char/rotations'

type Keys = { w: boolean; a: boolean; s: boolean; d: boolean }

function getDirection(keys: Keys): Direction {
  const hasNorth = keys.w && !keys.s
  const hasSouth = keys.s && !keys.w
  const hasWest = keys.a && !keys.d
  const hasEast = keys.d && !keys.a

  if (hasNorth && hasWest) return 'north-west'
  if (hasNorth && hasEast) return 'north-east'
  if (hasSouth && hasWest) return 'south-west'
  if (hasSouth && hasEast) return 'south-east'
  if (hasNorth) return 'north'
  if (hasSouth) return 'south'
  if (hasWest) return 'west'
  if (hasEast) return 'east'
  return 'south'
}

type PlayerProps = {
  keys: Keys
}

export function Player({ keys }: PlayerProps) {
  const direction = useMemo(() => getDirection(keys), [keys.w, keys.a, keys.s, keys.d])
  const spriteSrc = ROTATION_SPRITES[direction]

  return (
    <div className="player">
      <img src={spriteSrc} alt="Player" className="player-sprite" />
    </div>
  )
}
