type RateRecord = { count: number; windowStart: number }

const rateCache = new Map<string, RateRecord>()

export function isRateLimited(userId: string, limitPerHour: number): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const existing = rateCache.get(userId)
  if (!existing || now - existing.windowStart > windowMs) {
    rateCache.set(userId, { count: 1, windowStart: now })
    return false
  }
  if (existing.count >= limitPerHour) return true
  existing.count += 1
  rateCache.set(userId, existing)
  return false
}

export function resetRate(userId: string) {
  rateCache.delete(userId)
}
