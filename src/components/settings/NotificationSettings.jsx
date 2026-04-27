import { Bell, Smartphone, Mail, Save } from 'lucide-react';

export default function NotificationSettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Preferensi Notifikasi</h3>
        <p className="text-sm text-text-muted mb-6">Pilih bagaimana Anda ingin menerima notifikasi dari sistem.</p>
        
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email Notifikasi', desc: 'Terima laporan harian dan alert sistem via email', checked: true },
            { icon: Smartphone, title: 'Notifikasi WhatsApp/SMS', desc: 'Alert langsung untuk klien yang jatuh tempo', checked: false },
            { icon: Bell, title: 'Push Notifikasi Web', desc: 'Notifikasi langsung di browser', checked: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-bg-elevated flex items-center justify-center">
                  <item.icon size={20} className="text-text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-primary after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-text-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => alert('Preferensi notifikasi disimpan!')}
          className="bg-text-primary text-bg-primary px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Save size={18} />
          Simpan Preferensi
        </button>
      </div>
    </div>
  );
}
