import { useState, useEffect } from 'react';
import { oltLocation as defaultOltLocation } from '../data/mockData';

export function useOLTLocation() {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('custom_olt_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
            // Jika koordinat lama berada di area Bandung atau mengandung teks "Bandung", reset agar menggunakan lokasi baru (ARDKOM)
            if ((parsed.lat < -6.8 && parsed.lat > -7.0 && parsed.lng > 107.5 && parsed.lng < 107.7) || 
                (parsed.name && String(parsed.name).includes('Bandung')) || 
                (parsed.address && String(parsed.address).includes('Bandung'))) {
                localStorage.removeItem('custom_olt_location');
                return defaultOltLocation;
            }
            return parsed;
        }
      } catch (e) {}
    }
    return defaultOltLocation;
  });

  const updateLocation = (lat, lng, name, address) => {
    const newLoc = { ...location, lat, lng };
    if (name !== undefined) newLoc.name = name;
    if (address !== undefined) newLoc.address = address;
    setLocation(newLoc);
    localStorage.setItem('custom_olt_location', JSON.stringify(newLoc));
    // Trigger custom event so other components that use this hook update immediately
    window.dispatchEvent(new CustomEvent('olt-location-changed', { detail: newLoc }));
  };

  useEffect(() => {
    const handleSync = (e) => setLocation(e.detail);
    window.addEventListener('olt-location-changed', handleSync);
    return () => window.removeEventListener('olt-location-changed', handleSync);
  }, []);

  return { location, updateLocation };
}
