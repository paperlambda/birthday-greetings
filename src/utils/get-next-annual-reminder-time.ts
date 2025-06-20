import { DateTime } from 'luxon'

export const getNextAnnualReminderTime = (
    eventDate: Date,
    timezone: string,
    hour: number
): Date => {
    const now = DateTime.now().setZone(timezone)
    const eventDateInUserTimezone =
        DateTime.fromJSDate(eventDate).setZone(timezone)
    let next = eventDateInUserTimezone.set({
        year: now.year,
        hour: hour,
        minute: 0,
    })
    if (next < now) next = next.plus({ years: 1 })
    return next.toUTC().toJSDate()
}
