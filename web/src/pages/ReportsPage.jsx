import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import './ReportsPage.css'

const categoryColors = ['var(--teal)', 'var(--navy)', 'var(--coral)', 'var(--amber)', 'var(--green)', 'var(--gray-badge)']

export default function ReportsPage() {
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [readers, setReaders] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true)
        const [summaryData, categoriesData, readersData, activityData] = await Promise.all([
          api.get('/reports/summary'),
          api.get('/reports/popular-categories'),
          api.get('/reports/frequent-readers'),
          api.get('/reports/recent-activity'),
        ])
        setSummary(summaryData)
        setCategories(categoriesData)
        setReaders(readersData)
        setActivity(activityData)
      } catch (err) {
        console.error('Erro ao carregar relatórios:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Relatórios">
        <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando relatórios...</div>
      </DashboardLayout>
    )
  }

  const summaryCards = [
    { label: 'Total de Livros', value: summary?.totalBooks ?? 0, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ), color: 'var(--teal)', bg: 'var(--teal-light)', variation: `${summary?.totalTitles ?? 0} títulos cadastrados` },
    { label: 'Leitores Ativos', value: summary?.activeReaders ?? 0, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ), color: 'var(--navy)', bg: 'rgba(27, 42, 74, 0.08)', variation: 'com status ativo' },
    { label: 'Empréstimos Ativos', value: summary?.openLoans ?? 0, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ), color: 'var(--green)', bg: 'var(--green-light)', variation: 'em aberto no momento' },
    { label: 'Atrasos', value: summary?.lateLoans ?? 0, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ), color: 'var(--coral)', bg: 'var(--coral-light)', variation: 'pendentes de devolução' },
  ]

  return (
    <DashboardLayout title="Relatórios">
      {/* Resumo Cards */}
      <div className="rel-summary">
        {summaryCards.map((item, i) => (
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
            {categories.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>Nenhum livro cadastrado ainda.</p>
            ) : (
              categories.map((cat, i) => (
                <div key={cat.name} className="rel-cat-row">
                  <div className="rel-cat-info">
                    <span className="rel-cat-name">{cat.name}</span>
                    <span className="rel-cat-qty">{cat.qty} livros</span>
                  </div>
                  <div className="rel-cat-bar-track">
                    <div
                      className="rel-cat-bar-fill"
                      style={{ width: `${cat.pct * 3.5}%`, background: categoryColors[i % categoryColors.length] }}
                    ></div>
                  </div>
                  <span className="rel-cat-pct">{cat.pct}%</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leitores Frequentes */}
        <div className="card rel-card animate-in stagger-6">
          <h3 className="rel-card-title">Leitores Mais Frequentes</h3>
          <div className="rel-readers">
            {readers.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>Nenhum empréstimo registrado ainda.</p>
            ) : (
              readers.map((reader, i) => (
                <div key={reader.name} className="rel-reader-row">
                  <span className="rel-reader-rank">#{i + 1}</span>
                  <div className="rel-reader-avatar">{reader.avatar}</div>
                  <span className="rel-reader-name">{reader.name}</span>
                  <span className="rel-reader-count">{reader.loans} empréstimos</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="card rel-card rel-card--wide animate-in stagger-7">
          <h3 className="rel-card-title">Atividade Recente</h3>
          <div className="rel-activity">
            {activity.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>Nenhuma atividade registrada.</p>
            ) : (
              activity.map((item, i) => (
                <div key={i} className="rel-activity-row">
                  <div className={`rel-activity-dot ${item.type === 'Empréstimo' ? 'rel-activity-dot--emp' : 'rel-activity-dot--dev'}`}></div>
                  <div className="rel-activity-info">
                    <span className="rel-activity-main">
                      <strong>{item.reader}</strong> — {item.type.toLowerCase()} de <em>{item.book}</em>
                    </span>
                    <span className="rel-activity-date">{item.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
