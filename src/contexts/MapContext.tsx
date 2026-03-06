import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'

type MapContextValue = {
  map: MapboxMap | null
  setMap: (map: MapboxMap | null) => void
}

const MapContext = createContext<MapContextValue | null>(null)

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<MapboxMap | null>(null)
  return (
    <MapContext.Provider value={{ map, setMap }}>{children}</MapContext.Provider>
  )
}

export function useMap() {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMap must be used within MapProvider')
  return ctx
}
