import { UserRepository } from '@/repositories/user.repository'
import { Event, PrismaClient, User } from '@/generated/prisma'
import {
    CreateUserDTO,
    CreateUserResponseDTO,
} from '@/usecases/create-user/create-user.dto'
import { EventRepository } from '@/repositories/event.repository'
import { EventType } from '@/types'
import { DateTime } from 'luxon'

export class CreateUserWithEventUseCase {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async execute(payload: CreateUserDTO): Promise<CreateUserResponseDTO> {
        return this.prisma.$transaction(async (tx) => {
            const userRepository = new UserRepository(tx)
            const eventRepository = new EventRepository(tx)

            const user = await userRepository.create({
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                timezone: payload.timezone,
            })
            const event = await eventRepository.create({
                eventType: EventType.BIRTHDAY,
                eventDate: DateTime.fromISO(payload.eventDate).toJSDate(),
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            })

            return this.toResponse(user, event)
        })
    }

    private toResponse(user: User, event: Event): CreateUserResponseDTO {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            timezone: user.timezone,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            eventType: event.eventType,
            eventDate: DateTime.fromJSDate(event.eventDate).toFormat(
                'yyyy-MM-dd'
            ),
        }
    }
}
