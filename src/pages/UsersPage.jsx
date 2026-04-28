import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Users, Search, Save, X } from 'lucide-react'
import { getUsers, createUser, updateUser, deleteUser } from '../api'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roleId: '2'
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData)
      } else {
        await createUser(formData)
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (error) {
      alert('Gagal menyimpan data user')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await deleteUser(id)
        fetchUsers()
      } catch (error) {
        alert('Gagal menghapus user')
      }
    }
  }

  const openModal = (user = null) => {
    setEditingUser(user)
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone || '',
        roleId: user.roleId || '2'
      })
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        roleId: '2'
      })
    }
    setIsModalOpen(true)
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col animate-fade-in bg-bg-primary">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-border space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Manajemen User</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">Kelola akun staf dan hak akses aplikasi</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary px-5 py-2 text-sm flex items-center justify-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah User</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm input-modern"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-text-muted">
            <div className="w-6 h-6 border-2 border-border border-t-text-primary rounded-full animate-spin mr-3" />
            <span className="text-sm font-medium">Memuat data...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-bg-secondary/90 backdrop-blur-md z-10">
              <tr className="text-left text-xs text-text-secondary uppercase tracking-wider font-semibold border-b border-border/50">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Role / Akses</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-sm font-medium border border-border uppercase">
                        {u.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{u.name}</p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-secondary">{u.phone || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                      u.roleId === '1' || u.roleId === 1 
                        ? 'bg-accent/10 text-accent border-accent/20' 
                        : 'bg-bg-tertiary text-text-secondary border-border'
                    }`}>
                      {u.roleId === '1' || u.roleId === 1 ? 'Full Access' : 'Read Only'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(u)} className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Users size={32} className="opacity-50 mb-4" />
            <p className="text-sm font-medium">Tidak ada user ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-fade-in-scale">
            <div className="flex items-center justify-between p-5 border-b border-border bg-bg-primary">
              <h3 className="text-lg font-bold text-text-primary">{editingUser ? 'Edit User' : 'Tambah User'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Password {editingUser && '(Kosongkan jika tidak ingin diubah)'}</label>
                <input required={!editingUser} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">No. HP</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Role / Hak Akses</label>
                <select value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})} className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm appearance-none">
                  <option value="1">Full Access (Admin)</option>
                  <option value="2">Read Only (Staf)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-border text-text-secondary rounded-lg text-sm font-medium hover:bg-bg-tertiary transition-colors">
                  Batal
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-text-primary text-bg-primary rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  <Save size={16} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
