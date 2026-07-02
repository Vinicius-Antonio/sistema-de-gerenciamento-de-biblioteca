import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { verifyToken } from '../middleware/auth.js'
import {
  getSummary,
  getPopularCategories,
  getFrequentReaders,
  getRecentActivity,
} from '../controllers/report.controller.js'

const router = Router()

// All report routes require authentication
router.use(verifyToken)

/**
 * @swagger
 * /reports/summary:
 *   get:
 *     summary: Get dashboard summary stats
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary statistics from the database
 */
router.get('/summary', asyncHandler(getSummary))

/**
 * @swagger
 * /reports/popular-categories:
 *   get:
 *     summary: Get book counts by category
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories with book counts and percentages
 */
router.get('/popular-categories', asyncHandler(getPopularCategories))

/**
 * @swagger
 * /reports/frequent-readers:
 *   get:
 *     summary: Get top 5 readers by loan count
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top readers
 */
router.get('/frequent-readers', asyncHandler(getFrequentReaders))

/**
 * @swagger
 * /reports/recent-activity:
 *   get:
 *     summary: Get 10 most recent loan activities
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent loan/return activities
 */
router.get('/recent-activity', asyncHandler(getRecentActivity))

export default router
