'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
      setError('Unable to register. Please try again.')
      return
    }
    window.location.href = '/login'
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input name="name" type="text" required placeholder="Name" className="w-full rounded border p-2" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border p-2" />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          minLength={8}
          className="w-full rounded border p-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" type="submit">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link className="text-primary" href="/login">Login</Link>
      </p>
    </div>
  )
}
