import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStorageProvider } from '@/lib/storage'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json()
  await prisma.user.update({ where: { id: session.user.id }, data: { name } })
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const storage = getStorageProvider()
  const sessions = await prisma.session.findMany({ where: { userId: session.user.id }, include: { parentPhotos: true, generatedImages: true } })
  for (const s of sessions) {
    await Promise.all([
      ...s.parentPhotos.map((p) => storage.deleteFile(p.fileKey)),
      ...s.generatedImages.map((g) => storage.deleteFile(g.fileKey)),
    ])
  }
  await prisma.session.deleteMany({ where: { userId: session.user.id } })
  await prisma.user.delete({ where: { id: session.user.id } })
  return NextResponse.json({ ok: true })
}
