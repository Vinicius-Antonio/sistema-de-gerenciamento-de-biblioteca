import DashboardLayout from '../components/DashboardLayout'
import './ReportsPage.css'

const summary = [
  { label: 'Total de Livros', value: '1.284', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ), color: 'var(--teal)', bg: 'var(--teal-light)', variation: '+12 este mês' },
  { label: 'Leitores Ativos', value: '347', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ), color: 'var(--navy)', bg: 'rgba(27, 42, 74, 0.08)', variation: '+23 este mês' },
  { label: 'Empréstimos Ativos', value: '89', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ), color: 'var(--green)', bg: 'var(--green-light)', variation: '5 vencem esta semana' },
  { label: 'Atrasos', value: '7', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ), color: 'var(--coral)', bg: 'var(--coral-light)', variation: '-2 vs. mês passado' },
]

const recentLoans = [
  { reader: 'Dosia Kara', book: 'Orgulho e Preconceito', date: '28/06/2023', type: 'Empréstimo' },
  { reader: 'Maria Gatto', book: 'Cem Anos de Solidão', date: '27/06/2023', type: 'Devolução' },
  { reader: 'Carla Ferrer', book: 'A Forma da Água', date: '26/06/2023', type: 'Empréstimo' },
  { reader: 'Elisa Maris', book: 'O Cortiço', date: '25/06/2023', type: 'Empréstimo' },
  { reader: 'Karol Narcour', book: 'Ciência e Inovação', date: '24/06/2023', type: 'Devolução' },
]

const frequentReaders = [
  { name: 'Dosia Kara', loans: 14, avatar: 'DK' },
  { name: 'Maria Gatto', loans: 11, avatar: 'MG' },
  { name: 'Carla Ferrer', loans: 9, avatar: 'CF' },
  { name: 'Elisa Maris', loans: 8, avatar: 'EM' },
  { name: 'Jemies Denos', loans: 7, avatar: 'JD' },
]

const popularCategories = [
  { name: 'Romance', qty: 312, pct: 24 },
  { name: 'Ficção', qty: 278, pct: 22 },
  { name: 'Literatura Brasileira', qty: 196, pct: 15 },
  { name: 'História', qty: 164, pct: 13 },
  { name: 'Ciências', qty: 142, pct: 11 },
  { name: 'Outros', qty: 192, pct: 15 },
]

const categoryColors = ['var(--teal)', 'var(--navy)', 'var(--coral)', 'var(--amber)', 'var(--green)', 'var(--gray-badge)']

export default function ReportsPage() {
  return (
    <DashboardLayout title="Relatórios">
      {/* Resumo Cards */}
      <div className="rel-summary">
        {summary.map((item, i) => (
          <div key={item.label} className={`rel-summary-card card animate-in stagger-${i + 1}`}>
            <div className="rel-summary-icon" style={{ background: item.bg, color: item.color }}>
              {item.icon}
            </div>
            <div className="rel-summary-info">
              <span className="rel-summary-label">{item.label}</span>
              <span className="rel-summary-value">{item.value}</span>
              <span className="rel-summary-change">{item.variation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de relatórios */}
      <div className="rel-grid">
        {/* Categorias Populares */}
        <div className="card rel-card animate-in stagger-5">
          <h3 className="rel-card-title">Categorias Mais Populares</h3>
          <div className="rel-categories">
            {popularCategories.map((cat, i) => (
              <div key={cat.name} className="rel-cat-row">
                <div className="rel-cat-info">
                  <span className="rel-cat-name">{cat.name}</span>
                  <span className="rel-cat-qty">{cat.qty} livros</span>
                </div>
                <div className="rel-cat-bar-track">
                  <div
                    className="rel-cat-bar-fill"
                    style={{ width: `${cat.pct * 3.5}%`, background: categoryColors[i] }}
                  ></div>
                </div>
                <span className="rel-cat-pct">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leitores Frequentes */}
        <div className="card rel-card animate-in stagger-6">
          <h3 className="rel-card-title">Leitores Mais Frequentes</h3>
          <div className="rel-readers">
            {frequentReaders.map((reader, i) => (
              <div key={reader.name} className="rel-reader-row">
                <span className="rel-reader-rank">#{i + 1}</span>
                <div className="rel-reader-avatar">{reader.avatar}</div>
                <span className="rel-reader-name">{reader.name}</span>
                <span className="rel-reader-count">{reader.loans} empréstimos</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="card rel-card rel-card--wide animate-in stagger-7">
          <h3 className="rel-card-title">Atividade Recente</h3>
          <div className="rel-activity">
            {recentLoans.map((item, i) => (
              <div key={i} className="rel-activity-row">
                <div className={`rel-activity-dot ${item.type === 'Empréstimo' ? 'rel-activity-dot--emp' : 'rel-activity-dot--dev'}`}></div>
                <div className="rel-activity-info">
                  <span className="rel-activity-main">
                    <strong>{item.reader}</strong> — {item.type.toLowerCase()} de <em>{item.book}</em>
                  </span>
                  <span className="rel-activity-date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
