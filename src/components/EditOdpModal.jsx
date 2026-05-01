import { useState, useEffect } from 'react'
import { X, Save, MapPin } from 'lucide-react'
import { updateOdp } from '../api'

export default function EditOdpModal({ isOpen, onClose, onSuccess, odpData }) {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    totalPorts: 8,
    coverageOdp: 150,
    remark: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (odpData && isOpen) {
      setFormData({
        name: odpData.name || '',
        lat: odpData.lat || '',
        lng: odpData.lng || '',
        totalPorts: odpData.totalPorts || 8,
        coverageOdp: odpData.coverageOdp || 150,
        remark: odpData.remark || ''
      })
    }
  }, [odpData, isOpen])

  const handleLocationPaste = (e) => {
    const text = e.target.value;
    
    // Pattern 1: Google maps URL containing @-6.9175,107.6191
    const urlMatch = text.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (urlMatch) {
      setFormData(prev => ({ ...prev, lat: urlMatch[1], lng: urlMatch[2] }));
      e.target.value = '';
      return;
    }

    // Pattern 2: -6.9175, 107.6191
    const coordMatch = text.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (coordMatch) {
      setFormData(prev => ({ ...prev, lat: coordMatch[1], lng: coordMatch[2] }));
      e.target.value = '';
      return;
    }
  };

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await updateOdp(odpData.id, {
        latitude: String(formData.lat),
        longitude: String(formData.lng),
        totalPort: Number(formData.totalPorts),
        coverageOdp: Number(formData.coverageOdp),
        remark: formData.remark
      })
      // Pass updated odp data back so parent can refresh immediately
      onSuccess(result?.odp || null)
      onClose()
    } catch (error) {
      alert('Gagal memperbarui ODP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-fade-in-scale">
        <div className="flex items-center justify-between p-5 border-b border-border bg-bg-primary">
          <h3 className="text-lg font-bold text-text-primary">Edit Data ODP</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Nama / Kode ODP</label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-muted cursor-not-allowed"
            />
            <p className="text-[10px] text-text-muted mt-1">Nama ODP tidak dapat diubah karena menjadi identifier unik.</p>
          </div>

          <div className="bg-accent/5 p-3 rounded-lg border border-accent/20">
            <label className="block text-xs font-semibold text-accent mb-1 flex items-center gap-1.5"><MapPin size={12} /> Auto Ekstrak Koordinat</label>
            <input
              type="text"
              placeholder="Paste Link Google Maps (Full) atau Titik Koordinat (Misal: -6.91, 107.61)"
              onChange={handleLocationPaste}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm outline-none focus:border-accent"
            />
            <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
              Paste koordinat atau <b>Full URL</b> Google Maps (yang mengandung @lat,lng) ke sini. Latitude dan Longitude di bawah akan otomatis terisi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Latitude</label>
              <input
                required
                type="text"
                value={formData.lat}
                onChange={e => setFormData({...formData, lat: e.target.value})}
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Longitude</label>
              <input
                required
                type="text"
                value={formData.lng}
                onChange={e => setFormData({...formData, lng: e.target.value})}
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Kapasitas Port</label>
              <input
                required
                type="number"
                min="1"
                value={formData.totalPorts}
                onChange={e => setFormData({...formData, totalPorts: e.target.value})}
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Distance / Coverage (m)</label>
              <input
                required
                type="number"
                min="0"
                value={formData.coverageOdp}
                onChange={e => setFormData({...formData, coverageOdp: e.target.value})}
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Keterangan / Remark</label>
            <textarea
              rows="2"
              value={formData.remark}
              onChange={e => setFormData({...formData, remark: e.target.value})}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm outline-none focus:border-accent resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-border text-text-secondary rounded-lg text-sm font-medium hover:bg-bg-tertiary transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-text-primary text-bg-primary rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
