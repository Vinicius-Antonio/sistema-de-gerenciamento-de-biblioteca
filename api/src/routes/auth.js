import { Router } from 'express'
import crypto from 'crypto'
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
    const { name, email, password, documentId, phone, address } = req.body
    const role = 'READER'

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' })
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

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     description: Envia um link de recuperação de senha para o e-mail informado.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@biblioteca.com
 *     responses:
 *       200:
 *         description: Solicitação processada (resposta genérica por segurança).
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'O e-mail é obrigatório.' })
    }

    // Resposta genérica por segurança (não revela se o e-mail existe ou não)
    const genericResponse = {
      message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.'
    }

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.json(genericResponse)
    }

    // Gerar token seguro
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Salvar hash do token e expiração (1 hora)
    user.resetPasswordToken = resetTokenHash
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    // Montar o link de recuperação
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

    // Em produção, aqui usaríamos Nodemailer para enviar o e-mail.
    // Em ambiente de desenvolvimento, imprimimos no console.
    console.log('\n==========================================')
    console.log('📧 RECUPERAÇÃO DE SENHA')
    console.log('==========================================')
    console.log(`Usuário: ${user.name} (${user.email})`)
    console.log(`Link: ${resetUrl}`)
    console.log(`Expira em: 1 hora`)
    console.log('==========================================\n')

    return res.json(genericResponse)
  } catch (err) {
    console.error('Erro no forgot-password:', err)
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
})

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefinir senha com token
 *     description: Redefine a senha do usuário usando o token de recuperação.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *       400:
 *         description: Token inválido, expirado ou senha muito curta.
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' })
    }

    // Hash do token recebido para comparar com o armazenado
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      where: {
        resetPasswordToken: tokenHash,
      }
    })

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' })
    }

    // Verificar se o token não expirou
    if (user.resetPasswordExpires < new Date()) {
      // Limpar token expirado
      user.resetPasswordToken = null
      user.resetPasswordExpires = null
      await user.save()
      return res.status(400).json({ error: 'Token inválido ou expirado.' })
    }

    // Atualizar a senha
    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    console.log(`\n✅ Senha redefinida com sucesso para: ${user.email}\n`)

    return res.json({ message: 'Senha redefinida com sucesso!' })
  } catch (err) {
    console.error('Erro no reset-password:', err)
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
})

export default router
