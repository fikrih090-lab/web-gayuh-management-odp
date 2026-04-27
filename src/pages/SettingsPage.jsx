import { useState } from 'react'
import { Settings, Bell, User, Database, Shield, Palette, Info, ArrowLeft } from 'lucide-react'

// Import components
import ProfileSettings from '../components/settings/ProfileSettings'
import NotificationSettings from '../components/settings/NotificationSettings'
import DatabaseSettings from '../components/settings/DatabaseSettings'
import SecuritySettings from '../components/settings/SecuritySettings'
import AppearanceSettings from '../components/settings/AppearanceSettings'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(null)

  return (
    <div className="h-full overflow-auto animate-fade-in z-0 relative bg-bg-primary">
      <div className="p-5 md:p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-bg-primary -mx-5 -mt-5 p-5 md:p-6 md:-mx-6 md:-mt-6 border-b border-border mb-6">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Pengaturan</h1>
          <p className="text-sm text-text-muted mt-1 font-medium">Konfigurasi aplikasi dan preferensi</p>
        </div>

        {/* Main Content Area */}
        {activeTab ? (
          <div className="space-y-6 animate-fade-in">
            <button 
              onClick={() => setActiveTab(null)}
              className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors mb-2 w-fit px-3 py-1.5 rounded-lg hover:bg-bg-tertiary"
            >
              <ArrowLeft size={16} />
              Kembali ke Pengaturan
            </button>
            
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'notification' && <NotificationSettings />}
            {activeTab === 'database' && <DatabaseSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
          </div>
        ) : (
          <>
            {/* Settings sections */}
            <div className="space-y-4">
              {[
                { id: 'profile', icon: User, title: 'Profil Admin', desc: 'Ubah nama, email, dan password', action: 'Edit Profil' },
                { id: 'notification', icon: Bell, title: 'Notifikasi', desc: 'Atur preferensi notifikasi gangguan', action: 'Konfigurasi' },
                { id: 'database', icon: Database, title: 'Database', desc: 'Backup dan restore data', action: 'Kelola' },
                { id: 'security', icon: Shield, title: 'Keamanan', desc: 'Autentikasi dua faktor dan sesi aktif', action: 'Pengaturan' },
                { id: 'appearance', icon: Palette, title: 'Tampilan', desc: 'Kustomisasi tema dan layout', action: 'Kustomisasi' },
              ].map((item, i) => (
                <div 
                  key={item.id} 
                  className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up group"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border group-hover:bg-bg-elevated transition-all duration-300 shrink-0">
                      <item.icon size={22} className="text-text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-text-primary">{item.title}</p>
                      <p className="text-sm text-text-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab(item.id)}
                    className="text-sm font-medium text-text-primary bg-bg-tertiary border border-border px-5 py-2 rounded-lg hover:bg-bg-elevated transition-all duration-200 self-start sm:self-auto w-full sm:w-auto cursor-pointer"
                  >
                    {item.action}
                  </button>
                </div>
              ))}
            </div>

        {/* App info */}
        <div className="card p-6 mt-8 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info size={16} className="text-text-muted" />
            Tentang Aplikasi
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-text-muted font-medium">Versi</span>
              <span className="text-text-primary font-mono bg-bg-tertiary px-2 py-1 rounded">1.0.0-dev</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-text-muted font-medium">Frontend</span>
              <span className="text-text-primary font-medium">React + Vite + Tailwind v4</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text-muted font-medium">Maps</span>
              <span className="text-text-primary font-medium">Leaflet.js + OpenStreetMap</span>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  )
}
