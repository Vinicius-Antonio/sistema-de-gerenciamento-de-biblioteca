import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard/books" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard/books')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login">
      {/* Left: Illustration */}
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="login-visual-shapes">
            <div className="login-shape login-shape--1"></div>
            <div className="login-shape login-shape--2"></div>
            <div className="login-shape login-shape--3"></div>
            <div className="login-shape login-shape--book">
              <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
                <g transform="translate(2, 2)">
                  <path d="M30 6C30 6 18 3 6 9V54C18 48 30 51 30 51" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M30 6C30 6 42 3 54 9V54C42 48 30 51 30 51" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <line x1="12" y1="16" x2="24" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="12" y1="24" x2="22" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="12" y1="32" x2="20" y2="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="36" y1="16" x2="48" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="36" y1="24" x2="46" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="36" y1="32" x2="44" y2="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                </g>
              </svg>
            </div>
          </div>
          <h2 className="login-visual-title">Bem-vindo de volta!</h2>
          <p className="login-visual-desc">
            Acesse o sistema para gerenciar seu acervo, leitores e empréstimos de forma rápida e intuitiva.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="login-form-side">
        <div className="login-form-wrapper animate-in">
          <div className="login-form-logo">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="14" fill="var(--navy)"/>
              <g transform="translate(12, 10)">
                <path d="M20 4C20 4 12 2 4 6V38C12 34 20 36 20 36" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M20 4C20 4 28 2 36 6V38C28 34 20 36 20 36" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </g>
            </svg>
            <div>
              <h3 className="login-form-brand">Biblioteca Digital</h3>
              <p className="login-form-brand-sub">Acesso ao Sistema</p>
            </div>
          </div>

          {error && (
            <div className="login-error animate-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">E-mail</label>
              <div className="login-input-wrapper">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 7L2 7"/>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password" className="login-label">Senha</label>
              <div className="login-input-wrapper">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="login-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg login-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="login-btn-spinner"></span>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
              <p className="login-register-link">
                Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
              </p>
            </div>
          </form>

          <div className="login-demo-accounts">
            <p className="login-demo-title">Contas de demonstração:</p>
            <div className="login-demo-grid">
              <button
                type="button"
                className="login-demo-btn"
                onClick={() => { setEmail('admin@biblioteca.com'); setPassword('senha123') }}
              >
                <span className="login-demo-role">Admin</span>
                <span className="login-demo-email">admin@biblioteca.com</span>
              </button>
              <button
                type="button"
                className="login-demo-btn"
                onClick={() => { setEmail('librarian@biblioteca.com'); setPassword('senha123') }}
              >
                <span className="login-demo-role">Bibliotecário</span>
                <span className="login-demo-email">librarian@biblioteca.com</span>
              </button>
              <button
                type="button"
                className="login-demo-btn"
                onClick={() => { setEmail('dosia@example.com'); setPassword('senha123') }}
              >
                <span className="login-demo-role">Leitor</span>
                <span className="login-demo-email">dosia@example.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
