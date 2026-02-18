import { Router } from 'express'
import { createRecallLogHandler } from '../controllers/recallController.js'

const recallRouter = Router()

/**
 * @openapi
 * /api/recall:
 *   post:
 *     tags: [Recall]
 *     summary: Log a recall attempt and schedule next revision
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [problemId, confidence]
 *             properties:
 *               problemId:
 *                 type: integer
 *               confidence:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Recall logged
 */
recallRouter.post('/', createRecallLogHandler)

export default recallRouter
