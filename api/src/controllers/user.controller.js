import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { HttpError } from '../middlewares/errorHandler.js'

const PUBLIC_ATTRIBUTES = ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']

export async function listUsers(req, res) {
  const users = await User.findAll({ attributes: PUBLIC_ATTRIBUTES, order: [['name', 'ASC']] })
  res.json(users)
}

export async function getUser(req, res) {
  const user = await User.findByPk(req.params.id, { attributes: PUBLIC_ATTRIBUTES })
  if (!user) throw new HttpError(404, 'Usuário não encontrado')
  res.json(user)
}

export async function createUser(req, res) {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    throw new HttpError(400, 'name, email, password e role são obrigatórios')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({ name, email, password: passwordHash, role })

  const { password: _omit, ...safeUser } = user.toJSON()
  res.status(201).json(safeUser)
}

export async function updateUser(req, res) {
  const user = await User.findByPk(req.params.id)
  if (!user) throw new HttpError(404, 'Usuário não encontrado')

  const { name, email, password, role } = req.body

  if (name !== undefined) user.name = name
  if (email !== undefined) user.email = email
  if (role !== undefined) user.role = role
  if (password) user.password = await bcrypt.hash(password, 10)

  await user.save()

  const { password: _omit, ...safeUser } = user.toJSON()
  res.json(safeUser)
}

export async function deleteUser(req, res) {
  const user = await User.findByPk(req.params.id)
  if (!user) throw new HttpError(404, 'Usuário não encontrado')
  await user.destroy()
  res.status(204).send()
}
