import { describe, expect, test, beforeEach, vi } from 'vitest'
import prisma from '@/libs/__mocks__/prisma'
import { Prisma } from '@/generated/prisma'
import { EventRepository } from '@/repositories/event.repository'
import { EventTypes } from '../../src/types'
import { DateTime } from 'luxon'
import { getNextAnnualReminderTime } from '../../src/utils/get-next-annual-reminder-time'

describe('EventRepository', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('createMany', () => {
        test('successfully creates an event', async () => {
            const eventDate = DateTime.fromISO('1996-09-12')
            const newEvent: Prisma.EventCreateManyInput = {
                eventType: EventTypes.BIRTHDAY,
                userId: 0,
                eventDate: eventDate.toJSDate(),
                nextReminderAt: getNextAnnualReminderTime(
                    eventDate.toJSDate(),
                    'Asia/Jakarta',
                    9
                ),
            }
            prisma.event.createMany.mockResolvedValueOnce({
                count: 1,
            })

            const eventRepository = new EventRepository(prisma)
            const result = await eventRepository.createMany([newEvent])

            expect(result).toStrictEqual({ count: 1 })
        })

        test('throws error when Prisma createMany fails', async () => {
            const eventDate = DateTime.fromISO('1996-09-12')
            const newEvent: Prisma.EventCreateManyInput = {
                eventType: EventTypes.BIRTHDAY,
                userId: 0,
                eventDate: eventDate.toJSDate(),
                nextReminderAt: getNextAnnualReminderTime(
                    eventDate.toJSDate(),
                    'Asia/Jakarta',
                    9
                ),
            }
            const genericError = new Error('Prisma createMany failure')
            prisma.event.createMany.mockRejectedValueOnce(genericError)

            const eventRepository = new EventRepository(prisma)

            await expect(
                eventRepository.createMany([newEvent])
            ).rejects.toThrow('Prisma createMany failure')
        })
    })
})
