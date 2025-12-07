import { AgeStage } from '@prisma/client'
import { randomUUID } from 'crypto'

export type GenerationRequest = {
  parentAPath: string
  parentBPath: string
  ageStages: AgeStage[]
  variations: number
}

export type GeneratedImageResult = {
  ageStage: AgeStage
  variationIndex: number
  fileUrl: string
  fileKey: string
}

// Swap this mock with a real AI provider. The interface intentionally mirrors
// a typical image generation SDK while keeping configuration via env vars.
export async function generateBabyImages(
  options: GenerationRequest,
): Promise<GeneratedImageResult[]> {
  const results: GeneratedImageResult[] = []
  for (const age of options.ageStages) {
    for (let i = 0; i < options.variations; i++) {
      const id = randomUUID()
      results.push({
        ageStage: age,
        variationIndex: i,
        fileKey: `${age.toLowerCase()}-${id}.png`,
        fileUrl: `/placeholder/${age.toLowerCase()}-${i}.png`,
      })
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 500))
  return results
}
