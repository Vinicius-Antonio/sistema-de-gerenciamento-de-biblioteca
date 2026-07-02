import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, Reader } from '../models/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca-secret-key-2026'
const JWT_EXPIRES_IN = '24h'

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@biblioteca.com
 *         password:
 *           type: string
 *           example: senha123
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@email.com
 *         password:
 *           type: string
 *           example: senha123
 *         role:
 *           type: string
 *           enum: [ADMIN, LIBRARIAN, READER]
 *           example: READER
 *         documentId:
 *           type: string
 *           description: CPF ou RA (obrigatório para READER)
 *           example: 123.456.789-00
 *         phone:
 *           type: string
 *           example: 11-999998888
 *         address:
 *           type: string
 *           example: Rua Exemplo, 100
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticação de usuário
 *     description: Realiza login e retorna um token JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Campos obrigatórios não informados.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
    }

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
})

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastro de novo usuário
 *     description: Cria um novo usuário no sistema. Para leitores, cria automaticamente o perfil de leitor.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos ou e-mail já cadastrado.
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, documentId, phone, address } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Nome, e-mail, senha e perfil são obrigatórios.' })
    }

    const validRoles = ['ADMIN', 'LIBRARIAN', 'READER']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Perfil inválido. Utilize ADMIN, LIBRARIAN ou READER.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' })
    }

    if (role === 'READER' && !documentId) {
      return res.status(400).json({ error: 'CPF ou RA é obrigatório para leitores.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role,
    })

    if (role === 'READER') {
      await Reader.create({
        userId: user.id,
        name,
        documentId,
        email,
        phone: phone || null,
        address: address || null,
        status: 'ACTIVE',
      })
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Erro no cadastro:', err)
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message)
      return res.status(400).json({ error: messages.join(', ') })
    }
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
})

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     description: Retorna as informações do usuário com base no token JWT.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário.
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido.' })
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido.' })
    }

    const decoded = jwt.verify(parts[1], JWT_SECRET)
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' })
    }

    return res.json({ user })
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
})

export default router
