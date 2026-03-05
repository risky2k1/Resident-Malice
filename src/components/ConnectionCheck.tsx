import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Status = 'checking' | 'ok' | 'error'

export function ConnectionCheck() {
  const [supabaseStatus, setSupabaseStatus] = useState<Status>('checking')
  const [supabaseError, setSupabaseError] = useState<string>('')
  const [mapboxStatus, setMapboxStatus] = useState<Status>('checking')
  const [mapboxError, setMapboxError] = useState<string>('')

  useEffect(() => {
    // Supabase: test connection via auth.getSession (không cần table)
    const checkSupabase = async () => {
      try {
        const { error } = await supabase.auth.getSession()
        setSupabaseStatus(error ? 'error' : 'ok')
        setSupabaseError(error?.message ?? '')
      } catch (e) {
        setSupabaseStatus('error')
        setSupabaseError(e instanceof Error ? e.message : 'Unknown error')
      }
    }

    // Mapbox: test token bằng cách load 1 tile
    const checkMapbox = async () => {
      const token = import.meta.env.VITE_MAPBOX_TOKEN
      if (!token || token === 'your-mapbox-token') {
        setMapboxStatus('error')
        setMapboxError('VITE_MAPBOX_TOKEN chưa cấu hình trong .env')
        return
      }
      try {
        const res = await fetch(
          `https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${token}`
        )
        setMapboxStatus(res.ok ? 'ok' : 'error')
        setMapboxError(res.ok ? '' : `HTTP ${res.status}`)
      } catch (e) {
        setMapboxStatus('error')
        setMapboxError(e instanceof Error ? e.message : 'Unknown error')
      }
    }

    checkSupabase()
    checkMapbox()
  }, [])

  const StatusBadge = ({ status }: { status: Status }) =>
    status === 'ok' ? (
      <span style={{ color: 'green' }}>✓ OK</span>
    ) : status === 'error' ? (
      <span style={{ color: 'red' }}>✗ Lỗi</span>
    ) : (
      <span style={{ color: 'gray' }}>...</span>
    )

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 14, padding: 16 }}>
      <h3>Kiểm tra kết nối</h3>
      <p>
        <strong>Supabase:</strong> <StatusBadge status={supabaseStatus} />
        {supabaseError && (
          <span style={{ color: 'red', marginLeft: 8 }}>{supabaseError}</span>
        )}
      </p>
      <p>
        <strong>Mapbox:</strong> <StatusBadge status={mapboxStatus} />
        {mapboxError && (
          <span style={{ color: 'red', marginLeft: 8 }}>{mapboxError}</span>
        )}
      </p>
    </div>
  )
}
