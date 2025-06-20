import { describe, test, expect, vi } from 'vitest'
import { NextFunction, Request, Response } from 'express'
import { UserController } from '@/controllers/user.controller'
import { CreateUserWithEventUseCase } from '@/usecases/create-user/create-user-with-event.usecase'
import { DeleteUserAndEventUsecase } from '@/usecases/delete-user/delete-user-and-event.usecase'
import { UserNotFoundError } from '@/errors'
import { UnknownError } from '../../src/errors'

describe('user.controller', () => {
    const createRequest = (body): Request => {
        return { body } as Request
    }

    const createParams = (params): Request => {
        return { params } as Request
    }

    const createResponse = (): Response => {
        const res: Partial<Response> = {}
        res.status = vi.fn().mockReturnValue(res)
        res.json = vi.fn().mockReturnValue(res)
        return res as Response
    }

    const creatNextFunc = () => {
        const next: Partial<NextFunction> = vi.fn()
        return next as NextFunction
    }

    describe('createUser', () => {
        const fakeUserResponse = {
            id: 1,
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            timezone: 'Asia/Jakarta',
            createdAt: new Date('2023-01-01T00:00:00.000Z').toISOString(),
            updatedAt: new Date('2023-01-01T00:00:00.000Z').toISOString(),
            events: [
                {
                    eventType: 'BIRTHDAY',
                    eventDate: '2023-12-31',
                },
            ],
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
            const next = creatNextFunc()

            const controller = new UserController()
            await controller.createUser(req, res, next)

            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User created successfully',
                data: fakeUserResponse,
            })
        })

        test('handles error when creating user fails', async () => {
            const appError = new UserNotFoundError()
            vi.spyOn(
                CreateUserWithEventUseCase.prototype,
                'execute'
            ).mockRejectedValueOnce(appError)

            const req = createRequest({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                timezone: 'Asia/Jakarta',
                eventDate: '2023-12-31',
                eventType: 'BIRTHDAY',
            })
            const res = createResponse()
            const next = creatNextFunc()

            const controller = new UserController()
            await controller.createUser(req, res, next)

            expect(next).toHaveBeenCalledWith(appError)
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
            const next = creatNextFunc()

            const controller = new UserController()
            await controller.deleteUser(req, res, next)

            expect(res.status).toHaveBeenCalledWith(204)
            expect(res.json).toHaveBeenCalledWith()
        })

        test('returns error for invalid user ID', async () => {
            const req = createParams({ id: 'abc' })
            const res = createResponse()
            const next = creatNextFunc()

            const controller = new UserController()
            await controller.deleteUser(req, res, next)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid user ID',
            })
        })

        test('handles error when deletion fails', async () => {
            const appError = new UnknownError()
            vi.spyOn(
                DeleteUserAndEventUsecase.prototype,
                'execute'
            ).mockRejectedValueOnce(appError)
            const req = createParams({ id: '1' })
            const res = createResponse()
            const next = creatNextFunc()

            const controller = new UserController()
            await controller.deleteUser(req, res, next)

            expect(next).toHaveBeenCalledWith(appError)
        })
    })
})
