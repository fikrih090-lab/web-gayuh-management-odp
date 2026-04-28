import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Map, Radio, Users, Cable, Activity, Settings,
  Bell, Search, ChevronLeft, ChevronRight, LogOut,
  Menu, X
} from 'lucide-react'

const navItems = [
  { to: '/', icon: Map, label: 'Dashboard' },
  { to: '/odp', icon: Radio, label: 'ODP' },
  { to: '/clients', icon: Users, label: 'Pelanggan' },
  { to: '/paths', icon: Cable, label: 'Jalur Kabel' },
  { to: '/monitoring', icon: Activity, label: 'Monitoring' },
  { to: '/settings', icon: Settings, label: 'Pengaturan' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isFullAccess = user.roleId === '1' || user.roleId === 1

  const currentNavItems = [
    ...navItems,
    ...(isFullAccess ? [{ to: '/users', icon: Users, label: 'Manajemen User' }] : [])
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }} className="bg-bg-primary">

      {/* ===== MOBILE OVERLAY ===== */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 40,
          }}
          className="layout-mobile-overlay"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className="layout-sidebar bg-bg-secondary border-r border-border"
        style={{
          width: collapsed ? '72px' : '260px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          zIndex: 2000,
        }}
        data-open={mobileOpen}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 border-b border-border shrink-0" style={{ height: '64px' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-bg-primary border border-border">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-text-primary tracking-tight whitespace-nowrap truncate">
                PT Gayuh Media Informatika
              </h1>
              <p className="text-[10px] text-text-muted tracking-wider uppercase font-semibold">ISP Network</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {currentNavItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group
                ${isActive
                  ? 'bg-bg-tertiary text-text-primary font-medium'
                  : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    className={`shrink-0 ${isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'}`}
                  />
                  {!collapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border p-3" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-text-secondary hover:text-danger transition-all duration-200"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Keluar</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="layout-collapse-btn flex items-center gap-3 px-3 py-2 rounded-lg w-full text-text-muted hover:text-text-primary transition-all duration-200"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-sm">Perkecil</span>}
          </button>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Header */}
        <header
          className="border-b border-border bg-bg-primary"
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hamburger — dikontrol CSS, bukan JS */}
            <button
              id="hamburger-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="layout-hamburger p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary transition-colors"
              aria-label="Buka menu navigasi"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Search */}
            <div className="relative" style={{ display: 'none' }} id="search-box">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari ODP, pelanggan..."
                className="pl-9 pr-4 py-1.5 text-sm input-modern"
                style={{ width: '280px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="relative p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid var(--color-border)' }}>
              <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-medium text-text-primary border border-border uppercase">
                {user.name ? user.name.substring(0, 2) : 'US'}
              </div>
              <div className="layout-profile-name">
                <p className="text-sm font-medium text-text-primary leading-none capitalize">{user.name || 'User'}</p>
                <p className="text-[10px] text-text-muted leading-none mt-1 uppercase">{isFullAccess ? 'Full Access' : 'Read Only'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto' }} className="bg-bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
