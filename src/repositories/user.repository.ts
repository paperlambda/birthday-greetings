import { Prisma, User } from '@/generated/prisma'
import { IUserRepository, PrismaClientTx } from '@/types'

export class UserRepository implements IUserRepository {
    private prisma: PrismaClientTx

    constructor(prismaClient: PrismaClientTx) {
        this.prisma = prismaClient
    }

    async create(userPayload: Prisma.UserCreateInput): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: userPayload,
            })
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new Error('User with this email already exists')
                }
            }

            console.error('Error creating user:', err)
            throw err
        }
    }
}
