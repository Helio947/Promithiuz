'use client'

import { FormEvent, useState } from 'react'

const ageStages = [
  { value: 'BABY', label: 'Baby (0-1)' },
  { value: 'TODDLER', label: 'Toddler (2-3)' },
  { value: 'CHILD', label: 'Child (7-10)' },
]

export default function CreatePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const res = await fetch('/api/sessions', {
      method: 'POST',
      body: formData,
    })
    setLoading(false)
    if (!res.ok) {
      setError('Unable to create session. Please try again.')
      return
    }
    const data = await res.json()
    window.location.href = `/sessions/${data.id}`
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
      <h1 className="text-3xl font-semibold">Create a baby session</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded border border-dashed p-4">
            <label className="text-sm font-semibold">Parent A photo</label>
            <input name="parentA" type="file" accept="image/*" required className="mt-2 w-full" />
          </div>
          <div className="rounded border border-dashed p-4">
            <label className="text-sm font-semibold">Parent B photo</label>
            <input name="parentB" type="file" accept="image/*" required className="mt-2 w-full" />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Relationship</label>
          <select name="relationshipType" className="mt-1 w-full rounded border p-2">
            <option>Couple</option>
            <option>Friends</option>
            <option>Just for fun</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Ethnicity tags (optional)</label>
          <input name="ethnicity" className="mt-1 w-full rounded border p-2" placeholder="e.g., Mixed, Latinx" />
        </div>
        <div>
          <label className="text-sm font-semibold">Age stages</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {ageStages.map((age) => (
              <label key={age.value} className="flex items-center gap-2">
                <input type="checkbox" name="ageStages" value={age.value} defaultChecked />
                <span>{age.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Number of variations</label>
          <input name="variations" type="number" min={1} max={5} defaultValue={2} className="mt-1 w-full rounded border p-2" />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={loading} className="btn-primary w-full" type="submit">
          {loading ? 'Creating...' : 'Create session'}
        </button>
        <p className="text-sm text-red-600">
          Disclaimer: These images are AI-generated approximations for entertainment only and are not genetically accurate
          predictions.
        </p>
      </form>
    </div>
  )
}
