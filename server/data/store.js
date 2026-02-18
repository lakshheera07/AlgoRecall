const problems = []
let nextId = 1

export function getAllProblems() {
  return problems
}

export function getProblemById(id) {
  return problems.find((problem) => problem.id === id) ?? null
}

export function createProblem(problemPayload) {
  const newProblem = {
    id: nextId,
    ...problemPayload,
  }

  nextId += 1
  problems.push(newProblem)
  return newProblem
}

export function updateProblemById(id, updatedPayload) {
  const index = problems.findIndex((problem) => problem.id === id)
  if (index === -1) {
    return null
  }

  const updatedProblem = {
    ...problems[index],
    ...updatedPayload,
    id,
  }

  problems[index] = updatedProblem
  return updatedProblem
}

export function deleteProblemById(id) {
  const index = problems.findIndex((problem) => problem.id === id)
  if (index === -1) {
    return null
  }

  const [deletedProblem] = problems.splice(index, 1)
  return deletedProblem
}
