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
      antialias: true,
      dragRotate: false,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.on('style.load', () => {
      const layers = map.getStyle().layers
      const labelLayer = layers?.find(
        (l) =>
          l.type === 'symbol' &&
          (l.layout as Record<string, unknown>)?.['text-field']
      )
      const beforeId = labelLayer?.id

      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.7,
          },
        },
        beforeId
      )
    })

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
