import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Map, Radio, Users, Cable, Activity, Settings,
  Bell, Search, ChevronLeft, ChevronRight, LogOut,
  Menu, X, Wifi
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
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 h-full flex flex-col
          bg-bg-secondary border-r border-border
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-bg-primary border border-border">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className="text-sm font-bold text-text-primary tracking-tight whitespace-nowrap truncate" title="PT Gayuh Media Informatika">PT Gayuh Media Informatika</h1>
              <p className="text-[10px] text-text-muted tracking-wider uppercase font-semibold">ISP Network</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {currentNavItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative
                ${isActive
                  ? 'bg-bg-tertiary text-text-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary'
                }`
              }
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'}`} />
                  {!collapsed && (
                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-200 group"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Keluar</span>}
          </button>

          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg w-full text-text-muted hover:bg-bg-tertiary hover:text-text-primary transition-all duration-200 group"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-sm">Perkecil</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-bg-primary flex items-center justify-between px-4 md:px-6 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari ODP, pelanggan..."
                className="w-64 lg:w-80 pl-9 pr-4 py-1.5 text-sm input-modern"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary transition-colors group">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-medium text-text-primary border border-border uppercase">
                {user.name ? user.name.substring(0, 2) : 'US'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-text-primary leading-none capitalize">{user.name || 'User'}</p>
                <p className="text-[10px] text-text-muted leading-none mt-1 uppercase">{isFullAccess ? 'Full Access' : 'Read Only'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
