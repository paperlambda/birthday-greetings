import { Event, Prisma } from '@/generated/prisma'
import { IEventRepository, PrismaClientTx } from '@/types'

export class EventRepository implements IEventRepository {
    private prisma: PrismaClientTx

    constructor(prismaClient: PrismaClientTx) {
        this.prisma = prismaClient
    }

    async create(eventPayload: Prisma.EventCreateInput): Promise<Event> {
        return this.prisma.event.create({
            data: eventPayload,
        })
    }
}
