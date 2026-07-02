import { Op, fn, col, literal } from 'sequelize'
import { Book, Reader, Loan } from '../models/index.js'

/**
 * GET /reports/summary
 * Returns real aggregate numbers from the database.
 */
export async function getSummary(req, res) {
  const totalBooks = await Book.sum('totalQuantity') || 0
  const totalTitles = await Book.count()
  const activeReaders = await Reader.count({ where: { status: 'ACTIVE' } })
  const openLoans = await Loan.count({ where: { status: 'OPEN' } })
  const lateLoans = await Loan.count({ where: { status: 'LATE' } })

  // Also count loans that are OPEN but past due date (should be LATE)
  const overdueOpen = await Loan.count({
    where: {
      status: 'OPEN',
      dueDate: { [Op.lt]: new Date() },
    },
  })

  res.json({
    totalBooks,
    totalTitles,
    activeReaders,
    openLoans,
    lateLoans: lateLoans + overdueOpen,
  })
}

/**
 * GET /reports/popular-categories
 * Returns book counts grouped by category.
 */
export async function getPopularCategories(req, res) {
  const categories = await Book.findAll({
    attributes: [
      'category',
      [fn('SUM', col('totalQuantity')), 'qty'],
    ],
    group: ['category'],
    order: [[literal('qty'), 'DESC']],
    raw: true,
  })

  // Calculate percentages
  const total = categories.reduce((sum, c) => sum + parseInt(c.qty || 0), 0)
  const result = categories.map((c) => ({
    name: c.category || 'Sem Categoria',
    qty: parseInt(c.qty || 0),
    pct: total > 0 ? Math.round((parseInt(c.qty || 0) / total) * 100) : 0,
  }))

  res.json(result)
}

/**
 * GET /reports/frequent-readers
 * Returns top 5 readers by number of loans.
 */
export async function getFrequentReaders(req, res) {
  const readers = await Loan.findAll({
    attributes: [
      'readerId',
      [fn('COUNT', col('Loan.id')), 'loanCount'],
    ],
    include: [
      {
        model: Reader,
        as: 'reader',
        attributes: ['name'],
      },
    ],
    group: ['readerId', 'reader.id', 'reader.name'],
    order: [[literal('loanCount'), 'DESC']],
    limit: 5,
    raw: true,
    nest: true,
  })

  const result = readers.map((r) => ({
    name: r.reader?.name || 'Desconhecido',
    loans: parseInt(r.loanCount || 0),
    avatar: (r.reader?.name || 'XX')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  }))

  res.json(result)
}

/**
 * GET /reports/recent-activity
 * Returns the 10 most recent loan/return operations.
 */
export async function getRecentActivity(req, res) {
  // Get the most recent loans (by creation or return)
  const recentLoans = await Loan.findAll({
    include: [
      { model: Reader, as: 'reader', attributes: ['name'] },
      { model: Book, as: 'book', attributes: ['title'] },
    ],
    order: [['updatedAt', 'DESC']],
    limit: 10,
  })

  const result = recentLoans.map((loan) => ({
    reader: loan.reader?.name || 'Desconhecido',
    book: loan.book?.title || 'Desconhecido',
    date: loan.status === 'RETURNED' && loan.returnDate
      ? new Date(loan.returnDate).toLocaleDateString('pt-BR')
      : new Date(loan.loanDate).toLocaleDateString('pt-BR'),
    type: loan.status === 'RETURNED' ? 'Devolução' : 'Empréstimo',
  }))

  res.json(result)
}
