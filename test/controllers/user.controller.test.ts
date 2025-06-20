import { describe, test, expect, vi } from 'vitest'
import { Request, Response } from 'express'
import { UserController } from '@/controllers/user.controller'
import { CreateUserWithEventUseCase } from '@/usecases/create-user/create-user-with-event.usecase'
import { DeleteUserAndEventUsecase } from '../../src/usecases/delete-user/delete-user-and-event.usecase'

describe('user.controller', () => {
    const fakeUserResponse = {
        id: 1,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        timezone: 'Asia/Jakarta',
        createdAt: new Date('2023-01-01T00:00:00.000Z').toISOString(),
        updatedAt: new Date('2023-01-01T00:00:00.000Z').toISOString(),
        eventType: 'BIRTHDAY',
        eventDate: '2023-12-31',
    }

    const createRequest = (body): Request => {
        return { body } as Request
    }

    const createParams = (params): Request => {
        return { params } as Request
    }

    const createResponse = () => {
        const res: Partial<Response> = {}
        res.status = vi.fn().mockReturnValue(res)
        res.json = vi.fn().mockReturnValue(res)
        return res as Response
    }

    test('creates user successfully', async () => {
        vi.spyOn(
            CreateUserWithEventUseCase.prototype,
            'execute'
        ).mockResolvedValueOnce(fakeUserResponse)

        const req = createRequest({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            timezone: 'Asia/Jakarta',
            eventDate: '2023-12-31',
            eventType: 'BIRTHDAY',
        })
        const res = createResponse()

        const controller = new UserController()
        await controller.createUser(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'User created successfully',
            data: fakeUserResponse,
        })
    })

    test('handles error when creating user fails', async () => {
        const errorMessage = 'Creation failed'
        vi.spyOn(
            CreateUserWithEventUseCase.prototype,
            'execute'
        ).mockRejectedValueOnce(new Error(errorMessage))

        const req = createRequest({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            timezone: 'Asia/Jakarta',
            eventDate: '2023-12-31',
            eventType: 'BIRTHDAY',
        })
        const res = createResponse()

        const controller = new UserController()
        await controller.createUser(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: errorMessage,
        })
    })

    describe('deleteUser', () => {
        test('successfully deletes a user', async () => {
            vi.spyOn(
                DeleteUserAndEventUsecase.prototype,
                'execute'
            ).mockResolvedValueOnce(undefined)
            const req = createParams({ id: '1' })
            const res = createResponse()

            const controller = new UserController()
            await controller.deleteUser(req, res)

            expect(res.status).toHaveBeenCalledWith(204)
            expect(res.json).toHaveBeenCalledWith()
        })

        test('returns error for invalid user ID', async () => {
            const req = createParams({ id: 'abc' })
            const res = createResponse()

            const controller = new UserController()
            await controller.deleteUser(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid user ID',
            })
        })

        test('handles error when deletion fails', async () => {
            const errorMessage = 'Deletion failed'
            vi.spyOn(
                DeleteUserAndEventUsecase.prototype,
                'execute'
            ).mockRejectedValueOnce(new Error(errorMessage))
            const req = createParams({ id: '1' })
            const res = createResponse()

            const controller = new UserController()
            await controller.deleteUser(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: errorMessage,
            })
        })
    })
})
