import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import { Cable, Plus, Trash2, Save, X, MousePointer, MapPin, Download, Upload } from 'lucide-react'
import { getOdps } from '../api'
import { useOLTLocation } from '../hooks/useOLTLocation'
import { useDarkMode } from '../hooks/useDarkMode'

const pathColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#ef4444']

function createIcon(color, size = 20) {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 8px ${color}66;"></div>`
  })
}

const oltIcon = L.divIcon({
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  html: `<div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:2px solid white;box-shadow:0 0 12px rgba(59,130,246,0.5);display:flex;align-items:center;justify-content:center;font-size:12px;color:white;">⚡</div>`
})

const drawIcon = L.divIcon({
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#f59e0b;border:2px solid white;box-shadow:0 0 10px #f59e0b88;cursor:grab;"></div>`
})

// Component to capture map clicks
function MapClickHandler({ isDrawing, onMapClick }) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onMapClick([e.latlng.lat, e.latlng.lng])
      }
    }
  })
  return null
}

const STORAGE_KEY = 'netmanager_custom_paths'

function loadPaths() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePaths(paths) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paths))
}

export default function PathsPage() {
  const [odpData, setOdpData] = useState([])
  const [loading, setLoading] = useState(true)
  const [customPaths, setCustomPaths] = useState(loadPaths)
  const [selectedPath, setSelectedPath] = useState(null)
  const isDark = useDarkMode()
  const { location: oltLoc, updateLocation } = useOLTLocation()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isFullAccess = user.roleId === '1' || user.roleId === 1

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawPoints, setDrawPoints] = useState([])
  const [newPathName, setNewPathName] = useState('')
  const [newPathCable, setNewPathCable] = useState('FO 12 Core')

  // Server config state
  const [showServerConfig, setShowServerConfig] = useState(false)
  const [serverNameInput, setServerNameInput] = useState(oltLoc.name || '')
  const [serverAddressInput, setServerAddressInput] = useState(oltLoc.address || '')

  useEffect(() => {
    setServerNameInput(oltLoc.name || '')
    setServerAddressInput(oltLoc.address || '')
  }, [oltLoc.name, oltLoc.address])

  const handleSaveServerConfig = () => {
    updateLocation(oltLoc.lat, oltLoc.lng, serverNameInput, serverAddressInput)
    alert('Informasi server berhasil diperbarui!')
    setShowServerConfig(false)
  }

  useEffect(() => {
    getOdps().then(data => { setOdpData(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { savePaths(customPaths) }, [customPaths])

  const mapCenter = [-6.905, 107.610]

  const handleMapClick = (latlng) => {
    setDrawPoints(prev => [...prev, latlng])
  }

  const handleStartDraw = () => {
    setIsDrawing(true)
    setDrawPoints([])
    setNewPathName('')
    setNewPathCable('FO 12 Core')
    setSelectedPath(null)
  }

  const handleCancelDraw = () => {
    setIsDrawing(false)
    setDrawPoints([])
  }

  const handleSavePath = () => {
    if (drawPoints.length < 2 || !newPathName.trim()) return
    const newPath = {
      id: `CPATH-${Date.now()}`,
      name: newPathName.trim(),
      cableType: newPathCable,
      coordinates: drawPoints,
      createdAt: new Date().toISOString()
    }
    setCustomPaths(prev => [...prev, newPath])
    setIsDrawing(false)
    setDrawPoints([])
  }

  const handleDeletePath = (id) => {
    setCustomPaths(prev => prev.filter(p => p.id !== id))
    if (selectedPath?.id === id) setSelectedPath(null)
  }

  const handleUndoPoint = () => {
    setDrawPoints(prev => prev.slice(0, -1))
  }

  const handleExportPaths = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customPaths));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "jalur_fo_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const handleImportPaths = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          setCustomPaths(parsed);
          alert('Berhasil mengimpor data jalur kabel!');
        } else {
          alert('Format file backup tidak sesuai (harus berupa array jalur)!');
        }
      } catch (err) {
        alert('Gagal membaca file backup, pastikan format JSON valid!');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  }

  const fileInputRef = useRef(null);

  if (loading) return <div className="p-8 text-text-secondary">Loading...</div>

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in relative z-0">
      {/* Side panel */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col border-r border-border min-h-0 bg-bg-primary z-10">
        <div className="p-5 md:p-6 border-b border-border bg-bg-primary flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Jalur Kabel FO</h1>
              <p className="text-sm text-text-muted mt-1 font-medium">{customPaths.length} jalur terdaftar</p>
            </div>
            {!isDrawing && isFullAccess && (
              <button onClick={handleStartDraw} className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shrink-0">
                <Plus size={16} /> <span className="hidden sm:inline">Gambar Jalur</span>
              </button>
            )}
          </div>
          
          {/* Import / Export Backup */}
          {!isDrawing && isFullAccess && (
            <div className="flex items-center gap-2">
              <button onClick={handleExportPaths} className="flex-1 py-1.5 px-3 bg-bg-secondary border border-border text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                <Download size={14} /> Backup (Export)
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-1.5 px-3 bg-bg-secondary border border-border text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                <Upload size={14} /> Restore (Import)
              </button>
              <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImportPaths} />
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {/* Server Config Form */}
          {!isDrawing && isFullAccess && (
            <div className="px-5 py-3 border-b border-border bg-bg-secondary shrink-0">
            <button 
              onClick={() => setShowServerConfig(!showServerConfig)}
              className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline w-full"
            >
              {showServerConfig ? 'Tutup Pengaturan Server' : '⚙️ Edit Nama & Info Server Pusat'}
            </button>
            {showServerConfig && (
              <div className="mt-3 space-y-3 p-3 bg-bg-primary border border-border rounded-lg animate-fade-in">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Nama Server</label>
                  <input type="text" value={serverNameInput} onChange={e => setServerNameInput(e.target.value)} className="w-full px-2.5 py-1.5 text-sm bg-bg-secondary border border-border rounded-md outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Alamat (Opsional)</label>
                  <input type="text" value={serverAddressInput} onChange={e => setServerAddressInput(e.target.value)} className="w-full px-2.5 py-1.5 text-sm bg-bg-secondary border border-border rounded-md outline-none focus:border-accent" />
                </div>
                <div className="text-[10px] text-text-muted italic bg-warning/10 p-2 rounded border border-warning/20">
                  Tip: Untuk menggeser lokasi titik koordinatnya, Anda cukup men-drag & drop langsung lambang petir (⚡) di dalam peta.
                </div>
                <div className="flex gap-2 pt-1">
                   <button onClick={handleSaveServerConfig} className="flex-1 py-1.5 bg-accent text-white rounded-md text-xs font-semibold shadow-md shadow-accent/20 hover:bg-accent/90 transition-colors">
                     Simpan Perubahan
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drawing form */}
        {isDrawing && (
          <div className="p-5 border-b border-border bg-accent/5 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent">
              <MousePointer size={16} />
              Mode Menggambar Aktif
            </div>
            <p className="text-xs text-text-muted">Klik pada peta untuk menambah titik jalur kabel. Minimal 2 titik.</p>
            <input
              type="text"
              placeholder="Nama jalur kabel..."
              value={newPathName}
              onChange={e => setNewPathName(e.target.value)}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm outline-none focus:border-accent"
            />
            <select
              value={newPathCable}
              onChange={e => setNewPathCable(e.target.value)}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm outline-none focus:border-accent appearance-none"
            >
              <option>FO 6 Core</option>
              <option>FO 12 Core</option>
              <option>FO 24 Core</option>
              <option>FO 48 Core</option>
              <option>FO 96 Core</option>
            </select>
            <div className="text-xs text-text-secondary font-mono bg-bg-secondary border border-border rounded-lg px-3 py-2">
              Titik: {drawPoints.length} {drawPoints.length > 0 && `(terakhir: ${drawPoints[drawPoints.length-1][0].toFixed(4)}, ${drawPoints[drawPoints.length-1][1].toFixed(4)})`}
            </div>
            <div className="flex gap-2">
              <button onClick={handleUndoPoint} disabled={drawPoints.length === 0} className="flex-1 px-3 py-2 bg-bg-secondary border border-border rounded-lg text-xs font-medium hover:bg-bg-tertiary transition-colors disabled:opacity-30">
                Undo Titik
              </button>
              <button onClick={handleCancelDraw} className="flex-1 px-3 py-2 bg-danger/10 text-danger border border-danger/20 rounded-lg text-xs font-medium hover:bg-danger/20 transition-colors">
                <X size={14} className="inline mr-1" />Batal
              </button>
              <button onClick={handleSavePath} disabled={drawPoints.length < 2 || !newPathName.trim()} className="flex-1 px-3 py-2 bg-accent text-white rounded-lg text-xs font-medium shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors disabled:opacity-30">
                <Save size={14} className="inline mr-1" />Simpan
              </button>
            </div>
          </div>
        )}

        {/* Path list */}
        <div className="flex-1 p-5 space-y-3">
          {customPaths.length === 0 && !isDrawing && (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <Cable size={40} className="opacity-30 mb-4" />
              <p className="text-sm font-medium">Belum ada jalur kabel</p>
              <p className="text-xs mt-1">Klik "Gambar Jalur" untuk mulai</p>
            </div>
          )}
          {customPaths.map((path, i) => (
            <div
              key={path.id}
              onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
              className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                selectedPath?.id === path.id
                  ? 'bg-bg-tertiary border-accent/30 shadow-sm'
                  : 'bg-bg-secondary border-border hover:border-border-hover hover:bg-bg-tertiary'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-10 rounded-full" style={{ background: pathColors[i % pathColors.length] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{path.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{path.cableType} • {path.coordinates.length} titik</p>
                  </div>
                  {isFullAccess && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeletePath(path.id) }}
                      className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><MapPin size={12} />{path.coordinates.length} titik</span>
                  <span>{new Date(path.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Map */}
    <div className="flex-1 relative min-h-[400px]">
        <MapContainer center={mapCenter} zoom={13} className="w-full h-full" zoomControl={false} attributionControl={false}>
          <TileLayer 
            key={isDark ? 'dark' : 'light'}
            url={`https://{s}.basemaps.cartocdn.com/${isDark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`} 
          />
          <MapClickHandler isDrawing={isDrawing} onMapClick={handleMapClick} />

          {/* OLT */}
          <Marker 
            position={[oltLoc.lat, oltLoc.lng]} 
            icon={oltIcon}
            draggable={isFullAccess && !isDrawing}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                updateLocation(position.lat, position.lng);
              }
            }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-sm">{oltLoc.name}</p>
                <p className="text-xs text-gray-500 mt-1">Pusat Jaringan</p>
                {isFullAccess && !isDrawing && <p className="text-[10px] text-text-muted mt-1 italic">Dapat digeser</p>}
              </div>
            </Popup>
          </Marker>

          {/* ODP markers */}
          {odpData.map(odp => (
            <Marker key={odp.id} position={[odp.lat, odp.lng]} icon={createIcon('#10b981', 16)}>
              <Popup><div className="text-center"><p className="font-bold text-sm">{odp.name}</p><p className="text-xs text-gray-500 mt-0.5">{odp.id}</p></div></Popup>
            </Marker>
          ))}

          {/* Saved paths */}
          {customPaths.map((path, i) => (
            <Polyline
              key={path.id}
              positions={path.coordinates}
              pathOptions={{
                color: pathColors[i % pathColors.length],
                weight: selectedPath?.id === path.id ? 6 : 3,
                opacity: selectedPath ? (selectedPath.id === path.id ? 1 : 0.2) : 0.8,
                lineCap: 'round', lineJoin: 'round'
              }}
              eventHandlers={{ click: () => setSelectedPath(path) }}
            >
              <Popup><div><p className="font-bold text-sm">{path.name}</p><p className="text-xs text-gray-500">{path.cableType}</p></div></Popup>
            </Polyline>
          ))}

          {/* Drawing preview line */}
          {isDrawing && drawPoints.length >= 2 && (
            <Polyline positions={drawPoints} pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.9, dashArray: '8 6' }} />
          )}

          {/* Drawing points */}
          {isDrawing && drawPoints.map((pt, i) => (
            <Marker key={i} position={pt} icon={drawIcon}>
              <Popup><p className="text-xs font-mono">Titik {i+1}: {pt[0].toFixed(5)}, {pt[1].toFixed(5)}</p></Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Drawing mode banner */}
        {isDrawing && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-warning/90 text-black px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2 animate-fade-in">
            <MousePointer size={16} /> Klik peta untuk menambah titik jalur kabel
          </div>
        )}

        {/* Selected path detail overlay */}
        {selectedPath && !isDrawing && (
          <div className="absolute bottom-6 left-6 right-6 z-[1000] card p-5 animate-slide-up max-w-md">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
              <p className="text-base font-bold text-text-primary">{selectedPath.name}</p>
              <button onClick={() => setSelectedPath(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-bg-primary rounded-lg p-3 border border-border">
                <p className="text-text-muted mb-1">Kabel</p>
                <p className="text-sm text-text-primary font-semibold">{selectedPath.cableType}</p>
              </div>
              <div className="bg-bg-primary rounded-lg p-3 border border-border">
                <p className="text-text-muted mb-1">Titik Koordinat</p>
                <p className="text-sm text-text-primary font-semibold">{selectedPath.coordinates.length} titik</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
