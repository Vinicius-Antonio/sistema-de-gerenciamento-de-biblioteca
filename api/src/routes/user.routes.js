import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { verifyToken, isAdmin } from '../middlewares/auth.js'
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js'

const router = Router()

router.use(verifyToken)
router.use(isAdmin)

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: >
 *     Usuarios do sistema (Admin, Bibliotecario, Leitor).
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários do sistema
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuarios (sem o campo password)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 */
router.get('/', asyncHandler(listUsers))

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca do usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', asyncHandler(getUser))

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cadastra um novo usuário (senha armazenada com hash)
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/', asyncHandler(createUser))

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', asyncHandler(updateUser))

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', asyncHandler(deleteUser))

export default router
