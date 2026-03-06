import { useEffect, useState } from 'react'

const MOVE_SPEED = 0.000002

export function usePlayerMovement(initialLat = 10.78, initialLng = 106.7) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng })
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault()
        if (k === 'w') setKeys((prev) => ({ ...prev, w: true }))
        if (k === 'a') setKeys((prev) => ({ ...prev, a: true }))
        if (k === 's') setKeys((prev) => ({ ...prev, s: true }))
        if (k === 'd') setKeys((prev) => ({ ...prev, d: true }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'w') setKeys((prev) => ({ ...prev, w: false }))
      if (k === 'a') setKeys((prev) => ({ ...prev, a: false }))
      if (k === 's') setKeys((prev) => ({ ...prev, s: false }))
      if (k === 'd') setKeys((prev) => ({ ...prev, d: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!keys.w && !keys.a && !keys.s && !keys.d) return

    let rafId: number
    const tick = () => {
      setPosition((prev) => {
        let { lat, lng } = prev
        if (keys.w) lat += MOVE_SPEED
        if (keys.s) lat -= MOVE_SPEED
        if (keys.a) lng -= MOVE_SPEED
        if (keys.d) lng += MOVE_SPEED
        return { lat, lng }
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [keys.w, keys.a, keys.s, keys.d])

  return { position, keys }
}
