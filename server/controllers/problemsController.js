import prisma from '../db.js'

const REQUIRED_FIELDS = [
  'title',
  'platform',
  'dataStructure',
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
    dataStructure:
      typeof payload.dataStructure === 'string' ? payload.dataStructure.trim() : '',
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

export async function createProblemHandler(request, response) {
  const validationErrors = validateProblemPayload(request.body)
  if (validationErrors.length > 0) {
    return response.status(400).json({ errors: validationErrors })
  }

  try {
    const createdProblem = await prisma.problem.create({
      data: normalizeProblemPayload(request.body),
    })

    return response.status(201).json(createdProblem)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to create problem' })
  }
}

export async function getAllProblemsHandler(_request, response) {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { id: 'desc' },
    })

    return response.status(200).json(problems)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch problems' })
  }
}

export async function getProblemByIdHandler(request, response) {
  const problemId = parseIdParam(request.params.id)
  if (!problemId) {
    return response.status(400).json({ error: 'Invalid problem ID' })
  }

  let problem
  try {
    problem = await prisma.problem.findUnique({ where: { id: problemId } })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch problem' })
  }

  if (!problem) {
    return response.status(404).json({ error: 'Problem not found' })
  }

  return response.status(200).json(problem)
}

export async function updateProblemHandler(request, response) {
  const problemId = parseIdParam(request.params.id)
  if (!problemId) {
    return response.status(400).json({ error: 'Invalid problem ID' })
  }

  const validationErrors = validateProblemPayload(request.body, { partial: true })
  if (validationErrors.length > 0) {
    return response.status(400).json({ errors: validationErrors })
  }

  let existingProblem
  try {
    existingProblem = await prisma.problem.findUnique({ where: { id: problemId } })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to update problem' })
  }

  if (!existingProblem) {
    return response.status(404).json({ error: 'Problem not found' })
  }

  let updatedProblem
  try {
    updatedProblem = await prisma.problem.update({
      where: { id: problemId },
      data: normalizeProblemPayload({ ...existingProblem, ...request.body }),
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to update problem' })
  }

  return response.status(200).json(updatedProblem)
}

export async function deleteProblemHandler(request, response) {
  const problemId = parseIdParam(request.params.id)
  if (!problemId) {
    return response.status(400).json({ error: 'Invalid problem ID' })
  }

  try {
    await prisma.problem.delete({ where: { id: problemId } })
  } catch (error) {
    if (error?.code === 'P2025') {
      return response.status(404).json({ error: 'Problem not found' })
    }

    console.error(error)
    return response.status(500).json({ error: 'Failed to delete problem' })
  }

  return response.status(200).json({ message: 'Problem deleted successfully' })
}
