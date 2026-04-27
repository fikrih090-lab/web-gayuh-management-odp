import { useState, useEffect } from 'react'
import { X, User, MapPin, Phone, Wifi, CreditCard, Plug, HardDrive } from 'lucide-react'
import { createClient, getOdps, getClients } from '../api'

export default function AddClientModal({ isOpen, onClose, onAdd }) {
  const [odpList, setOdpList] = useState([])
  const [clientList, setClientList] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    noWa: '',
    address: '',
    typeId: 'Standard',
    custAmount: 150000,
    idOdp: '',
    noPortOdp: 1,
    latitude: '',
    longitude: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      Promise.all([getOdps(), getClients()])
        .then(([odps, clients]) => {
          setOdpList(odps)
          setClientList(clients)
        })
        .catch(console.error)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const selectedOdpObj = odpList.find(o => String(o.id) === String(formData.idOdp) || String(o.id) === `ODP-${formData.idOdp}`)
      const payload = {
        ...formData,
        targetHost: selectedOdpObj?.hostId || 'default',
        targetDb: selectedOdpObj?.sourceDb || 'gayuh'
      }
      await createClient(payload)
      onAdd()
      onClose()
    } catch (error) {
      console.error('Failed to create Client:', error)
      alert('Gagal menambah Pelanggan')
    } finally {
      setLoading(false)
    }
  }

  const selectedOdp = odpList.find(o => String(o.id) === String(formData.idOdp) || String(o.id) === `ODP-${formData.idOdp}`)
  const totalPorts = selectedOdp ? selectedOdp.totalPorts : 8
  const connectedClients = selectedOdp ? clientList.filter(c => c.odpId === selectedOdp.id) : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-bg-primary rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg-secondary/50">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <User size={18} className="text-accent" />
            Tambah Pelanggan Baru
          </h2>
          <button onClick={onClose} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-secondary border-b border-border pb-2">Data Pribadi</h3>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5"><User size={14} className="text-text-muted" /> Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5"><Phone size={14} className="text-text-muted" /> No. WhatsApp</label>
                <input
                  type="text"
                  required
                  value={formData.noWa}
                  onChange={e => setFormData({ ...formData, noWa: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5"><MapPin size={14} className="text-text-muted" /> Alamat Lengkap</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Latitude</label>
                  <input
                    type="text"
                    required
                    value={formData.latitude}
                    onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg focus:border-accent outline-none text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Longitude</label>
                  <input
                    type="text"
                    required
                    value={formData.longitude}
                    onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg focus:border-accent outline-none text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Network & Billing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-secondary border-b border-border pb-2">Jaringan & Paket</h3>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5"><Wifi size={14} className="text-text-muted" /> Profil Paket</label>
                <select
                  value={formData.typeId}
                  onChange={e => setFormData({ ...formData, typeId: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm appearance-none"
                >
                  <option value="10Mbps">Internet 10Mbps</option>
                  <option value="20Mbps">Internet 20Mbps</option>
                  <option value="30Mbps">Internet 30Mbps</option>
                  <option value="50Mbps">Internet 50Mbps</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5"><CreditCard size={14} className="text-text-muted" /> Tagihan Bulanan (Rp)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.custAmount}
                  onChange={e => setFormData({ ...formData, custAmount: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5"><HardDrive size={14} className="text-text-muted" /> Pilih ODP</label>
                  <select
                    required
                    value={formData.idOdp}
                    onChange={e => setFormData({ ...formData, idOdp: e.target.value, noPortOdp: 1 })}
                    className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg focus:border-accent outline-none text-sm appearance-none"
                  >
                    <option value="">-- Pilih --</option>
                    {odpList.map(o => (
                      <option key={o.id} value={o.id.replace('ODP-', '')}>{o.id}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5"><Plug size={14} className="text-text-muted" /> Port</label>
                  <select
                    value={formData.noPortOdp}
                    onChange={e => setFormData({ ...formData, noPortOdp: Number(e.target.value) })}
                    disabled={!formData.idOdp}
                    className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg focus:border-accent outline-none text-sm appearance-none disabled:opacity-50"
                  >
                    {Array.from({ length: totalPorts }).map((_, i) => {
                      const portNum = i + 1;
                      const isUsed = connectedClients.some(c => Number(c.portNumber) === portNum);
                      return (
                        <option key={portNum} value={portNum} disabled={isUsed} className={isUsed ? 'text-text-muted bg-bg-tertiary' : ''}>
                          Port {portNum} {isUsed ? '(Terpakai)' : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border border-border rounded-xl text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-medium shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Pelanggan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
