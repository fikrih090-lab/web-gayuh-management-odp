import { Database, Download, Upload, AlertTriangle, Map } from 'lucide-react';
import { useRef } from 'react';

export default function DatabaseSettings() {
  const fileInputRef = useRef(null);

  const handleBackupFrontend = () => {
    const data = {
      customPaths: localStorage.getItem('netmanager_custom_paths'),
      oltLocation: localStorage.getItem('custom_olt_location')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_map_gayuh_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFrontend = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.customPaths) localStorage.setItem('netmanager_custom_paths', data.customPaths);
        if (data.oltLocation) localStorage.setItem('custom_olt_location', data.oltLocation);
        alert('Berhasil mengembalikan konfigurasi peta. Halaman akan dimuat ulang untuk menerapkan perubahan.');
        window.location.reload();
      } catch (err) {
        alert('File backup tidak valid!');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-border pb-2">
        <Database size={16} /> Database Server
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border mb-4">
            <Download size={28} className="text-text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Backup Database</h3>
          <p className="text-sm text-text-muted mb-6 flex-grow">Download salinan seluruh data pelanggan, tagihan, dan konfigurasi jaringan dari server.</p>
          <button 
            onClick={() => alert('Fitur ini akan segera tersedia saat backend mendukung export SQL penuh.')}
            className="w-full bg-text-primary text-bg-primary px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Download SQL
          </button>
        </div>

        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border mb-4">
            <Upload size={28} className="text-text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Restore Database</h3>
          <p className="text-sm text-text-muted mb-6 flex-grow">Kembalikan data dari file backup sebelumnya. Tindakan ini akan menimpa data saat ini.</p>
          <div className="w-full relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".sql" onChange={() => alert('Fitur restore server belum aktif.')} />
            <button className="w-full bg-bg-tertiary text-text-primary border border-border px-4 py-2 rounded-lg font-medium hover:bg-bg-elevated transition-colors">
              Pilih File Backup
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2 border-b border-border pb-2 mt-8">
        <Map size={16} /> Konfigurasi Peta (Browser)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 flex flex-col items-center text-center bg-accent/5 border-accent/20">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Download size={28} className="text-accent" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Backup Map & Jalur</h3>
          <p className="text-sm text-text-muted mb-6 flex-grow">Download posisi Peta Server (OLT) dan gambar jalur kabel yang Anda buat. Disimpan sebagai format JSON.</p>
          <button 
            onClick={handleBackupFrontend}
            className="w-full bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-opacity shadow-lg shadow-accent/20"
          >
            Download JSON
          </button>
        </div>

        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border mb-4">
            <Upload size={28} className="text-text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Restore Map & Jalur</h3>
          <p className="text-sm text-text-muted mb-6 flex-grow">Kembalikan posisi Peta Server dan gambar jalur dari file JSON. (Untuk pindah ke komputer lain).</p>
          <div className="w-full relative">
            <input 
              ref={fileInputRef}
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              accept=".json" 
              onChange={handleRestoreFrontend} 
            />
            <button className="w-full bg-bg-tertiary text-text-primary border border-border px-4 py-2 rounded-lg font-medium hover:bg-bg-elevated transition-colors">
              Pilih File JSON
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mt-8">
        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-red-500">Peringatan Penting</h4>
          <p className="text-sm text-text-muted mt-1">Selalu simpan file backup JSON di tempat aman agar Anda tidak perlu menggambar ulang jalur jika browser dibersihkan.</p>
        </div>
      </div>
    </div>
  );
}
