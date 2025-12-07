import { generateBabyImages } from '@/lib/aiImageGenerator'
import { AgeStage } from '@prisma/client'

describe('generateBabyImages', () => {
  it('creates images for each age and variation', async () => {
    const results = await generateBabyImages({
      parentAPath: 'a',
      parentBPath: 'b',
      ageStages: [AgeStage.BABY, AgeStage.CHILD],
      variations: 2,
    })
    expect(results.length).toBe(4)
    expect(results[0]).toHaveProperty('fileKey')
  })
})
