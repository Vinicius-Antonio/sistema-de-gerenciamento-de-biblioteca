import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './LoginPage.css' // Reusing LoginPage styles

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setIsLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { email })
      setStatus({ type: 'success', message: response.message || 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login">
      {/* Left: Visual */}
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="login-visual-shapes">
            <div className="login-shape login-shape--1"></div>
            <div className="login-shape login-shape--2"></div>
            <div className="login-shape login-shape--book">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
          <h2 className="login-visual-title">Recuperação de Senha</h2>
          <p className="login-visual-desc">
            Esqueceu sua senha? Não se preocupe, nós te ajudamos a recuperar o acesso à sua conta.
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
              <p className="login-form-brand-sub">Esqueci minha senha</p>
            </div>
          </div>

          {status.message && (
            <div className={`login-error animate-in`} style={{ backgroundColor: status.type === 'success' ? 'var(--teal-light)' : 'var(--coral-light)', color: status.type === 'success' ? 'var(--teal-dark)' : 'var(--coral)', borderColor: status.type === 'success' ? 'var(--teal)' : 'rgba(230, 57, 70, 0.25)' }}>
              {status.type === 'error' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              <span>{status.message}</span>
            </div>
          )}

          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Digite o e-mail associado à sua conta e enviaremos instruções para redefinir sua senha.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="forgot-email" className="login-label">E-mail</label>
              <div className="login-input-wrapper">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 7L2 7"/>
                </svg>
                <input
                  id="forgot-email"
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
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
                    Enviando...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--teal)', textAlign: 'center', textDecoration: 'none' }}>
                  Voltar para o Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
