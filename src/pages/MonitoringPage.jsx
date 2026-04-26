import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, AlertCircle, Info, CheckCircle,
  Activity, Users, Wifi, WifiOff, Clock, Radio
} from 'lucide-react'
import { alertData, clientData, odpData, getStats } from '../data/mockData'

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
  const stats = useMemo(() => getStats(), [])
  const navigate = useNavigate()
  const activeAlerts = alertData.filter(a => !a.resolved)
  const resolvedAlerts = alertData.filter(a => a.resolved)

  const onlinePercent = Math.round((stats.onlineClients / stats.totalClients) * 100)

  return (
    <div className="h-full overflow-auto animate-fade-in">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Monitoring Jaringan</h1>
          <p className="text-sm text-text-muted mt-1">Pantau status jaringan dan gangguan secara real-time</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Wifi size={20} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stats.onlineClients}</p>
                <p className="text-xs text-text-muted">Online</p>
              </div>
            </div>
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full transition-all" style={{ width: `${onlinePercent}%` }} />
            </div>
            <p className="text-xs text-text-muted mt-1">{onlinePercent}% dari total</p>
          </div>

          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                <WifiOff size={20} className="text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stats.offlineClients}</p>
                <p className="text-xs text-text-muted">Offline</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertTriangle size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{activeAlerts.length}</p>
                <p className="text-xs text-text-muted">Gangguan Aktif</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Radio size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stats.availablePorts}</p>
                <p className="text-xs text-text-muted">Port Tersedia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Active alerts */}
          <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                <AlertTriangle size={16} className="text-warning" />
                Gangguan Aktif ({activeAlerts.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {activeAlerts.map(alert => {
                const style = getAlertStyle(alert.severity)
                const Icon = style.icon
                return (
                  <div key={alert.id} className={`p-4 ${style.bg} border-l-4 ${style.border} transition-colors hover:brightness-110`}>
                    <div className="flex items-start gap-3">
                      <Icon size={18} className={`${style.text} mt-0.5 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-text-primary">{alert.title}</p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {timeAgo(alert.createdAt)}
                          </span>
                          {alert.affectedClients > 0 && (
                            <span className="flex items-center gap-1">
                              <Users size={12} />
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
                <div className="p-12 text-center text-text-muted">
                  <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Tidak ada gangguan aktif</p>
                </div>
              )}
            </div>
          </div>

          {/* Resolved alerts */}
          <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                Riwayat Selesai ({resolvedAlerts.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {resolvedAlerts.map(alert => (
                <div key={alert.id} className="p-4 opacity-60 hover:opacity-80 transition-opacity">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-success mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary line-through">{alert.title}</p>
                      <p className="text-xs text-text-muted mt-1">{alert.description}</p>
                      <span className="text-xs text-text-muted flex items-center gap-1 mt-2">
                        <Clock size={12} />
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
        <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <WifiOff size={16} className="text-danger" />
              Pelanggan Offline
            </h3>
          </div>
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider bg-bg-primary/50">
                  <th className="px-5 py-3 font-medium">Pelanggan</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">ODP</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Paket</th>
                  <th className="px-5 py-3 font-medium">Terakhir Online</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clientData.filter(c => c.status === 'offline').map(client => (
                  <tr
                    key={client.id}
                    className="hover:bg-bg-tertiary/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-text-primary">{client.name}</p>
                      <p className="text-xs text-text-muted">{client.address}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-accent hidden sm:table-cell">{client.odpId}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary hidden md:table-cell">{client.package}</td>
                    <td className="px-5 py-3 text-xs text-text-muted">
                      {new Date(client.lastOnline).toLocaleString('id-ID')}
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
