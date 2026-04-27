import { User, Mail, Lock, Save } from 'lucide-react';

export default function ProfileSettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <User className="text-text-muted" size={20} />
          Informasi Dasar
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Nama Lengkap</label>
            <input type="text" className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-text-muted" defaultValue="Admin ISP" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input type="email" className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-text-muted" defaultValue="admin@gayuh.net" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Lock className="text-text-muted" size={20} />
          Ubah Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password Lama</label>
            <input type="password" className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-text-muted" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password Baru</label>
            <input type="password" className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-text-muted" placeholder="••••••••" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => alert('Profil berhasil disimpan!')}
          className="bg-text-primary text-bg-primary px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Save size={18} />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
