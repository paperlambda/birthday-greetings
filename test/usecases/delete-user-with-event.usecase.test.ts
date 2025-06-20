import { beforeEach, describe, expect, test, vi } from 'vitest'
import prisma from '@/libs/__mocks__/prisma'
import { DeleteUserAndEventUsecase } from '@/usecases/delete-user/delete-user-and-event.usecase'
import { UserNotFoundError } from '../../src/errors'

describe('delete-user-and-event.usecase', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test('successfully deletes a user', async () => {
        const fakeUser = {
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            timezone: 'UTC',
        }

        prisma.user.findUnique.mockResolvedValueOnce(fakeUser)

        prisma.user.delete.mockResolvedValueOnce({ id: fakeUser.id })

        const usecase = new DeleteUserAndEventUsecase(prisma)
        await expect(usecase.execute(1)).resolves.toBeUndefined()

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    test('throws error when user is not found', async () => {
        const error = new UserNotFoundError()
        prisma.user.findUniqueOrThrow.mockRejectedValueOnce(error)

        const usecase = new DeleteUserAndEventUsecase(prisma)
        await expect(usecase.execute(999)).rejects.toThrow(error)
    })

    test('propagates error when deletion fails', async () => {
        const fakeUser = {
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            timezone: 'UTC',
        }

        prisma.user.findUnique.mockResolvedValueOnce(fakeUser)

        const deleteError = new Error('Deletion failed')
        prisma.user.delete.mockRejectedValueOnce(deleteError)

        const usecase = new DeleteUserAndEventUsecase(prisma)
        await expect(usecase.execute(1)).rejects.toThrow('Deletion failed')
    })
})
