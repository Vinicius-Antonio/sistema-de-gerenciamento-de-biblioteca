import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import './BooksPage.css'

const categories = ['Todas', 'Romance', 'Ficção', 'Fantasia', 'Literatura Brasileira', 'Sociologia', 'Direito', 'História', 'Ciências']
const availabilities = ['Todas', 'AVAILABLE', 'UNAVAILABLE']

const statusLabels = {
  AVAILABLE: 'Disponível',
  UNAVAILABLE: 'Indisponível',
}

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

function defaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString()
}

const emptyBook = { title: '', author: '', publisher: 'Desconhecida', publicationYear: 2024, category: 'Ficção', isbn: '', totalQuantity: 1 }

export default function BooksPage() {
  const { isReader } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [availability, setAvailability] = useState('Todas')

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [form, setForm] = useState(emptyBook)

  const [borrowingId, setBorrowingId] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [bookToBorrow, setBookToBorrow] = useState(null)

  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

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

  const openCreate = () => {
    setEditingBook(null)
    setForm(emptyBook)
    setShowModal(true)
  }

  const openEdit = (book) => {
    setEditingBook(book)
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher || 'Desconhecida',
      publicationYear: book.publicationYear || 2024,
      category: book.category || 'Ficção',
      isbn: book.isbn || '',
      totalQuantity: book.totalQuantity || 1,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, form)
      } else {
        await api.post('/books', form)
      }
      setShowModal(false)
      fetchBooks()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteId) return
    try {
      await api.delete(`/books/${confirmDeleteId}`)
      fetchBooks()
    } catch (err) {
      alert(err.message)
    } finally {
      setConfirmDeleteId(null)
    }
  }

  const openBorrowModal = (book) => {
    setBookToBorrow(book)
    setShowBorrowModal(true)
  }

  const confirmBorrow = async () => {
    if (!bookToBorrow) return
    setFeedback(null)
    setBorrowingId(bookToBorrow.id)
    setShowBorrowModal(false)
    try {
      await api.post('/loans', { bookId: bookToBorrow.id, dueDate: defaultDueDate() })
      setFeedback({ type: 'success', message: `"${bookToBorrow.title}" emprestado com sucesso! Prazo de devolução: 14 dias.` })
      fetchBooks()
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setBorrowingId(null)
      setBookToBorrow(null)
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
        !isReader && (
          <button className="btn btn-primary" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Livro
          </button>
        )
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
            <option key={d} value={d}>{d === 'Todas' ? 'Disponibilidade' : statusLabels[d]}</option>
          ))}
        </select>
      </div>

      {feedback && (
        <div className={feedback.type === 'success' ? 'acervo-feedback acervo-feedback--success' : 'acervo-feedback acervo-feedback--error'}>
          {feedback.message}
        </div>
      )}

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
                  <span className={getStatusBadgeClass(book.status)}>{statusLabels[book.status] || book.status}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{book.availableQuantity}/{book.totalQuantity}</span>
                </div>

                {!isReader && (
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.6rem' }}>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', background: 'rgba(14,165,233,0.1)', color: '#0284c7' }} onClick={() => openEdit(book)}>Editar</button>
                    <button className="btn" style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#ef4444' }} onClick={() => handleDeleteClick(book.id)}>Excluir</button>
                  </div>
                )}

                {isReader && (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.6rem', padding: '0.4rem' }}
                    disabled={book.availableQuantity <= 0 || borrowingId === book.id}
                    onClick={() => openBorrowModal(book)}
                  >
                    {borrowingId === book.id ? 'Emprestando...' : book.availableQuantity > 0 ? 'Pegar Emprestado' : 'Indisponível'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="card modal-card">
            <h3 className="modal-title">{editingBook ? 'Editar Livro' : 'Novo Livro'}</h3>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="book-title">Título</label>
                <input id="book-title" required className="input-field" placeholder="Título" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label htmlFor="book-author">Autor</label>
                <input id="book-author" required className="input-field" placeholder="Autor" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
              </div>
              <div>
                <label htmlFor="book-category">Categoria</label>
                <select id="book-category" className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="book-qty">Quantidade Total</label>
                <input id="book-qty" type="number" required className="input-field" placeholder="Quantidade" value={form.totalQuantity} onChange={e => setForm({...form, totalQuantity: parseInt(e.target.value)})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingBook ? 'Salvar' : 'Criar Livro'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBorrowModal && bookToBorrow && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowBorrowModal(false) }}>
          <div className="card modal-card" style={{ maxWidth: '400px' }}>
            <h3 className="modal-title">Confirmar Empréstimo</h3>
            <p style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              Deseja realmente pegar emprestado o livro <strong style={{ color: 'var(--text)' }}>"{bookToBorrow.title}"</strong>?
            </p>
            <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--navy)' }}>
              Você terá <strong>14 dias</strong> para devolvê-lo.
            </p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowBorrowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={confirmBorrow}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Excluir Livro"
        message="Tem certeza que deseja excluir este livro do acervo?"
        confirmText="Excluir"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </DashboardLayout>
  )
}
