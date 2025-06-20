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
                { code: 'P2002', clientVersion: '1.0.0' }
            )
            prisma.user.create.mockRejectedValueOnce(duplicateError)
            const userRepository = new UserRepository(prisma)

            await expect(userRepository.create(newUser)).rejects.toThrow(
                'User already exists'
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

    describe('getById', () => {
        test('successfully retrieves a user by id', async () => {
            const user = {
                id: 1,
                email: 'user@example.com',
                firstName: 'Test',
                lastName: 'User',
                timezone: 'UTC',
            }
            prisma.user.findUnique.mockResolvedValueOnce(user)
            const userRepository = new UserRepository(prisma)
            const result = await userRepository.getById(1)
            expect(result).toStrictEqual(user)
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            })
        })

        test('returns undefined when user not found', async () => {
            prisma.user.findUnique.mockResolvedValueOnce(undefined)
            const userRepository = new UserRepository(prisma)
            const result = await userRepository.getById(999)
            expect(result).toBeUndefined()
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
            })
        })
    })

    describe('delete', () => {
        test('successfully deletes a user', async () => {
            prisma.user.delete.mockResolvedValueOnce({ id: 1 })
            const userRepository = new UserRepository(prisma)
            await expect(userRepository.delete(1)).resolves.toBeUndefined()
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            })
        })

        test('throws error when delete fails', async () => {
            const deleteError = new Error('Delete failed')
            prisma.user.delete.mockRejectedValueOnce(deleteError)
            const userRepository = new UserRepository(prisma)
            await expect(userRepository.delete(1)).rejects.toThrow(
                'Delete failed'
            )
        })
    })
})
