import { useState } from 'react'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import { useProblems } from '../state/ProblemsContext'

function ProblemListPage() {
  const { problems, submitRecall, deleteProblem, isLoading, errorMessage } = useProblems()
  const [openProblemId, setOpenProblemId] = useState(null)
  const [revealedByProblemId, setRevealedByProblemId] = useState({})
  const [confidenceByProblemId, setConfidenceByProblemId] = useState({})
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  function handleToggle(problemId) {
    setOpenProblemId((prev) => {
      if (prev === problemId) {
        return null
      }

      setRevealedByProblemId((oldState) => ({ ...oldState, [problemId]: false }))
      setConfidenceByProblemId((oldState) => ({ ...oldState, [problemId]: '' }))
      return problemId
    })
  }

  function handleReveal(problemId) {
    setRevealedByProblemId((prev) => ({ ...prev, [problemId]: true }))
  }

  function handleConfidenceChange(problemId, value) {
    setConfidenceByProblemId((prev) => ({ ...prev, [problemId]: value }))
  }

  function handleConfidenceSubmit(event, problemId) {
    event.preventDefault()

    const selectedConfidence = confidenceByProblemId[problemId]
    if (!selectedConfidence) {
      return
    }

    submitRecall(problemId, Number(selectedConfidence))
    setOpenProblemId(null)
  }

  function openDeleteDialog(problemId) {
    setPendingDeleteId(problemId)
  }

  function closeDeleteDialog() {
    setPendingDeleteId(null)
  }

  async function confirmDelete() {
    if (!pendingDeleteId) {
      return
    }

    try {
      await deleteProblem(pendingDeleteId)
      setOpenProblemId((prev) => (prev === pendingDeleteId ? null : prev))
      toast.success('Problem deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete problem')
    } finally {
      closeDeleteDialog()
    }
  }

  return (
    <section className="page-section">
      <h2>Problem List</h2>

      {isLoading ? <p>Loading problems...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete Problem"
        message="Are you sure you want to delete this problem?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />

      {!isLoading && problems.length === 0 ? (
        <p>No problems saved yet.</p>
      ) : (
        <ul className="problem-list">
          {problems.map((problem) => (
            <li key={problem.id} className="problem-card">
              <div className="problem-row">
                <h3>{problem.title}</h3>
                <div className="problem-row-actions">
                  <button type="button" onClick={() => handleToggle(problem.id)}>
                    {openProblemId === problem.id ? 'Hide' : 'Revise'}
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => openDeleteDialog(problem.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {openProblemId === problem.id ? (
                <div className="accordion-content">
                  <div className="recall-header-row">
                    <p>
                      Description: {problem.describeProblemInOwnWords || 'Not provided.'}
                    </p>
                    {!revealedByProblemId[problem.id] ? (
                      <button type="button" onClick={() => handleReveal(problem.id)}>
                        Reveal
                      </button>
                    ) : null}
                  </div>
                  <p>Difficulty: {problem.difficulty}</p>
                  <p>Mentally recall before revealing:</p>
                  <ul>
                    <li>What is the pattern?</li>
                    <li>What is the brute-force approach?</li>
                    <li>Why does brute force fail?</li>
                    <li>What is the optimal approach?</li>
                  </ul>

                  {revealedByProblemId[problem.id] ? (
                    <>
                      <p>Platform: {problem.platform}</p>
                      <p>Pattern: {problem.pattern}</p>
                      <p>
                        <strong>Brute:</strong> {problem.bruteApproach}
                      </p>
                      <p>
                        <strong>Better:</strong> {problem.betterApproach}
                      </p>
                      <p>
                        <strong>Optimal:</strong> {problem.optimalApproach}
                      </p>
                      <p>
                        <strong>Code:</strong>
                      </p>
                      <pre>{problem.code || 'No code provided.'}</pre>

                      <form
                        className="inline-form"
                        onSubmit={(event) => handleConfidenceSubmit(event, problem.id)}
                      >
                        <label>
                          Confidence (1-5)
                          <select
                            value={confidenceByProblemId[problem.id] ?? ''}
                            onChange={(event) =>
                              handleConfidenceChange(problem.id, event.target.value)
                            }
                            required
                          >
                            <option value="">Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </label>
                        <button type="submit">Submit Confidence</button>
                      </form>
                    </>
                  ) : null}

                  <p>
                    Last confidence: {problem.lastConfidence ? `${problem.lastConfidence}/5` : 'Not submitted yet'}
                  </p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ProblemListPage