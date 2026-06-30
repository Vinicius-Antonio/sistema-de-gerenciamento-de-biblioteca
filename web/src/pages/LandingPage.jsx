import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="9" y1="7" x2="16" y2="7"/>
        <line x1="9" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    title: 'Gestão de Acervo',
    desc: 'Cadastre, edite e organize livros com capas, categorias e status de disponibilidade.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
    title: 'Empréstimos Rápidos',
    desc: 'Registre empréstimos e devoluções em poucos cliques, com controle de prazos e atrasos.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Controle de Leitores',
    desc: 'Gerencie cadastros de leitores com dados completos, status e histórico de empréstimos.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    title: 'Relatórios',
    desc: 'Acompanhe métricas do acervo, empréstimos ativos e leitores mais frequentes.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* --- Header --- */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="14" fill="var(--navy)"/>
                <g transform="translate(12, 10)">
                  <path d="M20 4C20 4 12 2 4 6V38C12 34 20 36 20 36" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <path d="M20 4C20 4 28 2 36 6V38C28 34 20 36 20 36" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </g>
              </svg>
            </div>
            <span className="landing-logo-text">
              <strong>Biblioteca</strong> Digital
            </span>
          </div>
          <div className="landing-header-buttons">
            <button className="btn btn-secondary" onClick={() => navigate('/cadastro')}>
              Cadastrar-se
            </button>
            <button className="btn btn-navy" onClick={() => navigate('/login')}>
              Fazer Login
            </button>
          </div>
        </div>
      </header>

      {/* --- Hero --- */}
      <section className="landing-hero">
        <div className="landing-hero-content animate-in">
          <h1 className="landing-hero-title">
            A forma mais inteligente de{' '}
            <span className="landing-hero-highlight">gerenciar sua biblioteca</span>
          </h1>
          <p className="landing-hero-subtitle">
            Sistema rápido, seguro e intuitivo para bibliotecários. Controle acervo, leitores e empréstimos em uma única plataforma.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"/>
              <polyline points="6 17 11 12 6 7"/>
            </svg>
            Acessar o Sistema
          </button>
        </div>
        <div className="landing-hero-visual animate-in stagger-2">
          <div className="hero-illustration">
            <div className="hero-card hero-card--1">
              <div className="hero-card-bar"></div>
              <div className="hero-card-line hero-card-line--w70"></div>
              <div className="hero-card-line hero-card-line--w50"></div>
            </div>
            <div className="hero-card hero-card--2">
              <div className="hero-card-bar"></div>
              <div className="hero-card-line hero-card-line--w80"></div>
              <div className="hero-card-line hero-card-line--w60"></div>
              <div className="hero-card-line hero-card-line--w40"></div>
            </div>
            <div className="hero-card hero-card--3">
              <div className="hero-card-circle"></div>
              <div className="hero-card-line hero-card-line--w90"></div>
              <div className="hero-card-line hero-card-line--w70"></div>
            </div>
            <div className="hero-float hero-float--1"></div>
            <div className="hero-float hero-float--2"></div>
            <div className="hero-float hero-float--3"></div>
          </div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="landing-features">
        <div className="landing-features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`landing-feature-card card animate-in stagger-${i + 3}`}
            >
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="landing-footer-brand">Biblioteca Digital</span>
          <span className="landing-footer-copy">Desenvolvido por Grupo Alpha</span>
        </div>
      </footer>
    </div>
  )
}
