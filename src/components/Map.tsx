import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMap } from '../contexts/MapContext'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

type MapProps = {
  center: { lat: number; lng: number }
}

export function Map({ center }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { map, setMap } = useMap()

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom: 20,
      pitch: 60,
      bearing: -20,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    setMap(map)
    return () => {
      map.remove()
      setMap(null)
    }
  }, [setMap])

  useEffect(() => {
    map?.setCenter([center.lng, center.lat], { duration: 0 })
  }, [map, center.lat, center.lng])

  return <div ref={containerRef} className="map-container" />
}
