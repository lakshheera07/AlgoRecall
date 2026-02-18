import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProblems } from '../state/ProblemsContext'

function RecallPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProblemById, submitRecall } = useProblems()

  const problem = getProblemById(Number(id))
  const [revealed, setRevealed] = useState(false)
  const [confidence, setConfidence] = useState('')

  if (!problem) {
    return (
      <section className="page-section">
        <h2>Recall Screen</h2>
        <p>Problem not found.</p>
      </section>
    )
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!confidence) {
      return
    }

    submitRecall(problem.id, Number(confidence))
    navigate('/problems')
  }

  return (
    <section className="page-section">
      <h2>Recall Screen</h2>

      <div className="problem-card">
        <h3>{problem.title}</h3>
        <p>Pattern: {problem.pattern}</p>
        <p>Difficulty: {problem.difficulty}</p>

        <p>Mentally recall:</p>
        <ul>
          <li>Brute force idea</li>
          <li>Why brute force fails</li>
          <li>Optimal approach</li>
        </ul>
      </div>

      {!revealed ? (
        <button type="button" onClick={() => setRevealed(true)}>
          Reveal
        </button>
      ) : (
        <div className="problem-card">
          <h3>Solution Notes</h3>
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
        </div>
      )}

      <form onSubmit={handleSubmit} className="inline-form">
        <label>
          Confidence (1–5)
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
        <button type="submit">Submit Recall</button>
      </form>

      <button type="button" onClick={() => navigate('/problems')}>
        Back to List
      </button>
    </section>
  )
}

export default RecallPage