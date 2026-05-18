import { useMemo, useState, useEffect } from 'react'
import {
  Clipboard, Plus, Trash2, Edit, CheckCircle, AlertCircle,
  User, Clock, Search, Filter, X, Play, Check, AlertTriangle, Shield, Database, MapPin
} from 'lucide-react'
import { getTickets, createTicket, updateTicket, deleteTicket, getClients, getDbTicketStats, getUsers } from '../api'

function getStatusStyle(status) {
  switch (status) {
    case 'Open': return { bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger' }
    case 'In Progress': return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' }
    case 'Resolved': return { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success' }
    case 'Closed': return { bg: 'bg-bg-tertiary', border: 'border-border', text: 'text-text-muted' }
    default: return { bg: 'bg-bg-tertiary', border: 'border-border', text: 'text-text-secondary' }
  }
}

export default function MonitoringPage() {
  const [tickets, setTickets] = useState([])
  const [clients, setClients] = useState([])
  const [dbStats, setDbStats] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [categoryFilter, setCategoryFilter] = useState('Semua')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  
  // Client selection for tickets
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [showClientDropdown, setShowClientDropdown] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Koneksi',
    shareloc: '',
    assignedTo: ''
  })

  // Get current logged in user and permissions
  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem('user') || '{}')
  }, [])

  const roleId = String(currentUser.roleId || '2')
  const isSuperAdmin = roleId === '1'
  const isHelpdesk = roleId === '3'
  const isTeknisi = roleId === '4'

  const canCreateOrDelete = isSuperAdmin || isHelpdesk
  const canTakeOrProcess = isSuperAdmin || isTeknisi

  const fetchTicketsAndClients = async () => {
    setLoading(true)
    try {
      const [ticketData, clientData, dbStatData, userData] = await Promise.all([
        getTickets(),
        getClients(),
        getDbTicketStats(),
        getUsers()
      ])
      setTickets(ticketData)
      setClients(clientData)
      setDbStats(dbStatData || [])
      setUsers(userData || [])
    } catch (error) {
      console.error('Error fetching tickets/clients/stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTicketsAndClients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      alert('Mohon isi judul dan deskripsi tiket')
      return
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        clientName: selectedClient ? selectedClient.name : '-',
        clientId: selectedClient ? selectedClient.id : '-',
        createdBy: currentUser.name || 'Staff',
        shareloc: formData.shareloc,
        assignedTo: formData.assignedTo
      }

      if (editingTicket) {
        await updateTicket(editingTicket.id, payload)
      } else {
        await createTicket(payload)
      }
      
      setIsModalOpen(false)
      fetchTicketsAndClients()
      resetForm()
    } catch (error) {
      alert('Gagal menyimpan data tiket')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus tiket ini?')) {
      try {
        await deleteTicket(id)
        fetchTicketsAndClients()
      } catch (error) {
        alert('Gagal menghapus tiket')
      }
    }
  }

  const handleTakeTicket = async (ticket) => {
    try {
      await updateTicket(ticket.id, {
        status: 'In Progress',
        assignedTo: currentUser.name || 'Teknisi'
      })
      fetchTicketsAndClients()
    } catch (error) {
      alert('Gagal mengambil tiket')
    }
  }

  const handleProcessTicket = async (ticket, nextStatus) => {
    try {
      await updateTicket(ticket.id, {
        status: nextStatus
      })
      fetchTicketsAndClients()
    } catch (error) {
      alert('Gagal memproses tiket')
    }
  }

  const openModal = (ticket = null) => {
    setEditingTicket(ticket)
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category || 'Koneksi',
        shareloc: ticket.shareloc || '',
        assignedTo: ticket.assignedTo || ''
      })
      const matchingClient = clients.find(c => c.id === ticket.clientId)
      setSelectedClient(matchingClient || { name: ticket.clientName, id: ticket.clientId })
      setClientSearch(ticket.clientName || '')
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Koneksi',
      shareloc: '',
      assignedTo: ''
    })
    setSelectedClient(null)
    setClientSearch('')
    setShowClientDropdown(false)
  }

  // Filter clients dynamically as helpdesk searches
  const filteredClients = useMemo(() => {
    if (!clientSearch) return []
    return clients.filter(c => 
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
      c.id.toLowerCase().includes(clientSearch.toLowerCase())
    ).slice(0, 5) // limit to 5 results for sleek look
  }, [clients, clientSearch])

  // List of all technicians (roleId === '4')
  const technicians = useMemo(() => {
    return users.filter(u => String(u.roleId || '') === '4')
  }, [users])

  // Filtered tickets - Technicians only see tickets assigned to them
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                            t.clientName.toLowerCase().includes(search.toLowerCase()) ||
                            t.description.toLowerCase().includes(search.toLowerCase()) ||
                            t.clientId.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'Semua' || t.status === statusFilter
      const matchesCategory = categoryFilter === 'Semua' || t.category === categoryFilter
      const matchesAssignee = !isTeknisi || t.assignedTo === currentUser.username
      
      return matchesSearch && matchesStatus && matchesCategory && matchesAssignee
    })
  }, [tickets, search, statusFilter, categoryFilter, isTeknisi, currentUser.username])

  // Ticket stats
  const stats = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter(t => t.status === 'Open').length
    const progress = tickets.filter(t => t.status === 'In Progress').length
    const resolved = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length
    return { total, open, progress, resolved }
  }, [tickets])

  return (
    <div className="h-full overflow-auto animate-fade-in bg-bg-primary">
      <div className="p-5 md:p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-bg-primary -mx-5 -mt-5 p-5 md:p-6 md:-mx-6 md:-mt-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Management Tiket Gangguan</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">Kelola aduan pelanggan dan penugasan teknisi lapangan</p>
          </div>
          {canCreateOrDelete && (
            <button onClick={() => openModal()} className="btn-primary px-5 py-2.5 text-sm flex items-center justify-center gap-2">
              <Plus size={16} />
              <span>Tambah Tiket</span>
            </button>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Tiket</p>
            <p className="text-3xl font-extrabold text-text-primary tracking-tight mt-2">{stats.total}</p>
          </div>

          <div className="card p-5 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Belum Diambil (Open)</p>
              <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
            </div>
            <p className="text-3xl font-extrabold text-danger tracking-tight mt-2">{stats.open}</p>
          </div>

          <div className="card p-5 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Dalam Proses</p>
            <p className="text-3xl font-extrabold text-warning tracking-tight mt-2">{stats.progress}</p>
          </div>

          <div className="card p-5 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Selesai</p>
            <p className="text-3xl font-extrabold text-success tracking-tight mt-2">{stats.resolved}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari judul tiket, nama, ID pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm input-modern"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Pills */}
            <div className="flex border border-border rounded-lg p-0.5 bg-bg-secondary overflow-hidden">
              {['Semua', 'Open', 'In Progress', 'Resolved', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    statusFilter === st 
                      ? 'bg-bg-primary text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Category Select */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-bg-secondary border border-border rounded-lg text-xs font-semibold text-text-primary appearance-none focus:outline-none focus:border-accent"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Koneksi">Koneksi</option>
                <option value="Kabel">Kabel</option>
                <option value="Perangkat">Perangkat</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tickets Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map((ticket, index) => {
            const style = getStatusStyle(ticket.status)
            return (
              <div 
                key={ticket.id} 
                className="card p-6 flex flex-col justify-between hover:border-border/80 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-current/25 ${style.bg} ${style.text}`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs font-semibold text-text-muted">{ticket.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-1">{ticket.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-4 min-h-[60px] leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="border-t border-border/40 pt-4 mt-2 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-text-muted uppercase">Pelanggan</p>
                      <p className="text-text-primary font-medium mt-0.5 truncate">{ticket.clientName} ({ticket.clientId})</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-text-muted uppercase">Staf Pembuat</p>
                      <p className="text-text-primary font-medium mt-0.5 truncate">{ticket.createdBy}</p>
                    </div>
                  </div>

                  {ticket.assignedTo && (
                    <div className="bg-bg-secondary border border-border/50 rounded-lg p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px] font-bold">
                          {ticket.assignedTo.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-text-primary truncate">Ditugaskan: {ticket.assignedTo}</span>
                      </div>
                    </div>
                  )}

                  {ticket.shareloc && (
                    <a 
                      href={ticket.shareloc} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 rounded-xl text-xs font-bold transition-all duration-200"
                    >
                      <MapPin size={14} />
                      <span>Arahkan ke Maps</span>
                    </a>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(ticket.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Helpdesk/Admin Actions */}
                      {canCreateOrDelete && (
                        <>
                          <button onClick={() => openModal(ticket)} className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-md transition-colors" title="Edit Tiket">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(ticket.id)} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors" title="Hapus Tiket">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}

                      {/* Technician Actions */}
                      {canTakeOrProcess && ticket.status === 'Open' && (
                        <button 
                          onClick={() => handleTakeTicket(ticket)} 
                          className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Play size={12} />
                          <span>Ambil Tiket</span>
                        </button>
                      )}

                      {canTakeOrProcess && ticket.status === 'In Progress' && (
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleProcessTicket(ticket, 'Resolved')} 
                            className="px-2.5 py-1.5 bg-success hover:bg-success/90 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Selesaikan Tiket"
                          >
                            <Check size={12} />
                            <span>Selesai</span>
                          </button>
                          {isSuperAdmin && (
                            <button 
                              onClick={() => handleProcessTicket(ticket, 'Closed')} 
                              className="px-2.5 py-1.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary border border-border rounded-md text-xs font-semibold transition-colors"
                              title="Tutup Tiket"
                            >
                              Tutup
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredTickets.length === 0 && (
            <div className="col-span-2 card p-16 flex flex-col items-center justify-center text-text-muted">
              <Clipboard size={48} className="opacity-30 mb-4" />
              <p className="text-base font-semibold">Tidak ada tiket gangguan ditemukan</p>
              <p className="text-xs mt-1">Coba gunakan filter lain atau buat tiket baru</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-fade-in-scale">
            <div className="flex items-center justify-between p-5 border-b border-border bg-bg-primary">
              <h3 className="text-lg font-bold text-text-primary">{editingTicket ? 'Edit Tiket' : 'Buat Tiket Gangguan'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Judul Gangguan / Keluhan</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Contoh: Lampu LOS Merah di ODP-12"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Deskripsi Detail</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="Detail keluhan pelanggan atau kronologi putusnya kabel..."
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm resize-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Link Share Location / Google Maps</label>
                <input 
                  type="text" 
                  placeholder="Contoh: https://maps.app.goo.gl/..."
                  value={formData.shareloc} 
                  onChange={e => setFormData({...formData, shareloc: e.target.value})} 
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm" 
                />
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Tugaskan ke Teknisi</label>
                  <select 
                    value={formData.assignedTo} 
                    onChange={e => setFormData({...formData, assignedTo: e.target.value})} 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm"
                  >
                    <option value="">-- Pilih Teknisi (Belum Ditugaskan) --</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.username}>{tech.name || tech.username}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Kategori</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm appearance-none"
                  >
                    <option value="Koneksi">Koneksi</option>
                    <option value="Kabel">Kabel</option>
                    <option value="Perangkat">Perangkat</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Status Tiket</label>
                  <input 
                    type="text" 
                    readOnly
                    value={editingTicket ? editingTicket.status : 'Open'} 
                    className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-muted cursor-not-allowed font-semibold"
                  />
                </div>
              </div>

              {/* Searchable Client Selector */}
              <div className="relative">
                <label className="block text-xs font-semibold text-text-secondary mb-1">Hubungkan ke Pelanggan (Opsional)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ketik nama atau ID pelanggan..."
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value)
                      setShowClientDropdown(true)
                      if (selectedClient && selectedClient.name !== e.target.value) {
                        setSelectedClient(null)
                      }
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm" 
                  />
                  {selectedClient && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success font-semibold text-[10px] bg-success/10 border border-success/20 px-1.5 py-0.5 rounded">
                      Terhubung
                    </span>
                  )}
                </div>

                {showClientDropdown && filteredClients.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-bg-secondary border border-border rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-border">
                    {filteredClients.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedClient(c)
                          setClientSearch(c.name)
                          setShowClientDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-bg-tertiary transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-text-primary">{c.name}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{c.address}</p>
                        </div>
                        <span className="font-bold text-accent">{c.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-4 py-2 border border-border text-text-secondary rounded-lg text-sm font-medium hover:bg-bg-tertiary transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-text-primary text-bg-primary rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  Simpan Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
