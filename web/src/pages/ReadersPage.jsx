import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import './ReadersPage.css'

function getStatusBadgeClass(status) {
  return status === 'ACTIVE' ? 'badge badge-active' : 'badge badge-inactive'
}

export default function ReadersPage() {
  const [search, setSearch] = useState('')
  const [readers, setReaders] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [newReader, setNewReader] = useState({ name: '', documentId: '', email: '', phone: '', address: '' })

  const fetchReaders = async () => {
    try {
      setLoading(true)
      const data = await api.get('/readers')
      setReaders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReaders()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/readers', newReader)
      setShowModal(false)
      fetchReaders()
      setNewReader({ name: '', documentId: '', email: '', phone: '', address: '' })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza?')) return
    try {
      await api.delete(`/readers/${id}`)
      fetchReaders()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredReaders = readers.filter(
    (reader) =>
      reader.name.toLowerCase().includes(search.toLowerCase()) ||
      (reader.documentId && reader.documentId.includes(search)) ||
      (reader.email && reader.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <DashboardLayout
      title="Leitores"
      actions={
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Leitor
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
            placeholder="Buscar por Nome, CPF ou RA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando leitores...</div>
        ) : (
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
              {filteredReaders.map((reader, i) => (
                <tr key={reader.id} className={`animate-in stagger-${(i % 5) + 1}`}>
                  <td>
                    <div className="leitor-avatar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  </td>
                  <td className="td-name">{reader.name}</td>
                  <td>{reader.documentId}</td>
                  <td className="td-email">{reader.email}</td>
                  <td>{reader.phone}</td>
                  <td><span className={getStatusBadgeClass(reader.status)}>{reader.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</span></td>
                  <td>
                    <button className="btn-icon" aria-label="Excluir" onClick={() => handleDelete(reader.id)} style={{ color: '#ef4444' }}>
                      X
                    </button>
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
            <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>Novo Leitor</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required className="input-field" placeholder="Nome" value={newReader.name} onChange={e => setNewReader({...newReader, name: e.target.value})} />
              <input required className="input-field" placeholder="CPF ou RA" value={newReader.documentId} onChange={e => setNewReader({...newReader, documentId: e.target.value})} />
              <input type="email" required className="input-field" placeholder="E-mail" value={newReader.email} onChange={e => setNewReader({...newReader, email: e.target.value})} />
              <input className="input-field" placeholder="Telefone" value={newReader.phone} onChange={e => setNewReader({...newReader, phone: e.target.value})} />
              <input className="input-field" placeholder="Endereço" value={newReader.address} onChange={e => setNewReader({...newReader, address: e.target.value})} />
              
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

