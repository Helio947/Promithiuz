import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStorageProvider } from '@/lib/storage'
import { isRateLimited } from '@/lib/rateLimiter'
import { AgeStage, SessionStatus } from '@prisma/client'
import { generateBabyImages } from '@/lib/aiImageGenerator'

const validMime = ['image/jpeg', 'image/png', 'image/webp']

async function generateForSession(sessionId: string, parentAPath: string, parentBPath: string, ageStages: AgeStage[], variations: number) {
  const results = await generateBabyImages({ parentAPath, parentBPath, ageStages, variations })
  const storage = getStorageProvider()
  const stored = []
  for (const result of results) {
    const buffer = Buffer.from(`mock-image-${result.ageStage}-${result.variationIndex}`)
    const saved = await storage.saveFile(buffer, result.fileKey, 'image/png')
    stored.push({
      ageStage: result.ageStage,
      variationIndex: result.variationIndex,
      fileKey: saved.key,
      fileUrl: saved.url,
    })
  }
  await prisma.generatedImage.createMany({
    data: stored.map((img) => ({ ...img, sessionId })),
  })
  await prisma.session.update({ where: { id: sessionId }, data: { status: SessionStatus.COMPLETED } })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sessions = await prisma.session.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(sessions)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const limit = Number(process.env.SESSION_RATE_LIMIT_PER_HOUR || 5)
  if (isRateLimited(session.user.id, limit)) return NextResponse.json({ error: 'Rate limited' }, { status: 429 })

  const form = await req.formData()
  const parentA = form.get('parentA') as File | null
  const parentB = form.get('parentB') as File | null
  const variations = Number(form.get('variations') || 1)
  const relationshipType = (form.get('relationshipType') as string) || 'Couple'
  const ageStages = form.getAll('ageStages').map((a) => a.toString()) as AgeStage[]
  if (!parentA || !parentB) return NextResponse.json({ error: 'Missing photos' }, { status: 400 })
  const maxSizeMb = Number(process.env.MAX_UPLOAD_SIZE_MB || 10)
  for (const file of [parentA, parentB]) {
    if (!validMime.includes(file.type)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    if (file.size > maxSizeMb * 1024 * 1024) return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  const storage = getStorageProvider()
  const [savedA, savedB] = await Promise.all([
    storage.saveFile(Buffer.from(await parentA.arrayBuffer()), parentA.name, parentA.type),
    storage.saveFile(Buffer.from(await parentB.arrayBuffer()), parentB.name, parentB.type),
  ])

  const created = await prisma.session.create({
    data: {
      userId: session.user.id,
      relationshipType,
      status: SessionStatus.PENDING,
      parentPhotos: {
        create: [
          { role: 'PARENT_A', fileUrl: savedA.url, fileKey: savedA.key },
          { role: 'PARENT_B', fileUrl: savedB.url, fileKey: savedB.key },
        ],
      },
    },
  })

  generateForSession(created.id, savedA.localPath || '', savedB.localPath || '', ageStages, variations).catch(async (err) => {
    console.error(err)
    await prisma.session.update({ where: { id: created.id }, data: { status: SessionStatus.FAILED } })
  })

  return NextResponse.json({ id: created.id })
}
