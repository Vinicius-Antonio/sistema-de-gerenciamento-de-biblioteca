import DashboardLayout from '../components/DashboardLayout'
import './RelatoriosPage.css'

const resumo = [
  { label: 'Total de Livros', valor: '1.284', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ), cor: 'var(--teal)', bg: 'var(--teal-light)', variacao: '+12 este mês' },
  { label: 'Leitores Ativos', valor: '347', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ), cor: 'var(--navy)', bg: 'rgba(27, 42, 74, 0.08)', variacao: '+23 este mês' },
  { label: 'Empréstimos Ativos', valor: '89', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ), cor: 'var(--green)', bg: 'var(--green-light)', variacao: '5 vencem esta semana' },
  { label: 'Atrasos', valor: '7', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ), cor: 'var(--coral)', bg: 'var(--coral-light)', variacao: '-2 vs. mês passado' },
]

const emprestimosRecentes = [
  { leitor: 'Dosia Kara', livro: 'Orgulho e Preconceito', data: '28/06/2023', tipo: 'Empréstimo' },
  { leitor: 'Maria Gatto', livro: 'Cem Anos de Solidão', data: '27/06/2023', tipo: 'Devolução' },
  { leitor: 'Carla Ferrer', livro: 'A Forma da Água', data: '26/06/2023', tipo: 'Empréstimo' },
  { leitor: 'Elisa Maris', livro: 'O Cortiço', data: '25/06/2023', tipo: 'Empréstimo' },
  { leitor: 'Karol Narcour', livro: 'Ciência e Inovação', data: '24/06/2023', tipo: 'Devolução' },
]

const leitoresFrequentes = [
  { nome: 'Dosia Kara', emprestimos: 14, avatar: 'DK' },
  { nome: 'Maria Gatto', emprestimos: 11, avatar: 'MG' },
  { nome: 'Carla Ferrer', emprestimos: 9, avatar: 'CF' },
  { nome: 'Elisa Maris', emprestimos: 8, avatar: 'EM' },
  { nome: 'Jemies Denos', emprestimos: 7, avatar: 'JD' },
]

const categoriasPop = [
  { nome: 'Romance', qtd: 312, pct: 24 },
  { nome: 'Ficção', qtd: 278, pct: 22 },
  { nome: 'Literatura Brasileira', qtd: 196, pct: 15 },
  { nome: 'História', qtd: 164, pct: 13 },
  { nome: 'Ciências', qtd: 142, pct: 11 },
  { nome: 'Outros', qtd: 192, pct: 15 },
]

const coresCat = ['var(--teal)', 'var(--navy)', 'var(--coral)', 'var(--amber)', 'var(--green)', 'var(--gray-badge)']

export default function RelatoriosPage() {
  return (
    <DashboardLayout title="Relatórios">
      {/* Resumo Cards */}
      <div className="rel-summary">
        {resumo.map((item, i) => (
          <div key={item.label} className={`rel-summary-card card animate-in stagger-${i + 1}`}>
            <div className="rel-summary-icon" style={{ background: item.bg, color: item.cor }}>
              {item.icon}
            </div>
            <div className="rel-summary-info">
              <span className="rel-summary-label">{item.label}</span>
              <span className="rel-summary-value">{item.valor}</span>
              <span className="rel-summary-change">{item.variacao}</span>
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
            {categoriasPop.map((cat, i) => (
              <div key={cat.nome} className="rel-cat-row">
                <div className="rel-cat-info">
                  <span className="rel-cat-name">{cat.nome}</span>
                  <span className="rel-cat-qty">{cat.qtd} livros</span>
                </div>
                <div className="rel-cat-bar-track">
                  <div
                    className="rel-cat-bar-fill"
                    style={{ width: `${cat.pct * 3.5}%`, background: coresCat[i] }}
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
            {leitoresFrequentes.map((leitor, i) => (
              <div key={leitor.nome} className="rel-reader-row">
                <span className="rel-reader-rank">#{i + 1}</span>
                <div className="rel-reader-avatar">{leitor.avatar}</div>
                <span className="rel-reader-name">{leitor.nome}</span>
                <span className="rel-reader-count">{leitor.emprestimos} empréstimos</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="card rel-card rel-card--wide animate-in stagger-7">
          <h3 className="rel-card-title">Atividade Recente</h3>
          <div className="rel-activity">
            {emprestimosRecentes.map((item, i) => (
              <div key={i} className="rel-activity-row">
                <div className={`rel-activity-dot ${item.tipo === 'Empréstimo' ? 'rel-activity-dot--emp' : 'rel-activity-dot--dev'}`}></div>
                <div className="rel-activity-info">
                  <span className="rel-activity-main">
                    <strong>{item.leitor}</strong> — {item.tipo.toLowerCase()} de <em>{item.livro}</em>
                  </span>
                  <span className="rel-activity-date">{item.data}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
