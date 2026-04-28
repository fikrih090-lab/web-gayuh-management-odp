import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { Radio, Users, Plug, AlertTriangle, Layers, LocateFixed, ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react'
import { oltLocation } from '../data/mockData'
import { getClients, getOdps, getPaths, getAlerts } from '../api'
import { useDarkMode } from '../hooks/useDarkMode'

// Fix Leaflet map size when container becomes visible
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

// Custom icon creator
function createIcon(color, size = 28) {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      border:3px solid rgba(255,255,255,0.9);
      box-shadow:0 0 12px ${color}88, 0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
    "></div>`
  })
}

function getODPColor(odp) {
  const ratio = odp.usedPorts / odp.totalPorts
  if (ratio >= 1) return '#ef4444'
  if (ratio >= 0.5) return '#eab308'
  return '#22c55e'
}

const oltIcon = L.divIcon({
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  html: `<div style="
    width:36px;height:36px;border-radius:10px;
    background:linear-gradient(135deg,#3b82f6,#8b5cf6);
    border:3px solid rgba(255,255,255,0.9);
    box-shadow:0 0 16px rgba(59,130,246,0.5), 0 4px 12px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:14px;font-weight:700;color:white;
  ">⚡</div>`
})

const clientIcon = L.divIcon({
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:#818cf8;
    border:2px solid rgba(255,255,255,0.8);
    box-shadow:0 0 6px rgba(129,140,248,0.5);
  "></div>`
})

function MapControls() {
  const map = useMap()

  return (
    <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
      >
        <ZoomIn size={18} />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
      >
        <ZoomOut size={18} />
      </button>
      <button
        onClick={() => map.flyTo([oltLocation.lat, oltLocation.lng], 14)}
        className="w-10 h-10 card flex items-center justify-center text-text-secondary hover:text-accent transition-all"
      >
        <LocateFixed size={18} />
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const [clientData, setClientData] = useState([]);
  const [odpData, setOdpData] = useState([]);
  const [pathData, setPathData] = useState([]);
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = useDarkMode();

  useEffect(() => {
    Promise.all([getClients(), getOdps(), getPaths(), getAlerts()])
      .then(([clients, odps, paths, alerts]) => {
        setClientData(clients);
        setOdpData(odps);
        setPathData(paths);
        setAlertData(alerts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => ({
    totalOdp: odpData.length,
    totalClients: clientData.length,
    availablePorts: odpData.reduce((acc, odp) => acc + (odp.totalPorts || 8) - (odp.usedPorts || 0), 0),
    activeAlerts: alertData.filter(a => !a.resolved).length
  }), [odpData, clientData, alertData])
  const navigate = useNavigate()
  const [layers, setLayers] = useState({ odp: true, clients: true, paths: true })

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const statCards = [
    { label: 'Total ODP', value: stats.totalOdp, icon: Radio, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Pelanggan', value: stats.totalClients, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Port Tersedia', value: stats.availablePorts, icon: Plug, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Gangguan', value: stats.activeAlerts, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
  ]

  const pathColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899']

  return (
    <div className="relative h-full">
      {/* Map */}
      <MapContainer
        center={[oltLocation.lat, oltLocation.lng]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapResizer />
        <TileLayer
          key={isDark ? 'dark' : 'light'}
          url={`https://{s}.basemaps.cartocdn.com/${isDark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* OLT marker */}
        <Marker position={[oltLocation.lat, oltLocation.lng]} icon={oltIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <p className="font-bold text-sm">{oltLocation.name}</p>
              <p className="text-xs text-text-secondary mt-1">{oltLocation.address}</p>
              <p className="text-xs text-accent mt-1 font-medium">Pusat Jaringan (OLT)</p>
            </div>
          </Popup>
        </Marker>

        {/* Path lines */}
        {layers.paths && pathData.map((path, i) => (
          <Polyline
            key={path.id}
            positions={path.coordinates}
            pathOptions={{
              color: pathColors[i % pathColors.length],
              weight: 3,
              opacity: 0.7,
              dashArray: path.hasRedundancy ? null : '8 6',
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-bold text-sm">{path.name}</p>
                <p className="text-xs text-text-secondary mt-1">{path.cableType} • {path.distance} km</p>
                <p className="text-xs mt-1">
                  {path.hasRedundancy
                    ? <span className="text-success">✓ Jalur backup tersedia</span>
                    : <span className="text-warning">⚠ Tanpa redundansi</span>
                  }
                </p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* ODP markers */}
        {layers.odp && odpData.map(odp => (
          <Marker
            key={odp.id}
            position={[odp.lat, odp.lng]}
            icon={createIcon(getODPColor(odp))}
            eventHandlers={{
              click: () => navigate(`/odp/${odp.id}`)
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">{odp.id}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    background: getODPColor(odp) + '22',
                    color: getODPColor(odp)
                  }}>
                    {odp.usedPorts}/{odp.totalPorts} Port
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">{odp.name}</p>
                <p className="text-xs text-text-muted mt-1">{odp.address}</p>
                <p className="text-xs text-text-muted mt-1">Tipe: {odp.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Client markers */}
        {layers.clients && clientData.map(client => (
          <Marker
            key={client.id}
            position={[client.lat, client.lng]}
            icon={clientIcon}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-bold text-sm">{client.name}</p>
                <p className="text-xs text-text-secondary mt-1">{client.package} • {client.odpId}</p>
                <p className="text-xs mt-1">
                  {client.status === 'online'
                    ? <span className="text-success">● Online</span>
                    : <span className="text-danger">● Offline</span>
                  }
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapControls />
      </MapContainer>

      {/* Stats overlay */}
      <div className="absolute top-6 left-6 z-[1000] space-y-3">
        {statCards.map((card, i) => (
          <div 
            key={card.label} 
            className={`card px-5 py-4 flex items-center gap-4 min-w-[200px] cursor-pointer animate-slide-left`}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
          >
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon size={20} className={card.color} />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium mb-0.5 uppercase tracking-wide">{card.label}</p>
              <p className="text-2xl font-bold text-text-primary tracking-tight leading-none">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Layer toggle */}
      <div className="absolute top-6 right-6 z-[1000] animate-slide-right stagger-1">
        <div className="card p-4 space-y-2.5 min-w-[160px]">
          <div className="flex items-center gap-2 px-1 pb-3 border-b border-border">
            <Layers size={16} className="text-text-muted" />
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Layer Peta</span>
          </div>
          <div className="space-y-1 pt-1">
            {[
              { key: 'odp', label: 'ODP', color: 'text-success' },
              { key: 'clients', label: 'Pelanggan', color: 'text-purple-400' },
              { key: 'paths', label: 'Jalur Kabel', color: 'text-accent' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => toggleLayer(item.key)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full transition-all duration-200 ${
                  layers[item.key]
                    ? 'text-text-primary bg-bg-tertiary'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/50'
                }`}
              >
                {layers[item.key] ? <Eye size={16} className={item.color} /> : <EyeOff size={16} />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
