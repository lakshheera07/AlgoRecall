import { Router } from 'express'
import {
  createProblemHandler,
  deleteProblemHandler,
  getAllProblemsHandler,
  getProblemByIdHandler,
  updateProblemHandler,
} from '../controllers/problemsController.js'

const problemsRouter = Router()

problemsRouter.post('/', createProblemHandler)
problemsRouter.get('/', getAllProblemsHandler)
problemsRouter.get('/:id', getProblemByIdHandler)
problemsRouter.put('/:id', updateProblemHandler)
problemsRouter.delete('/:id', deleteProblemHandler)

export default problemsRouter
