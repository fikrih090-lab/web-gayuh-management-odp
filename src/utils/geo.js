/**
 * Haversine formula — hitung jarak antara 2 koordinat (km)
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Format jarak ke string yang enak dibaca
 */
export function formatDistance(km) {
  if (km < 0.1) return `${Math.round(km * 1000)} m`
  if (km < 1)   return `${(km * 1000).toFixed(0)} m`
  return `${km.toFixed(2)} km`
}

/**
 * Buka Google Maps navigasi ke koordinat tujuan
 */
export function openGoogleMaps(lat, lng, label = '') {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
  window.open(url, '_blank')
}

/**
 * Buka Waze navigasi ke koordinat tujuan
 */
export function openWaze(lat, lng) {
  const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
  window.open(url, '_blank')
}
