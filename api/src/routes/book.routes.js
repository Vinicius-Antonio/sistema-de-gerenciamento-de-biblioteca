import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/book.controller.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Livros
 *   description: Gerenciamento do acervo de livros
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Lista livros (com busca e filtros)
 *     tags: [Livros]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por título, autor ou ISBN
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtra por categoria exata
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [AVAILABLE, UNAVAILABLE] }
 *         description: Filtra por disponibilidade
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Book' }
 */
router.get('/', asyncHandler(listBooks))

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Book' }
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:id', asyncHandler(getBook))

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Cadastra um novo livro
 *     tags: [Livros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookInput' }
 *     responses:
 *       201:
 *         description: Livro criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Book' }
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', asyncHandler(createBook))

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Atualiza um livro existente
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookInput' }
 *     responses:
 *       200:
 *         description: Livro atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Book' }
 *       404:
 *         description: Livro não encontrado
 */
router.put('/:id', asyncHandler(updateBook))

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Exclui um livro
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Livro excluído com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.delete('/:id', asyncHandler(deleteBook))

export default router
