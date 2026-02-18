import prisma from '../db.js'
import {
  computeNextRevisionAt,
  deriveRecallCategory,
  isValidConfidence,
} from '../services/revisionService.js'

function parseProblemId(problemIdRaw) {
  const parsed = Number.parseInt(problemIdRaw, 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export async function createRecallLogHandler(request, response) {
  const problemId = parseProblemId(request.body.problemId)
  const confidence = Number.parseInt(request.body.confidence, 10)

  if (!problemId) {
    return response.status(400).json({ error: 'problemId must be a valid positive integer' })
  }

  if (!isValidConfidence(confidence)) {
    return response.status(400).json({ error: 'confidence must be an integer between 1 and 5' })
  }

  const category = deriveRecallCategory(confidence)
  const nextRevisionAt = computeNextRevisionAt(confidence)

  try {
    const updated = await prisma.$transaction(async (transactionClient) => {
      const problem = await transactionClient.problem.findUnique({ where: { id: problemId } })

      if (!problem) {
        return null
      }

      const recallLog = await transactionClient.recallLog.create({
        data: {
          problemId,
          confidence,
          category,
        },
      })

      const updatedProblem = await transactionClient.problem.update({
        where: { id: problemId },
        data: { nextRevisionAt },
      })

      return { recallLog, updatedProblem }
    })

    if (!updated) {
      return response.status(404).json({ error: 'Problem not found' })
    }

    return response.status(201).json({
      message: 'Recall logged successfully',
      recallLog: updated.recallLog,
      nextRevisionAt: updated.updatedProblem.nextRevisionAt,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to log recall' })
  }
}
