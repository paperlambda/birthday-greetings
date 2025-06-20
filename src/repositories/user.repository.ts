import { Prisma, User } from '@/generated/prisma'
import { IUserRepository, PrismaClientTx } from '@/types'
import { UserAlreadyExistsError } from '@/errors'

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
                    throw new UserAlreadyExistsError()
                }
            }

            throw err
        }
    }

    async getById(userId: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: userId },
        })
    }

    async delete(userId: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id: userId },
        })
    }
}
