import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import './SettingsPage.css'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Administrador',
    email: 'admin@biblioteca.com',
    role: 'Bibliotecário Chefe',
    phone: '(17) 99999-0000',
  })

  const [config, setConfig] = useState({
    loanDays: 14,
    dailyFine: '2.50',
    maxBooks: 5,
    notifications: true,
    emailNotifications: true,
    overdueAlerts: true,
    darkMode: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <DashboardLayout title="Configurações">
      <div className="config-layout">
        {/* Profile Section */}
        <section className="card config-section animate-in stagger-1">
          <h3 className="config-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Perfil do Usuário
          </h3>
          <div className="config-form-grid">
            <div className="config-field">
              <label htmlFor="cfg-nome" className="config-label">Nome Completo</label>
              <input
                id="cfg-nome"
                type="text"
                className="input-field"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="config-field">
              <label htmlFor="cfg-email" className="config-label">E-mail</label>
              <input
                id="cfg-email"
                type="email"
                className="input-field"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="config-field">
              <label htmlFor="cfg-cargo" className="config-label">Cargo</label>
              <input
                id="cfg-cargo"
                type="text"
                className="input-field"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </div>
            <div className="config-field">
              <label htmlFor="cfg-tel" className="config-label">Telefone</label>
              <input
                id="cfg-tel"
                type="text"
                className="input-field"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Regras de Empréstimo */}
        <section className="card config-section animate-in stagger-2">
          <h3 className="config-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Regras de Empréstimo
          </h3>
          <div className="config-form-grid">
            <div className="config-field">
              <label htmlFor="cfg-dias" className="config-label">Prazo de Empréstimo (dias)</label>
              <input
                id="cfg-dias"
                type="number"
                className="input-field"
                value={config.loanDays}
                onChange={(e) => setConfig({ ...config, loanDays: e.target.value })}
              />
            </div>
            <div className="config-field">
              <label htmlFor="cfg-multa" className="config-label">Multa por Atraso (R$/dia)</label>
              <input
                id="cfg-multa"
                type="text"
                className="input-field"
                value={config.dailyFine}
                onChange={(e) => setConfig({ ...config, dailyFine: e.target.value })}
              />
            </div>
            <div className="config-field">
              <label htmlFor="cfg-max" className="config-label">Máximo de Livros por Leitor</label>
              <input
                id="cfg-max"
                type="number"
                className="input-field"
                value={config.maxBooks}
                onChange={(e) => setConfig({ ...config, maxBooks: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Notificações */}
        <section className="card config-section animate-in stagger-3">
          <h3 className="config-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Notificações
          </h3>
          <div className="config-toggles">
            <label className="config-toggle">
              <div className="config-toggle-info">
                <span className="config-toggle-label">Notificações do sistema</span>
                <span className="config-toggle-desc">Receber alertas sobre atividades importantes</span>
              </div>
              <div className={`config-switch ${config.notifications ? 'config-switch--on' : ''}`} onClick={() => setConfig({ ...config, notifications: !config.notifications })}>
                <div className="config-switch-thumb"></div>
              </div>
            </label>
            <label className="config-toggle">
              <div className="config-toggle-info">
                <span className="config-toggle-label">Notificações por e-mail</span>
                <span className="config-toggle-desc">Enviar cópia das notificações para o e-mail cadastrado</span>
              </div>
              <div className={`config-switch ${config.emailNotifications ? 'config-switch--on' : ''}`} onClick={() => setConfig({ ...config, emailNotifications: !config.emailNotifications })}>
                <div className="config-switch-thumb"></div>
              </div>
            </label>
            <label className="config-toggle">
              <div className="config-toggle-info">
                <span className="config-toggle-label">Alerta de atrasos</span>
                <span className="config-toggle-desc">Notificar automaticamente quando empréstimos estiverem atrasados</span>
              </div>
              <div className={`config-switch ${config.overdueAlerts ? 'config-switch--on' : ''}`} onClick={() => setConfig({ ...config, overdueAlerts: !config.overdueAlerts })}>
                <div className="config-switch-thumb"></div>
              </div>
            </label>
          </div>
        </section>

        {/* Ações */}
        <div className="config-actions animate-in stagger-4">
          <button className="btn btn-primary btn-lg" onClick={handleSave}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Salvar Alterações
          </button>
          {saved && (
            <span className="config-saved-msg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Configurações salvas com sucesso!
            </span>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
