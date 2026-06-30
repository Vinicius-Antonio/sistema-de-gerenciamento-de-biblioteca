import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import './AcervoPage.css'

const livrosMock = [
  { id: 1, titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', categoria: 'Romance', status: 'Disponível', cor: '#2D5A7B' },
  { id: 2, titulo: 'Cem Anos de Solidão', autor: 'Gabriel García Márquez', categoria: 'Ficção', status: 'Emprestado', cor: '#8B4513' },
  { id: 3, titulo: 'A Forma da Água', autor: 'Guillermo del Toro', categoria: 'Fantasia', status: 'Disponível', cor: '#1B6B4F' },
  { id: 4, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', categoria: 'Literatura Brasileira', status: 'Disponível', cor: '#6B3A5D' },
  { id: 5, titulo: 'Desencantadas do Mundo', autor: 'Autor Brasileiro', categoria: 'Ficção', status: 'Indisponível', cor: '#4A4A6A' },
  { id: 6, titulo: 'Democracia Sócio-Brasileira', autor: 'Autor Brasileiro', categoria: 'Sociologia', status: 'Emprestado', cor: '#2A4858' },
  { id: 7, titulo: 'A Hermenêutica do Direito', autor: 'Autor Brasileiro', categoria: 'Direito', status: 'Disponível', cor: '#5A3D2B' },
  { id: 8, titulo: 'Conhecimento do Barroco', autor: 'Autor Brasileiro', categoria: 'História', status: 'Disponível', cor: '#3D5A80' },
  { id: 9, titulo: 'Ciência e Inovação', autor: 'Autor Brasileiro', categoria: 'Ciências', status: 'Indisponível', cor: '#6D4C7D' },
]

const categorias = ['Todas', 'Romance', 'Ficção', 'Fantasia', 'Literatura Brasileira', 'Sociologia', 'Direito', 'História', 'Ciências']
const disponibilidades = ['Todas', 'Disponível', 'Emprestado', 'Indisponível']

function statusBadgeClass(status) {
  switch (status) {
    case 'Disponível': return 'badge badge-available'
    case 'Emprestado': return 'badge badge-borrowed'
    case 'Indisponível': return 'badge badge-unavailable'
    default: return 'badge'
  }
}

export default function AcervoPage() {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [disponibilidade, setDisponibilidade] = useState('Todas')

  const filtrados = livrosMock.filter((l) => {
    const matchBusca = l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      l.autor.toLowerCase().includes(busca.toLowerCase())
    const matchCat = categoria === 'Todas' || l.categoria === categoria
    const matchDisp = disponibilidade === 'Todas' || l.status === disponibilidade
    return matchBusca && matchCat && matchDisp
  })

  return (
    <DashboardLayout
      title="Acervo"
      actions={
        <button className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Livro
        </button>
      }
    >
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="input-field"
            placeholder="Buscar por título ou autor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select
          className="input-field acervo-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {categorias.map((c) => (
            <option key={c} value={c}>{c === 'Todas' ? 'Categoria' : c}</option>
          ))}
        </select>
        <select
          className="input-field acervo-select"
          value={disponibilidade}
          onChange={(e) => setDisponibilidade(e.target.value)}
        >
          {disponibilidades.map((d) => (
            <option key={d} value={d}>{d === 'Todas' ? 'Disponibilidade' : d}</option>
          ))}
        </select>
      </div>

      {/* Book Grid */}
      <div className="acervo-grid">
        {filtrados.map((livro, i) => (
          <div key={livro.id} className={`acervo-card card animate-in stagger-${i + 1}`}>
            <div className="acervo-cover" style={{ background: `linear-gradient(160deg, ${livro.cor}, ${livro.cor}cc)` }}>
              <div className="acervo-cover-spine"></div>
              <div className="acervo-cover-lines">
                <div className="acervo-cover-line" style={{ width: '70%' }}></div>
                <div className="acervo-cover-line" style={{ width: '50%' }}></div>
                <div className="acervo-cover-line" style={{ width: '60%' }}></div>
              </div>
              <span className="acervo-cover-title">{livro.titulo}</span>
              <span className="acervo-cover-author">{livro.autor}</span>
            </div>
            <div className="acervo-info">
              <h4 className="acervo-title">{livro.titulo}</h4>
              <p className="acervo-author">{livro.autor}</p>
              <span className={statusBadgeClass(livro.status)}>{livro.status}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
