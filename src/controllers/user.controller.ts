import { Request, Response } from 'express'
import { CreateUserWithEventUseCase } from '@/usecases/create-user/create-user-with-event.usecase'
import { CreateUserDTO } from '@/usecases/create-user/create-user.dto'
import { prisma } from '@/config/database'
import { DeleteUserAndEventUsecase } from '@/usecases/delete-user/delete-user-and-event.usecase'

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData: CreateUserDTO = req.body
            const handler = new CreateUserWithEventUseCase(prisma)
            const user = await handler.execute(userData)

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user,
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create user',
            })
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id, 10)
            if (isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid user ID',
                })
                return
            }

            const handler = new DeleteUserAndEventUsecase(prisma)
            await handler.execute(userId)

            res.status(204).json()
        } catch (error) {
            // TODO: handle custom error for 404
            res.status(400).json({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to delete user',
            })
        }
    }
}
