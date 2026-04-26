import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Mock login
    await new Promise(r => setTimeout(r, 800))

    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/')
    } else {
      setError('Username atau password salah')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid pattern - very subtle */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Login card */}
      <div className="relative w-full max-w-md z-10 flex flex-col gap-8">
        {/* Logo section */}
        <div className="text-center animate-fade-in-scale">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-bg-primary border border-border mb-5 shadow-lg shadow-black/20 animate-float overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">PT Gayuh Media Informatika</h1>
          <p className="text-sm text-text-muted mt-2 font-medium">Sistem Manajemen Jaringan ISP</p>
        </div>

        {/* Form card */}
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 animate-fade-in stagger-1">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-xl font-bold text-text-primary">Selamat Datang Kembali</h2>
            <p className="text-sm text-text-muted mt-1.5">Masukkan kredensial untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Username */}
            <div className="animate-fade-in stagger-2 flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Username</label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full bg-bg-primary border border-border rounded-lg text-text-primary px-4 py-3 placeholder:text-text-muted focus:outline-none focus:border-text-secondary focus:ring-1 focus:ring-text-secondary transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="animate-fade-in stagger-3 flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-bg-primary border border-border rounded-lg text-text-primary px-4 py-3 pr-11 placeholder:text-text-muted focus:outline-none focus:border-text-secondary focus:ring-1 focus:ring-text-secondary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 mt-2 bg-danger/10 border border-danger/20 rounded-lg text-sm font-medium text-danger animate-fade-in flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-danger shrink-0"></div>
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-4 animate-fade-in stagger-4">
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-text-primary text-bg-primary font-semibold rounded-lg px-4 py-3.5 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-border animate-fade-in stagger-5">
            <p className="text-xs text-text-muted text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Demo Akses: 
              <span className="text-text-primary font-mono bg-bg-tertiary px-2 py-0.5 rounded border border-border">admin</span> 
              / 
              <span className="text-text-primary font-mono bg-bg-tertiary px-2 py-0.5 rounded border border-border">admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
