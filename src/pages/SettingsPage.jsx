import { Settings, Bell, User, Database, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="h-full overflow-auto animate-fade-in">
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Pengaturan</h1>
          <p className="text-sm text-text-muted mt-1">Konfigurasi aplikasi dan preferensi</p>
        </div>

        {/* Settings sections */}
        <div className="space-y-4">
          {[
            { icon: User, title: 'Profil Admin', desc: 'Ubah nama, email, dan password', action: 'Edit Profil' },
            { icon: Bell, title: 'Notifikasi', desc: 'Atur preferensi notifikasi gangguan', action: 'Konfigurasi' },
            { icon: Database, title: 'Database', desc: 'Backup dan restore data', action: 'Kelola' },
            { icon: Shield, title: 'Keamanan', desc: 'Autentikasi dua faktor dan sesi aktif', action: 'Pengaturan' },
            { icon: Palette, title: 'Tampilan', desc: 'Kustomisasi tema dan layout', action: 'Kustomisasi' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-secondary border border-border rounded-2xl p-5 flex items-center justify-between hover:border-border-hover transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <item.icon size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
              <button className="text-xs font-medium text-accent bg-accent/10 px-4 py-2 rounded-xl hover:bg-accent/20 transition-colors">
                {item.action}
              </button>
            </div>
          ))}
        </div>

        {/* App info */}
        <div className="bg-bg-secondary border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Tentang Aplikasi</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Versi</span>
              <span className="text-text-primary font-mono">1.0.0-dev</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Frontend</span>
              <span className="text-text-primary">React + Vite + Tailwind v4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Maps</span>
              <span className="text-text-primary">Leaflet.js + OpenStreetMap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
