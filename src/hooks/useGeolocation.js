import { useState, useCallback, useRef } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null) // { lat, lng, accuracy }
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const watchIdRef = useRef(null)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('GPS tidak didukung di browser ini')
      return Promise.reject('not supported')
    }
    setLoading(true)
    setError(null)
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }
          setLocation(loc)
          setLoading(false)
          resolve(loc)
        },
        (err) => {
          const msg = err.code === 1
            ? 'Akses lokasi ditolak. Izinkan GPS di browser.'
            : err.code === 2
            ? 'Posisi tidak dapat ditentukan'
            : 'Timeout mendapatkan lokasi'
          setError(msg)
          setLoading(false)
          reject(msg)
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      )
    })
  }, [])

  const startWatching = useCallback(() => {
    if (!navigator.geolocation || watchIdRef.current) return
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy })
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )
  }, [])

  const stopWatching = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  return { location, loading, error, getLocation, startWatching, stopWatching }
}
