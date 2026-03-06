import { useEffect, useState } from 'react'
import { WALK_FRAMES, DEATH_FRAMES } from '../assets/zom_char'
import type { Zombie as ZombieType } from '../hooks/useZombies'

const WALK_FRAME_MS = 100
const DEATH_FRAME_MS = 100

type ZombieProps = {
  zombie: ZombieType
  x: number
  y: number
}

export function Zombie({ zombie, x, y }: ZombieProps) {
  const [walkFrame, setWalkFrame] = useState(0)
  const [deathFrame, setDeathFrame] = useState(0)

  const isDying = zombie.state === 'dying'

  // Reset death frame when entering dying state
  useEffect(() => {
    if (isDying) setDeathFrame(0)
  }, [isDying])
  const frames = isDying
    ? DEATH_FRAMES[zombie.direction]
    : WALK_FRAMES[zombie.direction]
  const frameIndex = isDying ? deathFrame : walkFrame
  const src = frames[frameIndex] ?? frames[0]

  useEffect(() => {
    if (!src) return
    const interval = setInterval(
      () => {
        if (isDying) {
          setDeathFrame((f) => Math.min(f + 1, 6))
        } else {
          setWalkFrame((f) => (f + 1) % 6)
        }
      },
      isDying ? DEATH_FRAME_MS : WALK_FRAME_MS
    )
    return () => clearInterval(interval)
  }, [isDying])

  return (
    <div
      className="zombie"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <img src={src} alt="" className="zombie-sprite" />
    </div>
  )
}
