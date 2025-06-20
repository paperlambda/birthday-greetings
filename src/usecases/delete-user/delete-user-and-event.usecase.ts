import { UserRepository } from '@/repositories/user.repository'
import { PrismaClient } from '@/generated/prisma'
import { UserNotFoundError } from '@/errors'

export class DeleteUserAndEventUsecase {
    constructor(private readonly prisma: PrismaClient) {}

    async execute(userId: number): Promise<void> {
        const userRepository = new UserRepository(this.prisma)
        const user = await userRepository.getById(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        // Cascade delete events associated with the user
        await userRepository.delete(userId)
        return
    }
}
