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
    describe('getById', () => {
        test('successfully retrieves an event by id', async () => {
            const event = {
                id: 1,
                eventType: EventTypes.BIRTHDAY,
                userId: 100,
                eventDate: new Date('1990-01-01'),
                nextReminderAt: new Date('2024-01-01'),
            }
            prisma.event.findUnique.mockResolvedValueOnce(event)
            const eventRepository = new EventRepository(prisma)
            const result = await eventRepository.getById(1)
            expect(result).toStrictEqual(event)
            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            })
        })

        test('returns null when event not found', async () => {
            prisma.event.findUnique.mockResolvedValueOnce(null)
            const eventRepository = new EventRepository(prisma)
            const result = await eventRepository.getById(999)
            expect(result).toBeNull()
            expect(prisma.event.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
            })
        })
    })

    describe('update', () => {
        test('successfully updates an event', async () => {
            const updatedEvent = {
                id: 1,
                eventType: EventTypes.BIRTHDAY,
                userId: 100,
                eventDate: new Date('1990-01-01'),
                nextReminderAt: new Date('2024-01-01'),
            }
            const payload = { eventDate: new Date('1990-01-02') }
            prisma.event.update.mockResolvedValueOnce(updatedEvent)
            const eventRepository = new EventRepository(prisma)
            const result = await eventRepository.update(1, payload)
            expect(result).toStrictEqual(updatedEvent)
            expect(prisma.event.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: payload,
            })
        })

        test('throws error when update fails', async () => {
            const payload = { eventDate: new Date('1990-01-02') }
            const updateError = new Error('Update failed')
            prisma.event.update.mockRejectedValueOnce(updateError)
            const eventRepository = new EventRepository(prisma)
            await expect(eventRepository.update(1, payload)).rejects.toThrow(
                'Update failed'
            )
        })
    })
})
