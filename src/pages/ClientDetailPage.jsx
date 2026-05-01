import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import {
  ArrowLeft, User, MapPin, CreditCard, Wifi, Radio,
  Phone, Mail, Calendar, Clock, Trash2
} from 'lucide-react'
import { getClients, getOdps, getPaths, deleteClient } from '../api'
import { useOLTLocation } from '../hooks/useOLTLocation'
import { useDarkMode } from '../hooks/useDarkMode'

function createIcon(color, size = 20) {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 8px ${color}88;"></div>`
  })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [odp, setOdp] = useState(null)
  const [path, setPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isDark = useDarkMode()
  const { location: oltLoc } = useOLTLocation()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isFullAccess = user.roleId === '1' || user.roleId === 1

  useEffect(() => {
    Promise.all([getClients(), getOdps(), getPaths()]).then(([clients, odps, pathsData]) => {
      const foundClient = clients.find(c => c.id === id)
      setClient(foundClient)
      if (foundClient) {
        const foundOdp = odps.find(o => o.id === foundClient.odpId)
        setOdp(foundOdp)
        if (foundOdp) {
          setPath(pathsData.find(p => p.odpIds.includes(foundOdp.id)))
        }
      }
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini secara permanen?')) {
      try {
        await deleteClient(id)
        navigate('/clients')
      } catch (err) {
        alert('Gagal menghapus pelanggan')
      }
    }
  }

  if (loading) return <div className="p-8 text-text-secondary">Loading...</div>
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted">
        <User size={48} className="mb-4 opacity-30" />
        <p>Pelanggan tidak ditemukan</p>
        <button onClick={() => navigate('/clients')} className="mt-4 text-accent text-sm">← Kembali</button>
      </div>
    )
  }

  // Connection trace line: Client → ODP → OLT
  const traceLine = []
  if (odp) {
    traceLine.push([client.lat, client.lng])
    traceLine.push([odp.lat, odp.lng])
    traceLine.push([oltLoc.lat, oltLoc.lng])
  }

  const billingHistory = [
    { month: 'April 2026', amount: client.monthlyFee, status: client.paymentStatus === 'paid' ? 'paid' : 'overdue', date: '2026-04-05' },
    { month: 'Maret 2026', amount: client.monthlyFee, status: 'paid', date: '2026-03-03' },
    { month: 'Februari 2026', amount: client.monthlyFee, status: 'paid', date: '2026-02-04' },
    { month: 'Januari 2026', amount: client.monthlyFee, status: 'paid', date: '2026-01-02' },
  ]

  return (
    <div className="h-full overflow-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-border px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/clients')}
            className="p-2 rounded-xl text-text-secondary hover:bg-bg-tertiary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-text-primary">{client.name}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                client.status === 'online' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'online' ? 'bg-success' : 'bg-danger'}`} />
                {client.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-sm text-text-muted">{client.id} • {client.address}</p>
          </div>
          {isFullAccess && (
            <button
              onClick={handleDelete}
              className="p-2 md:px-4 md:py-2 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors flex items-center gap-2 text-sm font-medium"
              title="Hapus Pelanggan"
            >
              <Trash2 size={18} />
              <span className="hidden md:inline">Hapus</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Personal Info */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
              <User size={16} className="text-accent" />
              Data Pelanggan
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted flex items-center gap-2"><User size={14} /> Nama</span>
                <span className="text-text-primary font-medium">{client.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted flex items-center gap-2"><Phone size={14} /> Telepon</span>
                <span className="text-text-primary">{client.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted flex items-center gap-2"><MapPin size={14} /> Alamat</span>
                <span className="text-text-primary text-right max-w-[180px]">{client.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted flex items-center gap-2"><Wifi size={14} /> Paket</span>
                <span className="text-accent font-semibold">{client.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted flex items-center gap-2"><CreditCard size={14} /> Biaya/bulan</span>
                <span className="text-text-primary">{formatCurrency(client.monthlyFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted flex items-center gap-2"><Calendar size={14} /> Bergabung</span>
                <span className="text-text-primary">{client.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Connection Info */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
              <Radio size={16} className="text-accent" />
              Info Koneksi
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">ODP</span>
                <button
                  onClick={() => navigate(`/odp/${client.odpId}`)}
                  className="text-accent hover:underline"
                >
                  {client.odpId}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Port</span>
                <span className="text-text-primary font-mono">#{client.portNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">ONT Serial</span>
                <span className="text-text-primary font-mono text-xs">{client.ontSerial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Jalur</span>
                <span className="text-text-secondary">{path?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status ONT</span>
                <span className={client.status === 'online' ? 'text-success' : 'text-danger'}>
                  {client.status === 'online' ? '● Online' : '● Offline'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted flex items-center gap-1"><Clock size={14} /> Terakhir Online</span>
                <span className="text-text-secondary text-xs">
                  {new Date(client.lastOnline).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Connection trace visual */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-text-muted mb-3">Jalur Koneksi</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-purple-500/15 text-purple-400 rounded-lg">ONT</span>
                <span className="text-text-muted">→</span>
                <span className="px-2 py-1 bg-success/15 text-success rounded-lg">{client.odpId}</span>
                <span className="text-text-muted">→</span>
                <span className="px-2 py-1 bg-accent/15 text-accent rounded-lg">OLT</span>
              </div>
            </div>
          </div>

          {/* Connection Map */}
          <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
            <div className="p-4 pb-2">
              <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                Peta Koneksi
              </h3>
            </div>
            <div className="h-[260px]">
              <MapContainer
                center={[client.lat, client.lng]}
                zoom={15}
                className="w-full h-full"
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer 
                  key={isDark ? 'dark' : 'light'}
                  url={`https://{s}.basemaps.cartocdn.com/${isDark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`} 
                />
                {traceLine.length > 0 && (
                  <Polyline positions={traceLine} pathOptions={{ color: '#3b82f6', weight: 2, opacity: 0.6, dashArray: '6 4' }} />
                )}
                <Marker position={[client.lat, client.lng]} icon={createIcon('#818cf8', 20)} />
                {odp && <Marker position={[odp.lat, odp.lng]} icon={createIcon('#22c55e', 20)} />}
                <Marker position={[oltLoc.lat, oltLoc.lng]} icon={createIcon('#3b82f6', 24)} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <CreditCard size={16} className="text-accent" />
              Riwayat Pembayaran
            </h3>
          </div>
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider bg-bg-primary/50">
                  <th className="px-5 py-3 font-medium">Bulan</th>
                  <th className="px-5 py-3 font-medium">Jumlah</th>
                  <th className="px-5 py-3 font-medium">Tanggal Bayar</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {billingHistory.map((bill, i) => (
                  <tr key={i} className="hover:bg-bg-tertiary/30 transition-colors">
                    <td className="px-5 py-3 text-sm text-text-primary">{bill.month}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary">{formatCurrency(bill.amount)}</td>
                    <td className="px-5 py-3 text-sm text-text-muted">{bill.date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        bill.status === 'paid' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                      }`}>
                        {bill.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
