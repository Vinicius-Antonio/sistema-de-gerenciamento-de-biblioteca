import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import './ReadersPage.css'

function getStatusBadgeClass(status) {
  return status === 'ACTIVE' ? 'badge badge-active' : 'badge badge-inactive'
}

const emptyReader = { name: '', documentId: '', email: '', phone: '', address: '', status: 'ACTIVE' }

export default function ReadersPage() {
  const { isAdmin } = useAuth()
  const [search, setSearch] = useState('')
  const [readers, setReaders] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editingReader, setEditingReader] = useState(null)
  const [form, setForm] = useState(emptyReader)

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

  const openCreate = () => {
    setEditingReader(null)
    setForm(emptyReader)
    setShowModal(true)
  }

  const openEdit = (reader) => {
    setEditingReader(reader)
    setForm({
      name: reader.name,
      documentId: reader.documentId,
      email: reader.email,
      phone: reader.phone || '',
      address: reader.address || '',
      status: reader.status,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingReader) {
        await api.put(`/readers/${editingReader.id}`, form)
      } else {
        await api.post('/readers', form)
      }
      setShowModal(false)
      fetchReaders()
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
        <button className="btn btn-primary" onClick={openCreate}>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon-edit" aria-label="Editar" onClick={() => openEdit(reader)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      {isAdmin && (
                        <button className="btn-icon-delete" aria-label="Excluir" onClick={() => handleDelete(reader.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="card modal-card">
            <h3 className="modal-title">{editingReader ? 'Editar Leitor' : 'Novo Leitor'}</h3>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="reader-name">Nome</label>
                <input id="reader-name" required className="input-field" placeholder="Nome completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reader-doc">CPF ou RA</label>
                <input id="reader-doc" required className="input-field" placeholder="CPF ou RA" value={form.documentId} onChange={e => setForm({...form, documentId: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reader-email">E-mail</label>
                <input id="reader-email" type="email" required className="input-field" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reader-phone">Telefone</label>
                <input id="reader-phone" className="input-field" placeholder="(00) 00000-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reader-address">Endereço</label>
                <input id="reader-address" className="input-field" placeholder="Endereço" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              {editingReader && (
                <div>
                  <label htmlFor="reader-status">Status</label>
                  <select id="reader-status" className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingReader ? 'Salvar' : 'Criar Leitor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
