import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Cable, Shield, ShieldOff, ArrowRight, Radio } from 'lucide-react'
import { pathData, odpData, oltLocation } from '../data/mockData'

const pathColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899']

function createIcon(color, size = 20) {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 8px ${color}66;"></div>`
  })
}

const oltIcon = L.divIcon({
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  html: `<div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:2px solid white;box-shadow:0 0 12px rgba(59,130,246,0.5);display:flex;align-items:center;justify-content:center;font-size:12px;color:white;">⚡</div>`
})

export default function PathsPage() {
  const [selectedPath, setSelectedPath] = useState(null)

  const mapCenter = [-6.905, 107.610]

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in">
      {/* Side panel */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col border-r border-border min-h-0">
        <div className="p-4 md:p-6 border-b border-border">
          <h1 className="text-xl font-bold text-text-primary">Jalur Kabel FO</h1>
          <p className="text-sm text-text-muted mt-1">{pathData.length} jalur terdaftar</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {pathData.map((path, i) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
              className={`w-full text-left rounded-2xl border transition-all duration-200 ${
                selectedPath?.id === path.id
                  ? 'bg-accent/5 border-accent/30'
                  : 'bg-bg-secondary border-border hover:border-border-hover'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-10 rounded-full"
                    style={{ background: pathColors[i % pathColors.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{path.name}</p>
                    <p className="text-xs text-text-muted">{path.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-bg-primary/50 rounded-xl px-3 py-2">
                    <p className="text-text-muted">Tipe Kabel</p>
                    <p className="text-text-primary font-medium mt-0.5">{path.cableType}</p>
                  </div>
                  <div className="bg-bg-primary/50 rounded-xl px-3 py-2">
                    <p className="text-text-muted">Jarak</p>
                    <p className="text-text-primary font-medium mt-0.5">{path.distance} km</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent font-medium">OLT</span>
                    <ArrowRight size={12} className="text-text-muted" />
                    <span className="text-text-secondary">{path.odpIds.join(', ')}</span>
                  </div>
                  {path.hasRedundancy ? (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <Shield size={12} /> Backup
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-warning">
                      <ShieldOff size={12} /> No Backup
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-[400px]">
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {/* OLT */}
          <Marker position={[oltLocation.lat, oltLocation.lng]} icon={oltIcon}>
            <Popup>
              <p className="font-bold text-sm">{oltLocation.name}</p>
              <p className="text-xs text-text-muted">Pusat Jaringan</p>
            </Popup>
          </Marker>

          {/* Paths */}
          {pathData.map((path, i) => (
            <Polyline
              key={path.id}
              positions={path.coordinates}
              pathOptions={{
                color: pathColors[i % pathColors.length],
                weight: selectedPath?.id === path.id ? 5 : 3,
                opacity: selectedPath ? (selectedPath.id === path.id ? 1 : 0.2) : 0.7,
                dashArray: path.hasRedundancy ? null : '8 6',
              }}
              eventHandlers={{
                click: () => setSelectedPath(path)
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-sm">{path.name}</p>
                  <p className="text-xs text-text-secondary mt-1">{path.cableType} • {path.distance} km</p>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* ODP markers */}
          {odpData.map(odp => (
            <Marker
              key={odp.id}
              position={[odp.lat, odp.lng]}
              icon={createIcon('#22c55e', 18)}
            >
              <Popup>
                <p className="font-bold text-sm">{odp.id}</p>
                <p className="text-xs text-text-muted">{odp.name}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Selected path detail overlay */}
        {selectedPath && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] glass rounded-xl p-4 animate-fade-in max-w-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-text-primary">{selectedPath.name}</p>
              <button
                onClick={() => setSelectedPath(null)}
                className="text-xs text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-text-muted">Kabel</p>
                <p className="text-text-primary font-medium">{selectedPath.cableType}</p>
              </div>
              <div>
                <p className="text-text-muted">Jarak</p>
                <p className="text-text-primary font-medium">{selectedPath.distance} km</p>
              </div>
              <div>
                <p className="text-text-muted">ODP Dilayani</p>
                <p className="text-text-primary font-medium">{selectedPath.odpIds.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
