import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca-secret-key-2026'

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }

  const parts = authHeader.split(' ')

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido.' })
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id
    req.userRole = decoded.role
    req.userName = decoded.name
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

export function isAdmin(req, res, next) {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' })
  }
  next()
}

export function isLibrarianOrAdmin(req, res, next) {
  if (req.userRole !== 'ADMIN' && req.userRole !== 'LIBRARIAN') {
    return res.status(403).json({ error: 'Acesso restrito a bibliotecários e administradores.' })
  }
  next()
}

export function isReader(req, res, next) {
  if (req.userRole !== 'READER') {
    return res.status(403).json({ error: 'Acesso restrito a leitores.' })
  }
  next()
}
