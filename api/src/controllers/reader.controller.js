import { Op } from 'sequelize'
import { Reader } from '../models/index.js'
import { HttpError } from '../middlewares/errorHandler.js'

export async function listReaders(req, res) {
  const { search, status } = req.query

  const where = {}
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { documentId: { [Op.iLike]: `%${search}%` } },
    ]
  }
  if (status) where.status = status

  const readers = await Reader.findAll({ where, order: [['name', 'ASC']] })
  res.json(readers)
}

export async function getReader(req, res) {
  const reader = await Reader.findByPk(req.params.id)
  if (!reader) throw new HttpError(404, 'Leitor não encontrado')
  res.json(reader)
}

export async function createReader(req, res) {
  const { userId, name, documentId, email, phone, address } = req.body

  const reader = await Reader.create({
    userId: userId ?? null,
    name,
    documentId,
    email,
    phone,
    address,
  })

  res.status(201).json(reader)
}

export async function updateReader(req, res) {
  const reader = await Reader.findByPk(req.params.id)
  if (!reader) throw new HttpError(404, 'Leitor não encontrado')

  const { name, documentId, email, phone, address, status } = req.body

  if (name !== undefined) reader.name = name
  if (documentId !== undefined) reader.documentId = documentId
  if (email !== undefined) reader.email = email
  if (phone !== undefined) reader.phone = phone
  if (address !== undefined) reader.address = address
  if (status !== undefined) reader.status = status

  await reader.save()
  res.json(reader)
}

export async function deleteReader(req, res) {
  const reader = await Reader.findByPk(req.params.id)
  if (!reader) throw new HttpError(404, 'Leitor não encontrado')
  await reader.destroy()
  res.status(204).send()
}
