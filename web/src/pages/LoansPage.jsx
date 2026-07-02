import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import './LoansPage.css'

function getStatusBadgeClass(status) {
  switch (status) {
    case 'OPEN': return 'badge badge-open'
    case 'RETURNED': return 'badge badge-returned'
    case 'LATE': return 'badge badge-late'
    default: return 'badge'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'OPEN': return 'Em aberto'
    case 'RETURNED': return 'Devolvido'
    case 'LATE': return 'Atrasado'
    default: return status
  }
}

export default function LoansPage() {
  const { isReader } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const statuses = ['Todos', 'OPEN', 'RETURNED', 'LATE']

  const [loans, setLoans] = useState([])
  const [books, setBooks] = useState([])
  const [readers, setReaders] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [newLoan, setNewLoan] = useState({ readerId: '', bookId: '', dueDate: '' })

  const fetchAll = async () => {
    try {
      setLoading(true)
      const loansData = await api.get('/loans')
      setLoans(loansData)

      // Only Admin/Librarian can access these endpoints
      if (!isReader) {
        const [booksData, readersData] = await Promise.all([
          api.get('/books'),
          api.get('/readers')
        ])
        setBooks(booksData.filter(b => b.availableQuantity > 0))
        setReaders(readersData.filter(r => r.status === 'ACTIVE'))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/loans', newLoan)
      setShowModal(false)
      fetchAll()
      setNewLoan({ readerId: '', bookId: '', dueDate: '' })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleReturn = async (id) => {
    if (!window.confirm('Confirmar devolução?')) return
    try {
      await api.patch(`/loans/${id}/return`)
      fetchAll()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredLoans = loans.filter((loan) => {
    const readerName = loan.reader?.name || ''
    const bookTitle = loan.book?.title || ''
    const matchSearch =
      readerName.toLowerCase().includes(search.toLowerCase()) ||
      bookTitle.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Todos' || loan.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <DashboardLayout
      title="Empréstimos"
      actions={
        !isReader && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Empréstimo
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
            placeholder="Buscar Empréstimo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="emprestimos-filters">
          <select
            className="input-field emprestimos-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === 'Todos' ? 'Status' : getStatusLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando empréstimos...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Leitor</th>
                <th>Livro</th>
                <th>Data de Saída</th>
                <th>Previsão de Volta</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan, i) => (
                <tr key={loan.id} className={`animate-in stagger-${(i % 5) + 1}`}>
                  <td>
                    <div className="emp-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="17 1 21 5 17 9"/>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                        <polyline points="7 23 3 19 7 15"/>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                      </svg>
                    </div>
                  </td>
                  <td className="td-name">{loan.reader?.name}</td>
                  <td>{loan.book?.title}</td>
                  <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                  <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                  <td><span className={getStatusBadgeClass(loan.status)}>{getStatusLabel(loan.status)}</span></td>
                  <td>
                    {!isReader && loan.status !== 'RETURNED' ? (
                      <button className="btn" style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', fontSize: '0.8rem' }} onClick={() => handleReturn(loan.id)}>
                        Devolver
                      </button>
                    ) : loan.status === 'RETURNED' ? (
                      <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Concluído</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>Novo Empréstimo</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select required className="input-field" value={newLoan.readerId} onChange={e => setNewLoan({...newLoan, readerId: e.target.value})}>
                <option value="">Selecione um Leitor...</option>
                {readers.map(r => <option key={r.id} value={r.id}>{r.name} ({r.documentId})</option>)}
              </select>
              <select required className="input-field" value={newLoan.bookId} onChange={e => setNewLoan({...newLoan, bookId: e.target.value})}>
                <option value="">Selecione um Livro...</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.availableQuantity} disp.)</option>)}
              </select>
              <input type="date" required className="input-field" value={newLoan.dueDate} onChange={e => setNewLoan({...newLoan, dueDate: e.target.value})} />
              
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

