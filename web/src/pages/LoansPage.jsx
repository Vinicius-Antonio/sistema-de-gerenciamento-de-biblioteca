import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import './LoansPage.css'

const mockLoans = [
  { id: 1, reader: 'Loreia Editar', book: 'Otelo', checkoutDate: '25/06/2023', dueDate: '03/01/2023', status: 'Em aberto' },
  { id: 2, reader: 'Marora Tafuora', book: 'Lima', checkoutDate: '25/06/2023', dueDate: '19/01/2023', status: 'Em aberto' },
  { id: 3, reader: 'Marcos Editar', book: 'Gonzales', checkoutDate: '25/04/2023', dueDate: '03/01/2023', status: 'Em aberto' },
  { id: 4, reader: 'Biakris Kossin', book: 'Derrudes Optimus', checkoutDate: '25/04/2023', dueDate: '03/01/2023', status: 'Registrar Devolução' },
  { id: 5, reader: 'Marcos Canara', book: 'Romanta', checkoutDate: '25/06/2023', dueDate: '03/01/2023', status: 'Devolvido' },
  { id: 6, reader: 'Lilena Moois', book: 'Derrudes Meteórico', checkoutDate: '25/06/2023', dueDate: '03/01/2023', status: 'Devolvido' },
  { id: 7, reader: 'Diana Editar', book: 'Derrudes Kantar', checkoutDate: '25/06/2023', dueDate: '03/01/2023', status: 'Devolvido' },
]

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Em aberto': return 'badge badge-open'
    case 'Devolvido': return 'badge badge-returned'
    case 'Atrasado': return 'badge badge-late'
    case 'Registrar Devolução': return 'badge badge-late'
    default: return 'badge'
  }
}

export default function LoansPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const statuses = ['Todos', 'Em aberto', 'Devolvido', 'Atrasado', 'Registrar Devolução']

  const filteredLoans = mockLoans.filter((loan) => {
    const matchSearch =
      loan.reader.toLowerCase().includes(search.toLowerCase()) ||
      loan.book.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Todos' || loan.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <DashboardLayout
      title="Empréstimos"
      actions={
        <button className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Empréstimo
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
            placeholder="Buscar Empréstimo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="emprestimos-filters">
          <span className="filter-label">Filtros por Status, Datas ou Leitor</span>
          <select
            className="input-field emprestimos-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === 'Todos' ? 'Status' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper card">
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
              <tr key={loan.id} className={`animate-in stagger-${i + 1}`}>
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
                <td className="td-name">{loan.reader}</td>
                <td>{loan.book}</td>
                <td>{loan.checkoutDate}</td>
                <td>{loan.dueDate}</td>
                <td><span className={getStatusBadgeClass(loan.status)}>{loan.status}</span></td>
                <td>
                  <button className="btn-icon" aria-label={`Editar empréstimo de ${loan.reader}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
