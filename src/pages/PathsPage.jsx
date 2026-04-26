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
    <div className="h-full flex flex-col lg:flex-row animate-fade-in relative z-0">
      {/* Side panel */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col border-r border-border min-h-0 bg-bg-primary z-10">
        <div className="p-5 md:p-6 border-b border-border bg-bg-primary">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Jalur Kabel FO</h1>
          <p className="text-sm text-text-muted mt-1 font-medium">{pathData.length} jalur terdaftar</p>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          {pathData.map((path, i) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
              className={`w-full text-left rounded-xl border transition-all duration-300 animate-fade-in ${
                selectedPath?.id === path.id
                  ? 'bg-bg-tertiary border-border shadow-sm scale-[1.02]'
                  : 'bg-bg-secondary border-border hover:border-border-hover hover:bg-bg-tertiary'
              }`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-1.5 h-12 rounded-full"
                    style={{ background: pathColors[i % pathColors.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-text-primary tracking-tight">{path.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 font-mono">{path.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-bg-primary border border-border rounded-lg px-3 py-2.5">
                    <p className="text-text-muted mb-0.5">Tipe Kabel</p>
                    <p className="text-sm text-text-primary font-semibold">{path.cableType}</p>
                  </div>
                  <div className="bg-bg-primary border border-border rounded-lg px-3 py-2.5">
                    <p className="text-text-muted mb-0.5">Jarak</p>
                    <p className="text-sm text-text-primary font-semibold">{path.distance} km</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-text-primary font-bold tracking-wider">OLT</span>
                    <ArrowRight size={14} className="text-text-muted" />
                    <span className="text-text-secondary font-medium truncate max-w-[100px]">{path.odpIds.join(', ')}</span>
                  </div>
                  {path.hasRedundancy ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded border border-success/20">
                      <Shield size={14} /> Backup
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-warning bg-warning/10 px-2 py-1 rounded border border-warning/20">
                      <ShieldOff size={14} /> No Backup
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
              <div className="min-w-[140px] text-center">
                <p className="font-bold text-sm text-text-primary">{oltLocation.name}</p>
                <p className="text-xs text-text-muted mt-1">Pusat Jaringan</p>
              </div>
            </Popup>
          </Marker>

          {/* Paths */}
          {pathData.map((path, i) => (
            <Polyline
              key={path.id}
              positions={path.coordinates}
              pathOptions={{
                color: pathColors[i % pathColors.length],
                weight: selectedPath?.id === path.id ? 6 : 3,
                opacity: selectedPath ? (selectedPath.id === path.id ? 1 : 0.15) : 0.7,
                dashArray: path.hasRedundancy ? null : '8 6',
                lineCap: 'round',
                lineJoin: 'round'
              }}
              eventHandlers={{
                click: () => setSelectedPath(path)
              }}
            >
              <Popup>
                <div className="min-w-[180px] p-1">
                  <p className="font-bold text-sm text-text-primary">{path.name}</p>
                  <p className="text-xs text-text-secondary mt-1">{path.cableType} • <span className="font-semibold text-text-primary">{path.distance} km</span></p>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* ODP markers */}
          {odpData.map(odp => (
            <Marker
              key={odp.id}
              position={[odp.lat, odp.lng]}
              icon={createIcon('#10b981', 16)}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-sm text-text-primary">{odp.id}</p>
                  <p className="text-xs text-text-muted mt-0.5">{odp.name}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Selected path detail overlay */}
        {selectedPath && (
          <div className="absolute bottom-6 left-6 right-6 z-[1000] card p-5 animate-slide-up max-w-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <p className="text-base font-bold text-text-primary tracking-tight">{selectedPath.name}</p>
              <button
                onClick={() => setSelectedPath(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-bg-primary rounded-lg p-3 border border-border">
                <p className="text-text-muted mb-1">Kabel</p>
                <p className="text-sm text-text-primary font-semibold">{selectedPath.cableType}</p>
              </div>
              <div className="bg-bg-primary rounded-lg p-3 border border-border">
                <p className="text-text-muted mb-1">Jarak</p>
                <p className="text-sm text-text-primary font-semibold">{selectedPath.distance} km</p>
              </div>
              <div className="bg-bg-primary rounded-lg p-3 border border-border">
                <p className="text-text-muted mb-1">ODP Dilayani</p>
                <p className="text-sm text-text-primary font-semibold">{selectedPath.odpIds.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
