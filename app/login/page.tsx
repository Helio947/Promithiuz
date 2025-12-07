'use client'

import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState('')
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await signIn('credentials', {
      redirect: false,
      email: form.get('email'),
      password: form.get('password'),
    })
    if (res?.error) setError('Invalid credentials')
    else window.location.href = '/dashboard'
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border p-2" />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded border p-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" type="submit">
          Login
        </button>
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          Sign in with Google
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don&apos;t have an account? <Link className="text-primary" href="/register">Register</Link>
      </p>
    </div>
  )
}
