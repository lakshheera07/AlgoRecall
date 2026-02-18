import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProblemsApi, fetchReviseTodayApi } from '../api/problemsApi'

function formatRevisionDateWithDay(value) {
  if (!value) {
    return 'Not scheduled'
  }

  const date = new Date(value)
  return `${date.toLocaleDateString()} (${date.toLocaleDateString(undefined, { weekday: 'long' })})`
}

function RevisionHubPage() {
  const navigate = useNavigate()
  const [dueItems, setDueItems] = useState([])
  const [upcomingItems, setUpcomingItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const [dueData, problemsData] = await Promise.all([
          fetchReviseTodayApi(),
          fetchProblemsApi(),
        ])

        const now = Date.now()
        const upcoming = problemsData
          .filter((problem) => {
            if (!problem.nextRevisionAt) {
              return false
            }

            return new Date(problem.nextRevisionAt).getTime() > now
          })
          .sort(
            (left, right) =>
              new Date(left.nextRevisionAt).getTime() -
              new Date(right.nextRevisionAt).getTime(),
          )

        if (isMounted) {
          setDueItems(dueData)
          setUpcomingItems(upcoming)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || 'Failed to load revision hub')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  function startSession() {
    navigate('/revision/session', { state: { queue: dueItems } })
  }

  return (
    <section className="page-section">
      <h2>Revision Hub</h2>
      <p>Use this space only for revision and learning insights.</p>

      {isLoading ? <p>Loading revision data...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}

      {!isLoading ? (
        <div className="revision-hub-grid">
          <article className="problem-card">
            <h3>Today&apos;s Revision</h3>
            {dueItems.length === 0 ? (
              <p>No problems due right now.</p>
            ) : (
              <>
                <ul>
                  {dueItems.map((problem) => (
                    <li key={`due-${problem.id}`}>
                      {problem.title} • {problem.dataStructure || 'Not specified'} • {problem.difficulty}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={startSession}>
                  Start Revision Session
                </button>
              </>
            )}
          </article>

          <article className="problem-card">
            <h3>Upcoming Revisions</h3>
            {upcomingItems.length === 0 ? (
              <p>No upcoming revisions scheduled.</p>
            ) : (
              <ul>
                {upcomingItems.map((problem) => (
                  <li key={`upcoming-${problem.id}`}>
                    {problem.title} • {formatRevisionDateWithDay(problem.nextRevisionAt)}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      ) : null}
    </section>
  )
}

export default RevisionHubPage
