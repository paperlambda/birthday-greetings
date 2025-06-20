import { describe, test, expect } from 'vitest'
import { isValidTimezone } from '../../src/utils/timezone'

describe('isValidTimezone', () => {
    test('returns true for a valid timezone', () => {
        const validTimezone = 'Asia/Jakarta'
        const result = isValidTimezone(validTimezone)
        expect(result).toBe(true)
    })

    test('returns false for an invalid timezone', () => {
        const invalidTimezone = 'Invalid/Timezone'
        const result = isValidTimezone(invalidTimezone)
        expect(result).toBe(false)
    })

    test('returns false for an empty string', () => {
        const emptyString = ''
        const result = isValidTimezone(emptyString)
        expect(result).toBe(false)
    })
})
