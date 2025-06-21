import 'dotenv/config'
import { Queue, Worker } from 'bullmq'
import { redis } from '@/config/redis'
import { EventRepository } from '@/repositories/event.repository'
import { prisma } from '@/config/database'
import { DateTime } from 'luxon'
import { sendEventEmailQueue } from '@/queues/send-event-email.queue'

const queueName = 'scan-daily-event-queue'
const scanDailyEventQueue = new Queue(queueName, {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
    },
})

async function addScanDailyEventJob() {
    await scanDailyEventQueue.upsertJobScheduler(
        'scan-daily-event-scheduler',
        {
            pattern: '0 0 * * *',
        },
        {
            name: 'scan-daily-event-job',
            data: {},
        }
    )
}

const worker = new Worker(
    queueName,
    async () => {
        console.log('Processing daily event scan job...')
        const eventRepository = new EventRepository(prisma)
        const today = DateTime.utc()
        const tomorrow = today.plus({ days: 1 })
        const todayEvents = await eventRepository.getByNextReminderAtBetween(
            today.toJSDate(),
            tomorrow.toJSDate()
        )

        console.log(
            `Found ${todayEvents.length} events for today (${today.toISODate()})`
        )

        for (const event of todayEvents) {
            console.log(
                `Processing event: ${event.eventType} for user ID ${event.userId}`
            )
            const reminderTime = DateTime.fromJSDate(event.nextReminderAt)
            const diffUntilReminder =
                reminderTime.diffNow('milliseconds').milliseconds
            const dedupId = `send-event-email:${event.userId}:${event.eventType}:${reminderTime.toISODate()}`
            const dedupSafeWindow = reminderTime
                .plus({ days: 2 })
                .diffNow().milliseconds

            await sendEventEmailQueue.add(
                'send-event-email',
                {
                    userId: event.userId,
                    eventId: event.id,
                },
                {
                    delay: diffUntilReminder,
                    deduplication: {
                        id: dedupId,
                        ttl: dedupSafeWindow,
                    },
                }
            )

            console.log(
                `Scheduled email for user ID ${event.userId} for event type ${event.eventType} in ${diffUntilReminder} ms (at ${reminderTime.toISO()})`
            )
        }
    },
    {
        connection: redis,
    }
)

worker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`)
})

worker.on('failed', (job, error) => {
    console.warn(
        `Job failed: ${job.id}. Reason: ${job.failedReason}. Error: ${error.message}`
    )
})

worker.on('error', (err) => {
    console.error('Worker error:', err)
})

addScanDailyEventJob()
