import { createContext, useContext, useState, useEffect } from 'react'

const API_URL = `http://${window.location.hostname}:3000/api`

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('biblioteca_token')
    const storedUser = localStorage.getItem('biblioteca_user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))

      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Token inválido')
          return res.json()
        })
        .then((data) => {
          setUser(data.user)
          localStorage.setItem('biblioteca_user', JSON.stringify(data.user))
        })
        .catch(() => {
          logout()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao fazer login.')
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('biblioteca_token', data.token)
    localStorage.setItem('biblioteca_user', JSON.stringify(data.user))

    return data
  }

  async function register({ name, email, password, role, documentId, phone, address }) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, documentId, phone, address }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao criar conta.')
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('biblioteca_token', data.token)
    localStorage.setItem('biblioteca_user', JSON.stringify(data.user))

    return data
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('biblioteca_token')
    localStorage.removeItem('biblioteca_user')
  }

  function getRoleLabel(role) {
    const labels = {
      ADMIN: 'Administrador',
      LIBRARIAN: 'Bibliotecário',
      READER: 'Leitor',
    }
    return labels[role] || role
  }

  const isAdmin = user?.role === 'ADMIN'
  const isLibrarian = user?.role === 'LIBRARIAN'
  const isReader = user?.role === 'READER'
  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        getRoleLabel,
        isAdmin,
        isLibrarian,
        isReader,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
