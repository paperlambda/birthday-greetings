import { describe, expect, test, beforeEach, vi } from 'vitest'
import prisma from '@/libs/__mocks__/prisma'
import { Prisma } from '@/generated/prisma'
import { EventRepository } from '@/repositories/event.repository'
import { EventType } from '../../src/types'
import { DateTime } from 'luxon'

describe('EventRepository', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('create', () => {
        test('successfully creates an event', async () => {
            const newEvent: Prisma.EventCreateInput = {
                eventType: EventType.BIRTHDAY,
                eventDate: DateTime.fromISO('1996-09-12').toJSDate(),
                user: {
                    connect: {
                        id: 1,
                    },
                },
            }
            prisma.event.create.mockResolvedValueOnce({ ...newEvent, id: 1 })

            const eventRepository = new EventRepository(prisma)
            const event = await eventRepository.create(newEvent)

            expect(event).toStrictEqual({ ...newEvent, id: 1 })
        })

        test('throws error when Prisma create fails', async () => {
            const newEvent: Prisma.EventCreateInput = {
                eventType: EventType.BIRTHDAY,
                eventDate: DateTime.fromISO('1996-09-12').toJSDate(),
                user: {
                    connect: {
                        id: 0,
                    },
                },
            }
            const genericError = new Error('Prisma create failure')
            prisma.event.create.mockRejectedValueOnce(genericError)

            const eventRepository = new EventRepository(prisma)

            await expect(eventRepository.create(newEvent)).rejects.toThrow(
                'Prisma create failure'
            )
        })
    })
})
