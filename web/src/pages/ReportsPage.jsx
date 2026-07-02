import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import './ReportsPage.css'

const categoryColors = ['var(--teal)', 'var(--navy)', 'var(--coral)', 'var(--amber)', 'var(--green)', 'var(--gray-badge)']

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export default function ReportsPage() {
  const [books, setBooks] = useState([])
  const [readers, setReaders] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/books'), api.get('/readers'), api.get('/loans')])
      .then(([booksData, readersData, loansData]) => {
        setBooks(booksData)
        setReaders(readersData)
        setLoans(loansData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Relatórios">
        <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando relatórios...</div>
      </DashboardLayout>
    )
  }

  const totalBooks = books.reduce((sum, b) => sum + (b.totalQuantity || 0), 0)
  const activeReaders = readers.filter(r => r.status === 'ACTIVE').length
  const openLoans = loans.filter(l => l.status === 'OPEN').length
  const lateLoans = loans.filter(l => l.status === 'LATE').length

  const now = new Date()
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const dueSoon = loans.filter(l => l.status === 'OPEN' && new Date(l.dueDate) <= in7Days).length

  const summary = [
    {
      label: 'Total de Livros', value: totalBooks.toLocaleString('pt-BR'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ), color: 'var(--teal)', bg: 'var(--teal-light)', variation: `${books.length} títulos cadastrados`
    },
    {
      label: 'Leitores Ativos', value: activeReaders,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ), color: 'var(--navy)', bg: 'rgba(27, 42, 74, 0.08)', variation: `${readers.length - activeReaders} inativos`
    },
    {
      label: 'Empréstimos Ativos', value: openLoans,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <polyline points="7 23 3 19 7 15"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
      ), color: 'var(--green)', bg: 'var(--green-light)', variation: `${dueSoon} vencem em 7 dias`
    },
    {
      label: 'Atrasos', value: lateLoans,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ), color: 'var(--coral)', bg: 'var(--coral-light)', variation: 'empréstimos vencidos'
    },
  ]

  const categoryMap = {}
  books.forEach(b => {
    const cat = b.category || 'Sem categoria'
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })
  const totalCatBooks = books.length || 1
  const popularCategories = Object.entries(categoryMap)
    .map(([name, qty]) => ({ name, qty, pct: Math.round((qty / totalCatBooks) * 100) }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6)

  const loanCountByReader = {}
  loans.forEach(l => {
    if (!l.reader) return
    const key = l.reader.id
    if (!loanCountByReader[key]) loanCountByReader[key] = { name: l.reader.name, loans: 0 }
    loanCountByReader[key].loans += 1
  })
  const frequentReaders = Object.values(loanCountByReader)
    .sort((a, b) => b.loans - a.loans)
    .slice(0, 5)

  const activity = []
  loans.forEach(l => {
    if (l.reader && l.book) {
      activity.push({ reader: l.reader.name, book: l.book.title, date: l.loanDate, type: 'Empréstimo' })
      if (l.returnDate) {
        activity.push({ reader: l.reader.name, book: l.book.title, date: l.returnDate, type: 'Devolução' })
      }
    }
  })
  const recentActivity = activity
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <DashboardLayout title="Relatórios">
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

      <div className="rel-grid">
        <div className="card rel-card animate-in stagger-5">
          <h3 className="rel-card-title">Categorias Mais Populares</h3>
          <div className="rel-categories">
            {popularCategories.length === 0 && <p>Nenhum livro cadastrado ainda.</p>}
            {popularCategories.map((cat, i) => (
              <div key={cat.name} className="rel-cat-row">
                <div className="rel-cat-info">
                  <span className="rel-cat-name">{cat.name}</span>
                  <span className="rel-cat-qty">{cat.qty} livros</span>
                </div>
                <div className="rel-cat-bar-track">
                  <div
                    className="rel-cat-bar-fill"
                    style={{ width: `${cat.pct}%`, background: categoryColors[i % categoryColors.length] }}
                  ></div>
                </div>
                <span className="rel-cat-pct">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card rel-card animate-in stagger-6">
          <h3 className="rel-card-title">Leitores Mais Frequentes</h3>
          <div className="rel-readers">
            {frequentReaders.length === 0 && <p>Nenhum empréstimo registrado ainda.</p>}
            {frequentReaders.map((reader, i) => (
              <div key={reader.name} className="rel-reader-row">
                <span className="rel-reader-rank">#{i + 1}</span>
                <div className="rel-reader-avatar">{initials(reader.name)}</div>
                <span className="rel-reader-name">{reader.name}</span>
                <span className="rel-reader-count">{reader.loans} empréstimos</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card rel-card rel-card--wide animate-in stagger-7">
          <h3 className="rel-card-title">Atividade Recente</h3>
          <div className="rel-activity">
            {recentActivity.length === 0 && <p>Nenhuma atividade registrada ainda.</p>}
            {recentActivity.map((item, i) => (
              <div key={i} className="rel-activity-row">
                <div className={`rel-activity-dot ${item.type === 'Empréstimo' ? 'rel-activity-dot--emp' : 'rel-activity-dot--dev'}`}></div>
                <div className="rel-activity-info">
                  <span className="rel-activity-main">
                    <strong>{item.reader}</strong> — {item.type.toLowerCase()} de <em>{item.book}</em>
                  </span>
                  <span className="rel-activity-date">{formatDate(item.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
