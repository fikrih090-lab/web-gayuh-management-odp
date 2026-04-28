import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { ArrowLeft, Radio, MapPin, Cable, User, Plug, Trash2 } from 'lucide-react'
import { getOdps, getClients, getPaths, deleteOdp } from '../api'
import { useDarkMode } from '../hooks/useDarkMode'

function createIcon(color, size = 24) {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 0 10px ${color}88;"></div>`
  })
}

export default function ODPDetailPage() {
  const { id } = useParams()
  const [odp, setOdp] = useState(null)
  const [connectedClients, setConnectedClients] = useState([])
  const [path, setPath] = useState(null)
  const [clientData, setClientData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isDark = useDarkMode()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isFullAccess = user.roleId === '1' || user.roleId === 1

  useEffect(() => {
    const decodedId = decodeURIComponent(id).toUpperCase().trim();
    Promise.all([getOdps(), getClients(), getPaths()]).then(([odps, clients, pathsData]) => {
      const foundOdp = odps.find(o => o.id.toUpperCase().trim() === decodedId)
      setOdp(foundOdp)
      // Match case-insensitive agar tidak gagal karena perbedaan huruf besar/kecil
      setConnectedClients(clients.filter(c => String(c.odpId).toUpperCase().trim() === decodedId))
      setPath(pathsData.find(p => p.odpIds.includes(decodedId)))
      setClientData(clients)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (connectedClients.length > 0) {
      if (!window.confirm(`Perhatian: Ada ${connectedClients.length} pelanggan yang terhubung ke ODP ini!\n\nApakah Anda YAKIN ingin menghapus ODP ini? Pelanggan tidak akan dihapus, tetapi koneksi mereka ke ODP ini akan hilang.`)) {
        return
      }
    } else {
      if (!window.confirm('Apakah Anda yakin ingin menghapus ODP ini secara permanen?')) {
        return
      }
    }

    try {
      await deleteOdp(odp.codeOdp || odp.idOdp || id)
      navigate('/odp')
    } catch (err) {
      alert('Gagal menghapus ODP')
    }
  }

  if (loading) return <div className="p-8 text-text-secondary">Loading...</div>

  if (!odp) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted">
        <Radio size={48} className="mb-4 opacity-30" />
        <p>ODP tidak ditemukan</p>
        <button onClick={() => navigate('/odp')} className="mt-4 text-accent text-sm">← Kembali</button>
      </div>
    )
  }

  const ratio = odp.usedPorts / odp.totalPorts
  const statusColor = ratio >= 1 ? '#ef4444' : ratio >= 0.5 ? '#eab308' : '#22c55e'

  return (
    <div className="h-full overflow-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-border px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/odp')}
            className="p-2 rounded-xl text-text-secondary hover:bg-bg-tertiary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-text-primary">{odp.name}</h1>
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}66` }}
              />
            </div>
            <p className="text-sm text-text-muted">{odp.id}</p>
          </div>
        </div>
        {isFullAccess && (
          <button
            onClick={handleDelete}
            className="p-2 md:px-4 md:py-2 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors flex items-center gap-2 text-sm font-medium"
            title="Hapus ODP"
          >
            <Trash2 size={18} />
            <span className="hidden md:inline">Hapus</span>
          </button>
        )}
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Info Card */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
              <Radio size={16} className="text-accent" />
              Informasi Umum
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Tipe Splitter</span>
                <span className="font-mono text-text-primary">{odp.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Latitude</span>
                <span className="font-mono text-text-primary">{odp.lat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Longitude</span>
                <span className="font-mono text-text-primary">{odp.lng}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Alamat</span>
                <span className="text-text-primary text-right max-w-[180px]">{odp.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Jalur</span>
                <span className="text-accent">{path?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Catatan</span>
                <span className="text-text-secondary text-right max-w-[180px]">{odp.note}</span>
              </div>
            </div>
          </div>

          {/* Port Grid */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
              <Plug size={16} className="text-accent" />
              Status Port ({connectedClients.length}/{odp.totalPorts})
            </h3>
            <div className={`grid gap-2 ${odp.totalPorts <= 8 ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-8'}`}>
              {Array.from({ length: odp.totalPorts }).map((_, i) => {
                const portNumber = i + 1;
                const client = connectedClients.find(c => Number(c.portNumber) === portNumber)
                const isUsed = !!client;
                return (
                  <div
                    key={portNumber}
                    className={`relative group aspect-square rounded-xl flex flex-col items-center justify-center text-xs cursor-pointer transition-all duration-200 border ${
                      isUsed
                        ? 'bg-danger/10 border-danger/30 text-danger hover:bg-danger/20'
                        : 'bg-success/10 border-success/30 text-success hover:bg-success/20'
                    }`}
                  >
                    <span className="font-bold text-base">{portNumber}</span>
                    <span className="text-[10px] opacity-70">
                      {isUsed ? 'Terpakai' : 'Kosong'}
                    </span>
                    {/* Tooltip */}
                    {client && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass rounded-lg px-3 py-2 text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {client.name}
                        <br />
                        <span className="text-text-muted">{client.package}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mini map */}
          <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
            <div className="p-4 pb-2">
              <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                Lokasi
              </h3>
            </div>
            <div className="h-[240px]">
              <MapContainer
                center={[odp.lat, odp.lng]}
                zoom={17}
                className="w-full h-full"
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer 
                  key={isDark ? 'dark' : 'light'}
                  url={`https://{s}.basemaps.cartocdn.com/${isDark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`} 
                />
                <Marker
                  position={[odp.lat, odp.lng]}
                  icon={createIcon(statusColor, 28)}
                />
                {/* Lines to clients */}
                {connectedClients.map(client => (
                  <Polyline
                    key={client.id}
                    positions={[[odp.lat, odp.lng], [client.lat, client.lng]]}
                    pathOptions={{ color: '#818cf8', weight: 1.5, opacity: 0.5, dashArray: '4 4' }}
                  />
                ))}
                {connectedClients.map(client => (
                  <Marker
                    key={client.id}
                    position={[client.lat, client.lng]}
                    icon={createIcon('#818cf8', 12)}
                  />
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Connected Clients */}
        <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <User size={16} className="text-accent" />
              Pelanggan Terhubung ({connectedClients.length})
            </h3>
          </div>
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider bg-bg-primary/50">
                  <th className="px-5 py-3 font-medium">Port</th>
                  <th className="px-5 py-3 font-medium">Pelanggan</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Paket</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">ONT Serial</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {connectedClients.map(client => (
                  <tr
                    key={client.id}
                    className="hover:bg-bg-tertiary/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="px-5 py-3">
                      <span className="w-7 h-7 rounded-lg bg-bg-tertiary flex items-center justify-center text-xs font-bold text-text-primary">
                        {client.portNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-text-primary">{client.name}</p>
                      <p className="text-xs text-text-muted">{client.id}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-sm text-text-secondary">{client.package}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-xs font-mono text-text-muted">{client.ontSerial}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        client.status === 'online'
                          ? 'bg-success/15 text-success'
                          : 'bg-danger/15 text-danger'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          client.status === 'online' ? 'bg-success' : 'bg-danger'
                        }`} />
                        {client.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
                {connectedClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">
                      Belum ada pelanggan terhubung
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
