import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import './RegisterPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'LIBRARIAN',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    
    setLoading(true)
    try {
      const response = await api.post('/users', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      })
      localStorage.setItem('user', JSON.stringify(response))
      navigate('/dashboard/books')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cadastro">
      {/* Left: Visual */}
      <div className="cadastro-visual">
        <div className="cadastro-visual-content">
          <div className="cadastro-visual-shapes">
            <div className="cadastro-shape cadastro-shape--1"></div>
            <div className="cadastro-shape cadastro-shape--2"></div>
            <div className="cadastro-shape cadastro-shape--3"></div>
            <div className="cadastro-shape cadastro-shape--icon">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
          </div>
          <h2 className="cadastro-visual-title">Crie sua conta</h2>
          <p className="cadastro-visual-desc">
            Junte-se ao sistema de gerenciamento de biblioteca e tenha acesso completo ao acervo e funcionalidades.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="cadastro-form-side">
        <div className="cadastro-form-wrapper animate-in">
          <div className="cadastro-form-logo">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="14" fill="var(--navy)"/>
              <g transform="translate(12, 10)">
                <path d="M20 4C20 4 12 2 4 6V38C12 34 20 36 20 36" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M20 4C20 4 28 2 36 6V38C28 34 20 36 20 36" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </g>
            </svg>
            <div>
              <h3 className="cadastro-form-brand">Biblioteca Digital</h3>
              <p className="cadastro-form-brand-sub">Criar Nova Conta</p>
            </div>
          </div>

          {error && <div className="cadastro-error" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div className="cadastro-field">
              <label htmlFor="cad-nome" className="cadastro-label">Nome Completo</label>
              <div className="cadastro-input-wrapper">
                <svg className="cadastro-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="cad-nome"
                  type="text"
                  className="input-field"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={handleChange('name')}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="cad-email" className="cadastro-label">E-mail</label>
              <div className="cadastro-input-wrapper">
                <svg className="cadastro-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 7L2 7"/>
                </svg>
                <input
                  id="cad-email"
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cad-senha" className="cadastro-label">Senha</label>
                <div className="cadastro-input-wrapper">
                  <svg className="cadastro-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="cad-senha"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange('password')}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="cadastro-field">
                <label htmlFor="cad-confirmar" className="cadastro-label">Confirmar Senha</label>
                <div className="cadastro-input-wrapper">
                  <svg className="cadastro-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="cad-confirmar"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="cad-cargo" className="cadastro-label">Cargo</label>
              <select
                id="cad-cargo"
                className="input-field"
                value={form.role}
                onChange={handleChange('role')}
              >
                <option value="LIBRARIAN">Bibliotecário</option>
                <option value="READER">Leitor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <label className="cadastro-checkbox">
              <input type="checkbox" defaultChecked />
              <span>Li e concordo com os <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a></span>
            </label>

            <div className="cadastro-actions">
              <button type="submit" className="btn btn-primary btn-lg cadastro-submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Conta'}
              </button>
              <p className="cadastro-login-link">
                Já tem uma conta? <Link to="/login">Fazer Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
