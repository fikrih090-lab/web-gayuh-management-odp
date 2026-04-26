import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users, Filter, ArrowUpDown } from 'lucide-react'
import { clientData, odpData } from '../data/mockData'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    let data = [...clientData]

    // Search
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.odpId.toLowerCase().includes(q)
      )
    }

    // Filter status
    if (filterStatus !== 'all') {
      data = data.filter(c => c.status === filterStatus)
    }

    // Filter payment
    if (filterPayment !== 'all') {
      data = data.filter(c => c.paymentStatus === filterPayment)
    }

    // Sort
    data.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'package') return a.package.localeCompare(b.package)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

    return data
  }, [search, filterStatus, filterPayment, sortBy])

  const onlineCount = clientData.filter(c => c.status === 'online').length
  const offlineCount = clientData.filter(c => c.status === 'offline').length
  const overdueCount = clientData.filter(c => c.paymentStatus === 'overdue').length

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Manajemen Pelanggan</h1>
            <p className="text-sm text-text-muted mt-1">{clientData.length} pelanggan terdaftar</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent to-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-accent/20 transition-all">
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah Pelanggan</span>
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-xl shrink-0">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-text-secondary">{onlineCount} Online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-xl shrink-0">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-xs text-text-secondary">{offlineCount} Offline</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-xl shrink-0">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-xs text-text-secondary">{overdueCount} Tunggakan</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari nama, ID, alamat, ODP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-bg-tertiary border border-border rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none px-4 py-2.5 bg-bg-tertiary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="appearance-none px-4 py-2.5 bg-bg-tertiary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">Semua Bayar</option>
            <option value="paid">Lunas</option>
            <option value="overdue">Tunggakan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-bg-secondary z-10">
            <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
              <th className="px-4 md:px-6 py-3 font-medium">Pelanggan</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Paket</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">ODP / Port</th>
              <th className="px-4 py-3 font-medium hidden xl:table-cell">Biaya</th>
              <th className="px-4 py-3 font-medium">Koneksi</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Bayar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(client => (
              <tr
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="hover:bg-bg-tertiary/30 cursor-pointer transition-colors"
              >
                <td className="px-4 md:px-6 py-4">
                  <p className="text-sm font-medium text-text-primary">{client.name}</p>
                  <p className="text-xs text-text-muted">{client.address}</p>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="text-sm text-text-secondary font-medium">{client.package}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-sm text-accent">{client.odpId}</span>
                  <span className="text-xs text-text-muted ml-1">P{client.portNumber}</span>
                </td>
                <td className="px-4 py-4 hidden xl:table-cell">
                  <span className="text-sm text-text-secondary">{formatCurrency(client.monthlyFee)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    client.status === 'online'
                      ? 'bg-success/15 text-success'
                      : 'bg-danger/15 text-danger'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      client.status === 'online' ? 'bg-success animate-pulse-soft' : 'bg-danger'
                    }`} />
                    {client.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    client.paymentStatus === 'paid'
                      ? 'bg-success/15 text-success'
                      : 'bg-warning/15 text-warning'
                  }`}>
                    {client.paymentStatus === 'paid' ? 'Lunas' : 'Tunggakan'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Tidak ada pelanggan ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
