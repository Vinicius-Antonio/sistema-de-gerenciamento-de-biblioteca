import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CadastroPage from './pages/CadastroPage'
import AcervoPage from './pages/AcervoPage'
import LeitoresPage from './pages/LeitoresPage'
import EmprestimosPage from './pages/EmprestimosPage'
import RelatoriosPage from './pages/RelatoriosPage'
import ConfiguracoesPage from './pages/ConfiguracoesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/dashboard/acervo" element={<AcervoPage />} />
      <Route path="/dashboard/leitores" element={<LeitoresPage />} />
      <Route path="/dashboard/emprestimos" element={<EmprestimosPage />} />
      <Route path="/dashboard/relatorios" element={<RelatoriosPage />} />
      <Route path="/dashboard/configuracoes" element={<ConfiguracoesPage />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/acervo" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
