import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BooksPage from './pages/BooksPage'
import ReadersPage from './pages/ReadersPage'
import LoansPage from './pages/LoansPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/dashboard/books" element={<BooksPage />} />
      <Route path="/dashboard/readers" element={<ReadersPage />} />
      <Route path="/dashboard/loans" element={<LoansPage />} />
      <Route path="/dashboard/reports" element={<ReportsPage />} />
      <Route path="/dashboard/settings" element={<SettingsPage />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/books" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
