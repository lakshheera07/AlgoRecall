import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useProblems } from '../state/ProblemsContext'

function RevisionSessionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { submitRecall } = useProblems()

  const queue = useMemo(() => {
    if (!Array.isArray(location.state?.queue)) {
      return []
    }

    return location.state.queue
  }, [location.state])

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [confidence, setConfidence] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentProblem = queue[index] ?? null
  const isCompleted = queue.length > 0 && index >= queue.length

  async function handleSubmit(event) {
    event.preventDefault()

    if (!currentProblem || !confidence) {
      return
    }

    try {
      setIsSubmitting(true)
      await submitRecall(currentProblem.id, Number(confidence))
      toast.success('Confidence saved')

      setRevealed(false)
      setConfidence('')
      setIndex((prev) => prev + 1)
    } catch (error) {
      toast.error(error.message || 'Failed to save confidence')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (queue.length === 0) {
    return (
      <section className="page-section revision-session-shell">
        <h2>Revision Session</h2>
        <p>Start your session from the Revision Hub.</p>
        <button type="button" onClick={() => navigate('/revision')}>
          Back to Revision Hub
        </button>
      </section>
    )
  }

  if (isCompleted) {
    return (
      <section className="page-section revision-session-shell">
        <h2>Revision Session Complete</h2>
        <p>You have completed today&apos;s revision queue.</p>
        <button type="button" onClick={() => navigate('/revision')}>
          Return to Revision Hub
        </button>
      </section>
    )
  }

  return (
    <section className="page-section revision-session-shell">
      <div className="session-progress-row">
        <h2>Revision Session</h2>
        <p>
          Problem {index + 1} / {queue.length}
        </p>
      </div>

      <article className="problem-card">
        <h3>{currentProblem.title}</h3>
        <p>Data Structure: {currentProblem.dataStructure || 'Not specified'}</p>
        <p>Difficulty: {currentProblem.difficulty}</p>

        <p>Active Recall Prompts:</p>
        <ul>
          <li>What is the core pattern?</li>
          <li>What is the brute-force approach?</li>
          <li>Why does brute force fail?</li>
          <li>What is the optimal approach?</li>
        </ul>

        {!revealed ? (
          <button type="button" onClick={() => setRevealed(true)}>
            Reveal Solution Notes
          </button>
        ) : (
          <div className="accordion-content">
            <p>Pattern: {currentProblem.pattern}</p>
            <p>
              <strong>Brute:</strong> {currentProblem.bruteApproach || 'Not provided'}
            </p>
            <p>
              <strong>Better:</strong> {currentProblem.betterApproach || 'Not provided'}
            </p>
            <p>
              <strong>Optimal:</strong> {currentProblem.optimalApproach || 'Not provided'}
            </p>
            <p>
              <strong>Code:</strong>
            </p>
            <pre>{currentProblem.code || 'No code provided.'}</pre>
          </div>
        )}
      </article>

      {revealed ? (
        <form onSubmit={handleSubmit} className="inline-form">
          <label>
            Confidence (1-5)
            <select
              value={confidence}
              onChange={(event) => setConfidence(event.target.value)}
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
          <button type="submit" disabled={isSubmitting}>
            {index === queue.length - 1 ? 'Submit & Finish' : 'Submit & Next'}
          </button>
        </form>
      ) : null}

      <button type="button" onClick={() => navigate('/revision')}>
        End Session
      </button>
    </section>
  )
}

export default RevisionSessionPage
