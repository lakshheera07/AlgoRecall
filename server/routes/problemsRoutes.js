import { Router } from 'express'
import {
  createProblemHandler,
  deleteProblemHandler,
  getAllProblemsHandler,
  getProblemByIdHandler,
  updateProblemHandler,
} from '../controllers/problemsController.js'

const problemsRouter = Router()

/**
 * @openapi
 * /api/problems:
 *   post:
 *     tags: [Problems]
 *     summary: Create a problem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Problem'
 *     responses:
 *       201:
 *         description: Problem created
 */
problemsRouter.post('/', createProblemHandler)

/**
 * @openapi
 * /api/problems:
 *   get:
 *     tags: [Problems]
 *     summary: Get all problems
 *     responses:
 *       200:
 *         description: List of problems
 */
problemsRouter.get('/', getAllProblemsHandler)

/**
 * @openapi
 * /api/problems/{id}:
 *   get:
 *     tags: [Problems]
 *     summary: Get a problem by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Problem found
 *       404:
 *         description: Problem not found
 */
problemsRouter.get('/:id', getProblemByIdHandler)

/**
 * @openapi
 * /api/problems/{id}:
 *   put:
 *     tags: [Problems]
 *     summary: Update a problem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Problem'
 *     responses:
 *       200:
 *         description: Problem updated
 */
problemsRouter.put('/:id', updateProblemHandler)

/**
 * @openapi
 * /api/problems/{id}:
 *   delete:
 *     tags: [Problems]
 *     summary: Delete a problem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Problem deleted
 */
problemsRouter.delete('/:id', deleteProblemHandler)

export default problemsRouter
