import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import './LeitoresPage.css'

const leitoresMock = [
  { id: 1, nome: 'Dosia Kara', cpfRa: '9/05/2027', email: 'ema@alpha.com', telefone: '17-873856', status: 'Ativo' },
  { id: 2, nome: 'Maria Gatto', cpfRa: '9/09/2025', email: 'ema@alpha.com', telefone: '17-878897', status: 'Ativo' },
  { id: 3, nome: 'Carla Ferrer', cpfRa: '9/05/2027', email: 'emoalpha.com', telefone: '17-878931', status: 'Ativo' },
  { id: 4, nome: 'Elisa Maris', cpfRa: '9/05/2023', email: 'ema@alpha.com', telefone: '17-878647', status: 'Ativo' },
  { id: 5, nome: 'Karol Narcour', cpfRa: '9/06/2023', email: 'ema@alpha.com', telefone: '17-873293', status: 'Inativo' },
  { id: 6, nome: 'Jemies Denos', cpfRa: '9/05/2027', email: 'ema@alpha.com', telefone: '17-878866', status: 'Ativo' },
  { id: 7, nome: 'Joares Milner', cpfRa: '9/06/2028', email: 'ema@alpha.com', telefone: '17-878300', status: 'Inativo' },
]

function statusBadgeClass(status) {
  return status === 'Ativo' ? 'badge badge-active' : 'badge badge-inactive'
}

export default function LeitoresPage() {
  const [busca, setBusca] = useState('')

  const filtrados = leitoresMock.filter(
    (l) =>
      l.nome.toLowerCase().includes(busca.toLowerCase()) ||
      l.cpfRa.includes(busca) ||
      l.email.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <DashboardLayout
      title="Leitores"
      actions={
        <button className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Leitor
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
            placeholder="Buscar por Nome, CPF ou RA..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper card">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Nome</th>
              <th>CPF/RA</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((leitor, i) => (
              <tr key={leitor.id} className={`animate-in stagger-${i + 1}`}>
                <td>
                  <div className="leitor-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </td>
                <td className="td-name">{leitor.nome}</td>
                <td>{leitor.cpfRa}</td>
                <td className="td-email">{leitor.email}</td>
                <td>{leitor.telefone}</td>
                <td><span className={statusBadgeClass(leitor.status)}>{leitor.status}</span></td>
                <td>
                  <button className="btn-icon" aria-label={`Editar ${leitor.nome}`}>
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
