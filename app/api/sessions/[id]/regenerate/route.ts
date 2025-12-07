import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AgeStage, SessionStatus } from '@prisma/client'
import { generateBabyImages } from '@/lib/aiImageGenerator'
import { getStorageProvider } from '@/lib/storage'

async function regenerate(sessionId: string, ageStages: AgeStage[], variations: number) {
  const storage = getStorageProvider()
  const results = await generateBabyImages({ parentAPath: '', parentBPath: '', ageStages, variations })
  await prisma.generatedImage.deleteMany({ where: { sessionId } })
  const stored = []
  for (const result of results) {
    const buffer = Buffer.from(`mock-image-${result.ageStage}-${result.variationIndex}`)
    const saved = await storage.saveFile(buffer, result.fileKey, 'image/png')
    stored.push({ ageStage: result.ageStage, variationIndex: result.variationIndex, fileKey: saved.key, fileUrl: saved.url })
  }
  await prisma.generatedImage.createMany({ data: stored.map((img) => ({ ...img, sessionId })) })
  await prisma.session.update({ where: { id: sessionId }, data: { status: SessionStatus.COMPLETED } })
}

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const target = await prisma.session.findUnique({ where: { id: params.id }, include: { generatedImages: true } })
  if (!target || target.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const stages = target.generatedImages.length
    ? (Array.from(new Set(target.generatedImages.map((g) => g.ageStage))) as AgeStage[])
    : ['BABY']
  const variations = target.generatedImages.length ? target.generatedImages.length : 1
  await prisma.session.update({ where: { id: params.id }, data: { status: SessionStatus.PROCESSING } })
  regenerate(params.id, stages, variations).catch(async () => {
    await prisma.session.update({ where: { id: params.id }, data: { status: SessionStatus.FAILED } })
  })
  return NextResponse.json({ ok: true })
}
