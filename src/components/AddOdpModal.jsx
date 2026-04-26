import { useState } from 'react'
import { X, MapPin, HardDrive } from 'lucide-react'
import { createOdp } from '../api'

export default function AddOdpModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    codeOdp: '',
    totalPort: 8,
    latitude: '',
    longitude: ''
  })
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createOdp(formData)
      onAdd()
      onClose()
    } catch (error) {
      console.error('Failed to create ODP:', error)
      alert('Gagal menambah ODP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-bg-primary rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg-secondary/50">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <HardDrive size={18} className="text-accent" />
            Tambah ODP Baru
          </h2>
          <button onClick={onClose} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">Kode ODP</label>
            <input
              type="text"
              required
              placeholder="Contoh: ODP-L1-01"
              value={formData.codeOdp}
              onChange={e => setFormData({ ...formData, codeOdp: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">Total Port</label>
            <select
              value={formData.totalPort}
              onChange={e => setFormData({ ...formData, totalPort: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm appearance-none"
            >
              <option value={8}>8 Port</option>
              <option value={16}>16 Port</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                <MapPin size={14} className="text-text-muted" /> Latitude
              </label>
              <input
                type="text"
                required
                placeholder="-6.9175"
                value={formData.latitude}
                onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                <MapPin size={14} className="text-text-muted" /> Longitude
              </label>
              <input
                type="text"
                required
                placeholder="107.6191"
                value={formData.longitude}
                onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border border-border rounded-xl text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-medium shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan ODP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
