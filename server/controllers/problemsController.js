import {
  createProblem,
  deleteProblemById,
  getAllProblems,
  getProblemById,
  updateProblemById,
} from '../data/store.js'

const REQUIRED_FIELDS = [
  'title',
  'platform',
  'pattern',
  'difficulty'
]

const ALLOWED_PLATFORMS = new Set(['LeetCode', 'GFG'])

function parseIdParam(idParam) {
  const parsedId = Number.parseInt(idParam, 10)
  if (Number.isNaN(parsedId) || parsedId < 1) {
    return null
  }

  return parsedId
}

function validateProblemPayload(payload, { partial = false } = {}) {
  const errors = []

  if (!partial) {
    for (const field of REQUIRED_FIELDS) {
      if (typeof payload[field] !== 'string' || payload[field].trim() === '') {
        errors.push(`${field} is required`)
      }
    }
  }

  if (payload.platform !== undefined && !ALLOWED_PLATFORMS.has(payload.platform)) {
    errors.push('platform must be either LeetCode or GFG')
  }

  return errors
}

function normalizeProblemPayload(payload) {
  return {
    title: payload.title?.trim(),
    platform: payload.platform?.trim(),
    pattern: payload.pattern?.trim(),
    difficulty: payload.difficulty?.trim(),
    describeProblemInOwnWords:
      typeof payload.describeProblemInOwnWords === 'string'
        ? payload.describeProblemInOwnWords.trim()
        : '',
    brute_force: payload.brute_force?.trim(),
    better_approach: payload.better_approach?.trim(),
    optimal_approach: payload.optimal_approach?.trim(),
    code: typeof payload.code === 'string' ? payload.code.trim() : '',
  }
}

export function createProblemHandler(request, response) {
  const validationErrors = validateProblemPayload(request.body)
  if (validationErrors.length > 0) {
    return response.status(400).json({ errors: validationErrors })
  }

  const payload = normalizeProblemPayload(request.body)
  const createdProblem = createProblem(payload)
  return response.status(201).json(createdProblem)
}

export function getAllProblemsHandler(_request, response) {
  return response.status(200).json(getAllProblems())
}

export function getProblemByIdHandler(request, response) {
  const problemId = parseIdParam(request.params.id)
  if (!problemId) {
    return response.status(400).json({ error: 'Invalid problem ID' })
  }

  const problem = getProblemById(problemId)
  if (!problem) {
    return response.status(404).json({ error: 'Problem not found' })
  }

  return response.status(200).json(problem)
}

export function updateProblemHandler(request, response) {
  const problemId = parseIdParam(request.params.id)
  if (!problemId) {
    return response.status(400).json({ error: 'Invalid problem ID' })
  }

  const validationErrors = validateProblemPayload(request.body, { partial: true })
  if (validationErrors.length > 0) {
    return response.status(400).json({ errors: validationErrors })
  }

  const existingProblem = getProblemById(problemId)
  if (!existingProblem) {
    return response.status(404).json({ error: 'Problem not found' })
  }

  const payload = normalizeProblemPayload({ ...existingProblem, ...request.body })
  const updatedProblem = updateProblemById(problemId, payload)
  return response.status(200).json(updatedProblem)
}

export function deleteProblemHandler(request, response) {
  const problemId = parseIdParam(request.params.id)
  if (!problemId) {
    return response.status(400).json({ error: 'Invalid problem ID' })
  }

  const deletedProblem = deleteProblemById(problemId)
  if (!deletedProblem) {
    return response.status(404).json({ error: 'Problem not found' })
  }

  return response.status(200).json({ message: 'Problem deleted successfully' })
}
