import { Queue } from 'bullmq'
import { redis } from '@/config/redis'

export const sendEventEmailQueueName = 'send-event-email-queue'
export const sendEventEmailQueue = new Queue(sendEventEmailQueueName, {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
})
