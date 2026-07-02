import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { verifyToken, isLibrarianOrAdmin } from '../middlewares/auth.js'
import {
  listLoans,
  getLoan,
  createLoan,
  returnLoan,
  deleteLoan,
} from '../controllers/loan.controller.js'

const router = Router()

router.use(verifyToken)

/**
 * @swagger
 * tags:
 *   name: Empréstimos
 *   description: Empréstimos e devoluções de livros
 */

/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Lista empréstimos (com filtros). Leitores só veem os próprios empréstimos. Atualiza automaticamente empréstimos vencidos para "LATE".
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPEN, RETURNED, LATE] }
 *       - in: query
 *         name: readerId
 *         schema: { type: integer }
 *       - in: query
 *         name: bookId
 *         schema: { type: integer }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         description: Filtra empréstimos com data de empréstimo a partir desta data
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         description: Filtra empréstimos com data de empréstimo até esta data
 *     responses:
 *       200:
 *         description: Lista de empréstimos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Loan' }
 */
router.get('/', asyncHandler(listLoans))

/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     summary: Busca um empréstimo pelo ID
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Empréstimo encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Loan' }
 *       404:
 *         description: Empréstimo não encontrado
 */
router.get('/:id', asyncHandler(getLoan))

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Registra um novo empréstimo (diminui a quantidade disponível do livro)
 *     description: >
 *       Bibliotecários e administradores podem registrar empréstimos para qualquer leitor
 *       informando readerId. Leitores autenticados também podem usar esta rota para pegar
 *       um livro emprestado para si mesmos — nesse caso o readerId enviado é ignorado e o
 *       sistema usa automaticamente o leitor vinculado à conta autenticada.
 *     tags: [Empréstimos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoanInput' }
 *     responses:
 *       201:
 *         description: Empréstimo criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Loan' }
 *       400:
 *         description: Sem exemplares disponíveis, leitor inativo, ou dados inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Leitor ou livro não encontrado
 */
router.post('/', asyncHandler(createLoan))

/**
 * @swagger
 * /loans/{id}/return:
 *   patch:
 *     summary: Registra a devolução de um empréstimo (aumenta a quantidade disponível do livro)
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Empréstimo devolvido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Loan' }
 *       400:
 *         description: Empréstimo já havia sido devolvido
 *       404:
 *         description: Empréstimo não encontrado
 */
router.patch('/:id/return', asyncHandler(returnLoan))

/**
 * @swagger
 * /loans/{id}:
 *   delete:
 *     summary: Exclui um registro de empréstimo
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Empréstimo excluído com sucesso
 *       404:
 *         description: Empréstimo não encontrado
 */
router.delete('/:id', isLibrarianOrAdmin, asyncHandler(deleteLoan))

export default router
