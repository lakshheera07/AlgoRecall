import { Router } from 'express'
import {
  getAnalysisInsightsHandler,
  getRevisionHubHandler,
  getRevisionOverviewHandler,
  getRevisionSessionQueueHandler,
  getPatternAnalyticsHandler,
  getUpcomingRevisionsHandler,
  getRevisionTodayHandler,
} from '../controllers/reviseController.js'

const revisionRouter = Router()

/**
 * @openapi
 * /api/revision/today:
 *   get:
 *     tags: [Revision]
 *     summary: Get problems due for revision now
 *     responses:
 *       200:
 *         description: Due problems sorted by lowest confidence first
 */
revisionRouter.get('/today', getRevisionTodayHandler)

/**
 * @openapi
 * /api/revision/upcoming:
 *   get:
 *     tags: [Revision]
 *     summary: Get upcoming scheduled revisions
 *     responses:
 *       200:
 *         description: Upcoming problems sorted by next revision date
 */
revisionRouter.get('/upcoming', getUpcomingRevisionsHandler)

/**
 * @openapi
 * /api/revision/analytics:
 *   get:
 *     tags: [Revision]
 *     summary: Get weak and strong pattern analytics
 *     responses:
 *       200:
 *         description: Pattern groups by average confidence
 */
revisionRouter.get('/analytics', getPatternAnalyticsHandler)

/**
 * @openapi
 * /api/revision/overview:
 *   get:
 *     tags: [Revision]
 *     summary: Get difficulty-wise and data-structure-wise confidence overview
 *     responses:
 *       200:
 *         description: Grouped revision overview metrics
 */
revisionRouter.get('/overview', getRevisionOverviewHandler)

/**
 * @openapi
 * /api/revision/hub:
 *   get:
 *     tags: [Revision]
 *     summary: Get complete revision hub payload
 *     responses:
 *       200:
 *         description: Today, upcoming, pattern analytics and grouped overview
 */
revisionRouter.get('/hub', getRevisionHubHandler)

/**
 * @openapi
 * /api/revision/session/queue:
 *   get:
 *     tags: [Revision]
 *     summary: Get the session queue for focused revision (due now)
 *     responses:
 *       200:
 *         description: Session queue sorted by weakest confidence first
 */
revisionRouter.get('/session/queue', getRevisionSessionQueueHandler)

/**
 * @openapi
 * /api/revision/insights:
 *   get:
 *     tags: [Revision]
 *     summary: Get full analysis insights payload for frontend dashboard
 *     responses:
 *       200:
 *         description: Aggregated analysis metrics and chart series
 */
revisionRouter.get('/insights', getAnalysisInsightsHandler)

export default revisionRouter
