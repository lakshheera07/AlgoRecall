import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useProblems } from '../state/ProblemsContext'

const emptyForm = {
  title: '',
  platform: 'LeetCode',
  pattern: '',
  difficulty: 'Easy',
  describeProblemInOwnWords: '',
  bruteApproach: '',
  betterApproach: '',
  optimalApproach: '',
  code: '',
}

function AddProblemPage() {
  const { addProblem } = useProblems()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.title.trim() ||
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

      await addProblem({
        ...form,
        title: form.title.trim(),
        pattern: form.pattern.trim(),
        describeProblemInOwnWords: form.describeProblemInOwnWords.trim(),
        bruteApproach: form.bruteApproach.trim(),
        betterApproach: form.betterApproach.trim(),
        optimalApproach: form.optimalApproach.trim(),
        code: form.code.trim(),
      })

      setForm(emptyForm)
      toast.success('Problem added successfully')
      navigate('/problems')
    } catch (error) {
      toast.error(error.message || 'Failed to add problem')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="page-section">
      <h2>Add Problem</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Problem title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
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
          Pattern
          <input
            name="pattern"
            value={form.pattern}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Difficulty
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>


        <label>
          Brute force approach
          <textarea
            name="bruteApproach"
            value={form.bruteApproach}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        <label>
          Better approach
          <textarea
            name="betterApproach"
            value={form.betterApproach}
            onChange={handleChange}
            rows={4}
            required
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
          <textarea
            name="code"
            value={form.code}
            onChange={handleChange}
            rows={6}
          />
        </label>

        <button type="submit">Save Problem</button>
        {isSaving ? <p>Saving...</p> : null}
      </form>
    </section>
  )
}

export default AddProblemPage