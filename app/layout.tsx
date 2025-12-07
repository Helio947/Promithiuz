import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          <header className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="font-semibold text-primary">
                FutureBaby
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                {session ? (
                  <>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/create">Create</Link>
                    <Link href="/account">Account</Link>
                    <form action="/api/auth/signout" method="post">
                      <button className="btn-secondary text-sm" type="submit">
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
