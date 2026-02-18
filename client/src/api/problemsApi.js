const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

function mapServerToClient(problem) {
  return {
    id: problem.id,
    title: problem.title ?? '',
    platform: problem.platform ?? 'LeetCode',
    pattern: problem.pattern ?? '',
    difficulty: problem.difficulty ?? 'Easy',
    describeProblemInOwnWords:
      problem.describeProblemInOwnWords ?? problem.description ?? '',
    bruteApproach: problem.brute_force ?? '',
    betterApproach: problem.better_approach ?? '',
    optimalApproach: problem.optimal_approach ?? '',
    code: problem.code ?? '',
    lastConfidence: problem.lastConfidence ?? null,
  }
}

function mapClientToServer(problem) {
  return {
    title: problem.title,
    platform: problem.platform,
    pattern: problem.pattern,
    difficulty: problem.difficulty,
    describeProblemInOwnWords: problem.describeProblemInOwnWords,
    brute_force: problem.bruteApproach,
    better_approach: problem.betterApproach,
    optimal_approach: problem.optimalApproach,
    code: problem.code,
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody.error ?? errorBody.errors?.[0] ?? 'Request failed'
    throw new Error(message)
  }

  return response.json()
}

export async function fetchProblemsApi() {
  const data = await request('/api/problems')
  return data.map(mapServerToClient)
}

export async function createProblemApi(problem) {
  const data = await request('/api/problems', {
    method: 'POST',
    body: JSON.stringify(mapClientToServer(problem)),
  })

  return mapServerToClient(data)
}

export async function deleteProblemApi(problemId) {
  await request(`/api/problems/${problemId}`, {
    method: 'DELETE',
  })
}
