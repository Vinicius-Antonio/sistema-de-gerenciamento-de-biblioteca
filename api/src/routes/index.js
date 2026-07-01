import { Router } from 'express'
import bookRoutes from './book.routes.js'
import readerRoutes from './reader.routes.js'
import loanRoutes from './loan.routes.js'
import userRoutes from './user.routes.js'

const router = Router()

router.get('/health', (req, res) => res.json({ status: 'ok' }))

router.use('/books', bookRoutes)
router.use('/readers', readerRoutes)
router.use('/loans', loanRoutes)
router.use('/users', userRoutes)

export default router
