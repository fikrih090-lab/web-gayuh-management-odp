import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, Plus, Radio, Filter, Navigation, MapPin, Loader2, Crosshair, SortAsc } from 'lucide-react'
import { getOdpsPaged, getOdps, deleteOdp } from '../api'
import AddOdpModal from '../components/AddOdpModal'
import EditOdpModal from '../components/EditOdpModal'
import { useDarkMode } from '../hooks/useDarkMode'
import { useGeolocation } from '../hooks/useGeolocation'
import { getDistanceKm, formatDistance, openGoogleMaps, openWaze } from '../utils/geo'

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

function createUserIcon() {
  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(59,130,246,0.25);
          animation:pulse-ring 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;inset:4px;border-radius:50%;
          background:#3b82f6;border:2.5px solid white;
          box-shadow:0 0 10px rgba(59,130,246,0.7);
        "></div>
      </div>
      <style>
        @keyframes pulse-ring {
          0%{transform:scale(1);opacity:0.8}
          100%{transform:scale(2.5);opacity:0}
        }
      </style>
    `
  })
}

// Komponen untuk fly-to map
function MapFlyTo({ center, zoom }) {
  const map = useMap()
  const prevCenter = useRef(null)
  useEffect(() => {
    if (center && JSON.stringify(center) !== JSON.stringify(prevCenter.current)) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 })
      prevCenter.current = center
    }
  }, [center, zoom, map])
  return null
}

export default function ODPPage() {
  const [odpData, setOdpData]         = useState([])
  const [allOdpData, setAllOdpData]   = useState([])
  const [total, setTotal]             = useState(0)
  const [totalPages, setTotalPages]   = useState(1)
  const [page, setPage]               = useState(1)
  const [loading, setLoading]         = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]           = useState('')
  const [selectedODP, setSelectedODP] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen]   = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingOdp, setEditingOdp]   = useState(null)
  const [deletingOdpId, setDeletingOdpId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedLetter, setSelectedLetter]   = useState('')
  const [sortNearest, setSortNearest] = useState(false)
  const [flyTarget, setFlyTarget]     = useState(null)
  const PAGE_SIZE = 50
  const navigate  = useNavigate()
  const isDark    = useDarkMode()

  const { location: userLocation, loading: gpsLoading, error: gpsError, getLocation, startWatching, stopWatching } = useGeolocation()
  const [isTracking, setIsTracking] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isFullAccess = user.roleId === '1' || user.roleId === 1

  const alphabet       = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
  const doubleAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => `A${l}`)

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

  const fetchAllMapOdps = useCallback(async () => {
    try {
      const res = await getOdps()
      setAllOdpData(res || [])
    } catch (e) {
      console.error('fetchAllMapOdps error:', e)
    }
  }, [])

  useEffect(() => { 
    fetchOdps(1, '', '')
    fetchAllMapOdps()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      fetchOdps(1, searchInput, selectedLetter)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  // Hitung jarak ODP dari user, sort jika aktif (UNTUK TABEL)
  const displayData = (() => {
    if (!userLocation) return odpData
    const withDist = odpData.map(odp => {
      const lat = Number(odp.lat), lng = Number(odp.lng)
      const dist = (lat && lng) ? getDistanceKm(userLocation.lat, userLocation.lng, lat, lng) : Infinity
      return { ...odp, _dist: dist }
    })
    return sortNearest ? [...withDist].sort((a, b) => a._dist - b._dist) : withDist
  })()

  // Hitung jarak ODP dari user (UNTUK PETA - SEMUA ODP)
  const mapDisplayData = (() => {
    if (!userLocation) return allOdpData
    return allOdpData.map(odp => {
      const lat = Number(odp.lat), lng = Number(odp.lng)
      const dist = (lat && lng) ? getDistanceKm(userLocation.lat, userLocation.lng, lat, lng) : Infinity
      return { ...odp, _dist: dist }
    })
  })()

  // Lokasi Saya handler
  const handleMyLocation = async () => {
    try {
      const loc = await getLocation()
      setFlyTarget([loc.lat, loc.lng])
    } catch {}
  }

  // Toggle live tracking
  const handleToggleTracking = () => {
    if (isTracking) {
      stopWatching()
      setIsTracking(false)
    } else {
      startWatching()
      setIsTracking(true)
    }
  }

  // Klik ODP → fly ke marker atau pindah halaman (mobile)
  const handleSelectODP = (odp) => {
    // Di perangkat mobile, langsung pindah ke halaman detail karena panel map disembunyikan
    if (window.innerWidth < 1024) {
      navigate(`/odp/${encodeURIComponent(odp.id)}`)
      return
    }
    
    // Di desktop, tampilkan card di atas map
    setSelectedODP(odp)
    if (odp.lat && odp.lng) setFlyTarget([Number(odp.lat), Number(odp.lng)])
  }

  // Delete ODP handler
  const handleDeleteOdp = async (id) => {
    setDeleteLoading(true)
    try {
      await deleteOdp(id)
      setDeletingOdpId(null)
      if (selectedODP?.id === id) setSelectedODP(null)
      fetchOdps(page, search, selectedLetter)
    } catch (e) {
      alert('Gagal menghapus ODP: ' + (e?.response?.data?.error || e.message))
    } finally {
      setDeleteLoading(false)
    }
  }

  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : (selectedODP?.lat && selectedODP?.lng ? [Number(selectedODP.lat), Number(selectedODP.lng)] : [-6.905, 107.610])

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

        {/* Filter Bar */}
        <div className="px-5 md:px-6 py-3 border-b border-border bg-bg-secondary flex items-center gap-3 flex-wrap">
          <Filter size={14} className="text-text-muted shrink-0" />
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider shrink-0">Filter</span>
          <select
            value={selectedLetter}
            onChange={(e) => {
              const val = e.target.value
              setSelectedLetter(val)
              fetchOdps(1, searchInput, val)
            }}
            className="input-modern text-sm py-1.5 px-3 pr-8 rounded-lg cursor-pointer flex-1 max-w-[200px]"
          >
            <option value="">Semua ODP</option>
            <optgroup label="Huruf Tunggal">
              {alphabet.map(l => <option key={l} value={l}>{l}</option>)}
            </optgroup>
            <optgroup label="Huruf Ganda (AA–AZ)">
              {doubleAlphabet.map(l => <option key={l} value={l}>{l}</option>)}
            </optgroup>
          </select>
          {selectedLetter && (
            <button
              onClick={() => { setSelectedLetter(''); fetchOdps(1, searchInput, '') }}
              className="text-xs text-text-muted hover:text-text-primary transition-colors shrink-0"
            >Reset</button>
          )}

          {/* Sort ODP Terdekat */}
          <button
            onClick={() => {
              if (!userLocation) { handleMyLocation().then(() => setSortNearest(true)); return }
              setSortNearest(v => !v)
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${sortNearest ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'border-border text-text-muted hover:text-text-primary hover:border-accent/50'}`}
          >
            <SortAsc size={13} />
            ODP Terdekat
          </button>
        </div>

        {/* GPS Error notice */}
        {gpsError && (
          <div className="px-5 py-2 bg-danger/5 border-b border-danger/20 text-xs text-danger font-medium flex items-center gap-2">
            <MapPin size={13} /> {gpsError}
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-bg-secondary/90 backdrop-blur-md z-10">
              <tr className="text-left text-xs text-text-secondary uppercase tracking-wider font-semibold border-b border-border/50">
                <th className="px-5 md:px-6 py-4">ODP</th>
                <th className="px-5 py-4 hidden md:table-cell">Tipe</th>
                <th className="px-5 py-4">Port</th>
                <th className="px-5 py-4">Status</th>
                {userLocation && <th className="px-5 py-4 hidden lg:table-cell">Jarak</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-center py-16 text-text-muted">
                      <div className="w-5 h-5 border-2 border-border border-t-text-primary rounded-full animate-spin mr-2" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : displayData.map((odp) => {
                const status = getStatusLabel(odp)
                const color  = getODPColor(odp)
                return (
                  <tr
                    key={odp.id}
                    onClick={() => handleSelectODP(odp)}
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
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingOdp(odp); setIsEditModalOpen(true) }}
                              className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                              title="Edit ODP"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeletingOdpId(odp.id) }}
                              className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                              title="Hapus ODP"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    {userLocation && (
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs font-mono text-text-muted">
                          {odp._dist !== Infinity ? formatDistance(odp._dist) : '—'}
                        </span>
                      </td>
                    )}
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

      {/* Map panel */}
      <div className="hidden lg:block w-[400px] xl:w-[480px] relative">
        <MapContainer
          key={`map`}
          center={mapCenter}
          zoom={13}
          className="w-full h-full border-l border-border"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            key={isDark ? 'dark' : 'light'}
            url={`https://{s}.basemaps.cartocdn.com/${isDark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`}
          />

          {/* Fly to target */}
          {flyTarget && <MapFlyTo center={flyTarget} zoom={selectedODP ? 16 : 15} />}

          {/* ODP markers */}
          {mapDisplayData.map(odp => {
            const lat = Number(odp.lat), lng = Number(odp.lng)
            if (!lat || !lng) return null
            return (
              <Marker
                key={odp.id}
                position={[lat, lng]}
                icon={createMiniIcon(selectedODP?.id === odp.id ? '#ffffff' : getODPColor(odp))}
                eventHandlers={{ click: () => handleSelectODP(odp) }}
              />
            )
          })}

          {/* User location marker */}
          {userLocation && (
            <>
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={createUserIcon()}
              />
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={userLocation.accuracy || 20}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 1.5, dashArray: '4' }}
              />
            </>
          )}
        </MapContainer>

        {/* GPS Buttons overlay (top right) */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={handleMyLocation}
            disabled={gpsLoading}
            title="Lokasi Saya"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-primary/90 backdrop-blur-sm border border-border shadow-lg text-accent hover:bg-accent hover:text-white transition-all duration-200 disabled:opacity-60"
          >
            {gpsLoading ? <Loader2 size={18} className="animate-spin" /> : <Crosshair size={18} />}
          </button>
          <button
            onClick={handleToggleTracking}
            title={isTracking ? 'Stop Tracking' : 'Live Tracking'}
            className={`w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-sm border shadow-lg transition-all duration-200 ${isTracking ? 'bg-accent text-white border-accent shadow-accent/30 animate-pulse' : 'bg-bg-primary/90 border-border text-text-muted hover:text-accent'}`}
          >
            <Navigation size={18} />
          </button>
        </div>

        {/* Selected ODP info overlay */}
        {selectedODP && (
          <div className="absolute bottom-6 left-6 right-6 z-[1000] card p-5 animate-slide-left">
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold text-text-primary tracking-tight">{selectedODP.id}</p>
              <span className="text-xs font-mono bg-bg-tertiary px-2 py-0.5 rounded text-text-secondary border border-border">{selectedODP.type}</span>
            </div>
            <p className="text-sm text-text-secondary mb-1">{selectedODP.address}</p>
            <p className="text-xs text-text-muted mb-1">{selectedODP.note}</p>

            {/* Jarak dari user */}
            {userLocation && selectedODP._dist !== undefined && selectedODP._dist !== Infinity && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1.5 rounded-lg mb-3 w-max">
                <MapPin size={12} />
                {formatDistance(selectedODP._dist)} dari lokasi kamu
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => openGoogleMaps(selectedODP.lat, selectedODP.lng, selectedODP.name)}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all"
              >
                <Navigation size={13} /> Google Maps
              </button>
              <button
                onClick={() => openWaze(selectedODP.lat, selectedODP.lng)}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg bg-[#33ccff]/10 text-[#33ccff] border border-[#33ccff]/20 hover:bg-[#33ccff] hover:text-white transition-all"
              >
                <Navigation size={13} /> Waze
              </button>
            </div>

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
        onAdd={() => {
          fetchOdps(1, search, selectedLetter)
          fetchAllMapOdps()
        }}
      />

      <EditOdpModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updatedOdp) => {
          // Langsung update state lokal agar tampilan berubah seketika
          if (updatedOdp) {
            const updatedCode = (updatedOdp.codeOdp || updatedOdp.idOdp || '').toString().toUpperCase().trim()
            setOdpData(prev => prev.map(o => {
              const code = (o.name || o.id || '').toString().toUpperCase().trim()
              if (code === updatedCode) {
                return {
                  ...o,
                  lat: Number(updatedOdp.latitude) || o.lat,
                  lng: Number(updatedOdp.longitude) || o.lng,
                  totalPorts: Number(updatedOdp.totalPort) || o.totalPorts,
                  coverageOdp: Number(updatedOdp.coverageOdp) || o.coverageOdp,
                  type: updatedOdp.remark || o.type,
                  note: updatedOdp.remark || o.note,
                }
              }
              return o
            }))
            
            // Juga perbarui allOdpData agar sinkron di peta
            setAllOdpData(prev => prev.map(o => {
              const code = (o.name || o.id || '').toString().toUpperCase().trim()
              if (code === updatedCode) {
                return {
                  ...o,
                  lat: Number(updatedOdp.latitude) || o.lat,
                  lng: Number(updatedOdp.longitude) || o.lng,
                }
              }
              return o
            }))
          }
          // Tetap fetch ulang dari server setelah 500ms untuk sinkronisasi
          setTimeout(() => {
            fetchOdps(page, search, selectedLetter)
            fetchAllMapOdps()
          }, 500)
        }}
        odpData={editingOdp}
      />

      {/* Delete Confirmation Modal */}
      {deletingOdpId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-bg-primary rounded-2xl border border-border shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-danger/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">Hapus ODP</h3>
                  <p className="text-xs text-text-muted mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-text-secondary mb-1">
                Kamu akan menghapus ODP:
              </p>
              <p className="text-base font-bold text-danger mb-4 font-mono">{deletingOdpId}</p>
              <p className="text-xs text-text-muted mb-6 bg-warning/5 border border-warning/20 rounded-lg px-3 py-2">
                ⚠️ Semua data pelanggan yang terhubung ke ODP ini mungkin terpengaruh.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingOdpId(null)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border border-border rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteOdp(deletingOdpId)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-danger hover:bg-danger/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-danger/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteLoading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menghapus...</>
                    : '🗑️ Ya, Hapus ODP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
