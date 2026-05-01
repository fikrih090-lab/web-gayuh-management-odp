import { useState, useEffect } from 'react';
import { oltLocation as defaultOltLocation } from '../data/mockData';

export function useOLTLocation() {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('custom_olt_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
            return parsed;
        }
      } catch (e) {}
    }
    return defaultOltLocation;
  });

  const updateLocation = (lat, lng) => {
    const newLoc = { ...location, lat, lng };
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
