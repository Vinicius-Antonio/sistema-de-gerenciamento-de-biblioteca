import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { verifyToken, isLibrarianOrAdmin, isAdmin } from '../middlewares/auth.js'
import {
  listReaders,
  getReader,
  createReader,
  updateReader,
  deleteReader,
} from '../controllers/reader.controller.js'

const router = Router()

router.use(verifyToken)
router.use(isLibrarianOrAdmin)

/**
 * @swagger
 * tags:
 *   name: Leitores
 *   description: Gerenciamento de leitores da biblioteca
 */

/**
 * @swagger
 * /readers:
 *   get:
 *     summary: Lista leitores (com busca e filtro por status)
 *     tags: [Leitores]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por nome, e-mail ou CPF/RA
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       200:
 *         description: Lista de leitores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reader' }
 */
router.get('/', asyncHandler(listReaders))

/**
 * @swagger
 * /readers/{id}:
 *   get:
 *     summary: Busca um leitor pelo ID
 *     tags: [Leitores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Leitor encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reader' }
 *       404:
 *         description: Leitor não encontrado
 */
router.get('/:id', asyncHandler(getReader))

/**
 * @swagger
 * /readers:
 *   post:
 *     summary: Cadastra um novo leitor
 *     tags: [Leitores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReaderInput' }
 *     responses:
 *       201:
 *         description: Leitor criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reader' }
 *       400:
 *         description: Erro de validação
 */
router.post('/', asyncHandler(createReader))

/**
 * @swagger
 * /readers/{id}:
 *   put:
 *     summary: Atualiza um leitor (inclusive inativar, via status)
 *     tags: [Leitores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReaderInput' }
 *     responses:
 *       200:
 *         description: Leitor atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reader' }
 *       404:
 *         description: Leitor não encontrado
 */
router.put('/:id', asyncHandler(updateReader))

/**
 * @swagger
 * /readers/{id}:
 *   delete:
 *     summary: Exclui um leitor
 *     tags: [Leitores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Leitor excluído com sucesso
 *       404:
 *         description: Leitor não encontrado
 */
router.delete('/:id', isAdmin, asyncHandler(deleteReader))

export default router
