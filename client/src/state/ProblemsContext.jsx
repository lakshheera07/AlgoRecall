import { createContext, useContext, useMemo, useState } from 'react'
import { initialProblems } from '../data/dummyProblems'

const ProblemsContext = createContext(null)

export function ProblemsProvider({ children }) {
  const [problems, setProblems] = useState(initialProblems)

  function addProblem(formValues) {
    const newProblem = {
      id: Date.now(),
      ...formValues,
      lastConfidence: null,
    }
    setProblems((prev) => [newProblem, ...prev])
  }

  function submitRecall(problemId, confidence) {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.id === problemId ? { ...problem, lastConfidence: confidence } : problem,
      ),
    )
  }

  function getProblemById(problemId) {
    return problems.find((problem) => problem.id === problemId) ?? null
  }

  const value = useMemo(
    () => ({
      problems,
      addProblem,
      submitRecall,
      getProblemById,
    }),
    [problems],
  )

  return <ProblemsContext.Provider value={value}>{children}</ProblemsContext.Provider>
}

export function useProblems() {
  const context = useContext(ProblemsContext)
  if (!context) {
    throw new Error('useProblems must be used within ProblemsProvider')
  }
  return context
}