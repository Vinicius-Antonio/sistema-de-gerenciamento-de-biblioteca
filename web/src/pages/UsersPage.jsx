import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../services/api'
import './UsersPage.css'

const roleLabels = {
  ADMIN: 'Administrador',
  LIBRARIAN: 'Bibliotecário',
  READER: 'Leitor',
}

const roleBadgeClass = {
  ADMIN: 'badge badge-admin',
  LIBRARIAN: 'badge badge-librarian',
  READER: 'badge badge-reader',
}

const roleFilters = ['Todos', 'ADMIN', 'LIBRARIAN', 'READER']

const emptyForm = { name: '', email: '', password: '', role: 'READER', documentId: '', phone: '', address: '' }

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Todos')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.get('/users')
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openCreate = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setForm({ ...emptyForm, name: user.name, email: user.email, role: user.role })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const body = { name: form.name, email: form.email, role: form.role }
        if (form.password) body.password = form.password
        await api.put(`/users/${editingUser.id}`, body)
      } else {
        await api.post('/users', form)
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return
    try {
      await api.delete(`/users/${id}`)
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'Todos' || user.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <DashboardLayout
      title="Usuários"
      actions={
        <button className="btn btn-primary" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Usuário
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
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="users-role-filter">
          {roleFilters.map((r) => (
            <button
              key={r}
              className={`users-role-btn${roleFilter === r ? ' users-role-btn--active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'Todos' ? 'Todos' : roleLabels[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando usuários...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id} className={`animate-in stagger-${(i % 5) + 1}`}>
                  <td>
                    <div className="leitor-avatar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  </td>
                  <td className="td-name">{user.name}</td>
                  <td className="td-email">{user.email}</td>
                  <td>
                    <span className={roleBadgeClass[user.role] || 'badge'}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="user-actions">
                      <button className="btn-icon-edit" aria-label="Editar" onClick={() => openEdit(user)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="btn-icon-delete" aria-label="Excluir" onClick={() => handleDelete(user.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="card modal-card">
            <h3 className="modal-title">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="user-name">Nome</label>
                <input
                  id="user-name"
                  required
                  className="input-field"
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="user-email">E-mail</label>
                <input
                  id="user-email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="email@exemplo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="user-password">
                  Senha {editingUser && <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>(deixe em branco para manter)</span>}
                </label>
                <input
                  id="user-password"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  required={!editingUser}
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="user-role">Perfil</label>
                <select
                  id="user-role"
                  className="input-field"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="LIBRARIAN">Bibliotecário</option>
                  <option value="READER">Leitor</option>
                </select>
              </div>

              {!editingUser && form.role === 'READER' && (
                <>
                  <div>
                    <label htmlFor="user-document">CPF ou RA</label>
                    <input
                      id="user-document"
                      required
                      className="input-field"
                      placeholder="000.000.000-00 ou RA12345"
                      value={form.documentId}
                      onChange={(e) => setForm({ ...form, documentId: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="user-phone">Telefone</label>
                    <input
                      id="user-phone"
                      className="input-field"
                      placeholder="(11) 99999-8888"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="user-address">Endereço</label>
                    <input
                      id="user-address"
                      className="input-field"
                      placeholder="Rua Exemplo, 100"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Salvar' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
