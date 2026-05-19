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

/**
 * Ekstrak koordinat (latitude, longitude) dari berbagai format link maps atau text koordinat
 */
export function extractCoordinates(text) {
  if (!text) return null;

  // 1. Decode URL encoded values (like %2C or %20)
  const decodedText = decodeURIComponent(text).trim();

  // Helper to validate lat/lng range
  const isValidLatLng = (lat, lng) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    return !isNaN(latNum) && latNum >= -90 && latNum <= 90 &&
           !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180;
  };

  // Helper to convert DMS (Degrees, Minutes, Seconds) to Decimal
  // e.g. 6°55'03.0"S 107°37'08.8"E
  const dmsRegex = /(\d+)\s*°\s*(\d+)\s*'\s*(\d+(?:\.\d+)?)\s*"\s*([NSEWnsew])/g;
  const dmsMatches = [...decodedText.matchAll(dmsRegex)];
  
  if (dmsMatches.length >= 2) {
    const parseDMS = (match) => {
      const deg = parseFloat(match[1]);
      const min = parseFloat(match[2]);
      const sec = parseFloat(match[3]);
      const dir = match[4].toUpperCase();
      let decimal = deg + min / 60 + sec / 3600;
      if (dir === 'S' || dir === 'W') {
        decimal = -decimal;
      }
      return decimal;
    };

    const latVal = parseDMS(dmsMatches[0]);
    const lngVal = parseDMS(dmsMatches[1]);
    
    const firstDir = dmsMatches[0][4].toUpperCase();
    const secondDir = dmsMatches[1][4].toUpperCase();
    
    let lat = latVal;
    let lng = lngVal;
    if ((firstDir === 'E' || firstDir === 'W') && (secondDir === 'N' || secondDir === 'S')) {
      lat = lngVal;
      lng = latVal;
    }

    if (isValidLatLng(lat, lng)) {
      return { lat: lat.toFixed(7), lng: lng.toFixed(7) };
    }
  }

  // 2. Google Maps `@lat,lng` (e.g. @-6.9175,107.6191)
  const urlMatch = decodedText.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (urlMatch && isValidLatLng(urlMatch[1], urlMatch[2])) {
    return { lat: urlMatch[1], lng: urlMatch[2] };
  }

  // 3. Look for query parameter patterns: q=lat,lng or ll=lat,lng or query=lat,lng etc.
  const paramMatch = decodedText.match(/(?:q|ll|query|destination|dest|origin|saddr|daddr|place|search)\/?[=:]\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/i);
  if (paramMatch && isValidLatLng(paramMatch[1], paramMatch[2])) {
    return { lat: paramMatch[1], lng: paramMatch[2] };
  }

  // 4. Coordinates separated by comma: -6.9175, 107.6191
  const coordMatch = decodedText.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (coordMatch && isValidLatLng(coordMatch[1], coordMatch[2])) {
    return { lat: coordMatch[1], lng: coordMatch[2] };
  }

  // 5. Coordinates separated by space: -6.9175 107.6191
  const spaceCoordMatch = decodedText.match(/(-?\d+\.\d+)\s+(-?\d+\.\d+)/);
  if (spaceCoordMatch && isValidLatLng(spaceCoordMatch[1], spaceCoordMatch[2])) {
    return { lat: spaceCoordMatch[1], lng: spaceCoordMatch[2] };
  }

  return null;
}
