import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import './EmprestimosPage.css'

const emprestimosMock = [
  { id: 1, leitor: 'Loreia Editar', livro: 'Otelo', dataSaida: '25/06/2023', previsaoVolta: '03/01/2023', status: 'Em aberto' },
  { id: 2, leitor: 'Marora Tafuora', livro: 'Lima', dataSaida: '25/06/2023', previsaoVolta: '19/01/2023', status: 'Em aberto' },
  { id: 3, leitor: 'Marcos Editar', livro: 'Gonzales', dataSaida: '25/04/2023', previsaoVolta: '03/01/2023', status: 'Em aberto' },
  { id: 4, leitor: 'Biakris Kossin', livro: 'Derrudes Optimus', dataSaida: '25/04/2023', previsaoVolta: '03/01/2023', status: 'Registrar Devolução' },
  { id: 5, leitor: 'Marcos Canara', livro: 'Romanta', dataSaida: '25/06/2023', previsaoVolta: '03/01/2023', status: 'Devolvido' },
  { id: 6, leitor: 'Lilena Moois', livro: 'Derrudes Meteórico', dataSaida: '25/06/2023', previsaoVolta: '03/01/2023', status: 'Devolvido' },
  { id: 7, leitor: 'Diana Editar', livro: 'Derrudes Kantar', dataSaida: '25/06/2023', previsaoVolta: '03/01/2023', status: 'Devolvido' },
]

function statusBadgeClass(status) {
  switch (status) {
    case 'Em aberto': return 'badge badge-open'
    case 'Devolvido': return 'badge badge-returned'
    case 'Atrasado': return 'badge badge-late'
    case 'Registrar Devolução': return 'badge badge-late'
    default: return 'badge'
  }
}

export default function EmprestimosPage() {
  const [busca, setBusca] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const statuses = ['Todos', 'Em aberto', 'Devolvido', 'Atrasado', 'Registrar Devolução']

  const filtrados = emprestimosMock.filter((e) => {
    const matchBusca =
      e.leitor.toLowerCase().includes(busca.toLowerCase()) ||
      e.livro.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = statusFilter === 'Todos' || e.status === statusFilter
    return matchBusca && matchStatus
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
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
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
            {filtrados.map((emp, i) => (
              <tr key={emp.id} className={`animate-in stagger-${i + 1}`}>
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
                <td className="td-name">{emp.leitor}</td>
                <td>{emp.livro}</td>
                <td>{emp.dataSaida}</td>
                <td>{emp.previsaoVolta}</td>
                <td><span className={statusBadgeClass(emp.status)}>{emp.status}</span></td>
                <td>
                  <button className="btn-icon" aria-label={`Editar empréstimo de ${emp.leitor}`}>
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
