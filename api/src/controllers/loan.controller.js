import { Op } from 'sequelize'
import { Loan, Book, Reader } from '../models/index.js'
import { HttpError } from '../middlewares/errorHandler.js'
import { sequelize } from '../models/index.js'

async function syncOverdueLoans() {
  await Loan.update(
    { status: 'LATE' },
    {
      where: {
        status: 'OPEN',
        dueDate: { [Op.lt]: new Date() },
      },
    }
  )
}

export async function listLoans(req, res) {
  await syncOverdueLoans()

  const { status, readerId, bookId, startDate, endDate } = req.query

  const where = {}
  if (status) where.status = status
  if (readerId) where.readerId = readerId
  if (bookId) where.bookId = bookId

  if (req.userRole === 'READER') {
    const reader = await Reader.findOne({ where: { userId: req.userId } })
    if (!reader) return res.json([])
    where.readerId = reader.id
  }

  if (startDate || endDate) {
    where.loanDate = {}
    if (startDate) where.loanDate[Op.gte] = new Date(startDate)
    if (endDate) where.loanDate[Op.lte] = new Date(endDate)
  }

  const loans = await Loan.findAll({
    where,
    include: [
      { model: Reader, as: 'reader' },
      { model: Book, as: 'book' },
    ],
    order: [['loanDate', 'DESC']],
  })
  res.json(loans)
}

export async function getLoan(req, res) {
  await syncOverdueLoans()

  const loan = await Loan.findByPk(req.params.id, {
    include: [
      { model: Reader, as: 'reader' },
      { model: Book, as: 'book' },
    ],
  })
  if (!loan) throw new HttpError(404, 'Empréstimo não encontrado')

  if (req.userRole === 'READER') {
    const reader = await Reader.findOne({ where: { userId: req.userId } })
    if (!reader || loan.readerId !== reader.id) {
      throw new HttpError(403, 'Você só pode visualizar seus próprios empréstimos')
    }
  }

  res.json(loan)
}

export async function createLoan(req, res) {
  const { bookId, dueDate } = req.body
  let { readerId } = req.body

  if (req.userRole === 'READER') {
    const myReader = await Reader.findOne({ where: { userId: req.userId } })
    if (!myReader) {
      throw new HttpError(404, 'Nenhum cadastro de leitor foi encontrado para este usuário')
    }
    readerId = myReader.id
  }

  if (!readerId || !bookId || !dueDate) {
    throw new HttpError(400, 'readerId, bookId e dueDate são obrigatórios')
  }

  const loan = await sequelize.transaction(async (t) => {
    const reader = await Reader.findByPk(readerId, { transaction: t })
    if (!reader) throw new HttpError(404, 'Leitor não encontrado')
    if (reader.status !== 'ACTIVE') throw new HttpError(400, 'Leitor está inativo')

    const book = await Book.findByPk(bookId, { transaction: t, lock: t.LOCK.UPDATE })
    if (!book) throw new HttpError(404, 'Livro não encontrado')
    if (book.availableQuantity <= 0) throw new HttpError(400, 'Não há exemplares disponíveis deste livro')

    book.availableQuantity -= 1
    if (book.availableQuantity === 0) book.status = 'UNAVAILABLE'
    await book.save({ transaction: t })

    return Loan.create(
      {
        readerId,
        bookId,
        loanDate: new Date(),
        dueDate,
        status: 'OPEN',
      },
      { transaction: t }
    )
  })

  res.status(201).json(loan)
}

export async function returnLoan(req, res) {
  const loan = await sequelize.transaction(async (t) => {
    const loan = await Loan.findByPk(req.params.id, { transaction: t })
    if (!loan) throw new HttpError(404, 'Empréstimo não encontrado')
    if (loan.status === 'RETURNED') throw new HttpError(400, 'Este empréstimo já foi devolvido')

    loan.returnDate = new Date()
    loan.status = 'RETURNED'
    await loan.save({ transaction: t })

    const book = await Book.findByPk(loan.bookId, { transaction: t, lock: t.LOCK.UPDATE })
    if (book) {
      book.availableQuantity += 1
      if (book.status === 'UNAVAILABLE' && book.availableQuantity > 0) {
        book.status = 'AVAILABLE'
      }
      await book.save({ transaction: t })
    }

    return loan
  })

  res.json(loan)
}

export async function deleteLoan(req, res) {
  const loan = await Loan.findByPk(req.params.id)
  if (!loan) throw new HttpError(404, 'Empréstimo não encontrado')
  await loan.destroy()
  res.status(204).send()
}
