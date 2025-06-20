import { Prisma, User, PrismaClient, Event } from '@/generated/prisma'

export type PrismaClientTx = Omit<
    PrismaClient,
    | '$connect'
    | '$disconnect'
    | '$on'
    | '$use'
    | '$executeRaw'
    | '$queryRaw'
    | '$transaction'
    | '$extends'
>

export type EventWithUser = Prisma.EventGetPayload<{
    include: {
        user: {
            select: {
                timezone: true
            }
        }
    }
}>

export interface IUserRepository {
    create(userPayload: Prisma.UserCreateInput): Promise<User>
    getById(userId: number): Promise<User | null>
    delete(userId: number): Promise<void>
}

export interface IEventRepository {
    createMany(
        eventPayload: Prisma.EventCreateManyInput[]
    ): Promise<Prisma.BatchPayload>

    getByNextReminderAtBetween(startDate: Date, endDate: Date): Promise<Event[]>
}

export enum EventTypes {
    BIRTHDAY = 'birthday',
    ANNIVERSARY = 'anniversary',
}
