import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStorageProvider } from '@/lib/storage'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await prisma.session.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: { parentPhotos: true, generatedImages: true },
  })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const target = await prisma.session.findUnique({ where: { id: params.id } })
  if (!target || target.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const storage = getStorageProvider()
  const files = await prisma.parentPhoto.findMany({ where: { sessionId: params.id } })
  const generated = await prisma.generatedImage.findMany({ where: { sessionId: params.id } })
  await prisma.generatedImage.deleteMany({ where: { sessionId: params.id } })
  await prisma.parentPhoto.deleteMany({ where: { sessionId: params.id } })
  await prisma.session.delete({ where: { id: params.id } })
  await Promise.all([...files.map((f) => storage.deleteFile(f.fileKey)), ...generated.map((g) => storage.deleteFile(g.fileKey))])
  return NextResponse.json({ ok: true })
}
