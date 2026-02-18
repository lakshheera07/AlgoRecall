import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useProblems } from '../state/ProblemsContext'

const emptyForm = {
  title: '',
  platform: 'LeetCode',
  dataStructure: '',
  pattern: '',
  difficulty: 'Easy',
  describeProblemInOwnWords: '',
  bruteApproach: '',
  betterApproach: '',
  optimalApproach: '',
  code: '',
}

function EditProblemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProblemById, updateProblem, isLoading, errorMessage } = useProblems()
  const problemId = Number(id)
  const existingProblem = getProblemById(problemId)

  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!existingProblem) {
      return
    }

    setForm({
      title: existingProblem.title ?? '',
      platform: existingProblem.platform ?? 'LeetCode',
      dataStructure: existingProblem.dataStructure ?? '',
      pattern: existingProblem.pattern ?? '',
      difficulty: existingProblem.difficulty ?? 'Easy',
      describeProblemInOwnWords: existingProblem.describeProblemInOwnWords ?? '',
      bruteApproach: existingProblem.bruteApproach ?? '',
      betterApproach: existingProblem.betterApproach ?? '',
      optimalApproach: existingProblem.optimalApproach ?? '',
      code: existingProblem.code ?? '',
    })
  }, [existingProblem])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.title.trim() ||
      !form.dataStructure.trim() ||
      !form.pattern.trim() ||
      !form.bruteApproach.trim() ||
      !form.betterApproach.trim() ||
      !form.optimalApproach.trim()
    ) {
      toast.warning('Please fill all required fields')
      return
    }

    try {
      setIsSaving(true)
      await updateProblem(problemId, {
        ...form,
        title: form.title.trim(),
        dataStructure: form.dataStructure.trim(),
        pattern: form.pattern.trim(),
        describeProblemInOwnWords: form.describeProblemInOwnWords.trim(),
        bruteApproach: form.bruteApproach.trim(),
        betterApproach: form.betterApproach.trim(),
        optimalApproach: form.optimalApproach.trim(),
        code: form.code.trim(),
      })

      toast.success('Problem updated successfully')
      navigate('/problems')
    } catch (error) {
      toast.error(error.message || 'Failed to update problem')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section className="page-section">
        <h2>Edit Problem</h2>
        <p>Loading problem...</p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="page-section">
        <h2>Edit Problem</h2>
        <p>{errorMessage}</p>
      </section>
    )
  }

  if (!existingProblem) {
    return (
      <section className="page-section">
        <h2>Edit Problem</h2>
        <p>Problem not found.</p>
      </section>
    )
  }

  return (
    <section className="page-section">
      <h2>Edit Problem</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-top-actions">
          <button type="button" onClick={() => navigate('/problems')}>
            Cancel
          </button>
        </div>

        <label>
          Problem title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Describe problem in your own words
          <textarea
            name="describeProblemInOwnWords"
            value={form.describeProblemInOwnWords}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label>
          Platform
          <select name="platform" value={form.platform} onChange={handleChange}>
            <option value="LeetCode">LeetCode</option>
            <option value="GFG">GFG</option>
          </select>
        </label>

        <label>
          Data Structure
          <select name="dataStructure" value={form.dataStructure} onChange={handleChange} required>
            <option value="">Select data structure</option>
            <option value="Array">Array</option>
            <option value="Strings">Strings</option>
            <option value="Linked List">Linked List</option>
            <option value="Trees">Trees</option>
            <option value="Graphs">Graphs</option>
            <option value="Heaps">Heaps</option>
            <option value="Tries">Tries</option>
            <option value="Stacks">Stacks</option>
            <option value="Queues">Queues</option>
          </select>
        </label>

        <label>
          Pattern
          <input name="pattern" value={form.pattern} onChange={handleChange} required />
        </label>

        <label>
          Difficulty
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <label>
          Brute force approach
          <textarea name="bruteApproach" value={form.bruteApproach} onChange={handleChange} rows={4} />
        </label>

        <label>
          Better approach
          <textarea
            name="betterApproach"
            value={form.betterApproach}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <label>
          Optimal approach
          <textarea
            name="optimalApproach"
            value={form.optimalApproach}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        <label>
          Optional code
          <textarea name="code" value={form.code} onChange={handleChange} rows={6} />
        </label>

        <button type="submit">Update Problem</button>

        {isSaving ? <p>Saving...</p> : null}
      </form>
    </section>
  )
}

export default EditProblemPage
