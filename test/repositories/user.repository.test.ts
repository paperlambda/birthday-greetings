import { beforeEach, describe, expect, test, vi } from 'vitest'
import prisma from '@/libs/__mocks__/prisma'
import { Prisma } from '@/generated/prisma'
import { UserRepository } from '@/repositories/user.repository'

describe('user.repository', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('create', () => {
        test('successfully creates a user', async () => {
            const newUser: Prisma.UserCreateInput = {
                email: 'example@example.com',
                firstName: 'John',
                lastName: 'Doe',
                timezone: 'Asia/Jakarta',
            }
            prisma.user.create.mockResolvedValueOnce({ ...newUser, id: 1 })
            const userRepository = new UserRepository(prisma)
            const user = await userRepository.create(newUser)

            expect(user).toStrictEqual({ ...newUser, id: 1 })
        })

        test('throws duplicate email error when user exists', async () => {
            const newUser: Prisma.UserCreateInput = {
                email: 'duplicate@example.com',
                firstName: 'Jane',
                lastName: 'Doe',
                timezone: 'America/New_York',
            }
            const duplicateError = new Prisma.PrismaClientKnownRequestError(
                'Unique constraint failed',
                { code: 'P2002', clientVersion: '6.10.1' }
            )
            prisma.user.create.mockRejectedValueOnce(duplicateError)
            const userRepository = new UserRepository(prisma)

            await expect(userRepository.create(newUser)).rejects.toThrow(
                'User with this email already exists'
            )
        })

        test('throws generic error for non-duplicate errors', async () => {
            const newUser: Prisma.UserCreateInput = {
                email: 'error@example.com',
                firstName: 'Alice',
                lastName: 'Smith',
                timezone: 'Europe/London',
            }
            const genericError = new Error('Database connection failure')
            prisma.user.create.mockRejectedValueOnce(genericError)
            const userRepository = new UserRepository(prisma)

            await expect(userRepository.create(newUser)).rejects.toThrow(
                'Database connection failure'
            )
        })
    })
})
