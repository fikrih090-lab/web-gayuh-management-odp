import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users, Filter, ArrowUpDown } from 'lucide-react'
import { getClients } from '../api'
import AddClientModal from '../components/AddClientModal'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function ClientsPage() {
  const [clientData, setClientData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getClients().then(data => {
      setClientData(data)
      setLoading(false)
    })
  }, [])

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
  }, [clientData, search, filterStatus, filterPayment, sortBy])

  const onlineCount = clientData.filter(c => c.status === 'online').length
  const offlineCount = clientData.filter(c => c.status === 'offline').length
  const overdueCount = clientData.filter(c => c.paymentStatus === 'overdue').length

  return (
    <div className="h-full flex flex-col animate-fade-in relative z-0">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-border space-y-5 bg-bg-primary">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Manajemen Pelanggan</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">{clientData.length} pelanggan terdaftar</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary px-5 py-2 text-sm flex items-center justify-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah Pelanggan</span>
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-bg-secondary border border-border rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm font-medium text-text-primary">{onlineCount} <span className="text-text-muted">Online</span></span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-bg-secondary border border-border rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-sm font-medium text-text-primary">{offlineCount} <span className="text-text-muted">Offline</span></span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-bg-secondary border border-border rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-sm font-medium text-text-primary">{overdueCount} <span className="text-text-muted">Tunggakan</span></span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari nama, ID, alamat, ODP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm input-modern"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none px-4 py-2.5 text-sm input-modern cursor-pointer w-40"
          >
            <option value="all">Semua Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="appearance-none px-4 py-2.5 text-sm input-modern cursor-pointer w-40"
          >
            <option value="all">Semua Bayar</option>
            <option value="paid">Lunas</option>
            <option value="overdue">Tunggakan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-bg-primary">
        <table className="w-full">
          <thead className="sticky top-0 bg-bg-secondary/90 backdrop-blur-md z-10">
            <tr className="text-left text-xs text-text-secondary uppercase tracking-wider font-semibold border-b border-border/50">
              <th className="px-5 md:px-6 py-4">Pelanggan</th>
              <th className="px-5 py-4 hidden sm:table-cell">Paket</th>
              <th className="px-5 py-4 hidden lg:table-cell">ODP / Port</th>
              <th className="px-5 py-4 hidden xl:table-cell">Biaya</th>
              <th className="px-5 py-4">Koneksi</th>
              <th className="px-5 py-4 hidden md:table-cell">Bayar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filtered.map((client, i) => (
              <tr
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="table-row-hover cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
              >
                <td className="px-5 md:px-6 py-4">
                  <p className="text-sm font-semibold text-text-primary">{client.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{client.address}</p>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-sm text-text-secondary font-medium bg-bg-tertiary/50 px-2.5 py-1 rounded-lg border border-border/30">{client.package}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm font-medium text-accent">{client.odpId}</span>
                  <span className="text-xs text-text-muted ml-1 font-mono">P{client.portNumber}</span>
                </td>
                <td className="px-5 py-4 hidden xl:table-cell">
                  <span className="text-sm font-medium text-text-secondary">{formatCurrency(client.monthlyFee)}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${
                    client.status === 'online'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-danger/10 text-danger border-danger/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      client.status === 'online' ? 'bg-success animate-pulse-soft shadow-[0_0_6px_#34d399]' : 'bg-danger shadow-[0_0_6px_#f87171]'
                    }`} />
                    {client.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${
                    client.paymentStatus === 'paid'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-warning/10 text-warning border-warning/20'
                  }`}>
                    {client.paymentStatus === 'paid' ? 'Lunas' : 'Tunggakan'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-bg-tertiary/50 flex items-center justify-center mb-4">
              <Users size={32} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">Tidak ada pelanggan ditemukan</p>
          </div>
        )}
      </div>

      <AddClientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={() => {
          setLoading(true)
          getClients().then(data => {
            setClientData(data)
            setLoading(false)
          })
        }} 
      />
    </div>
  )
}
