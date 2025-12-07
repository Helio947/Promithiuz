import { isRateLimited, resetRate } from '@/lib/rateLimiter'

describe('rate limiter', () => {
  it('limits after threshold', () => {
    const user = 'user-1'
    resetRate(user)
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(user, 5)).toBe(false)
    }
    expect(isRateLimited(user, 5)).toBe(true)
  })
})
