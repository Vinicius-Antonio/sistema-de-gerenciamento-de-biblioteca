import { Op } from 'sequelize'
import { Book } from '../models/index.js'
import { HttpError } from '../middlewares/errorHandler.js'


export async function listBooks(req, res) {
  const { search, category, status } = req.query

  const where = {}
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
      { isbn: { [Op.iLike]: `%${search}%` } },
    ]
  }
  if (category) where.category = category
  if (status) where.status = status

  const books = await Book.findAll({ where, order: [['title', 'ASC']] })
  res.json(books)
}


export async function getBook(req, res) {
  const book = await Book.findByPk(req.params.id)
  if (!book) throw new HttpError(404, 'Livro não encontrado')
  res.json(book)
}


export async function createBook(req, res) {
  const { title, author, publisher, publicationYear, category, isbn, totalQuantity } = req.body

  const qty = totalQuantity ?? 1

  const book = await Book.create({
    title,
    author,
    publisher,
    publicationYear,
    category,
    isbn,
    totalQuantity: qty,
    availableQuantity: qty,
    status: qty > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
  })

  res.status(201).json(book)
}



export async function updateBook(req, res) {
  const book = await Book.findByPk(req.params.id)
  if (!book) throw new HttpError(404, 'Livro não encontrado')

  const { title, author, publisher, publicationYear, category, isbn, totalQuantity, status } = req.body

  if (totalQuantity !== undefined && totalQuantity !== book.totalQuantity) {
    const diff = totalQuantity - book.totalQuantity
    book.availableQuantity = Math.max(0, book.availableQuantity + diff)
    book.totalQuantity = totalQuantity
  }

  if (title !== undefined) book.title = title
  if (author !== undefined) book.author = author
  if (publisher !== undefined) book.publisher = publisher
  if (publicationYear !== undefined) book.publicationYear = publicationYear
  if (category !== undefined) book.category = category
  if (isbn !== undefined) book.isbn = isbn
  if (status !== undefined) book.status = status

  await book.save()
  res.json(book)
}



export async function deleteBook(req, res) {
  const book = await Book.findByPk(req.params.id)
  if (!book) throw new HttpError(404, 'Livro não encontrado')
  await book.destroy()
  res.status(204).send()
}
