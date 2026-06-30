import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import './BooksPage.css'

const mockBooks = [
  { id: 1, title: 'Orgulho e Preconceito', author: 'Jane Austen', category: 'Romance', status: 'Disponível', color: '#2D5A7B' },
  { id: 2, title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', category: 'Ficção', status: 'Emprestado', color: '#8B4513' },
  { id: 3, title: 'A Forma da Água', author: 'Guillermo del Toro', category: 'Fantasia', status: 'Disponível', color: '#1B6B4F' },
  { id: 4, title: 'O Cortiço', author: 'Aluísio Azevedo', category: 'Literatura Brasileira', status: 'Disponível', color: '#6B3A5D' },
  { id: 5, title: 'Desencantadas do Mundo', author: 'Autor Brasileiro', category: 'Ficção', status: 'Indisponível', color: '#4A4A6A' },
  { id: 6, title: 'Democracia Sócio-Brasileira', author: 'Autor Brasileiro', category: 'Sociologia', status: 'Emprestado', color: '#2A4858' },
  { id: 7, title: 'A Hermenêutica do Direito', author: 'Autor Brasileiro', category: 'Direito', status: 'Disponível', color: '#5A3D2B' },
  { id: 8, title: 'Conhecimento do Barroco', author: 'Autor Brasileiro', category: 'História', status: 'Disponível', color: '#3D5A80' },
  { id: 9, title: 'Ciência e Inovação', author: 'Autor Brasileiro', category: 'Ciências', status: 'Indisponível', color: '#6D4C7D' },
]

const categories = ['Todas', 'Romance', 'Ficção', 'Fantasia', 'Literatura Brasileira', 'Sociologia', 'Direito', 'História', 'Ciências']
const availabilities = ['Todas', 'Disponível', 'Emprestado', 'Indisponível']

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Disponível': return 'badge badge-available'
    case 'Emprestado': return 'badge badge-borrowed'
    case 'Indisponível': return 'badge badge-unavailable'
    default: return 'badge'
  }
}

export default function BooksPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [availability, setAvailability] = useState('Todas')

  const filteredBooks = mockBooks.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'Todas' || book.category === category
    const matchAvailability = availability === 'Todas' || book.status === availability
    return matchSearch && matchCategory && matchAvailability
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field acervo-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'Todas' ? 'Categoria' : c}</option>
          ))}
        </select>
        <select
          className="input-field acervo-select"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          {availabilities.map((d) => (
            <option key={d} value={d}>{d === 'Todas' ? 'Disponibilidade' : d}</option>
          ))}
        </select>
      </div>

      {/* Book Grid */}
      <div className="acervo-grid">
        {filteredBooks.map((book, i) => (
          <div key={book.id} className={`acervo-card card animate-in stagger-${i + 1}`}>
            <div className="acervo-cover" style={{ background: `linear-gradient(160deg, ${book.color}, ${book.color}cc)` }}>
              <div className="acervo-cover-spine"></div>
              <div className="acervo-cover-lines">
                <div className="acervo-cover-line" style={{ width: '70%' }}></div>
                <div className="acervo-cover-line" style={{ width: '50%' }}></div>
                <div className="acervo-cover-line" style={{ width: '60%' }}></div>
              </div>
              <span className="acervo-cover-title">{book.title}</span>
              <span className="acervo-cover-author">{book.author}</span>
            </div>
            <div className="acervo-info">
              <h4 className="acervo-title">{book.title}</h4>
              <p className="acervo-author">{book.author}</p>
              <span className={getStatusBadgeClass(book.status)}>{book.status}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
