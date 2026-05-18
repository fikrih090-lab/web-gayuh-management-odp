import { useState, useEffect, useMemo } from 'react'
import {
  Calendar, CheckCircle, TrendingUp, Search, Clock, ArrowRight,
  Database, User, Clipboard, FileText, ChevronRight, BarChart2, Filter
} from 'lucide-react'
import { getDbResolvedTickets } from '../api'

// Helper to format UNIX timestamp to Indonesian date
function formatIndoDate(epochSeconds) {
  if (!epochSeconds) return '-'
  return new Date(epochSeconds * 1000).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper to get Month Name in Indonesian
const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export default function TicketStatsPage() {
  const [resolvedTickets, setResolvedTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonthKey, setSelectedMonthKey] = useState('') // e.g. "2026-04"
  const [ticketSearch, setTicketSearch] = useState('')

  useEffect(() => {
    getDbResolvedTickets()
      .then(data => {
        setResolvedTickets(data || [])
        setLoading(false)

        // Automatically select the current month or the latest available month with data
        if (data && data.length > 0) {
          const sortedByDate = [...data].sort((a, b) => b.dateCreated - a.dateCreated)
          const latestDate = new Date(sortedByDate[0].dateCreated * 1000)
          const latestKey = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, '0')}`
          setSelectedMonthKey(latestKey)
        }
      })
      .catch(err => {
        console.error('Error fetching resolved tickets:', err)
        setLoading(false)
      })
  }, [])

  // Process data to group by month
  const monthlyData = useMemo(() => {
    const groups = {}

    // We want to cover from "last month" to "current month" at least, but let's map all resolved tickets dynamically
    resolvedTickets.forEach(ticket => {
      if (!ticket.dateCreated) return
      const date = new Date(ticket.dateCreated * 1000)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthKey = `${year}-${String(month).padStart(2, '0')}`
      const monthLabel = `${INDO_MONTHS[month - 1]} ${year}`

      if (!groups[monthKey]) {
        groups[monthKey] = {
          key: monthKey,
          label: monthLabel,
          year,
          month,
          count: 0,
          tickets: []
        }
      }

      groups[monthKey].count++
      groups[monthKey].tickets.push(ticket)
    })

    // Sort chronologically (oldest to newest)
    return Object.values(groups).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })
  }, [resolvedTickets])

  // Get current active selection details
  const activeMonthData = useMemo(() => {
    return monthlyData.find(m => m.key === selectedMonthKey) || null
  }, [monthlyData, selectedMonthKey])

  // Filtered tickets in the active month
  const filteredActiveTickets = useMemo(() => {
    if (!activeMonthData) return []
    return activeMonthData.tickets.filter(t => 
      (t.noTicket || '').toLowerCase().includes(ticketSearch.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(ticketSearch.toLowerCase()) ||
      (t.noServices || '').toLowerCase().includes(ticketSearch.toLowerCase())
    )
  }, [activeMonthData, ticketSearch])

  // General stats summary
  const summary = useMemo(() => {
    const total = resolvedTickets.length
    
    let maxMonthLabel = '-'
    let maxCount = 0
    monthlyData.forEach(m => {
      if (m.count > maxCount) {
        maxCount = m.count
        maxMonthLabel = m.label
      }
    })

    const avgCount = monthlyData.length > 0 
      ? Math.round((total / monthlyData.length) * 10) / 10 
      : 0

    return { total, maxMonthLabel, maxCount, avgCount }
  }, [resolvedTickets, monthlyData])

  if (loading) {
    return <div className="p-8 text-text-secondary font-medium">Loading database statistics...</div>
  }

  // Find max count in chart to calculate percentage height for bars
  const maxChartCount = monthlyData.reduce((acc, curr) => Math.max(acc, curr.count), 0) || 1

  return (
    <div className="h-full overflow-auto animate-fade-in bg-bg-primary">
      <div className="p-5 md:p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-bg-primary -mx-5 -mt-5 p-5 md:p-6 md:-mx-6 md:-mt-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Statistik Tiket Selesai</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">Analisis performa penyelesaian gangguan dari bulan lalu sampai saat ini</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary bg-bg-secondary px-3 py-1.5 rounded-lg border border-border">
            <Database size={14} className="text-accent" />
            <span>Koneksi Real-time MySQL</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 bg-gradient-to-br from-bg-secondary to-bg-tertiary border-accent/15 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Tiket Selesai</p>
              <p className="text-3xl font-extrabold text-text-primary tracking-tight mt-1">{summary.total}</p>
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-br from-bg-secondary to-bg-tertiary border-accent/15 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Penyelesaian Tertinggi</p>
              <p className="text-xl font-bold text-text-primary tracking-tight mt-1 truncate">
                {summary.maxMonthLabel} <span className="text-accent font-extrabold">({summary.maxCount})</span>
              </p>
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-br from-bg-secondary to-bg-tertiary border-accent/15 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Rata-rata / Bulan</p>
              <p className="text-3xl font-extrabold text-text-primary tracking-tight mt-1">{summary.avgCount}</p>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="card p-6 bg-gradient-to-br from-bg-secondary to-bg-tertiary border-border/80">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={18} className="text-accent" />
            <h2 className="text-base font-bold text-text-primary">Grafik Performa Bulanan</h2>
          </div>

          {monthlyData.length === 0 ? (
            <div className="py-20 text-center text-text-muted">
              <Clipboard size={48} className="mx-auto opacity-30 mb-4" />
              <p className="font-semibold">Tidak ada data tiket selesai di database</p>
            </div>
          ) : (
            <div>
              {/* Hand-crafted Interactive SVG/CSS bar chart */}
              <div className="h-64 flex items-end gap-6 md:gap-12 px-4 border-b border-border/60 pb-2 overflow-x-auto min-w-[300px]">
                {monthlyData.map(m => {
                  const percentage = (m.count / maxChartCount) * 80 + 10 // scale to at least 10% for tiny counts
                  const isActive = m.key === selectedMonthKey

                  return (
                    <div 
                      key={m.key} 
                      onClick={() => setSelectedMonthKey(m.key)}
                      className="flex-1 flex flex-col items-center group cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      <div className={`mb-2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isActive ? 'opacity-100' : ''}`}>
                        {m.count} Selesai
                      </div>

                      {/* Bar */}
                      <div 
                        style={{ height: `${percentage}%` }}
                        className={`w-12 md:w-16 rounded-t-xl transition-all duration-300 relative ${
                          isActive 
                            ? 'bg-gradient-to-t from-accent/90 to-accent shadow-lg shadow-accent/25 border-t border-x border-accent/40' 
                            : 'bg-gradient-to-t from-bg-primary/50 to-text-secondary/20 hover:to-accent/50 border-t border-x border-border/30'
                        }`}
                      >
                        {/* Glow effect for active bar */}
                        {isActive && (
                          <div className="absolute inset-0 bg-accent rounded-t-xl blur-sm opacity-35 -z-10" />
                        )}
                      </div>

                      {/* Label */}
                      <p className={`text-[10px] font-bold mt-3 tracking-wider uppercase transition-colors truncate w-full text-center ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                        {m.label}
                      </p>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-text-muted mt-3 italic text-center">Klik pada batang grafik bulan di atas untuk memfilter daftar tiket selesai di bawah</p>
            </div>
          )}
        </div>

        {/* Selected Month Resolved Tickets List */}
        {activeMonthData && (
          <div className="card overflow-hidden border-border/80 animate-fade-in">
            {/* List Header */}
            <div className="px-6 py-5 bg-bg-secondary border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-success" />
                <h3 className="text-base font-bold text-text-primary">Daftar Tiket Selesai: {activeMonthData.label}</h3>
                <span className="ml-2 bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded border border-success/20">
                  {activeMonthData.count} Tiket
                </span>
              </div>

              {/* Live search within month list */}
              <div className="relative w-full md:max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Cari nomor, keluhan..."
                  value={ticketSearch}
                  onChange={e => setTicketSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs input-modern"
                />
              </div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-border">
              {filteredActiveTickets.map((ticket, idx) => (
                <div 
                  key={ticket.id}
                  className="p-5 hover:bg-bg-tertiary/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 animate-slide-up"
                  style={{ animationDelay: `${idx * 20}ms`, animationFillMode: 'both' }}
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/15">
                        {ticket.noTicket || `#${ticket.id}`}
                      </span>
                      <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                        <Clock size={12} />
                        Selesai: {formatIndoDate(ticket.dateCreated)}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-text-primary">{ticket.description || 'Tidak ada deskripsi keluhan'}</h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-text-muted pt-1">
                      <span className="flex items-center gap-1 bg-bg-primary/50 px-2 py-1 rounded border border-border/40">
                        <User size={12} />
                        ID Pelanggan: {ticket.noServices || '-'}
                      </span>
                      {ticket.teknisi > 0 && (
                        <span className="flex items-center gap-1 bg-bg-primary/50 px-2 py-1 rounded border border-border/40">
                          ID Teknisi: {ticket.teknisi}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-success/10 text-success border border-success/20">
                      RESOLVED
                    </span>
                  </div>
                </div>
              ))}

              {filteredActiveTickets.length === 0 && (
                <div className="p-16 text-center text-text-muted">
                  <FileText size={40} className="mx-auto opacity-35 mb-4" />
                  <p className="font-semibold text-sm">Tidak ada tiket selesai yang cocok dengan pencarian Anda</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
