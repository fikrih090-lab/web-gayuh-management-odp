import { Database, Download, Upload, AlertTriangle } from 'lucide-react';

export default function DatabaseSettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border mb-4">
            <Download size={28} className="text-text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Backup Database</h3>
          <p className="text-sm text-text-muted mb-6 flex-grow">Download salinan seluruh data pelanggan, tagihan, dan konfigurasi jaringan.</p>
          <button 
            onClick={() => alert('Memulai download backup...')}
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
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".sql" onChange={() => alert('File dipilih')} />
            <button className="w-full bg-bg-tertiary text-text-primary border border-border px-4 py-2 rounded-lg font-medium hover:bg-bg-elevated transition-colors">
              Pilih File Backup
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-red-500">Peringatan Penting</h4>
          <p className="text-sm text-text-muted mt-1">Selalu pastikan Anda memiliki backup terbaru sebelum melakukan restore. Proses restore tidak dapat dibatalkan.</p>
        </div>
      </div>
    </div>
  );
}
