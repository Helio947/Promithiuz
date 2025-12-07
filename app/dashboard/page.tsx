import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const sessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { generatedImages: true },
  })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <Link className="btn-primary" href="/create">
          New session
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sessions.map((s) => (
          <div key={s.id} className="rounded-xl bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.createdAt.toDateString()}</p>
                <p className="text-lg font-semibold">Status: {s.status}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{s.relationshipType || 'Couple'}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <Link className="btn-secondary" href={`/sessions/${s.id}`}>
                View
              </Link>
              <form action={`/api/sessions/${s.id}`} method="post" className="inline">
                <input type="hidden" name="_method" value="DELETE" />
                <button className="btn-secondary" formAction={`/api/sessions/${s.id}`} formMethod="delete">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {sessions.length === 0 && <p>No sessions yet. Create your first!</p>}
      </div>
    </div>
  )
}
