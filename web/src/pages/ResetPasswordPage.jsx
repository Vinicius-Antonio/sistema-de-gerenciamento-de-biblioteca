import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import './LoginPage.css' // Reusing LoginPage styles

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'Token de recuperação não fornecido na URL.' })
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    if (!token) {
      setStatus({ type: 'error', message: 'Token inválido ou não encontrado.' })
      return
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'As senhas não coincidem.' })
      return
    }

    if (password.length < 6) {
      setStatus({ type: 'error', message: 'A senha deve ter no mínimo 6 caracteres.' })
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/reset-password', { token, password })
      setStatus({ type: 'success', message: response.message || 'Senha redefinida com sucesso!' })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
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
                <path d="M12 17v-3"/>
              </svg>
            </div>
          </div>
          <h2 className="login-visual-title">Redefinir Senha</h2>
          <p className="login-visual-desc">
            Crie uma nova senha segura para acessar o sistema de gerenciamento de biblioteca.
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
              <p className="login-form-brand-sub">Nova Senha</p>
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

          {!success && (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="reset-password" className="login-label">Nova Senha</label>
                <div className="login-input-wrapper">
                  <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || !token}
                  />
                  <button
                    type="button"
                    className="login-toggle-pass"
                    onClick={() => setShowPassword(!showPassword)}
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

              <div className="login-field">
                <label htmlFor="reset-confirm-password" className="login-label">Confirmar Nova Senha</label>
                <div className="login-input-wrapper">
                  <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading || !token}
                  />
                </div>
              </div>

              <div className="login-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg login-submit"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <>
                      <span className="login-btn-spinner"></span>
                      Redefinindo...
                    </>
                  ) : (
                    'Redefinir Senha'
                  )}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--teal)', textAlign: 'center', textDecoration: 'none' }}>
                    Voltar para o Login
                  </Link>
                </div>
              </div>
            </form>
          )}

          {success && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Você será redirecionado para a página de login em instantes...
              </p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                Ir para o Login Agora
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
