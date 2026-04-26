import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { Search, Plus, Radio, Filter } from 'lucide-react'
import { odpData } from '../data/mockData'

function getODPColor(odp) {
  const ratio = odp.usedPorts / odp.totalPorts
  if (ratio >= 1) return '#ef4444'
  if (ratio >= 0.5) return '#eab308'
  return '#22c55e'
}

function getStatusLabel(odp) {
  const ratio = odp.usedPorts / odp.totalPorts
  if (ratio >= 1) return { text: 'Penuh', class: 'bg-danger/15 text-danger' }
  if (ratio >= 0.5) return { text: 'Sedang', class: 'bg-warning/15 text-warning' }
  return { text: 'Tersedia', class: 'bg-success/15 text-success' }
}

function createMiniIcon(color) {
  return L.divIcon({
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 6px ${color}66;"></div>`
  })
}

export default function ODPPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedODP, setSelectedODP] = useState(null)
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    return odpData.filter(odp => {
      const matchSearch = odp.name.toLowerCase().includes(search.toLowerCase()) ||
        odp.id.toLowerCase().includes(search.toLowerCase()) ||
        odp.address.toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'all' || odp.type === filterType
      return matchSearch && matchType
    })
  }, [search, filterType])

  const mapCenter = selectedODP
    ? [selectedODP.lat, selectedODP.lng]
    : [-6.905, 107.610]
  const mapZoom = selectedODP ? 16 : 13

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in">
      {/* Table panel */}
      <div className="flex-1 flex flex-col min-h-0 border-r border-border">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Manajemen ODP</h1>
              <p className="text-sm text-text-muted mt-1">{odpData.length} ODP terdaftar</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent to-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-accent/20 transition-all">
              <Plus size={16} />
              <span className="hidden sm:inline">Tambah ODP</span>
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari nama, ID, atau alamat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-bg-tertiary border border-border rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 bg-bg-tertiary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent transition-all cursor-pointer"
              >
                <option value="all">Semua Tipe</option>
                <option value="1:8">1:8</option>
                <option value="1:16">1:16</option>
              </select>
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-bg-secondary z-10">
              <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                <th className="px-4 md:px-6 py-3 font-medium">ODP</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Tipe</th>
                <th className="px-4 py-3 font-medium">Port</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(odp => {
                const status = getStatusLabel(odp)
                return (
                  <tr
                    key={odp.id}
                    onClick={() => { setSelectedODP(odp); }}
                    onDoubleClick={() => navigate(`/odp/${odp.id}`)}
                    className={`cursor-pointer transition-colors ${
                      selectedODP?.id === odp.id
                        ? 'bg-accent/5'
                        : 'hover:bg-bg-tertiary/50'
                    }`}
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: getODPColor(odp), boxShadow: `0 0 6px ${getODPColor(odp)}66` }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{odp.id}</p>
                          <p className="text-xs text-text-muted truncate">{odp.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs font-mono bg-bg-tertiary px-2 py-1 rounded-lg text-text-secondary">{odp.type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-text-primary">{odp.usedPorts}/{odp.totalPorts}</div>
                      <div className="w-16 h-1.5 bg-bg-tertiary rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(odp.usedPorts / odp.totalPorts) * 100}%`,
                            background: getODPColor(odp),
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <Radio size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Tidak ada ODP ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Mini map */}
      <div className="hidden lg:block w-[400px] xl:w-[480px] relative">
        <MapContainer
          key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {odpData.map(odp => (
            <Marker
              key={odp.id}
              position={[odp.lat, odp.lng]}
              icon={createMiniIcon(
                selectedODP?.id === odp.id ? '#ffffff' : getODPColor(odp)
              )}
            />
          ))}
        </MapContainer>

        {/* Selected ODP info overlay */}
        {selectedODP && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] glass rounded-xl p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-text-primary">{selectedODP.id}</p>
              <span className="text-xs font-mono text-text-muted">{selectedODP.type}</span>
            </div>
            <p className="text-xs text-text-secondary">{selectedODP.address}</p>
            <p className="text-xs text-text-muted mt-1">{selectedODP.note}</p>
            <button
              onClick={() => navigate(`/odp/${selectedODP.id}`)}
              className="mt-3 w-full py-2 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
            >
              Lihat Detail →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
