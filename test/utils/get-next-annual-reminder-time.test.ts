import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { getNextAnnualReminderTime } from '@/utils/get-next-annual-reminder-time'
import { DateTime } from 'luxon'

describe('getNextAnnualReminderTime', () => {
    let now: Date

    beforeAll(() => {
        // Freeze time for consistent test results.
        // This test uses UTC for simplicity.
        now = new Date('2023-01-01T00:00:00.000Z')
        vi.useFakeTimers({ now: now.getTime() })
    })

    afterAll(() => {
        vi.useRealTimers()
    })

    it('should return the reminder date for the current year if event is upcoming', () => {
        const timezone = 'UTC'
        // The actual event date is ignored except for month and day.
        // Using any valid date with December 31.
        const eventDate = new Date('2000-12-31T00:00:00.000Z')
        const hour = 10
        // Expect reminder to be scheduled on Dec 31, 2023 at 10:00 in UTC.
        const expected = DateTime.fromObject(
            { year: 2023, month: 12, day: 31, hour: hour, minute: 0 },
            { zone: timezone }
        )
            .toUTC()
            .toJSDate()

        const result = getNextAnnualReminderTime(eventDate, timezone, hour)
        expect(result.toISOString()).toEqual(expected.toISOString())
    })

    it('should return the reminder date for next year if event has already occurred', () => {
        // Set fake time to December 31, 2023 12:00 UTC so the event is in the past.
        const currentTime = new Date('2023-12-31T12:00:00.000Z')
        vi.setSystemTime(currentTime.getTime())

        const timezone = 'UTC'
        // Using any valid date with December 31.
        const eventDate = new Date('2000-12-31T00:00:00.000Z')
        const hour = 10
        // Reminder should be scheduled on December 31, 2024 at 10:00 UTC.
        const expected = DateTime.fromObject(
            { year: 2024, month: 12, day: 31, hour: hour, minute: 0 },
            { zone: timezone }
        )
            .toUTC()
            .toJSDate()

        const result = getNextAnnualReminderTime(eventDate, timezone, hour)
        expect(result.toISOString()).toEqual(expected.toISOString())
    })
})
