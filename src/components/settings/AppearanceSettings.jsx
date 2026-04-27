import { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Monitor } from 'lucide-react';

export default function AppearanceSettings() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'system';
  });

  const changeTheme = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('app-theme', themeId);
    if (themeId === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themeId === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Palette className="text-text-muted" size={20} />
          Tema Aplikasi
        </h3>
        <p className="text-sm text-text-muted mb-6">Pilih tema yang paling nyaman untuk mata Anda.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'dark', icon: Moon, title: 'Gelap', desc: 'Nyaman untuk malam hari' },
            { id: 'light', icon: Sun, title: 'Terang', desc: 'Tampilan bersih dan jelas' },
            { id: 'system', icon: Monitor, title: 'Sistem', desc: 'Mengikuti OS' },
          ].map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <div 
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isActive 
                    ? 'border-text-primary bg-bg-tertiary' 
                    : 'border-border bg-bg-tertiary hover:border-text-muted/50'
                }`}
              >
                <theme.icon size={24} className={`mb-3 ${isActive ? 'text-text-primary' : 'text-text-muted'}`} />
                <p className="text-sm font-bold text-text-primary">{theme.title}</p>
                <p className="text-xs text-text-muted mt-1">{theme.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
