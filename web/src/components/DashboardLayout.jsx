import Sidebar from './Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout({ title, actions, children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <h2 className="dashboard-title">{title}</h2>
          </div>
          {actions && (
            <div className="dashboard-header-actions">
              {actions}
            </div>
          )}
        </header>
        <div className="dashboard-content animate-in">
          {children}
        </div>
      </main>
    </div>
  )
}
