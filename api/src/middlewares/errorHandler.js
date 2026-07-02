import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize'

export function errorHandler(err, req, res, next) {
  console.error(err)

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      message: 'Registro já existe',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    })
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    })
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message: 'Referência inválida (registro relacionado não existe)',
    })
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message })
  }

  return res.status(500).json({ message: 'Erro interno do servidor' })
}

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` })
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
