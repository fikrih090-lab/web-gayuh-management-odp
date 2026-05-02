import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import 'leaflet/dist/leaflet.css'

import { registerSW } from 'virtual:pwa-register'

// Register PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Versi baru aplikasi tersedia. Muat ulang sekarang?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Aplikasi siap digunakan secara offline.')
  },
})

// Load theme before rendering to prevent flicker
const savedTheme = localStorage.getItem('app-theme') || 'system';
if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
