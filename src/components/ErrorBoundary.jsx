import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
    this.setState({ info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          background: '#1a1a2e',
          color: '#fff',
          minHeight: '100vh',
          fontFamily: 'monospace'
        }}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            background: '#16213e',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid #e53e3e'
          }}>
            <h2 style={{ color: '#fc8181', marginBottom: '1rem', fontSize: '1.25rem' }}>
              ⚠️ Terjadi Error — Halaman Tidak Bisa Dirender
            </h2>
            <p style={{ color: '#fed7d7', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Tangkap error ini dan kirim ke developer untuk diperbaiki:
            </p>
            <div style={{
              background: '#0d1117',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #e53e3e',
              overflowX: 'auto'
            }}>
              <p style={{ color: '#f6ad55', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Error:
              </p>
              <pre style={{ color: '#fc8181', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {this.state.error?.toString()}
              </pre>
            </div>
            {this.state.info && (
              <div style={{
                background: '#0d1117',
                borderRadius: '8px',
                padding: '1rem',
                border: '1px solid #4a5568',
                overflowX: 'auto'
              }}>
                <p style={{ color: '#90cdf4', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Component Stack:
                </p>
                <pre style={{ color: '#a0aec0', fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>
                  {this.state.info.componentStack}
                </pre>
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, info: null })
                window.location.href = '/'
              }}
              style={{
                marginTop: '1.5rem',
                background: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
