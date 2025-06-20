import { DateTime } from 'luxon'

export const isValidTimezone = (tz: string): boolean => {
    const check = DateTime.local().setZone(tz)
    return check.isValid
}
