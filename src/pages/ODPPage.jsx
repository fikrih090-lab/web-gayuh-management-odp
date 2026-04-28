import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { Search, Plus, Radio, Filter } from 'lucide-react'
import { getOdpsPaged } from '../api'
import AddOdpModal from '../components/AddOdpModal'
import EditOdpModal from '../components/EditOdpModal'
import { useDarkMode } from '../hooks/useDarkMode'

function getODPColor(odp) {
  const ratio = (odp.usedPorts || 0) / (odp.totalPorts || 1)
  if (ratio >= 1) return '#ef4444'
  if (ratio >= 0.5) return '#eab308'
  return '#22c55e'
}

function getStatusLabel(odp) {
  const ratio = (odp.usedPorts || 0) / (odp.totalPorts || 1)
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
  const [odpData, setOdpData]       = useState([])
  const [total, setTotal]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage]             = useState(1)
  const [loading, setLoading]       = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]         = useState('')
  const [selectedODP, setSelectedODP] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingOdp, setEditingOdp] = useState(null)
  const [selectedLetter, setSelectedLetter] = useState('')
  const PAGE_SIZE = 50
  const navigate = useNavigate()
  const isDark = useDarkMode()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isFullAccess = user.roleId === '1' || user.roleId === 1

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  const doubleAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => `A${l}`);

  const fetchOdps = useCallback(async (p, q, l) => {
    const pg  = p ?? page
    const qry = q ?? search
    const ltr = l !== undefined ? l : selectedLetter
    setLoading(true)
    try {
      const res = await getOdpsPaged({ page: pg, limit: PAGE_SIZE, search: qry, letter: ltr })
      setOdpData(res.data || [])
      setTotal(res.total || 0)
      setTotalPages(res.totalPages || 1)
      setPage(res.page || pg)
    } catch (e) {
      console.error('fetchOdps error:', e)
      setOdpData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, selectedLetter])

  useEffect(() => { fetchOdps(1, '', '') }, [])

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      fetchOdps(1, searchInput, selectedLetter)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const mapCenter = selectedODP && selectedODP.lat && selectedODP.lng
    ? [Number(selectedODP.lat), Number(selectedODP.lng)]
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
              <p className="text-sm text-text-muted mt-1 font-medium">
                {loading ? 'Memuat...' : `${total} ODP terdaftar`}
              </p>
            </div>
            {isFullAccess && (
              <button onClick={() => setIsAddModalOpen(true)} className="btn-primary px-5 py-2 text-sm flex items-center justify-center gap-2">
                <Plus size={16} />
                <span className="hidden sm:inline">Tambah ODP</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari nama ODP..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm input-modern"
              />
            </div>
          </div>
        </div>

        {/* Alphabet Filter Bar */}
        <div className="px-5 md:px-6 py-3 border-b border-border bg-bg-secondary flex flex-col gap-2">
          {/* Single letters */}
          <div className="flex flex-wrap gap-1 items-center justify-center sm:justify-start">
            <button
              onClick={() => { setSelectedLetter(''); fetchOdps(1, searchInput, ''); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedLetter === '' ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`}
            >
              Semua
            </button>
            <div className="w-px h-4 bg-border mx-1"></div>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => { setSelectedLetter(letter); fetchOdps(1, searchInput, letter); }}
                className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-lg transition-all ${selectedLetter === letter ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`}
              >
                {letter}
              </button>
            ))}
          </div>
          {/* Double letters AA-AZ */}
          <div className="flex flex-wrap gap-1 items-center justify-center sm:justify-start">
            <span className="text-[10px] font-semibold text-text-muted mr-1 uppercase tracking-wider">AA–AZ</span>
            <div className="w-px h-4 bg-border mx-1"></div>
            {doubleAlphabet.map(letter => (
              <button
                key={letter}
                onClick={() => { setSelectedLetter(letter); fetchOdps(1, searchInput, letter); }}
                className={`px-2 h-7 flex items-center justify-center text-xs font-medium rounded-lg transition-all ${selectedLetter === letter ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`}
              >
                {letter}
              </button>
            ))}
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
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex items-center justify-center py-16 text-text-muted">
                      <div className="w-5 h-5 border-2 border-border border-t-text-primary rounded-full animate-spin mr-2" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : odpData.map((odp) => {
                const status = getStatusLabel(odp)
                const color  = getODPColor(odp)
                return (
                  <tr
                    key={odp.id}
                    onClick={() => setSelectedODP(odp)}
                    onDoubleClick={() => navigate(`/odp/${encodeURIComponent(odp.id)}`)}
                    className={`cursor-pointer table-row-hover ${selectedODP?.id === odp.id ? 'bg-accent/5 shadow-[inset_2px_0_0_#3b82f6]' : ''}`}
                  >
                    <td className="px-5 md:px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: color, boxShadow: `0 0 10px ${color}88` }} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{odp.name}</p>
                          <p className="text-xs text-text-muted mt-0.5 truncate">{odp.note || 'Tidak ada keterangan'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs font-mono bg-bg-tertiary/80 border border-border/50 px-2.5 py-1 rounded-lg text-text-secondary">{odp.type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-text-primary mb-1.5">{odp.usedPorts || 0}/{odp.totalPorts || 0}</div>
                      <div className="w-20 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, ((odp.usedPorts || 0) / (odp.totalPorts || 1)) * 100)}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${status.class} border-current/20`}>
                          {status.text}
                        </span>
                        {isFullAccess && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingOdp(odp)
                              setIsEditModalOpen(true)
                            }}
                            className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors ml-2"
                            title="Edit ODP"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {!loading && odpData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-bg-tertiary/50 flex items-center justify-center mb-4">
                <Radio size={32} className="opacity-50" />
              </div>
              <p className="text-sm font-medium">Tidak ada ODP ditemukan</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-bg-primary sticky bottom-0">
              <span className="text-xs text-text-muted">Halaman {page} dari {totalPages} ({total} ODP)</span>
              <div className="flex items-center gap-2">
                <button onClick={() => fetchOdps(page - 1, search, selectedLetter)} disabled={page <= 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-bg-secondary text-text-primary hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ← Prev
                </button>
                <span className="text-xs font-mono text-text-secondary px-2">{page} / {totalPages}</span>
                <button onClick={() => fetchOdps(page + 1, search, selectedLetter)} disabled={page >= totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-bg-secondary text-text-primary hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  Next →
                </button>
              </div>
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
          <TileLayer 
            key={isDark ? 'dark' : 'light'}
            url={`https://{s}.basemaps.cartocdn.com/${isDark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`} 
          />
          {odpData.map(odp => {
            const lat = Number(odp.lat)
            const lng = Number(odp.lng)
            if (!lat || !lng) return null
            return (
              <Marker
                key={odp.id}
                position={[lat, lng]}
                icon={createMiniIcon(selectedODP?.id === odp.id ? '#ffffff' : getODPColor(odp))}
              />
            )
          })}
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
              onClick={() => navigate(`/odp/${encodeURIComponent(selectedODP.id)}`)}
              className="w-full py-2 text-sm font-medium text-bg-primary bg-text-primary hover:bg-zinc-200 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Lihat Detail Penuh →
            </button>
          </div>
        )}
      </div>

      <AddOdpModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={() => fetchOdps(1, search, selectedLetter)}
      />

      <EditOdpModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchOdps(1, search, selectedLetter)}
        odpData={editingOdp}
      />
    </div>
  )
}
