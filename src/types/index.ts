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

export interface IUserRepository {
    create(userPayload: Prisma.UserCreateInput): Promise<User>
    getById(userId: number): Promise<User | null>
    delete(userId: number): Promise<void>
}

export interface IEventRepository {
    create(eventPayload: Prisma.EventCreateInput): Promise<Event>
}

export enum EventType {
    BIRTHDAY = 'birthday',
    ANNIVERSARY = 'anniversary',
}
