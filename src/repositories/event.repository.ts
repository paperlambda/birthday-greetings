import { Event, Prisma } from '@/generated/prisma'
import { EventWithUser, IEventRepository, PrismaClientTx } from '@/types'

export class EventRepository implements IEventRepository {
    private prisma: PrismaClientTx

    constructor(prismaClient: PrismaClientTx) {
        this.prisma = prismaClient
    }

    async createMany(
        eventPayload: Prisma.EventCreateManyInput[]
    ): Promise<Prisma.BatchPayload> {
        return this.prisma.event.createMany({
            data: eventPayload,
        })
    }

    async getByNextReminderAtBetween(
        startDate: Date,
        endDate: Date
    ): Promise<EventWithUser[]> {
        return this.prisma.event.findMany({
            where: {
                nextReminderAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            include: {
                user: {
                    select: {
                        timezone: true,
                    },
                },
            },
        })
    }

    async update(
        eventID: number,
        payload: Prisma.EventUpdateInput
    ): Promise<Event> {
        return this.prisma.event.update({
            where: {
                id: eventID,
            },
            data: payload,
        })
    }

    async getById(eventID: number): Promise<Event> {
        return this.prisma.event.findUnique({
            where: {
                id: eventID,
            },
        })
    }
}
