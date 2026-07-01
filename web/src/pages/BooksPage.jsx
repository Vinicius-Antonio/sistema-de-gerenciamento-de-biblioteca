import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import './BooksPage.css'

const categories = ['Todas', 'Romance', 'Ficção', 'Fantasia', 'Literatura Brasileira', 'Sociologia', 'Direito', 'História', 'Ciências']
const availabilities = ['Todas', 'AVAILABLE', 'UNAVAILABLE']

function getStatusBadgeClass(status) {
  switch (status) {
    case 'AVAILABLE': return 'badge badge-available'
    case 'UNAVAILABLE': return 'badge badge-unavailable'
    default: return 'badge'
  }
}

function getColor(id) {
  const colors = ['#2D5A7B', '#8B4513', '#1B6B4F', '#6B3A5D', '#4A4A6A', '#2A4858', '#5A3D2B', '#3D5A80', '#6D4C7D']
  return colors[(id || 0) % colors.length]
}

export default function BooksPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [availability, setAvailability] = useState('Todas')
  
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [showModal, setShowModal] = useState(false)
  const [newBook, setNewBook] = useState({ title: '', author: '', publisher: 'Desconhecida', publicationYear: 2024, category: 'Ficção', isbn: '', totalQuantity: 1 })

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await api.get('/books')
      setBooks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/books', newBook)
      setShowModal(false)
      fetchBooks()
      setNewBook({ title: '', author: '', publisher: 'Desconhecida', publicationYear: 2024, category: 'Ficção', isbn: '', totalQuantity: 1 })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza?')) return
    try {
      await api.delete(`/books/${id}`)
      fetchBooks()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredBooks = books.filter((book) => {
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
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Livro
        </button>
      }
    >
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando livros...</div>
      ) : (
        <div className="acervo-grid">
          {filteredBooks.map((book, i) => (
            <div key={book.id} className={`acervo-card card animate-in stagger-${(i % 5) + 1}`}>
              <div className="acervo-cover" style={{ background: `linear-gradient(160deg, ${getColor(book.id)}, ${getColor(book.id)}cc)` }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span className={getStatusBadgeClass(book.status)}>{book.status === 'AVAILABLE' ? 'Disponível' : 'Indisponível'}</span>
                  <button className="btn" style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#ef4444' }} onClick={() => handleDelete(book.id)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>Novo Livro</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required className="input-field" placeholder="Título" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
              <input required className="input-field" placeholder="Autor" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
              <select className="input-field" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})}>
                {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" required className="input-field" placeholder="Quantidade" value={newBook.totalQuantity} onChange={e => setNewBook({...newBook, totalQuantity: parseInt(e.target.value)})} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

