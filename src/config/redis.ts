import Redis from 'ioredis'

const globalForPrisma = globalThis as unknown as { redis: Redis }

export const redis =
    globalForPrisma.redis ||
    new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.redis = redis
