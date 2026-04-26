import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { Search, Plus, Radio, Filter } from 'lucide-react'
import { getOdps, getClients } from '../api'
import AddOdpModal from '../components/AddOdpModal'

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
  const [odpData, setOdpData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedODP, setSelectedODP] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getOdps(), getClients()]).then(([odps, clients]) => {
      const odpsWithPorts = odps.map(odp => {
        const usedPorts = clients.filter(c => c.odpId === odp.id).length;
        return { ...odp, usedPorts };
      });
      setOdpData(odpsWithPorts)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return odpData.filter(odp => {
      const matchSearch = odp.name.toLowerCase().includes(search.toLowerCase()) ||
        odp.id.toLowerCase().includes(search.toLowerCase()) ||
        odp.address.toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'all' || odp.type === filterType
      return matchSearch && matchType
    })
  }, [odpData, search, filterType])

  const mapCenter = selectedODP
    ? [selectedODP.lat, selectedODP.lng]
    : [-6.905, 107.610]
  const mapZoom = selectedODP ? 16 : 13

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in relative z-0">
      {/* Table panel */}
      <div className="flex-1 flex flex-col min-h-0 border-r border-border/50 bg-bg-primary">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-border space-y-5 bg-bg-primary">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Manajemen ODP</h1>
              <p className="text-sm text-text-muted mt-1 font-medium">{odpData.length} ODP terdaftar</p>
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="btn-primary px-5 py-2 text-sm flex items-center justify-center gap-2">
              <Plus size={16} />
              <span className="hidden sm:inline">Tambah ODP</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari nama, ID, atau alamat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm input-modern"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full appearance-none pl-10 pr-8 py-2.5 text-sm input-modern cursor-pointer"
              >
                <option value="all">Semua Tipe</option>
                <option value="1:8">1:8</option>
                <option value="1:16">1:16</option>
              </select>
              <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-bg-secondary/90 backdrop-blur-md z-10">
              <tr className="text-left text-xs text-text-secondary uppercase tracking-wider font-semibold border-b border-border/50">
                <th className="px-5 md:px-6 py-4">ODP</th>
                <th className="px-5 py-4 hidden md:table-cell">Tipe</th>
                <th className="px-5 py-4">Port</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((odp, i) => {
                const status = getStatusLabel(odp)
                return (
                  <tr
                    key={odp.id}
                    onClick={() => { setSelectedODP(odp); }}
                    onDoubleClick={() => navigate(`/odp/${odp.id}`)}
                    className={`cursor-pointer table-row-hover animate-fade-in ${
                      selectedODP?.id === odp.id
                        ? 'bg-accent/5 shadow-[inset_2px_0_0_#3b82f6]'
                        : ''
                    }`}
                    style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
                  >
                    <td className="px-5 md:px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: getODPColor(odp), boxShadow: `0 0 10px ${getODPColor(odp)}88` }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{odp.name}</p>
                          <p className="text-xs text-text-muted mt-0.5 truncate">{odp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs font-mono bg-bg-tertiary/80 border border-border/50 px-2.5 py-1 rounded-lg text-text-secondary">{odp.type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-text-primary mb-1.5">{odp.usedPorts}/{odp.totalPorts}</div>
                      <div className="w-20 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(odp.usedPorts / odp.totalPorts) * 100}%`,
                            background: getODPColor(odp),
                            boxShadow: `0 0 8px ${getODPColor(odp)}`
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${status.class.replace('bg-', 'bg-').replace('/15', '/10').replace('text-', 'text-').concat(' border-current/20')}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-bg-tertiary/50 flex items-center justify-center mb-4">
                <Radio size={32} className="opacity-50" />
              </div>
              <p className="text-sm font-medium">Tidak ada ODP ditemukan</p>
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
          className="w-full h-full border-l border-border"
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
          <div className="absolute bottom-6 left-6 right-6 z-[1000] card p-5 animate-slide-left">
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold text-text-primary tracking-tight">{selectedODP.id}</p>
              <span className="text-xs font-mono bg-bg-tertiary px-2 py-0.5 rounded text-text-secondary border border-border">{selectedODP.type}</span>
            </div>
            <p className="text-sm text-text-secondary mb-1">{selectedODP.address}</p>
            <p className="text-xs text-text-muted mb-4">{selectedODP.note}</p>
            <button
              onClick={() => navigate(`/odp/${selectedODP.id}`)}
              className="w-full py-2 text-sm font-medium text-bg-primary bg-text-primary hover:bg-zinc-200 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Lihat Detail Penuh
              <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}
      </div>

      <AddOdpModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={() => {
          setLoading(true)
          Promise.all([getOdps(), getClients()]).then(([odps, clients]) => {
            const odpsWithPorts = odps.map(odp => {
              const usedPorts = clients.filter(c => c.odpId === odp.id).length;
              return { ...odp, usedPorts };
            });
            setOdpData(odpsWithPorts)
            setLoading(false)
          })
        }} 
      />
    </div>
  )
}
