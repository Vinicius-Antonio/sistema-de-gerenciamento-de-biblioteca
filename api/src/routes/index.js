import { Router } from 'express'
import bookRoutes from './book.routes.js'
import readerRoutes from './reader.routes.js'
import loanRoutes from './loan.routes.js'
import userRoutes from './user.routes.js'
import reportRoutes from './report.routes.js'
import authRoutes from './auth.js'

const router = Router()

router.get('/health', (req, res) => res.json({ status: 'ok' }))

router.use('/auth', authRoutes)
router.use('/books', bookRoutes)
router.use('/readers', readerRoutes)
router.use('/loans', loanRoutes)
router.use('/users', userRoutes)
router.use('/reports', reportRoutes)

export default router
