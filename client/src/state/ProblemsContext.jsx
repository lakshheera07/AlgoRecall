import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createProblemApi,
  deleteProblemApi,
  fetchProblemsApi,
  logRecallApi,
  updateProblemApi,
} from '../api/problemsApi'

const ProblemsContext = createContext(null)

export function ProblemsProvider({ children }) {
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProblems() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const data = await fetchProblemsApi()

        if (isMounted) {
          setProblems(data)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProblems()

    return () => {
      isMounted = false
    }
  }, [])

  async function addProblem(formValues) {
    const createdProblem = await createProblemApi(formValues)
    setProblems((prev) => [createdProblem, ...prev])
  }

  async function deleteProblem(problemId) {
    await deleteProblemApi(problemId)
    setProblems((prev) => prev.filter((problem) => problem.id !== problemId))
  }

  async function updateProblem(problemId, formValues) {
    const updatedProblem = await updateProblemApi(problemId, formValues)

    setProblems((prev) =>
      prev.map((problem) => (problem.id === problemId ? updatedProblem : problem)),
    )

    return updatedProblem
  }

  async function submitRecall(problemId, confidence) {
    const result = await logRecallApi({ problemId, confidence })

    setProblems((prev) =>
      prev.map((problem) =>
        problem.id === problemId
          ? {
              ...problem,
              lastConfidence: confidence,
              nextRevisionAt: result.nextRevisionAt ?? problem.nextRevisionAt,
            }
          : problem,
      ),
    )
  }

  function getProblemById(problemId) {
    return problems.find((problem) => problem.id === problemId) ?? null
  }

  const value = useMemo(
    () => ({
      problems,
      isLoading,
      errorMessage,
      addProblem,
      deleteProblem,
      updateProblem,
      submitRecall,
      getProblemById,
    }),
    [problems, isLoading, errorMessage],
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