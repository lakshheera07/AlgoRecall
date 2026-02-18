import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import { useProblems } from '../state/ProblemsContext'

function getDifficultyTagClass(difficulty) {
  const normalized = String(difficulty || '').trim().toLowerCase()

  if (normalized === 'easy') {
    return 'meta-tag-difficulty-easy'
  }

  if (normalized === 'medium') {
    return 'meta-tag-difficulty-medium'
  }

  if (normalized === 'hard') {
    return 'meta-tag-difficulty-hard'
  }

  return 'meta-tag-difficulty'
}

function ProblemListPage() {
  const navigate = useNavigate()
  const { problems, deleteProblem, isLoading, errorMessage } = useProblems()
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

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
      toast.success('Problem deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete problem')
    } finally {
      closeDeleteDialog()
    }
  }

  return (
    <section className="page-section">
      <h2>Problems</h2>

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
                <div>
                  <div className="problem-title-meta-row">
                    <h3>{problem.title}</h3>
                    <div className="meta-tags" aria-label="Problem metadata">
                      <span className="meta-tag">
                        {problem.dataStructure || 'Not specified'}
                      </span>
                      <span
                        className={`meta-tag ${getDifficultyTagClass(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="problem-row-actions">
                  <button
                    type="button"
                    onClick={() => navigate(`/problems/${problem.id}/edit`)}
                  >
                    Edit
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
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ProblemListPage