import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ImageCard from '@/components/ImageCard'

export default async function SessionDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const data = await prisma.session.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: { parentPhotos: true, generatedImages: true },
  })
  if (!data) return notFound()
  const grouped = data.generatedImages.reduce<Record<string, typeof data.generatedImages>>((acc, img) => {
    acc[img.ageStage] = acc[img.ageStage] ? [...acc[img.ageStage], img] : [img]
    return acc
  }, {})
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Session details</h1>
          <p className="text-sm text-gray-500">Status: {data.status}</p>
        </div>
        <Link className="btn-secondary" href="/create">
          Create new session
        </Link>
      </div>
      <div className="rounded-lg bg-white p-4 shadow">
        <p className="text-sm">Relationship: {data.relationshipType || 'Couple'}</p>
        <div className="mt-3 flex gap-4">
          {data.parentPhotos.map((photo) => (
            <div key={photo.id} className="text-sm">
              <div className="h-20 w-20 rounded bg-gray-100" />
              <p className="mt-1 text-gray-600">{photo.role}</p>
            </div>
          ))}
        </div>
      </div>
      {data.status !== 'COMPLETED' && (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-lg font-semibold">Cooking your future chaos agent…</p>
          <p className="mt-2 text-gray-600">Hang tight while we generate results.</p>
        </div>
      )}
      {data.status === 'COMPLETED' && (
        <div className="space-y-6">
          {Object.entries(grouped).map(([stage, images]) => (
            <div key={stage}>
              <h2 className="text-xl font-semibold">{stage}</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                {images.map((img) => (
                  <ImageCard key={img.id} fileUrl={img.fileUrl} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <form action={`/api/sessions/${data.id}/regenerate`} method="post">
              <button className="btn-primary" type="submit">
                Regenerate variations
              </button>
            </form>
            <Link className="btn-secondary" href="/create">
              Create new session
            </Link>
          </div>
          <p className="text-sm text-red-600">
            Disclaimer: These images are AI-generated approximations for entertainment only and are not genetically accurate
            predictions.
          </p>
        </div>
      )}
    </div>
  )
}
