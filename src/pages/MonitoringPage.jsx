import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, AlertCircle, Info, CheckCircle,
  Activity, Users, Wifi, WifiOff, Clock, Radio
} from 'lucide-react'
import { getAlerts, getClients, getOdps } from '../api'

function getAlertStyle(severity) {
  switch (severity) {
    case 'critical': return { bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger', icon: AlertTriangle }
    case 'warning': return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: AlertCircle }
    case 'info': return { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent', icon: Info }
    default: return { bg: 'bg-bg-tertiary', border: 'border-border', text: 'text-text-secondary', icon: Info }
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} hari lalu`
  if (hours > 0) return `${hours} jam lalu`
  return 'Baru saja'
}

export default function MonitoringPage() {
  const [alertData, setAlertData] = useState([])
  const [clientData, setClientData] = useState([])
  const [odpData, setOdpData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getAlerts(), getClients(), getOdps()]).then(([alerts, clients, odps]) => {
      setAlertData(alerts)
      setClientData(clients)
      setOdpData(odps)
      setLoading(false)
    })
  }, [])

  const stats = useMemo(() => {
    const totalClients = clientData.length || 1
    const onlineClients = clientData.filter(c => c.status === 'online').length
    const offlineClients = clientData.filter(c => c.status === 'offline').length
    const availablePorts = odpData.reduce((acc, odp) => acc + (odp.totalPorts || 8) - (odp.usedPorts || 0), 0)
    return { totalClients, onlineClients, offlineClients, availablePorts }
  }, [clientData, odpData])

  const activeAlerts = alertData.filter(a => !a.resolved)
  const resolvedAlerts = alertData.filter(a => a.resolved)

  const onlinePercent = Math.round((stats.onlineClients / stats.totalClients) * 100)

  if (loading) return <div className="p-8 text-text-secondary">Loading...</div>

  return (
    <div className="h-full overflow-auto animate-fade-in z-0 relative bg-bg-primary">
      <div className="p-5 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-bg-primary -mx-5 -mt-5 p-5 md:p-6 md:-mx-6 md:-mt-6 border-b border-border mb-6">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Monitoring Jaringan</h1>
          <p className="text-sm text-text-muted mt-1 font-medium">Pantau status jaringan dan gangguan secara real-time</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Wifi size={24} className="text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary tracking-tight leading-none">{stats.onlineClients}</p>
                <p className="text-sm text-text-muted mt-1 font-medium">Online</p>
              </div>
            </div>
            <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden border border-border">
              <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${onlinePercent}%` }} />
            </div>
            <p className="text-xs text-text-muted mt-2 font-medium">{onlinePercent}% dari total</p>
          </div>

          <div className="card p-5 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center">
                <WifiOff size={24} className="text-danger" />
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary tracking-tight leading-none">{stats.offlineClients}</p>
                <p className="text-sm text-text-muted mt-1 font-medium">Offline</p>
              </div>
            </div>
          </div>

          <div className="card p-5 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle size={24} className="text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary tracking-tight leading-none">{activeAlerts.length}</p>
                <p className="text-sm text-text-muted mt-1 font-medium">Gangguan Aktif</p>
              </div>
            </div>
          </div>

          <div className="card p-5 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Radio size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary tracking-tight leading-none">{stats.availablePorts}</p>
                <p className="text-sm text-text-muted mt-1 font-medium">Port Tersedia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-slide-up stagger-1">
          {/* Active alerts */}
          <div className="card overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-bg-secondary">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={18} className="text-warning" />
                Gangguan Aktif ({activeAlerts.length})
              </h3>
            </div>
            <div className="divide-y divide-border flex-1">
              {activeAlerts.map(alert => {
                const style = getAlertStyle(alert.severity)
                const Icon = style.icon
                return (
                  <div key={alert.id} className={`p-5 ${style.bg.replace('/10', '/5')} border-l-4 ${style.border.replace('/30', '')} transition-all duration-200 hover:bg-bg-tertiary`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${style.bg} ${style.text} shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-base font-bold text-text-primary">{alert.title}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${style.bg} ${style.text} border border-current/20`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1 leading-relaxed">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs font-medium text-text-muted">
                          <span className="flex items-center gap-1.5 bg-bg-primary px-2 py-1 rounded border border-border">
                            <Clock size={14} className="text-text-secondary" />
                            {timeAgo(alert.createdAt)}
                          </span>
                          {alert.affectedClients > 0 && (
                            <span className="flex items-center gap-1.5 bg-bg-primary px-2 py-1 rounded border border-border">
                              <Users size={14} className="text-text-secondary" />
                              {alert.affectedClients} pelanggan terdampak
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {activeAlerts.length === 0 && (
                <div className="p-16 text-center text-text-muted">
                  <div className="w-16 h-16 mx-auto bg-success/5 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-success opacity-50" />
                  </div>
                  <p className="text-base font-medium">Tidak ada gangguan aktif</p>
                </div>
              )}
            </div>
          </div>

          {/* Resolved alerts */}
          <div className="card overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border bg-bg-secondary">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={18} className="text-success" />
                Riwayat Selesai ({resolvedAlerts.length})
              </h3>
            </div>
            <div className="divide-y divide-border flex-1">
              {resolvedAlerts.map(alert => (
                <div key={alert.id} className="p-5 opacity-70 hover:opacity-100 hover:bg-bg-tertiary transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-success/10 text-success shrink-0">
                      <CheckCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-text-primary line-through decoration-text-muted">{alert.title}</p>
                      <p className="text-sm text-text-secondary mt-1">{alert.description}</p>
                      <span className="text-xs font-medium text-text-muted flex items-center gap-1.5 mt-2 bg-bg-primary px-2 py-1 rounded border border-border w-max">
                        <Clock size={14} />
                        {timeAgo(alert.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Offline clients list */}
        <div className="card overflow-hidden animate-slide-up stagger-2">
          <div className="px-6 py-5 border-b border-border bg-bg-secondary">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <WifiOff size={18} className="text-danger" />
              Pelanggan Offline
            </h3>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-bg-secondary z-10 border-b border-border">
                <tr className="text-left text-xs text-text-secondary uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4 hidden sm:table-cell">ODP</th>
                  <th className="px-6 py-4 hidden md:table-cell">Paket</th>
                  <th className="px-6 py-4">Terakhir Online</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clientData.filter(c => c.status === 'offline').map(client => (
                  <tr
                    key={client.id}
                    className="table-row-hover cursor-pointer"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-text-primary">{client.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{client.address}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-accent hidden sm:table-cell">{client.odpId}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary hidden md:table-cell">
                      <span className="bg-bg-tertiary px-2 py-1 rounded border border-border">{client.package}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-text-secondary bg-bg-tertiary px-2 py-1 rounded border border-border flex items-center gap-1.5 w-max">
                        <Clock size={12} className="text-text-muted" />
                        {new Date(client.lastOnline).toLocaleString('id-ID')}
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
