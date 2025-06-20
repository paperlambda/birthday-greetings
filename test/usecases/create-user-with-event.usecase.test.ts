import { beforeEach, describe, expect, test, vi } from 'vitest'
import { DateTime } from 'luxon'
import prisma from '@/libs/__mocks__/prisma'
import { CreateUserWithEventUseCase } from '@/usecases/create-user/create-user-with-event.usecase'
import { EventType } from '@/types'

describe('create-user-with-event.usecase', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('execute', () => {
        test('successfully creates user with event', async () => {
            const payload = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                timezone: 'Asia/Jakarta',
                eventDate: '2023-12-31',
                eventType: EventType.BIRTHDAY,
            }

            const fakeUser = {
                id: 1,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                timezone: payload.timezone,
                createdAt: new Date('2023-01-01T00:00:00.000Z'),
                updatedAt: new Date('2023-01-01T00:00:00.000Z'),
            }

            const fakeEvent = {
                id: 1,
                eventType: EventType.BIRTHDAY,
                eventDate: new Date('2023-12-31'),
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            prisma.user.create.mockResolvedValueOnce(fakeUser)
            prisma.event.create.mockResolvedValueOnce(fakeEvent)

            prisma.$transaction.mockImplementation((callback) =>
                callback(prisma)
            )

            const useCase = new CreateUserWithEventUseCase(prisma)
            const response = await useCase.execute(payload)

            expect(response).toStrictEqual({
                id: fakeUser.id,
                email: fakeUser.email,
                firstName: fakeUser.firstName,
                lastName: fakeUser.lastName,
                timezone: fakeUser.timezone,
                createdAt: fakeUser.createdAt.toISOString(),
                updatedAt: fakeUser.updatedAt.toISOString(),
                eventType: fakeEvent.eventType,
                eventDate: DateTime.fromJSDate(fakeEvent.eventDate).toFormat(
                    'yyyy-MM-dd'
                ),
            })

            expect(prisma.$transaction).toHaveBeenCalledTimes(1)
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: payload.email,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    timezone: payload.timezone,
                },
            })
            expect(prisma.event.create).toHaveBeenCalled()
        })

        test('propagates error from transaction', async () => {
            const payload = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                timezone: 'Asia/Jakarta',
                eventDate: '2023-12-31',
                eventType: EventType.BIRTHDAY,
            }
            const transactionError = new Error('Transaction failed')

            prisma.$transaction.mockImplementation(() => {
                throw transactionError
            })

            const useCase = new CreateUserWithEventUseCase(prisma)

            await expect(useCase.execute(payload)).rejects.toThrow(
                'Transaction failed'
            )
        })
    })

    test('propagates error from repository', async () => {
        const payload = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            timezone: 'Asia/Jakarta',
            eventDate: '2023-12-31',
            eventType: EventType.BIRTHDAY,
        }

        prisma.user.create.mockImplementation(() => {
            throw Error('User creation failed')
        })

        prisma.$transaction.mockImplementation((callback) => callback(prisma))

        const useCase = new CreateUserWithEventUseCase(prisma)

        await expect(useCase.execute(payload)).rejects.toThrow(
            'User creation failed'
        )
    })
})
