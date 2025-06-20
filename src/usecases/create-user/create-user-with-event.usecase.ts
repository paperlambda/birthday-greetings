import 'dotenv/config'
import { UserRepository } from '@/repositories/user.repository'
import { PrismaClient, User } from '@/generated/prisma'
import {
    CreateUserDTO,
    CreateUserResponseDTO,
    EventDTO,
} from '@/usecases/create-user/create-user.dto'
import { EventRepository } from '@/repositories/event.repository'
import { EventTypes } from '@/types'
import { DateTime } from 'luxon'
import { getNextAnnualReminderTime } from '@/utils/get-next-annual-reminder-time'

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

            const events = payload.events.map((ev) => {
                const eventDate = DateTime.fromISO(ev.eventDate).toJSDate()
                const nextReminderAt = getNextAnnualReminderTime(
                    eventDate,
                    user.timezone,
                    parseInt(process.env.APP_REMINDER_HOUR) || 9
                )
                return {
                    userId: user.id,
                    eventType: ev.eventType as EventTypes,
                    eventDate: eventDate,
                    nextReminderAt: nextReminderAt,
                }
            })

            await eventRepository.createMany(events)

            return this.toResponse(user, payload.events)
        })
    }

    private toResponse(user: User, events: EventDTO[]): CreateUserResponseDTO {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            timezone: user.timezone,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            events: events,
        }
    }
}
