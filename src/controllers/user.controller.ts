import { Request, Response } from 'express'
import { CreateUserWithEventUseCase } from '@/usecases/create-user/create-user-with-event.usecase'
import { CreateUserDTO } from '@/usecases/create-user/create-user.dto'
import { prisma } from '@/config/database'

export class UserController {
    createUser = async (req: Request, res: Response) => {
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
}
