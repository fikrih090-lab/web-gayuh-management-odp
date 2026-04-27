import { Shield, Key, Laptop, Trash2 } from 'lucide-react';

export default function SecuritySettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="text-text-muted" size={20} />
            <h3 className="text-lg font-bold text-text-primary">Autentikasi Dua Faktor (2FA)</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-primary after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-text-primary"></div>
          </label>
        </div>
        <p className="text-sm text-text-muted mb-4 ml-7">Tambahkan lapisan keamanan ekstra dengan meminta kode verifikasi saat login.</p>
        <div className="ml-7">
          <button className="text-sm font-medium text-text-primary bg-bg-tertiary border border-border px-4 py-2 rounded-lg hover:bg-bg-elevated transition-all" onClick={() => alert('Fitur setup 2FA sedang dikembangkan')}>
            Setup 2FA
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Laptop className="text-text-muted" size={20} />
          Sesi Aktif
        </h3>
        <p className="text-sm text-text-muted mb-4">Daftar perangkat yang saat ini sedang login ke akun Anda.</p>
        
        <div className="space-y-3">
          {[
            { os: 'Windows - Chrome', ip: '192.168.1.100', active: true, time: 'Sekarang' },
            { os: 'iOS - Safari', ip: '114.122.10.5', active: false, time: '2 hari yang lalu' },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg border border-border">
              <div>
                <p className="text-sm font-bold text-text-primary flex items-center gap-2">
                  {session.os}
                  {session.active && <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Aktif</span>}
                </p>
                <p className="text-xs text-text-muted mt-1">{session.ip} • {session.time}</p>
              </div>
              {!session.active && (
                <button 
                  onClick={() => alert('Sesi berhasil dikeluarkan')}
                  className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Keluarkan Sesi"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
