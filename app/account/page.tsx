'use client'

import { useEffect, useState } from 'react'

export default function AccountPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/me')
      if (res.ok) {
        const data = await res.json()
        setName(data.name || '')
        setEmail(data.email)
      }
    })()
  }, [])

  const updateProfile = async () => {
    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setMessage(res.ok ? 'Profile updated' : 'Update failed')
  }

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: form.get('currentPassword'),
        newPassword: form.get('newPassword'),
      }),
    })
    setMessage(res.ok ? 'Password changed' : 'Password update failed')
  }

  const deleteAccount = async () => {
    const res = await fetch('/api/account', { method: 'DELETE' })
    if (res.ok) window.location.href = '/'
    else setMessage('Could not delete account')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Account</h1>
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="mt-4 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border p-2" />
          <input value={email} disabled className="w-full rounded border p-2 bg-gray-100" />
          <button onClick={updateProfile} className="btn-primary">
            Save profile
          </button>
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Security</h2>
        <form onSubmit={changePassword} className="mt-4 space-y-3">
          <input name="currentPassword" type="password" placeholder="Current password" className="w-full rounded border p-2" />
          <input name="newPassword" type="password" placeholder="New password" className="w-full rounded border p-2" />
          <button className="btn-secondary" type="submit">
            Change password
          </button>
        </form>
      </div>
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-red-600">Danger zone</h2>
        <p className="mt-2 text-sm text-gray-600">Delete all my data & photos.</p>
        <button onClick={deleteAccount} className="btn-primary mt-3 bg-red-600 hover:bg-red-700">
          Delete my account
        </button>
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
      <div className="rounded-xl bg-white p-4 text-sm text-gray-700 shadow">
        <p>We do not sell your photos or face data. You can delete everything at any time.</p>
      </div>
    </div>
  )
}
